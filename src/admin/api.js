import { API_URL } from '../utils/constants'

/**
 * Admin API client. The admin session (adminToken/adminUser) is kept
 * separate from the customer session used on the public website.
 * Every admin action is re-checked server-side against the admin role.
 */

const TOKEN_KEY = 'adminToken'
const USER_KEY = 'adminUser'

export const session = {
  token: () => localStorage.getItem(TOKEN_KEY),
  user: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  },
  save: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

/** 401/403 mean the admin session is gone or no longer has admin rights. */
export const isAuthError = (err) => err instanceof ApiError && (err.status === 401 || err.status === 403)

async function request(path, { method = 'GET', body, token = session.token() } = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Check that XAMPP (Apache and MySQL) is running.', 0)
  }
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) {
    throw new ApiError(json.error || `Request failed (${res.status})`, res.status)
  }
  return json.data
}

export const adminGet = (action) => request(`/admin.php?action=${action}`)
export const adminPost = (action, body) => request(`/admin.php?action=${action}`, { method: 'POST', body })

export async function signIn(email, password) {
  const data = await request('/auth.php?action=login', { method: 'POST', body: { email, password }, token: null })
  if (data.user.role !== 'admin') {
    // Don't leave a live token behind for an account that can't use the console
    await request('/auth.php?action=logout', { method: 'POST', token: data.token }).catch(() => {})
    throw new ApiError('This account does not have admin access.', 403)
  }
  session.save(data.token, data.user)
  return data.user
}

export async function signOut() {
  await request('/auth.php?action=logout', { method: 'POST' }).catch(() => {})
  session.clear()
}

// Note: a wrong current password comes back as HTTP 401 — callers show it
// inline rather than treating it as an expired session.
export const changePassword = (currentPassword, newPassword) =>
  request('/auth.php?action=change-password', { method: 'POST', body: { currentPassword, newPassword } })

export async function updateProfile(name, phone) {
  const data = await request('/auth.php?action=update-profile', { method: 'POST', body: { name, phone } })
  session.save(session.token(), data.user)
  return data.user
}

export const signOutOtherDevices = () => request('/auth.php?action=logout-others', { method: 'POST' })

export const API_BASE = API_URL
