import React from 'react'
import { Link } from 'react-router-dom'
import { TOUR_PACKAGES } from '../utils/constants'
import Navbar from '../components/Navbar'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

export default function Home() {
  const featuredPackages = [...TOUR_PACKAGES]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  const destinations = [
    { name: 'Masai Mara', tag: 'Wildlife Safari' },
    { name: 'Mombasa', tag: 'Coastal Escape' },
    { name: 'Mount Kenya', tag: 'Alpine Trek' },
    { name: 'Nairobi', tag: 'City Experience' },
    { name: 'Lake Nakuru', tag: 'Flamingo Haven' },
    { name: 'Samburu', tag: 'Remote Adventure' },
    { name: 'Maasai Village', tag: 'Cultural Immersion' },
    { name: 'Multi-City', tag: 'Grand Tour' },
  ]

  const features = [
    { icon: '🌍', title: 'Immersive Journeys', desc: 'Curated storytelling tours that place you inside the destination, not outside looking in.' },
    { icon: '👨‍💼', title: 'Expert Guides', desc: 'Vetted local professionals who know the land, the culture, and the hidden paths.' },
    { icon: '💎', title: 'Premium Value', desc: 'Luxury experiences at transparent, competitive pricing — no hidden costs.' },
    { icon: '🛡️', title: 'Trusted Safety', desc: 'Strict safety protocols so you focus on the adventure, not the risk.' },
    { icon: '⭐', title: '5-Star Rated', desc: 'Loved by thousands of global travellers with consistently outstanding reviews.' },
    { icon: '⚡', title: 'Always-On Support', desc: 'Responsive assistance around the clock, wherever your journey takes you.' },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F7F4EE] text-[#1C1A17] overflow-x-hidden font-sans">

        <Navbar />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">

          {/* Full-bleed background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1800&q=80')" }}
          />

          {/* Gradient overlay — dark at bottom for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B08]/90 via-[#0D0B08]/30 to-transparent" />

          {/* Floating badge */}
          <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Booking open · 2025 season
          </div>

          {/* Hero copy */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 md:pb-28 w-full">
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-5">
              Kenya's Premier Safari Company
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight max-w-4xl">
              Where the<br />
              <span className="text-amber-400">wild</span> begins.
            </h1>

            <p className="text-white/70 text-lg mt-6 max-w-lg leading-relaxed">
              Handcrafted safaris and cultural journeys across Kenya's most extraordinary landscapes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#1C1A17] font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-2xl text-sm tracking-wide"
              >
                View All Packages
                <span className="text-base">→</span>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white hover:bg-white/10 rounded-full transition-all duration-300 text-sm tracking-wide"
              >
                Our Story
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/15">
              {[
                { value: '500+', label: 'Safaris completed' },
                { value: '98%', label: 'Guest satisfaction' },
                { value: '12+', label: 'Years in Kenya' },
                { value: '40+', label: 'Destinations' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-white/50 text-xs mt-1 tracking-wide uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARQUEE STRIP ────────────────────────────────── */}
        <div className="bg-amber-500 py-3 overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {Array(6).fill(['Masai Mara', 'Amboseli', 'Lake Nakuru', 'Samburu', 'Mombasa', 'Mount Kenya', 'Tsavo']).flat().map((d, i) => (
              <span key={i} className="text-[#1C1A17] font-semibold text-sm tracking-widest uppercase flex items-center gap-4">
                {d} <span className="text-[#1C1A17]/40">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── FEATURED PACKAGES ────────────────────────────── */}
        <section className="py-24 px-6 max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
            <div>
              <p className="text-amber-600 text-xs font-bold tracking-widest uppercase mb-3">Handpicked for you</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                Featured<br />Adventures
              </h2>
            </div>
            <Link
              to="/packages"
              className="self-start md:self-auto inline-flex items-center gap-2 text-sm font-semibold text-[#1C1A17] border-b-2 border-amber-500 pb-1 hover:text-amber-600 transition"
            >
              See all packages →
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group hover:-translate-y-2 transition-transform duration-500"
              >
                <PackageCard package={pkg} />
              </div>
            ))}
          </div>
        </section>

        {/* ── DESTINATIONS GRID ────────────────────────────── */}
        <section className="py-24 bg-[#1C1A17]">
          <div className="max-w-7xl mx-auto px-6">

            <div className="mb-16">
              <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">Explore Kenya</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Top Destinations
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.map((dest, i) => (
                <Link
                  key={i}
                  to="/packages"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-6 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-500 group-hover:w-full transition-all duration-500" />
                  <p className="font-bold text-white text-base leading-snug">{dest.name}</p>
                  <p className="text-white/40 text-xs mt-1.5 tracking-wide">{dest.tag}</p>
                  <span className="absolute top-4 right-4 text-white/20 group-hover:text-amber-400 transition text-lg">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US – HORIZONTAL SCROLL CARDS ────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">

            <div className="mb-16 text-center">
              <p className="text-amber-600 text-xs font-bold tracking-widest uppercase mb-3">Our promise</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                Why Travellers<br />Choose Us
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl border border-[#E8E4DB] bg-white hover:border-amber-400 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="text-3xl mb-5">{f.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-[#6B6560] text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IMMERSIVE SPLIT CTA ───────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="grid lg:grid-cols-2">

            {/* Left – image */}
            <div
              className="min-h-[50vh] lg:min-h-[600px] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547970827-f33b90fde688?w=900&q=80')" }}
            />

            {/* Right – copy */}
            <div className="bg-[#1C1A17] flex flex-col justify-center px-10 py-16 lg:px-16">
              <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-4">Ready to go?</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                Your next<br />
                adventure<br />
                <span className="text-amber-400">starts here.</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-10 max-w-sm">
                Discover Kenya's untamed beauty with a company built on passion, expertise, and a deep respect for the land.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/packages"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#1C1A17] font-bold rounded-full transition-all duration-300 hover:scale-105 text-sm tracking-wide"
                >
                  Browse Packages →
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white/25 text-white hover:bg-white/10 rounded-full transition text-sm tracking-wide"
                >
                  Create Account
                </Link>
              </div>
            </div>

          </div>
        </section>

        <Footer />
      </div>

      {/* Marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </PageTransition>
  )
}