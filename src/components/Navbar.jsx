import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/packages", label: "Packages" },
    { path: "/booking", label: "Book Safari" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
        : "bg-white/60 backdrop-blur-md"
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md border border-gray-100">
              <img
                src="/ibrali-tours-travel/logo.webp"
                alt="Ibrali Tours"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-gray-900 leading-none">
                Ibrali Tours
              </h1>
              <p className="text-xs text-gray-500">
                Explore Beyond Limits
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {item.label}

                <span
                  className={`absolute left-0 -bottom-2 h-[3px] bg-blue-600 rounded-full transition-all duration-300 ${isActive(item.path)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                    }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  My Trips
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    {user.name?.charAt(0)}
                  </div>

                  {user.name}
                </Link>

                <button
                  onClick={logout}
                  className="px-5 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/booking"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Book Safari
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px]" : "max-h-0"
          }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-lg">
          <div className="p-5 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition ${isActive(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3 border-t">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium"
                  >
                    {user.name}
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-left font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/booking"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
                >
                  Book Safari
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}