import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isValidEmail, isValidPhone } from '../utils/helpers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Profile() {
  const navigate = useNavigate()
  const { user, login, register, logout } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'password123',
    name: '',
    phone: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError('Email and password are required')
          return
        }
        if (!isValidEmail(formData.email)) {
          setError('Invalid email format')
          return
        }
        await login(formData.email, formData.password)
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
          setError('All fields are required')
          return
        }
        if (!isValidEmail(formData.email)) {
          setError('Invalid email format')
          return
        }
        if (!isValidPhone(formData.phone)) {
          setError('Invalid phone format')
          return
        }
        await register(formData)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-xl font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-xl font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-xl font-semibold">{user.phone}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/my-bookings')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View My Bookings
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {isLogin ? 'Login' : 'Create Account'}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+254712345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>

          {isLogin && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
              <p className="text-sm text-blue-700">Email: demo@example.com</p>
              <p className="text-sm text-blue-700">Password: password123</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
