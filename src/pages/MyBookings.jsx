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
      setUserBookings(bookings.filter(b => b.userId === user.id))
    }
  }, [user, bookings])

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Sign in required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to view your bookings and manage trips.
          </p>
          <Link
            to="/profile"
            className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
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

      {/* HEADER */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            My Trips
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your bookings and upcoming adventures
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {userBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="text-5xl mb-4">✈️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No bookings yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start exploring amazing destinations and book your first trip.
            </p>
            <Link
              to="/packages"
              className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Explore Packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {userBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition p-6"
              >

                {/* TOP SECTION */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {booking.packageTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking ID: <span className="font-mono">{booking.id}</span>
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-5">
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="font-medium">{formatDate(booking.createdAt)}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Travelers</p>
                    <p className="font-medium">{booking.travelers}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-gray-400">Total Paid</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>

                  <button className="text-gray-500 hover:text-gray-700 text-sm">
                    Download Receipt
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}