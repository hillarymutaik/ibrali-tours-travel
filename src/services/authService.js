import { TOUR_PACKAGES } from '../utils/constants'

// Mock authentication service - replace with real API calls
class AuthService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('users')) || [
      {
        id: 1,
        email: 'demo@example.com',
        password: 'password123',
        name: 'Demo User',
        phone: '+254712345678'
      }
    ]
  }

  // Register user
  async register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = this.users.find(u => u.email === userData.email)
        if (existingUser) {
          reject(new Error('User already exists'))
          return
        }

        const newUser = {
          id: this.users.length + 1,
          ...userData,
          createdAt: new Date()
        }

        this.users.push(newUser)
        localStorage.setItem('users', JSON.stringify(this.users))

        const { password, ...userWithoutPassword } = newUser
        resolve({
          user: userWithoutPassword,
          token: 'mock_jwt_token_' + Date.now()
        })
      }, 1000)
    })
  }

  // Login user
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.email === email && u.password === password)
        if (!user) {
          reject(new Error('Invalid email or password'))
          return
        }

        const { password: _, ...userWithoutPassword } = user
        const token = 'mock_jwt_token_' + Date.now()
        localStorage.setItem('authToken', token)
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))

        resolve({
          user: userWithoutPassword,
          token
        })
      }, 1000)
    })
  }

  // Logout user
  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
        resolve()
      }, 500)
    })
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  }

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken')
  }
}

export default new AuthService()
