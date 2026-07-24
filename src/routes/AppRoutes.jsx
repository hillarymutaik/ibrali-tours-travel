import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";

import Home from "../pages/Home";
import Packages from "../pages/Packages";
import PackageDetail from "../pages/PackageDetail";
import Booking from "../pages/Booking";
import MyBookings from "../pages/MyBookings";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Founder from "../pages/Founder";
import Careers from "../pages/Careers";
import Contact from "../pages/Contact";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import PageTransition from "../components/PageTransition";
import BackToTop from "../components/BackToTop";
import WhatsAppChat from "../components/WhatsAppChat";

function AppRoutes() {
  const location = useLocation();

  // Start each page at the top — router keeps scroll position otherwise.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      {/* Keyed on pathname so every route gets the entrance transition */}
      <PageTransition key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <BackToTop />
      <WhatsAppChat />
    </MotionConfig>
  );
}

export default AppRoutes;
