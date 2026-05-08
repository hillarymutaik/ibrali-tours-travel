import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Packages from "../pages/Packages";
import PackageDetail from "../pages/PackageDetail";
import Booking from "../pages/Booking";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:id" element={<PackageDetail />} />
      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;