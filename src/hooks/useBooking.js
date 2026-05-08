import { useState } from 'react'
import { generateBookingId } from '../utils/helpers'

export function useBooking() {
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem('bookings')) || []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createBooking = (bookingData) => {
    setLoading(true)
    setError(null)
    try {
      const newBooking = {
        id: generateBookingId(),
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      const updatedBookings = [...bookings, newBooking]
      setBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      return newBooking
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBooking = (bookingId, updates) => {
    setLoading(true)
    setError(null)
    try {
      const updatedBookings = bookings.map(b =>
        b.id === bookingId ? { ...b, ...updates } : b
      )
      setBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      return updatedBookings.find(b => b.id === bookingId)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getBookingById = (bookingId) => {
    return bookings.find(b => b.id === bookingId)
  }

  const getUserBookings = (userId) => {
    return bookings.filter(b => b.userId === userId)
  }

  const cancelBooking = (bookingId) => {
    return updateBooking(bookingId, { status: 'cancelled' })
  }

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    getBookingById,
    getUserBookings,
    cancelBooking
  }
}

export default useBooking
