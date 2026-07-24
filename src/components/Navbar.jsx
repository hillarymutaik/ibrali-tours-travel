import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const { user } = useAuth();
  const location = useLocation();

  // Routes that open with a dark hero get a transparent overlay navbar until
  // scrolled; everything else (light background from the top, or unmatched
  // 404s) keeps the solid navbar so the logo/links stay legible.
  const darkHeroRoutes = ["/", "/packages", "/about", "/founder", "/careers", "/contact", "/blog", "/booking", "/my-bookings"];
  const hasDarkHero =
    darkHeroRoutes.includes(location.pathname) ||
    /^\/packages\/.+/.test(location.pathname) ||
    /^\/blog\/.+/.test(location.pathname) ||
    (location.pathname === "/profile" && !!user);
  const isTransparent = hasDarkHero && !scrolled && !isOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const aboutDropdown = [
    { path: "/about", label: "Our Story" },
    { path: "/founder", label: "Message From Founder" },
    { path: "/careers", label: "Careers" },
  ];

  const navItems = [
    { path: "/", label: "Home" },
    { label: "About Us", dropdown: aboutDropdown },
    { path: "/packages", label: "Packages" },
    { path: "/booking", label: "Book Safari" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact Us" },
  ];

  const isActive = (path) => location.pathname === path;
  const isAboutActive = aboutDropdown.some((item) => item.path === location.pathname);

  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-[#FAF7F1]/95 backdrop-blur-xl border-b border-[#E3DCCD] shadow-[0_8px_30px_-16px_rgba(28,26,23,0.25)]";

  const logoNameColor = isTransparent ? "text-white" : "text-[#1C1A17]";
  const logoTagColor = isTransparent ? "text-white/55" : "text-[#9C9890]";
  const linkBase = isTransparent
    ? "text-white/75 hover:text-white"
    : "text-[#4A4540] hover:text-[#1C1A17]";
  const activeLink = isTransparent ? "text-[#F2843A]" : "text-[#1C1A17]";
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
              style={{ border: "1.5px solid rgba(231, 90, 8,0.5)" }}
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
                Discover. Experience. Remember.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-9">
            {navItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <button
                    onClick={() => setAboutOpen((o) => !o)}
                    className={`relative flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors duration-300 ${isAboutActive ? activeLink : linkBase
                      }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      className={`transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`}
                    />
                    <span
                      className={`absolute left-0 -bottom-1.5 h-px rounded-full transition-all duration-300 ${isAboutActive ? "w-full" : "w-0"
                        }`}
                      style={{ background: "#E75A08" }}
                    />
                  </button>

                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${aboutOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
                      }`}
                  >
                    <div
                      className="w-60 rounded-2xl bg-white overflow-hidden py-2"
                      style={{ border: "0.5px solid #E3DCCD", boxShadow: "0 18px 40px -18px rgba(28,26,23,0.25)" }}
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          state={sub.state}
                          className="block px-5 py-3 text-sm font-medium text-[#4A4540] hover:bg-[#FFF4ED] hover:text-[#1C1A17] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
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
                    style={{ background: "#E75A08" }}
                  />
                </Link>
              )
            )}
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
                    : "bg-white border border-[#E3DCCD] text-[#1C1A17] hover:border-[#E75A08]"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ background: "#E75A08", color: "#fff" }}
                  >
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {user.name?.split(" ")[0]}
                </Link>
              </>
            ) : (
              <Link
                to="/booking"
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "#E75A08", color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F2843A")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#E75A08")}
              >
                Book Now
              </Link>
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
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[720px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-[#FAF7F1] border-t border-[#E3DCCD]">
          <div className="p-4 space-y-1">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileAboutOpen((o) => !o)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isAboutActive
                      ? "bg-white text-[#1C1A17]"
                      : "text-[#4A4540] hover:bg-white/60"
                      }`}
                    style={isAboutActive ? { border: "0.5px solid #FFD9B3" } : undefined}
                  >
                    <span className="flex items-center gap-3">
                      {isAboutActive && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#E75A08" }} />
                      )}
                      {item.label}
                    </span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      className={`transition-transform duration-300 ${mobileAboutOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${mobileAboutOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                      }`}
                  >
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        state={sub.state}
                        className="flex items-center gap-3 pl-8 pr-4 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-white/60 hover:text-[#1C1A17] transition-all"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.path)
                    ? "bg-white text-[#1C1A17]"
                    : "text-[#4A4540] hover:bg-white/60"
                    }`}
                  style={isActive(item.path) ? { border: "0.5px solid #FFD9B3" } : undefined}
                >
                  {isActive(item.path) && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#E75A08" }} />
                  )}
                  {item.label}
                </Link>
              )
            )}

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
                      style={{ background: "#E75A08", color: "#fff" }}
                    >
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    {user.name}
                  </Link>
                </>
              ) : (
                <Link
                  to="/booking"
                  className="block text-center px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: "#E75A08", color: "#fff" }}
                >
                  Book Safari Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
