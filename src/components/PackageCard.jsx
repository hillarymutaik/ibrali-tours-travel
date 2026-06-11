import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, getCategoryColor } from '../utils/helpers'

export default function PackageCard({ package: pkg }) {

  const ratingStars = Array.from({ length: 5 })

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2">

      {/* IMAGE SECTION */}
      <div className="relative h-52 overflow-hidden">

        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* PRICE BADGE */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-blue-700 px-3 py-1 rounded-full text-sm font-bold shadow">
          {formatCurrency(pkg.price)}
        </div>

        {/* CATEGORY BADGE */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow ${getCategoryColor(pkg.category)}`}>
          {pkg.category}
        </div>

        {/* TITLE ON IMAGE (PREMIUM FEEL) */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white text-lg font-bold drop-shadow">
            {pkg.title}
          </h3>
          <p className="text-white/80 text-sm">
            {pkg.destination}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-4">

        {/* INFO GRID */}
        <div className="flex justify-between text-sm text-gray-600">

          <div className="flex items-center gap-1">
            📍 <span>{pkg.destination}</span>
          </div>

          <div className="flex items-center gap-1">
            🕐 <span>{pkg.duration}d</span>
          </div>

          <div className="flex items-center gap-1">
            👥 <span>{pkg.maxTravelers}</span>
          </div>

        </div>

        {/* RATING */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-1">

            {ratingStars.map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">
                {i < Math.floor(pkg.rating) ? '★' : '☆'}
              </span>
            ))}

            <span className="text-sm text-gray-600 ml-2">
              {pkg.rating}
            </span>
          </div>

          <span className="text-xs text-gray-400">
            ({pkg.reviews} reviews)
          </span>

        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {pkg.description}
        </p>

        {/* CTA BUTTONS */}
        <div className="flex gap-2 pt-2">

          <Link
            to={`/packages/${pkg.id}`}
            className="flex-1 text-center py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-black transition"
          >
            View
          </Link>

          <Link
            to="/booking"
            state={{ packageId: pkg.id }}
            className="flex-1 text-center py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Book
          </Link>

        </div>
      </div>
    </div>
  )
}