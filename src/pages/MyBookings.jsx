import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBooking } from '../hooks/useBooking'
import { formatCurrency, formatDate } from '../utils/helpers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MyBookings() {
  const { user } = useAuth()
  const { bookings } = useBooking()
  const [userBookings, setUserBookings] = useState([])

  useEffect(() => {
    if (user) {
      const filtered = bookings.filter(b => b.userId === user.id)
      setUserBookings(filtered)
    }
  }, [user, bookings])

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your bookings.</p>
          <Link to="/profile" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

        {userBookings.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <Link to="/packages" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.packageTitle}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Booking ID: <span className="font-mono font-semibold">{booking.id}</span></p>
                      <p>Date: {formatDate(booking.createdAt)}</p>
                      <p>Travelers: {booking.travelers}</p>
                      <p>Total: {formatCurrency(booking.totalPrice)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                    <button className="text-blue-600 hover:underline text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
