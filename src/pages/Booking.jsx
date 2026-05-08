import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Booking() {
  const [formData, setFormData] = useState({
    packageId: '',
    fullName: '',
    email: '',
    phone: '',
    travelers: 1,
    startDate: '',
    specialRequests: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const packages = [
    { id: 1, title: 'Safari Adventure - Masai Mara', price: 2500 },
    { id: 2, title: 'Beach Paradise - Mombasa', price: 1800 },
    { id: 3, title: 'Mountain Trek - Mount Kenya', price: 1500 },
    { id: 4, title: 'City Tour - Nairobi', price: 800 },
    { id: 5, title: 'Lake Nakuru', price: 600 },
    { id: 6, title: 'Luxury Safari - Samburu', price: 3500 }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Booking submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        packageId: '',
        fullName: '',
        email: '',
        phone: '',
        travelers: 1,
        startDate: '',
        specialRequests: ''
      })
      setSubmitted(false)
    }, 3000)
  }

  const selectedPackage = packages.find(pkg => pkg.id === parseInt(formData.packageId))
  const totalPrice = selectedPackage ? selectedPackage.price * formData.travelers : 0

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Book Your Trip</h1>
          <p className="text-blue-100">Secure your spot on an amazing adventure</p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg">
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  ✓ Your booking request has been submitted! We'll contact you shortly.
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Package *
              </label>
              <select
                name="packageId"
                value={formData.packageId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Choose a package...</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} - ${pkg.price} per person
                  </option>
                ))}
              </select>
            </div>

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
                  required
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
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

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
                  required
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

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
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                  ))}
                </select>
              </div>

              {selectedPackage && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Price
                  </label>
                  <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">${totalPrice}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any special requests or dietary requirements?"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={!formData.packageId}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Booking
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Fill in your details and select a package</li>
              <li>✓ Review the total price</li>
              <li>✓ Submit your booking request</li>
              <li>✓ Receive confirmation email within 24 hours</li>
              <li>✓ Complete payment to secure your spot</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
