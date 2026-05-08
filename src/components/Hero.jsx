import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}></div>
      
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
        <p className="text-xl mb-8 text-blue-100">
          Experience unforgettable journeys across Africa with Ibrali Tours
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/packages"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Explore Packages
          </Link>
          <Link
            to="/booking"
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </section>
  )
}
