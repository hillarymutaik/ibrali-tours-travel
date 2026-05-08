// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Calculate days between dates
export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
}

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone
export const isValidPhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  return re.test(phone)
}

// Generate booking ID
export const generateBookingId = () => {
  return 'BK' + Date.now().toString().slice(-8)
}

// Truncate text
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

// Format rating
export const formatRating = (rating) => {
  return Number(rating).toFixed(1)
}

// Get star array for rating display
export const getStarArray = (rating) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('full')
    } else if (i === fullStars && hasHalfStar) {
      stars.push('half')
    } else {
      stars.push('empty')
    }
  }
  return stars
}

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'hard':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    safari: 'bg-amber-100 text-amber-800',
    beach: 'bg-blue-100 text-blue-800',
    trekking: 'bg-green-100 text-green-800',
    city: 'bg-purple-100 text-purple-800',
    wildlife: 'bg-orange-100 text-orange-800',
    cultural: 'bg-pink-100 text-pink-800',
    adventure: 'bg-red-100 text-red-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}
