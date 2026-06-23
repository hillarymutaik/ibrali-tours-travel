import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/packages", label: "Packages" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/booking", label: "Book Safari" },
  ];

  const isActive = (path) => location.pathname === path;

  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-[#F5F0E8]/95 backdrop-blur-xl border-b border-[#E3DCCD]";

  const logoNameColor = isTransparent ? "text-white" : "text-[#1C1A17]";
  const logoTagColor = isTransparent ? "text-white/55" : "text-[#9C9890]";
  const linkBase = isTransparent
    ? "text-white/75 hover:text-white"
    : "text-[#4A4540] hover:text-[#1C1A17]";
  const activeLink = isTransparent ? "text-[#EDB84A]" : "text-[#1C1A17]";
  const hamburgerColor = isTransparent ? "text-white" : "text-[#1C1A17]";

  const serif = { fontFamily: "'Playfair Display', serif" };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-full overflow-hidden bg-white flex-shrink-0"
              style={{ border: "1.5px solid rgba(196,150,42,0.5)" }}
            >
              <img
                src="/ibrali-tours-travel/logo.webp"
                alt="Ibrali Tours"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-lg leading-none transition-colors duration-300 ${logoNameColor}`}
                style={{ ...serif, fontWeight: 700, letterSpacing: "-0.3px" }}
              >
                Ibrali Tours & Travel
              </h1>
              <p className={`text-[10px] tracking-[1.5px] uppercase mt-1 transition-colors duration-300 ${logoTagColor}`}>
                Explore Beyond Limits
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-9">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${isActive(item.path) ? activeLink : linkBase
                  }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-1.5 h-px rounded-full transition-all duration-300 ${isActive(item.path) ? "w-full" : "w-0"
                    }`}
                  style={{ background: "#C4962A" }}
                />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`text-sm font-medium transition-colors duration-300 ${linkBase}`}
                >
                  My Trips
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isTransparent
                    ? "bg-white/12 border border-white/25 text-white hover:bg-white/20"
                    : "bg-white border border-[#E3DCCD] text-[#1C1A17] hover:border-[#C4962A]"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ background: "#C4962A", color: "#0A0703" }}
                  >
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {user.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={logout}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${isTransparent
                    ? "border-white/25 text-white/70 hover:bg-white/10"
                    : "border-[#E3DCCD] text-[#6B6560] hover:border-red-200 hover:text-red-600"
                    }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors duration-300 ${linkBase}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/booking"
                  className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "#C4962A", color: "#0A0703" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#EDB84A")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#C4962A")}
                >
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${hamburgerColor}`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-[#F5F0E8] border-t border-[#E3DCCD]">
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.path)
                  ? "bg-white text-[#1C1A17]"
                  : "text-[#4A4540] hover:bg-white/60"
                  }`}
                style={isActive(item.path) ? { border: "0.5px solid #EBD9B0" } : undefined}
              >
                {isActive(item.path) && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C4962A" }} />
                )}
                {item.label}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-[#E3DCCD] space-y-2">
              {user ? (
                <>
                  <Link
                    to="/my-bookings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#4A4540] hover:bg-white/60 transition"
                  >
                    My Trips
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-[#1C1A17] font-medium text-sm"
                    style={{ border: "0.5px solid #E3DCCD" }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: "#C4962A", color: "#0A0703" }}
                    >
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-[#4A4540] hover:bg-white/60 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/booking"
                    className="block text-center px-4 py-3 rounded-xl text-sm font-medium"
                    style={{ background: "#C4962A", color: "#0A0703" }}
                  >
                    Book Safari Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
