import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-300 overflow-hidden">

      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* BRAND */}
          <div>
            <h3 className="text-white text-xl font-bold tracking-tight">
              🌍 Ibrali Tours
            </h3>

            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Crafting unforgettable African travel experiences since 2020.
              From safaris to beaches, we turn journeys into memories.
            </p>

            <div className="mt-6 flex gap-3 text-sm">
              <span className="px-3 py-1 bg-white/10 rounded-full">✈️ Travel</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">🌍 Explore</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">⭐ Premium</span>
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>

            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/packages', label: 'Packages' },
                { to: '/booking', label: 'Book Now' }
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition"
                  >
                    → {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contact</h4>

            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white transition">📧 info@ibrali-tours.com</li>
              <li className="hover:text-white transition">📱 +254 712 345 678</li>
              <li className="hover:text-white transition">📍 Nairobi, Kenya</li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-white font-semibold mb-5">Follow Us</h4>

            <div className="flex flex-col gap-3 text-sm">

              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '📷', label: 'Instagram' },
                { icon: '🐦', label: 'Twitter' }
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition hover:translate-x-1"
                >
                  <span className="text-lg">{s.icon}</span>
                  {s.label}
                </a>
              ))}

            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 pt-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-sm text-gray-500">
              © {currentYear} <span className="text-white">Ibrali Tours</span>. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm text-gray-500">

              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>

              <a href="#" className="hover:text-white transition">
                Terms
              </a>

              <a href="#" className="hover:text-white transition">
                Support
              </a>

            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}