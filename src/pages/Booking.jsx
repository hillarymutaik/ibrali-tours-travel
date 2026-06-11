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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMTIgMGMxLjY1NyAwIDMtMS4zNDMgMy0zcy0xLjM0My0zLTMtMy0zIDEuMzQzLTMgMyAxLjM0MyAzIDMgM3oiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-7xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            ✈️ Book Your Adventure
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Reserve your spot on an unforgettable journey. Every detail crafted for you.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="max-w-3xl mx-auto">
          {/* Tip for non-logged-in users */}
          {!user && (
            <div className="mb-8 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl shadow-sm flex items-start gap-3 animate-fadeIn">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-semibold text-amber-800">Pro tip</p>
                <p className="text-amber-700">Create an account to save your bookings, track status, and manage everything easily.</p>
              </div>
            </div>
          )}

          {/* Booking Form Card */}
          <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-100 transition-all duration-300 hover:shadow-3xl">
            {/* Success message */}
            {submitted && (
              <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 animate-fadeIn">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="text-emerald-800 font-bold text-lg">Booking submitted successfully!</p>
                  <p className="text-emerald-600">Redirecting you to your bookings…</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-4 animate-fadeIn">
                <span className="text-3xl">❌</span>
                <div>
                  <p className="text-rose-800 font-bold text-lg">Oops, something went wrong</p>
                  <p className="text-rose-600">{error}</p>
                </div>
              </div>
            )}

            {/* Package Selection */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <span className="text-blue-600">🏝️</span> Select Package <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium shadow-sm hover:border-blue-300"
                >
                  <option value="">Choose a package...</option>
                  {TOUR_PACKAGES.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} ({pkg.destination}) - {formatCurrency(pkg.price)}/person
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-blue-600">👤</span> Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 shadow-sm hover:border-blue-300"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-blue-600">📧</span> Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 shadow-sm hover:border-blue-300"
                />
              </div>
            </div>

            {/* Contact & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-blue-600">📱</span> Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 712 345 678"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 shadow-sm hover:border-blue-300"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-blue-600">📅</span> Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 shadow-sm hover:border-blue-300"
                />
              </div>
            </div>

            {/* Travelers & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-blue-600">👥</span> Travelers <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium shadow-sm hover:border-blue-300"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {selectedPackage && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <span className="text-blue-600">💰</span> Total Price
                  </label>
                  <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-inner">
                    <p className="text-3xl font-extrabold text-blue-700">{formatCurrency(totalPrice)}</p>
                    <p className="text-sm text-blue-600 mt-1">All taxes included</p>
                  </div>
                </div>
              )}
            </div>

            {/* Special Requests */}
            <div className="mb-10">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <span className="text-blue-600">✍️</span> Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any dietary requirements, accessibility needs, or preferences?"
                rows="4"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 shadow-sm hover:border-blue-300 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedPackageId || loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Complete Booking ✨'
              )}
            </button>
          </form>

          {/* What Happens Next? */}
          <div className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🧳</span> What Happens Next?
            </h3>
            <div className="space-y-4">
              {[
                { icon: '📋', text: 'Review your booking details' },
                { icon: '📧', text: 'Receive confirmation email within 24 hours' },
                { icon: '💳', text: 'Complete payment to secure your spot' },
                { icon: '📦', text: 'Receive pre-trip information package' },
                { icon: '🌍', text: 'Enjoy your adventure!' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-gray-700 font-medium">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}