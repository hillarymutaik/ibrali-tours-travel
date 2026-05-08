import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'

export default function Packages() {
  const [selectedDestination, setSelectedDestination] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')

  const allPackages = [
    {
      id: 1,
      title: 'Safari Adventure',
      destination: 'Masai Mara',
      duration: 5,
      price: 2500,
      image: 'https://images.unsplash.com/photo-1525253086316-d5eb3d51a046?w=500&h=300&fit=crop',
      rating: 4.8,
      reviews: 45,
      category: 'safari'
    },
    {
      id: 2,
      title: 'Beach Paradise',
      destination: 'Mombasa',
      duration: 7,
      price: 1800,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 62,
      category: 'beach'
    },
    {
      id: 3,
      title: 'Mountain Trek',
      destination: 'Mount Kenya',
      duration: 4,
      price: 1500,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      rating: 4.7,
      reviews: 38,
      category: 'trekking'
    },
    {
      id: 4,
      title: 'City Tour',
      destination: 'Nairobi',
      duration: 3,
      price: 800,
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop',
      rating: 4.5,
      reviews: 28,
      category: 'city'
    },
    {
      id: 5,
      title: 'Lake Nakuru',
      destination: 'Lake Nakuru',
      duration: 2,
      price: 600,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      rating: 4.6,
      reviews: 35,
      category: 'wildlife'
    },
    {
      id: 6,
      title: 'Luxury Safari',
      destination: 'Samburu',
      duration: 6,
      price: 3500,
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 52,
      category: 'safari'
    }
  ]

  const filteredPackages = allPackages.filter((pkg) => {
    const destinationMatch = selectedDestination === 'all' || pkg.category === selectedDestination
    const durationMatch = selectedDuration === 'all' || 
      (selectedDuration === 'short' && pkg.duration <= 3) ||
      (selectedDuration === 'medium' && pkg.duration > 3 && pkg.duration <= 5) ||
      (selectedDuration === 'long' && pkg.duration > 5)
    return destinationMatch && durationMatch
  })

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Our Packages</h1>
          <p className="text-blue-100">Choose from our wide range of travel packages</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination Type
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Destinations</option>
                <option value="safari">Safari</option>
                <option value="beach">Beach</option>
                <option value="trekking">Trekking</option>
                <option value="city">City</option>
                <option value="wildlife">Wildlife</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Durations</option>
                <option value="short">1-3 Days</option>
                <option value="medium">4-5 Days</option>
                <option value="long">6+ Days</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 mb-8">
            Found {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
          </p>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No packages match your filters</p>
              <button
                onClick={() => {
                  setSelectedDestination('all')
                  setSelectedDuration('all')
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
