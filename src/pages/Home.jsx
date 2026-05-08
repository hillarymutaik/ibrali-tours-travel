import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'

export default function Home() {
  const featuredPackages = [
    {
      id: 1,
      title: 'Safari Adventure',
      destination: 'Masai Mara',
      duration: 5,
      price: 2500,
      image: 'https://images.unsplash.com/photo-1525253086316-d5eb3d51a046?w=500&h=300&fit=crop',
      rating: 4.8,
      reviews: 45
    },
    {
      id: 2,
      title: 'Beach Paradise',
      destination: 'Mombasa',
      duration: 7,
      price: 1800,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 62
    },
    {
      id: 3,
      title: 'Mountain Trek',
      destination: 'Mount Kenya',
      duration: 4,
      price: 1500,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      rating: 4.7,
      reviews: 38
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Featured Packages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Packages
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most popular travel destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/packages"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All Packages
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Ibrali Tours?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Explore World
              </h3>
              <p className="text-gray-600">
                Discover breathtaking destinations across Africa and beyond with expert guides.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Professional Service
              </h3>
              <p className="text-gray-600">
                Experienced team ensuring smooth and memorable travel experiences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Competitive pricing with flexible payment options for all budgets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
