import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Back to Home
            </Link>
            <Link
              to="/packages"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              Browse Packages
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
