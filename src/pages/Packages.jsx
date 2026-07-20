import React, { useState, useEffect } from "react"
import { TOUR_PACKAGES } from "../utils/constants"
import Navbar from "../components/Navbar"
import PackageCard from "../components/PackageCard"
import Footer from "../components/Footer"
import PageHero from "../components/PageHero"

const gold = '#C4962A'

export default function Packages() {
  const [packages, setPackages] = useState(TOUR_PACKAGES)
  const [filters, setFilters] = useState({
    category: "all",
    difficulty: "all",
    minPrice: 0,
    maxPrice: Math.max(...TOUR_PACKAGES.map(p => p.price)),
    search: "",
  })
  const [filtersOpen, setFiltersOpen] = useState(false)

  const maxPriceValue = Math.max(...TOUR_PACKAGES.map(p => p.price))
  const categories = ["all", ...new Set(TOUR_PACKAGES.map(p => p.category))]
  const difficulties = ["all", "Easy", "Medium", "Hard"]

  const activeFilterCount = [
    filters.category !== "all",
    filters.difficulty !== "all",
    filters.minPrice > 0,
    filters.maxPrice < maxPriceValue,
    filters.search !== "",
  ].filter(Boolean).length

  useEffect(() => {
    const filtered = TOUR_PACKAGES.filter(pkg => {
      const matchCategory = filters.category === "all" || pkg.category === filters.category
      const matchDifficulty = filters.difficulty === "all" || pkg.difficulty === filters.difficulty
      const matchPrice = pkg.price >= filters.minPrice && pkg.price <= filters.maxPrice
      const matchSearch =
        filters.search === "" ||
        pkg.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(filters.search.toLowerCase())
      return matchCategory && matchDifficulty && matchPrice && matchSearch
    })
    setPackages(filtered)
  }, [filters])

  const clearFilters = () =>
    setFilters({ category: "all", difficulty: "all", minPrice: 0, maxPrice: maxPriceValue, search: "" })

  const difficultyColour = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-[#FAF3E4] text-[#B07E1C] border-[#EBD9B0]",
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
        eyebrow="Kenya Safari Packages"
        image="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1400&q=60"
        subtitle={`${TOUR_PACKAGES.length} curated experiences across Kenya's most extraordinary landscapes.`}
      >
        Find your<br />
        <span className="heading-accent">adventure</span>
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
                placeholder="Search by destination or name…"
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
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs font-medium flex items-center justify-center" style={{ background: gold, color: '#382C1C' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-5 py-3 rounded-xl border border-[#E3DCCD] bg-white text-sm font-medium text-[#6B6560] hover:text-[#1C1A17] hover:border-[#382C1C] transition"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Expanded filter panel */}
          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-[#E3DCCD] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Category */}
              <div>
                <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button key={c} onClick={() => setFilters({ ...filters, category: c })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${pill(filters.category === c)}`}>
                      {c === "all" ? "All" : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(d => (
                    <button key={d} onClick={() => setFilters({ ...filters, difficulty: d })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filters.difficulty === d
                        ? "bg-[#382C1C] text-white border-[#382C1C]"
                        : d !== "all"
                          ? `${difficultyColour[d]} hover:border-current`
                          : "bg-white text-[#6B6560] border-[#E3DCCD] hover:border-[#382C1C]"
                        }`}>
                      {d === "all" ? "All levels" : d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2">
                  Price range — <span className="text-[#1C1A17] font-medium" style={{ color: '#B07E1C' }}>${filters.minPrice.toLocaleString()} – ${filters.maxPrice.toLocaleString()}</span>
                </label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <p className="text-[10px] text-[#9C9890] mb-1">Min</p>
                    <input type="range" min="0" max={maxPriceValue} value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: +e.target.value })}
                      className="w-full" style={{ accentColor: gold }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-[#9C9890] mb-1">Max</p>
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
          <span className="heading text-[#1C1A17] text-lg">{packages.length}</span> experience{packages.length !== 1 ? "s" : ""} found
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
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B07E1C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3 className="heading text-2xl text-[#1C1A17] mb-2">No experiences found</h3>
            <p className="text-[#6B6560] text-sm mb-8 max-w-xs">
              Try broadening your search or adjusting the filters to see more options.
            </p>
            <button onClick={clearFilters} className="btn btn-dark px-8 py-4">
              Reset all filters
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}