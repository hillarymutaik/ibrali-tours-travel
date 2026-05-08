import { API_BASE_URL } from '../utils/constants'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Generic request handler
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      }

      // Add auth token if exists
      const token = localStorage.getItem('authToken')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  // GET request
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  // POST request
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT request
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // DELETE request
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export default new ApiService()
