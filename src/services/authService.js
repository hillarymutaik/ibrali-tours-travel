import { API_URL } from '../utils/constants'

/**
 * Auth service backed by the PHP/MySQL API (backend/api on XAMPP).
 * When the API is unreachable (e.g. the static GitHub Pages demo),
 * it falls back to the original localStorage mock so the site still works.
 */

async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = localStorage.getItem('authToken')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) {
    const err = new Error(json.error || `Request failed (${res.status})`)
    err.isApiError = true // reached the server; don't fall back to the mock
    throw err
  }
  return json.data
}

/* ── localStorage mock (offline/demo fallback) ─────────────────────── */
const mock = {
  loadUsers() {
    return (
      JSON.parse(localStorage.getItem('users')) || [
        { id: 1, email: 'demo@example.com', password: 'password123', name: 'Demo User', phone: '+254786000100' },
      ]
    )
  },
  register(userData) {
    const users = this.loadUsers()
    if (users.some(u => u.email === userData.email)) throw new Error('User already exists')
    const newUser = { id: users.length + 1, ...userData, createdAt: new Date().toISOString() }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    const user = { ...newUser }
    delete user.password
    return { user, token: 'mock_token_' + Date.now() }
  },
  login(email, password) {
    const found = this.loadUsers().find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    const user = { ...found }
    delete user.password
    return { user, token: 'mock_token_' + Date.now() }
  },
}

function persistSession({ user, token }) {
  localStorage.setItem('authToken', token)
  localStorage.setItem('currentUser', JSON.stringify(user))
  return { user, token }
}

class AuthService {
  async register(userData) {
    try {
      const data = await apiRequest('/auth.php?action=register', { method: 'POST', body: userData })
      return persistSession(data)
    } catch (err) {
      if (err.isApiError) throw err
      return persistSession(mock.register(userData)) // API unreachable → demo mode
    }
  }

  async login(email, password) {
    try {
      const data = await apiRequest('/auth.php?action=login', { method: 'POST', body: { email, password } })
      return persistSession(data)
    } catch (err) {
      if (err.isApiError) throw err
      return persistSession(mock.login(email, password)) // API unreachable → demo mode
    }
  }

  async logout() {
    try {
      await apiRequest('/auth.php?action=logout', { method: 'POST', auth: true })
    } catch {
      // best-effort — clear the local session regardless
    }
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  }

  getToken() {
    return localStorage.getItem('authToken')
  }
}

export default new AuthService()
