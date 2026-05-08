import React from 'react'
import { Link } from 'react-router-dom'
import { TOUR_PACKAGES } from '../utils/constants'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'

export default function Home() {
  const featuredPackages = TOUR_PACKAGES.sort((a, b) => b.rating - a.rating).slice(0, 3)

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
            Discover our most popular and highly-rated travel destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>

        <div className="text-center">
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
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Explore the World
              </h3>
              <p className="text-gray-600">
                Discover breathtaking destinations across Africa and beyond with our curated collection of premium tour packages designed for unforgettable experiences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">👨‍💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Professional Service
              </h3>
              <p className="text-gray-600">
                Our experienced team of travel experts and local guides ensure smooth, safe, and memorable travel experiences from start to finish.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Competitive pricing with flexible payment options and special discounts for groups. We believe great adventures should be accessible to everyone.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                Your safety is our priority. All our guides are certified, vehicles are regularly maintained, and we follow strict safety protocols.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Highly Rated
              </h3>
              <p className="text-gray-600">
                With thousands of satisfied customers and excellent reviews, Ibrali Tours is your trusted choice for adventure travel.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Our customer support team is available round the clock to assist you with bookings, questions, or any concerns during your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Popular Destinations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Masai Mara', count: '12 packages' },
            { name: 'Mombasa', count: '8 packages' },
            { name: 'Mount Kenya', count: '6 packages' },
            { name: 'Nairobi', count: '5 packages' },
            { name: 'Lake Nakuru', count: '4 packages' },
            { name: 'Samburu', count: '3 packages' },
            { name: 'Maasai Village', count: '4 packages' },
            { name: 'Multi-City', count: '5 packages' }
          ].map((dest, idx) => (
            <Link
              key={idx}
              to="/packages"
              className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105"
            >
              <p className="font-bold text-lg mb-1">{dest.name}</p>
              <p className="text-blue-100 text-sm">{dest.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our collection of amazing tour packages and book your dream vacation today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/packages"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Explore All Packages
            </Link>
            <Link
              to="/profile"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
