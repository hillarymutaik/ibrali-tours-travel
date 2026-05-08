import React, { useState, useEffect } from 'react'
import { TOUR_PACKAGES } from '../utils/constants'
import Navbar from '../components/Navbar'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'

export default function Packages() {
  const [packages, setPackages] = useState(TOUR_PACKAGES)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', ...new Set(TOUR_PACKAGES.map(p => p.category))]
  const difficulties = ['all', 'Easy', 'Medium', 'Hard']
  const maxPriceValue = Math.max(...TOUR_PACKAGES.map(p => p.price))

  useEffect(() => {
    let filtered = TOUR_PACKAGES.filter(pkg => {
      const categoryMatch = selectedCategory === 'all' || pkg.category === selectedCategory
      const difficultyMatch = selectedDifficulty === 'all' || pkg.difficulty === selectedDifficulty
      const priceMatch = pkg.price >= minPrice && pkg.price <= maxPrice
      const searchMatch = searchTerm === '' ||
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())

      return categoryMatch && difficultyMatch && priceMatch && searchMatch
    })

    setPackages(filtered)
  }, [selectedCategory, selectedDifficulty, minPrice, maxPrice, searchTerm])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Tour Packages</h1>
          <p className="text-blue-100">Explore our collection of amazing destinations across Africa</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search packages by name or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Levels' : diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Price: ${minPrice}
              </label>
              <input
                type="range"
                min="0"
                max={maxPriceValue}
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max={maxPriceValue}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || minPrice !== 0 || maxPrice !== maxPriceValue || searchTerm) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedDifficulty('all')
                  setMinPrice(0)
                  setMaxPrice(maxPriceValue)
                  setSearchTerm('')
                }}
                className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 mb-8 font-semibold">
            Found {packages.length} package{packages.length !== 1 ? 's' : ''}
          </p>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg mb-6">No packages match your filters</p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedDifficulty('all')
                  setMinPrice(0)
                  setMaxPrice(maxPriceValue)
                  setSearchTerm('')
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
