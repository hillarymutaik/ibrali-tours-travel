import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { TOUR_PACKAGES, TRIP_LENGTHS, GROUP_SIZES } from "../utils/constants"
import { useLanguage } from "../hooks/useLanguage"
import Navbar from "../components/Navbar"
import PackageCard from "../components/PackageCard"
import Footer from "../components/Footer"
import PageHero from "../components/PageHero"
import useSeo from "../hooks/useSeo"

const gold = '#E75A08'

export default function Packages() {
  const { t, locale } = useLanguage()
  const location = useLocation()
  useSeo({
    title: t('packages.seoTitle'),
    description: t('packages.seoDesc'),
  })

  const maxPriceValue = Math.max(...TOUR_PACKAGES.map(p => p.price))

  // Filters can arrive from the home page (hero search, category and destination cards)
  const incoming = location.state || {}
  const [packages, setPackages] = useState(TOUR_PACKAGES)
  const [filters, setFilters] = useState({
    category: incoming.category || "all",
    difficulty: "all",
    duration: incoming.duration || "all",
    groupSize: incoming.groupSize || "all",
    minPrice: 0,
    maxPrice: maxPriceValue,
    search: incoming.search || "",
  })
  // Show the filter panel when filters were applied for the visitor, so they can see why results are narrowed
  const [filtersOpen, setFiltersOpen] = useState(Boolean(incoming.category || incoming.duration || incoming.groupSize))

  const categories = ["all", ...new Set(TOUR_PACKAGES.map(p => p.category))]
  const difficulties = ["all", "Easy", "Medium", "Hard"]

  const activeFilterCount = [
    filters.category !== "all",
    filters.difficulty !== "all",
    filters.duration !== "all",
    filters.groupSize !== "all",
    filters.minPrice > 0,
    filters.maxPrice < maxPriceValue,
    filters.search !== "",
  ].filter(Boolean).length

  useEffect(() => {
    const query = filters.search.toLowerCase()
    const length = TRIP_LENGTHS.find(l => l.value === filters.duration)
    const group = GROUP_SIZES.find(g => g.value === filters.groupSize)
    const filtered = TOUR_PACKAGES.filter(pkg => {
      const matchCategory = filters.category === "all" || pkg.category === filters.category
      const matchDifficulty = filters.difficulty === "all" || pkg.difficulty === filters.difficulty
      const matchDuration = !length || (pkg.duration >= length.min && pkg.duration <= length.max)
      const matchGroup = !group || pkg.maxTravelers >= group.min
      const matchPrice = pkg.price >= filters.minPrice && pkg.price <= filters.maxPrice
      // Match the English data and the visitor's language, so "Plage" finds beach trips in French
      const matchSearch =
        query === "" ||
        [pkg.title, pkg.destination, t(`pkg.${pkg.id}.title`, pkg.title), t(`pkg.${pkg.id}.destination`, pkg.destination)]
          .some(text => text.toLowerCase().includes(query))
      return matchCategory && matchDifficulty && matchDuration && matchGroup && matchPrice && matchSearch
    })
    setPackages(filtered)
  }, [filters, t])

  const clearFilters = () =>
    setFilters({ category: "all", difficulty: "all", duration: "all", groupSize: "all", minPrice: 0, maxPrice: maxPriceValue, search: "" })

  const difficultyColour = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-[#FFF4ED] text-[#C2470A] border-[#FFD9B3]",
    Hard: "bg-red-50 text-red-700 border-red-200",
  }

  const pill = (active) =>
    active
      ? "bg-[#382C1C] text-white border-[#382C1C]"
      : "bg-white text-[#6B6560] border-[#E3DCCD] hover:border-[#382C1C]"

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      {/* ── HERO HEADER ───────────────────────────────────── */}
      <PageHero
        image="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1400&q=60"
        subtitle={t('packages.subtitle', null, { n: TOUR_PACKAGES.length })}
      >
        {t('packages.hero1')}<br />
        <span className="heading-accent">{t('packages.hero2')}</span>
      </PageHero>

      {/* ── STICKY SEARCH + FILTER BAR ───────────────────── */}
      <section className="sticky top-16 z-40 bg-[#FAF7F1]/95 backdrop-blur-lg border-b border-[#E3DCCD]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9890]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('packages.searchPlaceholder')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E3DCCD] bg-white text-sm focus:outline-none placeholder-[#B0A99E]"
                style={{ outlineColor: gold }}
                onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${gold}55`)}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${pill(filtersOpen || activeFilterCount > 0)}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h2M9 16h6" />
              </svg>
              {t('packages.filters')}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs font-medium flex items-center justify-center" style={{ background: gold, color: '#fff' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-5 py-3 rounded-xl border border-[#E3DCCD] bg-white text-sm font-medium text-[#6B6560] hover:text-[#1C1A17] hover:border-[#382C1C] transition"
              >
                {t('packages.clearAll')}
              </button>
            )}
          </div>

          {/* Expanded filter panel */}
          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-[#E3DCCD] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Category */}
              <div>
                <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2">{t('packages.category')}</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button key={c} onClick={() => setFilters({ ...filters, category: c })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${pill(filters.category === c)}`}>
                      {c === "all" ? t('packages.all') : t(`common.category.${c}`, c)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2">{t('packages.difficulty')}</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(d => (
                    <button key={d} onClick={() => setFilters({ ...filters, difficulty: d })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filters.difficulty === d
                        ? "bg-[#382C1C] text-white border-[#382C1C]"
                        : d !== "all"
                          ? `${difficultyColour[d]} hover:border-current`
                          : "bg-white text-[#6B6560] border-[#E3DCCD] hover:border-[#382C1C]"
                        }`}>
                      {d === "all" ? t('packages.allLevels') : t(`common.difficulty.${d}`, d)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2">{t('packages.duration')}</label>
                <div className="flex flex-wrap gap-2">
                  {[{ value: "all", label: t('packages.all') }, ...TRIP_LENGTHS.map(l => ({ value: l.value, label: t(l.labelKey) }))].map(o => (
                    <button key={o.value} onClick={() => setFilters({ ...filters, duration: o.value })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${pill(filters.duration === o.value)}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group size */}
              <div>
                <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2">{t('packages.groupSize')}</label>
                <div className="flex flex-wrap gap-2">
                  {[{ value: "all", label: t('packages.all') }, ...GROUP_SIZES].map(o => (
                    <button key={o.value} onClick={() => setFilters({ ...filters, groupSize: o.value })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${pill(filters.groupSize === o.value)}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2">
                  {t('packages.priceRange')} <span className="text-[#1C1A17] font-medium" style={{ color: '#C2470A' }}>${filters.minPrice.toLocaleString(locale)} – ${filters.maxPrice.toLocaleString(locale)}</span>
                </label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <p className="text-[10px] text-[#9C9890] mb-1">{t('packages.min')}</p>
                    <input type="range" min="0" max={maxPriceValue} value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: +e.target.value })}
                      className="w-full" style={{ accentColor: gold }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-[#9C9890] mb-1">{t('packages.max')}</p>
                    <input type="range" min="0" max={maxPriceValue} value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: +e.target.value })}
                      className="w-full" style={{ accentColor: gold }} />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* ── RESULTS COUNT ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2 flex items-center justify-between">
        <p className="text-sm text-[#6B6560] font-medium">
          <span className="heading text-[#1C1A17] text-lg">{packages.length}</span>{' '}
          {packages.length !== 1 ? t('packages.foundMany') : t('packages.foundOne')}
        </p>
      </div>

      {/* ── PACKAGE GRID ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24 pt-4">
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map(pkg => (
              <div key={pkg.id} className="group hover:-translate-y-2 transition-transform duration-500">
                <PackageCard package={pkg} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C2470A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3 className="heading text-2xl text-[#1C1A17] mb-2">{t('packages.noneTitle')}</h3>
            <p className="text-[#6B6560] text-sm mb-8 max-w-xs">
              {t('packages.noneDesc')}
            </p>
            <button onClick={clearFilters} className="btn btn-dark px-8 py-4">
              {t('packages.reset')}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
