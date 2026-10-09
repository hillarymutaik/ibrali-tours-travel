
import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { TOUR_PACKAGES } from "../utils/constants"
import { formatCurrency, getDifficultyColor, getCategoryColor } from "../utils/helpers"
import { useLanguage } from "../hooks/useLanguage"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import useSeo from "../hooks/useSeo"

const serif = { fontFamily: "'Playfair Display', serif" }
const gold = '#E75A08'

const difficultyStyle = {
  Easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Medium: "bg-[#FFF4ED] text-[#C2470A] border border-[#FFD9B3]",
  Hard: "bg-red-50 text-red-700 border border-red-200",
}

/* Compact inline icon set */
function StatIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: '#C2470A', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="3" x2="8" y2="6" /><line x1="16" y1="3" x2="16" y2="6" /></>,
    group: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" /><path d="M16 6a3 3 0 0 1 0 6M21 20v-1a5 5 0 0 0-3-4.5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></>,
    star: <polygon points="12 3 14.9 9 21 9.7 16.5 14 17.8 20 12 16.8 6.2 20 7.5 14 3 9.7 9.1 9 12 3" />,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function TrustIcon({ name }) {
  const common = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: '#C2470A', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    check: <polyline points="20 6 9 17 4 12" />,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, locale } = useLanguage()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Localised package text (falls back to the English data when no translation exists)
  const title = pkg ? t(`pkg.${pkg.id}.title`, pkg.title) : ''
  const destination = pkg ? t(`pkg.${pkg.id}.destination`, pkg.destination) : ''
  const description = pkg ? t(`pkg.${pkg.id}.description`, pkg.description) : ''
  const bestTime = pkg ? t(`pkg.${pkg.id}.bestTime`, pkg.bestTime) : ''
  const highlights = pkg ? pkg.highlights.map((h, i) => t(`pkg.${pkg.id}.highlight.${i}`, h)) : []
  const inclusions = pkg ? pkg.inclusions.map((item, i) => t(`pkg.${pkg.id}.inclusion.${i}`, item)) : []

  useSeo({
    title: pkg ? title : t('detail.seoFallbackTitle'),
    description: pkg ? description : t('detail.seoFallbackDesc'),
    image: pkg?.image,
  })

  useEffect(() => {
    const found = TOUR_PACKAGES.find(p => p.id === parseInt(id))
    setPkg(found || null)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: gold, borderTopColor: 'transparent' }} />
          <p className="text-[#6B6560] text-sm font-medium">{t('detail.loading')}</p>
        </div>
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#FAF7F1]">
        <Navbar />
        <div className="max-w-4xl mx-auto text-center py-32 px-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C2470A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <h1 className="text-3xl text-[#1C1A17] mb-3" style={{ ...serif, fontWeight: 700 }}>{t('detail.notFoundTitle')}</h1>
          <p className="text-[#6B6560] mb-8">{t('detail.notFoundDesc')}</p>
          <Link to="/packages" className="btn btn-dark px-8 py-4">
            {t('detail.backToPackages')}
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const tabs = ["overview", "highlights", "inclusions"]

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] font-sans overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative h-[75vh] overflow-hidden">
        <img
          src={pkg.image}
          alt={title}
          className="w-full h-full object-cover scale-[1.04] transition-transform duration-[8s] hover:scale-100"
        />

        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(56,44,28,0.85), rgba(56,44,28,0.2) 55%, transparent)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(56,44,28,0.4), transparent)' }} />

        {/* Back nav */}
        <button
          onClick={() => navigate("/packages")}
          className="absolute top-24 left-6 md:left-10 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/20 transition"
        >
          {t('detail.allPackages')}
        </button>

        {/* Rating pill */}
        <div className="absolute top-24 right-6 md:right-10 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-1.5">
          <span style={{ color: '#F2843A' }}>★</span>
          {pkg.rating} {t('detail.reviews', null, { n: pkg.reviews })}
        </div>

        {/* Hero copy */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 md:px-10 pb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: gold, color: '#fff' }}>
                {t(`common.category.${pkg.category?.toLowerCase()}`, pkg.category)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyStyle[pkg.difficulty] || "bg-white/20 text-white"}`}>
                {t(`common.difficulty.${pkg.difficulty}`, pkg.difficulty)}
              </span>
            </div>

            <h1 className="text-white leading-[1.0] max-w-3xl" style={{ ...serif, fontWeight: 700, fontSize: 'clamp(36px, 6vw, 64px)' }}>
              {title}
            </h1>

            <p className="text-white/65 mt-3 text-base flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F2843A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {destination} · {t('detail.dayAdventure', null, { n: pkg.duration })}
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
              { label: t('detail.statDuration'), value: t('detail.days', null, { n: pkg.duration }), icon: "calendar" },
              { label: t('detail.statGroup'), value: pkg.maxTravelers, icon: "group" },
              { label: t('detail.statBest'), value: bestTime, icon: "sun" },
              { label: t('detail.statRating'), value: `${pkg.rating} / 5`, icon: "star" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4" style={{ border: '0.5px solid #E3DCCD' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
                  <StatIcon name={s.icon} />
                </div>
                <p className="text-[11px] text-[#9C9890] font-medium uppercase tracking-[1.5px] mb-0.5">{s.label}</p>
                <p className="font-medium text-[#1C1A17] text-sm">{s.value}</p>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div>
            <div className="flex gap-1 p-1 bg-white rounded-xl w-fit mb-8" style={{ border: '0.5px solid #E3DCCD' }}>
              {tabs.map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${activeTab === tabKey
                    ? "bg-[#382C1C] text-white"
                    : "text-[#6B6560] hover:text-[#1C1A17]"
                    }`}
                >
                  {t(`detail.tab.${tabKey}`)}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl" style={{ ...serif, fontWeight: 700 }}>{t('detail.aboutTitle')}</h2>
                <p className="text-[#4A4540] leading-relaxed text-base">{description}</p>
              </div>
            )}

            {/* HIGHLIGHTS TAB */}
            {activeTab === "highlights" && (
              <div className="animate-fade-in">
                <h2 className="text-2xl mb-6" style={{ ...serif, fontWeight: 700 }}>{t('detail.highlightsTitle')}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 card-surface p-4 !rounded-xl"
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C2470A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      <span className="text-[#1C1A17] text-sm leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INCLUSIONS TAB */}
            {activeTab === "inclusions" && (
              <div className="animate-fade-in">
                <h2 className="text-2xl mb-6" style={{ ...serif, fontWeight: 700 }}>{t('detail.includedTitle')}</h2>
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '0.5px solid #E3DCCD' }}>
                  {inclusions.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-6 py-4 text-sm text-[#1C1A17] ${i < inclusions.length - 1 ? "border-b border-[#F0EDE8]" : ""
                        }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: gold }} />
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
            <div className="rounded-2xl p-7 text-white" style={{ background: '#382C1C' }}>

              <p className="text-white/50 text-[11px] font-medium uppercase tracking-[1.5px] mb-1">{t('common.pricePerPerson')}</p>
              <p className="mb-1" style={{ ...serif, fontWeight: 700, fontSize: '40px', color: '#F2843A' }}>
                {formatCurrency(pkg.price, 'USD', locale)}
              </p>
              <p className="text-white/40 text-xs mb-7">{t('detail.taxes')}</p>

              <div className="space-y-3 pb-6 mb-6 text-sm" style={{ borderBottom: '0.5px solid rgba(231, 90, 8,0.2)' }}>
                <div className="flex justify-between"><span className="text-white/50">{t('detail.destination')}</span><span className="font-medium">{destination}</span></div>
                <div className="flex justify-between"><span className="text-white/50">{t('detail.statDuration')}</span><span className="font-medium">{t('detail.days', null, { n: pkg.duration })}</span></div>
                <div className="flex justify-between"><span className="text-white/50">{t('detail.difficulty')}</span><span className="font-medium">{t(`common.difficulty.${pkg.difficulty}`, pkg.difficulty)}</span></div>
                <div className="flex justify-between"><span className="text-white/50">{t('detail.statGroup')}</span><span className="font-medium">{t('detail.people', null, { n: pkg.maxTravelers })}</span></div>
              </div>

              <Link
                to="/booking"
                state={{ packageId: pkg.id }}
                className="btn btn-gold w-full py-4 !rounded-xl tracking-wide"
              >
                {t('detail.reserve')} →
              </Link>

              <button
                onClick={() => navigate("/packages")}
                className="w-full mt-3 py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition text-sm"
              >
                {t('detail.viewAllPackages')}
              </button>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-2xl p-5" style={{ border: '0.5px solid #E3DCCD' }}>
              <div className="space-y-3">
                {[
                  { icon: "check", label: t('detail.trust.cancel'), sub: t('detail.trust.cancelSub') },
                  { icon: "lock", label: t('detail.trust.secure'), sub: t('detail.trust.secureSub') },
                  { icon: "bolt", label: t('detail.trust.instant'), sub: t('detail.trust.instantSub') },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
                      <TrustIcon name={badge.icon} />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-[#1C1A17]">{badge.label}</p>
                      <p className="text-xs text-[#9C9890]">{badge.sub}</p>
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
