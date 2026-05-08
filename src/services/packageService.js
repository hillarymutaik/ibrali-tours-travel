import { TOUR_PACKAGES } from '../utils/constants'

class PackageService {
  constructor() {
    this.packages = TOUR_PACKAGES
  }

  // Get all packages
  getAllPackages() {
    return Promise.resolve(this.packages)
  }

  // Get package by ID
  getPackageById(id) {
    const pkg = this.packages.find(p => p.id === parseInt(id))
    if (!pkg) {
      return Promise.reject(new Error('Package not found'))
    }
    return Promise.resolve(pkg)
  }

  // Get packages by category
  getPackagesByCategory(category) {
    return Promise.resolve(
      this.packages.filter(p => p.category === category)
    )
  }

  // Search packages
  searchPackages(query) {
    const searchTerm = query.toLowerCase()
    return Promise.resolve(
      this.packages.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.destination.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      )
    )
  }

  // Filter packages
  filterPackages(filters) {
    return Promise.resolve(
      this.packages.filter(p => {
        if (filters.category && p.category !== filters.category) return false
        if (filters.minPrice && p.price < filters.minPrice) return false
        if (filters.maxPrice && p.price > filters.maxPrice) return false
        if (filters.duration && p.duration !== filters.duration) return false
        if (filters.difficulty && p.difficulty !== filters.difficulty) return false
        return true
      })
    )
  }

  // Get featured packages
  getFeaturedPackages(limit = 3) {
    return Promise.resolve(
      this.packages
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit)
    )
  }

  // Get categories
  getCategories() {
    const categories = [...new Set(this.packages.map(p => p.category))]
    return Promise.resolve(categories)
  }

  // Get price range
  getPriceRange() {
    const prices = this.packages.map(p => p.price)
    return Promise.resolve({
      min: Math.min(...prices),
      max: Math.max(...prices)
    })
  }
}

export default new PackageService()
