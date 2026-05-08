import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Ibrali Tours</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Home
            </Link>
            <Link to="/packages" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Packages
            </Link>
            <Link to="/booking" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Book Now
            </Link>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Contact
            </a>
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
          <div className="md:hidden pb-4 space-y-2">
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
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
            >
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
