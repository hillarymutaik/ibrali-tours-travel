import { useState, useEffect, useCallback } from 'react'
import { API_URL } from '../utils/constants'
import { generateBookingId } from '../utils/helpers'
import authService from '../services/authService'

/**
 * Bookings backed by the PHP/MySQL API (backend/api on XAMPP).
 * Falls back to localStorage when the API is unreachable, so the
 * static demo deployment keeps working without a backend.
 */

// Mock-mode tokens come from the offline fallback in authService
const hasRealToken = () => {
  const t = authService.getToken()
  return !!t && !t.startsWith('mock_token_')
}

const loadLocal = () => JSON.parse(localStorage.getItem('bookings')) || []

async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (hasRealToken()) headers['Authorization'] = `Bearer ${authService.getToken()}`
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) {
    const err = new Error(json.error || `Request failed (${res.status})`)
    err.isApiError = true
    throw err
  }
  return json.data
}

export function useBooking() {
  const [bookings, setBookings] = useState(loadLocal)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load the signed-in user's bookings from the API
  const refresh = useCallback(async () => {
    if (!hasRealToken()) return
    try {
      setBookings(await apiRequest('/bookings.php'))
    } catch {
      // API down — keep whatever localStorage had
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const saveLocal = (updated) => {
    setBookings(updated)
    localStorage.setItem('bookings', JSON.stringify(updated))
  }

  const createBooking = async (bookingData) => {
    setLoading(true)
    setError(null)
    try {
      try {
        const created = await apiRequest('/bookings.php', {
          method: 'POST',
          body: {
            packageId: bookingData.packageId,
            fullName: bookingData.fullName,
            email: bookingData.email,
            phone: bookingData.phone,
            travelers: bookingData.travelers,
            startDate: bookingData.startDate,
            specialRequests: bookingData.specialRequests,
          },
        })
        setBookings(prev => [created, ...prev.filter(b => b.id !== created.id)])
        return created
      } catch (err) {
        if (err.isApiError) throw err
        // API unreachable → store locally (demo mode)
        const newBooking = {
          id: generateBookingId(),
          ...bookingData,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
        saveLocal([...bookings, newBooking])
        return newBooking
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId) => {
    setLoading(true)
    setError(null)
    try {
      try {
        await apiRequest('/bookings.php?action=cancel', { method: 'POST', body: { id: bookingId } })
        await refresh()
      } catch (err) {
        if (err.isApiError) throw err
        saveLocal(bookings.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)))
      }
      return bookings.find(b => b.id === bookingId)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getBookingById = (bookingId) => bookings.find(b => b.id === bookingId)
  const getUserBookings = (userId) => bookings.filter(b => b.userId === userId)

  return {
    bookings,
    loading,
    error,
    refresh,
    createBooking,
    cancelBooking,
    getBookingById,
    getUserBookings,
  }
}

export default useBooking
