import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Navbar />

      {/* BACKGROUND EFFECT */}
      <div className="flex-1 relative flex items-center justify-center px-4 overflow-hidden">

        <div className="absolute w-[500px] h-[500px] bg-blue-400/20 blur-3xl rounded-full -top-40 -left-40" />
        <div className="absolute w-[500px] h-[500px] bg-indigo-400/20 blur-3xl rounded-full -bottom-40 -right-40" />

        {/* CARD */}
        <div className="relative z-10 text-center max-w-xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-10">

          {/* ICON */}
          <div className="text-7xl mb-4">🧭</div>

          {/* ERROR CODE */}
          <h1 className="text-6xl font-extrabold text-blue-600 mb-2">
            404
          </h1>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            We couldn't find that page
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you’re looking for might have been moved, deleted, or never existed.
            Let’s get you back to exploring amazing destinations.
          </p>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
            >
              Go Home
            </Link>

            <Link
              to="/packages"
              className="px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Explore Trips
            </Link>

          </div>

          {/* SMALL HELP TEXT */}
          <p className="text-xs text-gray-500 mt-6">
            Need help? Contact support or return to homepage
          </p>

        </div>

      </div>

      <Footer />
    </div>
  )
}