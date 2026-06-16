import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Discover from "@/pages/Discover";
import CreatorProfile from "@/pages/CreatorProfile";
import BrandDashboard from "@/pages/BrandDashboard";
import CreatorDashboard from "@/pages/CreatorDashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CampaignDetail from "@/pages/CampaignDetail";
import CreatorProfileEdit from "@/pages/CreatorProfileEdit";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/brand/discover" element={<Discover />} />
        <Route path="/brand/creators/:id" element={<CreatorProfile />} />
        <Route path="/brand/dashboard" element={<BrandDashboard />} />
        <Route path="/brand/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/creator/dashboard" element={<CreatorDashboard />} />
        <Route path="/creator/profile" element={<CreatorProfileEdit />} />
        <Route path="/creator/campaigns/:id" element={<CampaignDetail />} />
      </Route>
    </Routes>
  );
}
