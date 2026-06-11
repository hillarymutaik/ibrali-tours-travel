import React from "react"
import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1800&auto=format&fit=crop)"
        }}
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* SOFT GLOW LAYERS (CLEANED) */}
      <div className="absolute inset-0">
        <div className="absolute top-24 left-10 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-24 right-10 w-72 h-72 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 max-w-5xl text-center px-6">

        {/* BADGE */}
        <span className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full
          bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm">
          ✈️ Premium African Travel Experiences
        </span>

        {/* TITLE */}
        <h1 className="text-white font-extrabold leading-tight text-4xl sm:text-5xl lg:text-6xl">
          Discover Your Next{" "}
          <span className="text-blue-300">Adventure</span>
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-6 text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Explore safaris, beaches, mountains, and cultural journeys across Africa
          with hand-crafted travel experiences designed for unforgettable moments.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            to="/packages"
            className="px-8 py-4 rounded-full bg-white text-blue-700 font-semibold
            shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Explore Packages
          </Link>

          <Link
            to="/booking"
            className="px-8 py-4 rounded-full border border-white/30 text-white
            bg-white/10 backdrop-blur-md hover:bg-white hover:text-blue-700
            transition-all duration-300"
          >
            Book Your Trip
          </Link>

        </div>

        {/* STATS */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 text-sm text-white/80">

          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            🌍 50+ Destinations
          </div>

          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            ⭐ 4.9 Rated Experiences
          </div>

          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            🧭 Expert Local Guides
          </div>

        </div>

      </div>
    </section>
  )
}