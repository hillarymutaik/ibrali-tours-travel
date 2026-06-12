import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-28">
        <div className="text-center max-w-lg">

          {/* Large 404 */}
          <p className="text-[140px] sm:text-[180px] font-black leading-none text-[#EAE6DF] select-none">
            404
          </p>

          {/* Icon + message overlaid */}
          <div className="-mt-10 relative z-10">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-amber-500 items-center justify-center text-3xl mb-6 shadow-lg shadow-amber-200/60">
              🧭
            </div>

            <h1 className="text-3xl font-black text-[#1C1A17] mb-3">
              Page not found
            </h1>
            <p className="text-[#6B6560] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              The page you're looking for might have moved, been deleted, or never existed.
              Let's get you back to exploring amazing destinations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1C1A17] text-white text-sm font-bold hover:bg-[#333] transition-all duration-300 hover:scale-105 shadow-md"
              >
                ← Go Home
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#E8E4DB] bg-white text-[#1C1A17] text-sm font-bold hover:border-amber-400 hover:bg-amber-50 transition-all duration-300"
              >
                Explore Trips
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
