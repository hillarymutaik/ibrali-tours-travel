import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { TOUR_PACKAGES } from "../utils/constants"
import { formatCurrency, getDifficultyColor, getCategoryColor } from "../utils/helpers"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const difficultyStyle = {
  Easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Hard: "bg-red-50 text-red-700 border border-red-200",
}

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const found = TOUR_PACKAGES.find(p => p.id === parseInt(id))
    setPkg(found || null)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-[#6B6560] text-sm font-medium">Loading experience…</p>
        </div>
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#F7F4EE]">
        <Navbar />
        <div className="max-w-4xl mx-auto text-center py-32 px-6">
          <p className="text-6xl mb-6">🔭</p>
          <h1 className="text-3xl font-black text-[#1C1A17] mb-3">Experience not found</h1>
          <p className="text-[#6B6560] mb-8">This package may have moved or no longer exists.</p>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1A17] text-white font-bold rounded-full hover:bg-[#333] transition text-sm"
          >
            ← Back to packages
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const tabs = ["overview", "highlights", "inclusions"]

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1C1A17] font-sans overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative h-[75vh] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover scale-[1.04] transition-transform duration-[8s] hover:scale-100"
        />

        {/* gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B08]/90 via-[#0D0B08]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B08]/40 to-transparent" />

        {/* Back nav */}
        <button
          onClick={() => navigate("/packages")}
          className="absolute top-24 left-6 md:left-10 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/20 transition"
        >
          ← All packages
        </button>

        {/* Rating pill */}
        <div className="absolute top-24 right-6 md:right-10 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5">
          <span className="text-amber-400">★</span>
          {pkg.rating} · {pkg.reviews} reviews
        </div>

        {/* Hero copy */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 md:px-10 pb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-[#1C1A17]">
                {pkg.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyStyle[pkg.difficulty] || "bg-white/20 text-white"}`}>
                {pkg.difficulty}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight max-w-3xl">
              {pkg.title}
            </h1>

            <p className="text-white/65 mt-3 text-base flex items-center gap-2">
              <span>📍</span> {pkg.destination} · {pkg.duration}-day adventure
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* LEFT ─ Main Content */}
        <div className="lg:col-span-2 space-y-12">

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Duration", value: `${pkg.duration} days`, icon: "🗓" },
              { label: "Max group", value: pkg.maxTravelers, icon: "👥" },
              { label: "Best time", value: pkg.bestTime, icon: "☀️" },
              { label: "Rating", value: `${pkg.rating} / 5`, icon: "⭐" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#EAE6DF]">
                <p className="text-xl mb-2">{s.icon}</p>
                <p className="text-xs text-[#9C9890] font-medium uppercase tracking-wide mb-0.5">{s.label}</p>
                <p className="font-black text-[#1C1A17] text-sm">{s.value}</p>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div>
            <div className="flex gap-1 p-1 bg-white rounded-xl border border-[#EAE6DF] w-fit mb-8">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${activeTab === t
                    ? "bg-[#1C1A17] text-white shadow-sm"
                    : "text-[#6B6560] hover:text-[#1C1A17]"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-black">About this experience</h2>
                <p className="text-[#4A4540] leading-relaxed text-base">{pkg.description}</p>
              </div>
            )}

            {/* HIGHLIGHTS TAB */}
            {activeTab === "highlights" && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-black mb-6">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#EAE6DF] hover:border-amber-400 transition-colors duration-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-[#1C1A17] text-sm leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INCLUSIONS TAB */}
            {activeTab === "inclusions" && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-black mb-6">What's included</h2>
                <div className="bg-white rounded-2xl border border-[#EAE6DF] overflow-hidden">
                  {pkg.inclusions.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-6 py-4 text-sm text-[#1C1A17] ${i < pkg.inclusions.length - 1 ? "border-b border-[#F0EDE8]" : ""
                        }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ─ Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">

            {/* Main booking card */}
            <div className="bg-[#1C1A17] rounded-2xl p-7 text-white">

              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Price per person</p>
              <p className="text-4xl font-black text-amber-400 mb-1">
                {formatCurrency(pkg.price)}
              </p>
              <p className="text-white/40 text-xs mb-7">All taxes & fees included</p>

              <div className="space-y-3 pb-6 mb-6 border-b border-white/10 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Destination</span>
                  <span className="font-bold">{pkg.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Duration</span>
                  <span className="font-bold">{pkg.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Difficulty</span>
                  <span className="font-bold capitalize">{pkg.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Max group</span>
                  <span className="font-bold">{pkg.maxTravelers} people</span>
                </div>
              </div>

              <Link
                to="/booking"
                state={{ packageId: pkg.id }}
                className="block text-center w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#1C1A17] font-black transition-all duration-200 hover:scale-[1.02] text-sm tracking-wide"
              >
                Reserve This Experience →
              </Link>

              <button
                onClick={() => navigate("/packages")}
                className="w-full mt-3 py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition text-sm"
              >
                View all packages
              </button>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-2xl border border-[#EAE6DF] p-5">
              <div className="space-y-3">
                {[
                  { icon: "✓", label: "Free cancellation", sub: "Up to 48 hrs before departure" },
                  { icon: "🔒", label: "Secure booking", sub: "256-bit SSL encryption" },
                  { icon: "⚡", label: "Instant confirmation", sub: "Booking confirmed immediately" },
                ].map((t) => (
                  <div key={t.label} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center flex-shrink-0">{t.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-[#1C1A17]">{t.label}</p>
                      <p className="text-xs text-[#9C9890]">{t.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </section>

      <Footer />
    </div>
  )
}