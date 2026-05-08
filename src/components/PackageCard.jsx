import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, getCategoryColor } from '../utils/helpers'

export default function PackageCard({ package: pkg }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105 flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {formatCurrency(pkg.price)}
        </div>
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(pkg.category)}`}>
          {pkg.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>

        {/* Destination and Duration */}
        <div className="space-y-2 mb-4 text-sm text-gray-600 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span>{pkg.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🕐</span>
            <span>{pkg.duration} Days</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👥</span>
            <span>Max {pkg.maxTravelers} travelers</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(pkg.rating) ? '⭐' : '☆'}>
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {pkg.rating} ({pkg.reviews} reviews)
          </span>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {pkg.description}
        </p>

        {/* Buttons */}
        <div className="space-y-2">
          <Link
            to={`/packages/${pkg.id}`}
            className="w-full block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </Link>
          <Link
            to="/booking"
            state={{ packageId: pkg.id }}
            className="w-full block text-center px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
