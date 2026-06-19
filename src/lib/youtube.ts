// Isolated YouTube Data API v3 client (browser-side, no backend).
// Everything that touches YouTube lives here, so this module can later be
// lifted into a Supabase Edge Function with the rest of the app unchanged.

const API = "https://www.googleapis.com/youtube/v3";
const KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;

export const isYouTubeConfigured = Boolean(KEY);

export type YouTubeVideo = {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  durationSeconds: number;
};

export type YouTubeChannelData = {
  channelId: string;
  title: string;
  description: string;
  customUrl?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  country?: string;
  createdAt?: string; // channel creation date
  subscribers: number;
  subscribersHidden: boolean;
  totalViews: number;
  videoCount: number;
  meanViews: number;
  medianViews: number;
  avgViews: number; // = medianViews (robust "typical" performance)
  engagementRate: number; // % — mean (likes+comments)/views across recent uploads
  uploadsPerMonth: number;
  lastUploadAt?: string;
  avgDurationSeconds: number;
  keywords: string[];
  topics: string[];
  recentVideos: YouTubeVideo[];
};

async function api(path: string, params: Record<string, string>) {
  if (!KEY) {
    throw new Error(
      "YouTube API key missing. Set VITE_YOUTUBE_API_KEY in .env.local and restart the dev server."
    );
  }
  const qs = new URLSearchParams({ ...params, key: KEY });
  const res = await fetch(`${API}/${path}?${qs}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? `YouTube API error ${res.status}`);
  }
  return data;
}

// --- small parsers / stats helpers ---

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function parseDuration(iso?: string): number {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0);
}

// YouTube stores channel keywords as a space-separated string with quoted phrases.
function parseKeywords(s?: string): string[] {
  if (!s) return [];
  const out: string[] = [];
  const re = /"([^"]+)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) out.push((m[1] ?? m[2]).toLowerCase());
  return Array.from(new Set(out));
}

// topicCategories are Wikipedia URLs, e.g. https://en.wikipedia.org/wiki/Technology
function topicName(url: string): string {
  try {
    return decodeURIComponent(url.split("/wiki/")[1] ?? "").replace(/_/g, " ");
  } catch {
    return "";
  }
}

type ParsedInput = { kind: "id" | "handle" | "search"; value: string };

/** Accepts a channel URL, @handle, raw UC… id, or a free-text search term. */
function parseInput(raw: string): ParsedInput {
  const s = raw.trim();
  if (s.includes("youtube.com") || s.includes("youtu.be")) {
    try {
      const u = new URL(s.startsWith("http") ? s : `https://${s}`);
      const path = u.pathname;
      if (path.startsWith("/channel/")) return { kind: "id", value: path.split("/")[2] };
      if (path.startsWith("/@")) return { kind: "handle", value: path.slice(2) };
      const m = path.match(/^\/(?:c|user)\/([^/]+)/);
      if (m) return { kind: "search", value: decodeURIComponent(m[1]) };
    } catch {
      /* fall through */
    }
  }
  if (s.startsWith("@")) return { kind: "handle", value: s.slice(1) };
  if (/^UC[\w-]{22}$/.test(s)) return { kind: "id", value: s };
  return { kind: "search", value: s };
}

async function resolveChannelId(raw: string): Promise<string> {
  const p = parseInput(raw);
  if (p.kind === "id") return p.value;
  if (p.kind === "handle") {
    const d = await api("channels", { part: "id", forHandle: p.value });
    const id = d.items?.[0]?.id;
    if (id) return id;
    // handle not found — fall back to search below
  }
  // search.list costs 100 quota units; only used when we can't resolve directly.
  const s = await api("search", {
    part: "snippet",
    type: "channel",
    q: p.value,
    maxResults: "1",
  });
  const id = s.items?.[0]?.id?.channelId ?? s.items?.[0]?.snippet?.channelId;
  if (!id) throw new Error(`No YouTube channel found for “${raw}”.`);
  return id;
}

