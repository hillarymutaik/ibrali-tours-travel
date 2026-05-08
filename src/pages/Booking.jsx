import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBooking } from '../hooks/useBooking'
import { TOUR_PACKAGES } from '../utils/constants'
import { formatCurrency, isValidEmail, isValidPhone, generateBookingId } from '../utils/helpers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Booking() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { createBooking } = useBooking()

  const [selectedPackageId, setSelectedPackageId] = useState(location.state?.packageId || '')
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    travelers: 1,
    startDate: '',
    specialRequests: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedPackage = TOUR_PACKAGES.find(pkg => pkg.id === parseInt(selectedPackageId))
  const totalPrice = selectedPackage ? selectedPackage.price * formData.travelers : 0

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'travelers' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!selectedPackageId) {
        setError('Please select a package')
        setLoading(false)
        return
      }

      if (!formData.fullName || !formData.email || !formData.phone || !formData.startDate) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (!isValidEmail(formData.email)) {
        setError('Invalid email format')
        setLoading(false)
        return
      }

      if (!isValidPhone(formData.phone)) {
        setError('Invalid phone format')
        setLoading(false)
        return
      }

      // Create booking
      const bookingData = {
        id: generateBookingId(),
        userId: user?.id || null,
        packageId: selectedPackageId,
        packageTitle: selectedPackage.title,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        travelers: formData.travelers,
        startDate: formData.startDate,
        specialRequests: formData.specialRequests,
        totalPrice: totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      if (user) {
        createBooking(bookingData)
      } else {
        // Store in localStorage for non-logged-in users
        const bookings = JSON.parse(localStorage.getItem('bookings')) || []
        bookings.push(bookingData)
        localStorage.setItem('bookings', JSON.stringify(bookings))
      }

      setSubmitted(true)
      setFormData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        travelers: 1,
        startDate: '',
        specialRequests: ''
      })
      setSelectedPackageId('')

      setTimeout(() => {
        setSubmitted(false)
        navigate('/my-bookings')
      }, 3000)
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Book Your Adventure</h1>
          <p className="text-blue-100">Reserve your spot on an unforgettable journey</p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {!user && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                💡 <strong>Tip:</strong> Create an account to save your bookings and manage them easily.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg">
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">
                  ✓ Booking submitted successfully! Redirecting...
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">❌ {error}</p>
              </div>
            )}

            {/* Package Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Package *
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Choose a package...</option>
                {TOUR_PACKAGES.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} ({pkg.destination}) - {formatCurrency(pkg.price)}/person
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 712 345 678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Travelers & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Travelers *
                </label>
                <select
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Traveler' : 'Travelers'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPackage && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Price
                  </label>
                  <div className="px-4 py-2 bg-blue-50 border-2 border-blue-600 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrice)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Special Requests */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any dietary requirements, accessibility needs, or preferences?"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedPackageId || loading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Booking'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">What Happens Next?</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Review your booking details</li>
              <li>✓ Receive confirmation email within 24 hours</li>
              <li>✓ Complete payment to secure your spot</li>
              <li>✓ Receive pre-trip information</li>
              <li>✓ Enjoy your adventure!</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
