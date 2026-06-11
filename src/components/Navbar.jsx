import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* LOGO – Updated to use image from public folder */}
          <Link
            to="/"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200 shadow-md hover:shadow-lg transition group"
          >
            <img
              src="/ibrali-tours-travel/logo.webp"
              alt="Ibrali Tours & Travel"
              className="h-8 w-auto group-hover:scale-110 transition-transform duration-200"
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { path: '/', label: 'Home' },
              { path: '/packages', label: 'Packages' },
              { path: '/booking', label: 'Book Now' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-medium transition ${isActive(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}

            {/* AUTH SECTION */}
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  My Trips
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
                >
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/profile"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-xl hover:scale-105 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/packages', label: 'Packages' },
              { path: '/booking', label: 'Book Now' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg font-medium transition ${isActive(item.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-100'
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
                >
                  My Trips
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
                >
                  {user.name}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-lg bg-blue-600 text-white text-center font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}