export async function fetchYouTubeChannel(raw: string): Promise<YouTubeChannelData> {
  const channelId = await resolveChannelId(raw);
  const ch = await api("channels", {
    part: "snippet,statistics,contentDetails,topicDetails,brandingSettings",
    id: channelId,
  });
  const item = ch.items?.[0];
  if (!item) throw new Error("Channel not found.");

  const snippet = item.snippet ?? {};
  const stats = item.statistics ?? {};
  const subscribers = Number(stats.subscriberCount ?? 0);
  const totalViews = Number(stats.viewCount ?? 0);
  const videoCount = Number(stats.videoCount ?? 0);

  const keywords = parseKeywords(item.brandingSettings?.channel?.keywords).slice(0, 12);
  const topics = (item.topicDetails?.topicCategories ?? [])
    .map(topicName)
    .filter(Boolean);

  // Pull recent uploads to derive typical performance + cadence.
  let recentVideos: YouTubeVideo[] = [];
  const uploads = item.contentDetails?.relatedPlaylists?.uploads;
  if (uploads) {
    const pl = await api("playlistItems", {
      part: "contentDetails",
      playlistId: uploads,
      maxResults: "15",
    });
    const ids: string[] = (pl.items ?? [])
      .map((i: any) => i.contentDetails?.videoId)
      .filter(Boolean);
    if (ids.length) {
      const vids = await api("videos", {
        part: "statistics,snippet,contentDetails",
        id: ids.join(","),
      });
      recentVideos = (vids.items ?? []).map((v: any) => ({
        id: v.id,
        title: v.snippet?.title ?? "",
        views: Number(v.statistics?.viewCount ?? 0),
        likes: Number(v.statistics?.likeCount ?? 0),
        comments: Number(v.statistics?.commentCount ?? 0),
        publishedAt: v.snippet?.publishedAt ?? "",
        durationSeconds: parseDuration(v.contentDetails?.duration),
      }));
    }
  }

  const viewsArr = recentVideos.map((v) => v.views);
  const meanViews = viewsArr.length
    ? Math.round(viewsArr.reduce((s, n) => s + n, 0) / viewsArr.length)
    : 0;
  const medianViews = median(viewsArr);

  const engaged = recentVideos.filter((v) => v.views > 0);
  const engagementRate = engaged.length
    ? Math.round(
        (engaged.reduce((s, v) => s + (v.likes + v.comments) / v.views, 0) /
          engaged.length) *
          1000
      ) / 10
    : 0;

  const avgDurationSeconds = recentVideos.length
    ? Math.round(
        recentVideos.reduce((s, v) => s + v.durationSeconds, 0) / recentVideos.length
      )
    : 0;

  const times = recentVideos
    .map((v) => +new Date(v.publishedAt))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => b - a);
  let uploadsPerMonth = 0;
  let lastUploadAt: string | undefined;
  if (times.length) {
    lastUploadAt = new Date(times[0]).toISOString();
    if (times.length >= 2) {
      const spanDays = (times[0] - times[times.length - 1]) / 86_400_000;
      uploadsPerMonth =
        spanDays > 0 ? Math.round((times.length / (spanDays / 30)) * 10) / 10 : 0;
    }
  }

  return {
    channelId,
    title: snippet.title ?? "",
    description: snippet.description ?? "",
    customUrl: snippet.customUrl,
    thumbnailUrl:
      snippet.thumbnails?.high?.url ??
      snippet.thumbnails?.medium?.url ??
      snippet.thumbnails?.default?.url,
    bannerUrl: item.brandingSettings?.image?.bannerExternalUrl,
    country: snippet.country,
    createdAt: snippet.publishedAt,
    subscribers,
    subscribersHidden: Boolean(stats.hiddenSubscriberCount),
    totalViews,
    videoCount,
    meanViews,
    medianViews,
    avgViews: medianViews,
    engagementRate,
    uploadsPerMonth,
    lastUploadAt,
    avgDurationSeconds,
    keywords,
    topics,
    recentVideos,
  };
}
