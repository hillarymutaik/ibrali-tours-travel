import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/helpers'

const CATEGORY_STYLES = {
  safari: 'bg-[#C4962A] text-[#0A0703]',
  beach: 'bg-[#2E7D7A] text-white',
  trekking: 'bg-[#5C6B3C] text-white',
  city: 'bg-[#7A6A55] text-white',
  wildlife: 'bg-[#B5651D] text-white',
  cultural: 'bg-[#A8451F] text-white',
  adventure: 'bg-[#8A5A1A] text-white',
}

const DIFFICULTY_STYLES = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-[#FAF3E4] text-[#B07E1C] border-[#EBD9B0]',
  Hard: 'bg-red-50 text-red-700 border-red-200',
}

export default function PackageCard({ package: pkg }) {
  const catStyle = CATEGORY_STYLES[pkg.category?.toLowerCase()] ?? 'bg-[#1C1A17] text-white'
  const diffStyle = DIFFICULTY_STYLES[pkg.difficulty] ?? 'bg-gray-50 text-gray-700 border-gray-200'

  return (
    <article className="group relative card-surface overflow-hidden duration-500">

      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,7,3,0.78) 0%, rgba(10,7,3,0.1) 55%, transparent 100%)' }}
        />

        {/* Top badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${catStyle}`}>
            {pkg.category}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
            style={{ background: 'rgba(10,7,3,0.7)', color: '#EDB84A' }}
          >
            {formatCurrency(pkg.price)}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3.5 left-4 right-4">
          <h3
            className="text-white text-lg leading-snug"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            {pkg.title}
          </h3>
          <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {pkg.destination}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 flex flex-col gap-3.5">

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-[#7A7268]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {pkg.duration}d
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {pkg.maxTravelers}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${diffStyle}`}>
            {pkg.difficulty}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className="w-3.5 h-3.5"
              style={{ color: i < Math.floor(pkg.rating) ? '#EDB84A' : '#E3DCCD' }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs font-medium text-[#1C1A17] ml-1">{pkg.rating}</span>
          <span className="text-[11px] text-[#9C9890]">({pkg.reviews})</span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#7A7268] line-clamp-2 leading-relaxed">
          {pkg.description}
        </p>

        {/* CTA */}
        <div className="flex gap-2 pt-1">
          <Link
            to={`/packages/${pkg.id}`}
            className="btn btn-dark flex-1 py-2.5 !rounded-xl text-xs"
          >
            View Details
          </Link>
          <Link
            to="/booking"
            state={{ packageId: pkg.id }}
            className="btn btn-gold flex-1 py-2.5 !rounded-xl text-xs"
          >
            Book Now
          </Link>
        </div>

      </div>
    </article>
  )
}