import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">🌍</div>
            <span className="text-2xl font-bold text-blue-600 hidden sm:inline">Ibrali Tours</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Home
            </Link>
            <Link
              to="/packages"
              className={`transition font-medium ${isActive('/packages') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Packages
            </Link>
            <Link
              to="/booking"
              className={`transition font-medium ${isActive('/booking') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Book Now
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/profile"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-200">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
            >
              Home
            </Link>
            <Link
              to="/packages"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
            >
              Packages
            </Link>
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
            >
              Book Now
            </Link>
            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium text-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
