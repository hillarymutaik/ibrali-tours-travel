import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { TOUR_PACKAGES } from '../utils/constants'
import { formatCurrency, getDifficultyColor, getCategoryColor } from '../utils/helpers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const selectedPackage = TOUR_PACKAGES.find(p => p.id === parseInt(id))
    if (selectedPackage) {
      setPkg(selectedPackage)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Package Not Found</h1>
          <Link to="/packages" className="text-blue-600 hover:underline">
            Back to Packages
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Image */}
      <section className="h-96 bg-gray-300 relative overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="w-full p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{pkg.title}</h1>
            <div className="flex flex-wrap gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(pkg.category)}`}>
                {pkg.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(pkg.difficulty)}`}>
                {pkg.difficulty}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Package</h2>
              <p className="text-gray-600 text-lg">{pkg.description}</p>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-2">
                  {pkg.inclusions.map((inclusion, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {inclusion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-xl font-bold text-gray-900">{pkg.duration} days</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Max Travelers</p>
                <p className="text-xl font-bold text-gray-900">{pkg.maxTravelers} people</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Best Time</p>
                <p className="text-lg font-bold text-gray-900">{pkg.bestTime}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Rating</p>
                <p className="text-xl font-bold text-gray-900">{pkg.rating} ⭐</p>
                <p className="text-xs text-gray-600">{pkg.reviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Price per person</p>
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {formatCurrency(pkg.price)}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Destination</span>
                  <span className="font-semibold">{pkg.destination}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{pkg.duration} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold capitalize">{pkg.difficulty}</span>
                </div>
              </div>

              <Link
                to="/booking"
                state={{ packageId: pkg.id }}
                className="w-full block text-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition mb-3"
              >
                Book Now
              </Link>

              <button
                onClick={() => navigate('/packages')}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
              >
                Back to Packages
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
