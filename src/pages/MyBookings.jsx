import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBooking } from '../hooks/useBooking'
import { formatCurrency, formatDate } from '../utils/helpers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import useSeo from '../hooks/useSeo'

const serif = { fontFamily: "'Playfair Display', serif" }

const STATUS_STYLE = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-[#F2EDE5] text-[#6B6560] border-[#E3DCCD]',
  pending: 'bg-[#FFF4ED] text-[#C2470A] border-[#FFD9B3]',
}
const STATUS_DOT = {
  confirmed: 'bg-emerald-400',
  cancelled: 'bg-red-400',
  completed: 'bg-[#9C9890]',
  pending: 'bg-[#E75A08]',
}

/* ── NOT SIGNED IN ─────────────────────────────────────────── */
function GuestView() {
  return (
    <div className="min-h-screen bg-[#FAF7F1] font-sans">
      <Navbar />
      <PageHero image="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=60">
        Your <span className="heading-accent">adventures</span>
      </PageHero>

      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="bg-white rounded-2xl p-12" style={{ border: '0.5px solid #E3DCCD' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C2470A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <h2 className="text-2xl text-[#1C1A17] mb-2" style={{ ...serif, fontWeight: 700 }}>Sign in to view your trips</h2>
          <p className="text-[#6B6560] text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Log in to track your bookings, manage upcoming trips, and download receipts.
          </p>
          <Link to="/profile" state={{ from: '/my-bookings' }} className="btn btn-gold px-8 py-3.5">
            Sign in →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

/* ── MAIN COMPONENT ────────────────────────────────────────── */
export default function MyBookings() {
  useSeo({ title: 'My Trips', description: 'Track your bookings, manage upcoming trips, and view your travel history with Ibrali Tours & Travel.' })
  const { user } = useAuth()
  const { bookings } = useBooking()
  const [userBookings, setUserBookings] = useState([])
  const [activeStatus, setActiveStatus] = useState('all')

  useEffect(() => {
    if (user) setUserBookings(bookings.filter(b => b.userId === user.id))
  }, [user, bookings])

  if (!user) return <GuestView />

  const statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled']
  const filtered = activeStatus === 'all'
    ? userBookings
    : userBookings.filter(b => b.status === activeStatus)

  return (
    <div className="min-h-screen bg-[#FAF7F1] font-sans text-[#1C1A17]">
      <Navbar />

      <PageHero
        subtitle={`${userBookings.length} booking${userBookings.length !== 1 ? 's' : ''} on record`}
        actions={
          <Link to="/booking" className="btn btn-gold px-6 py-3">
            + New booking
          </Link>
        }
      >
        Your <span className="heading-accent">adventures</span>
      </PageHero>

      <section className="max-w-7xl mx-auto px-6 py-12">

        {userBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center" style={{ border: '0.5px solid #E3DCCD' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C2470A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 16l7-2 4-9 2 1-1 8 5 2v2l-7-1-3 5-2-1 1-5-6 1z" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#1C1A17] mb-2" style={{ ...serif, fontWeight: 700 }}>No trips yet</h2>
            <p className="text-[#6B6560] text-sm mb-8 max-w-xs mx-auto leading-relaxed">
              Start exploring extraordinary destinations across Kenya, DR Congo, Dubai, and beyond — book your first trip.
            </p>
            <Link to="/packages" className="btn btn-dark px-8 py-4">
              Explore packages →
            </Link>
          </div>
        ) : (
          <>
            {/* Status filter tabs */}
            <div className="flex gap-2 flex-wrap mb-8">
              {statuses.map(s => (
                <button key={s} onClick={() => setActiveStatus(s)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border capitalize transition-all duration-200 ${activeStatus === s
                    ? 'bg-[#382C1C] text-white border-[#382C1C]'
                    : 'bg-white text-[#6B6560] border-[#E3DCCD] hover:border-[#382C1C]'
                    }`}
                >
                  {s === 'all' ? `All (${userBookings.length})` : s}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center" style={{ border: '0.5px solid #E3DCCD' }}>
                <p className="text-[#6B6560] text-sm">No bookings with status "{activeStatus}"</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filtered.map((booking) => (
                  <div key={booking.id}
                    className="card-surface overflow-hidden duration-300"
                  >
                    <div className="px-6 py-5 border-b border-[#F0EDE8] flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[#1C1A17] text-base leading-snug" style={{ ...serif, fontWeight: 700 }}>
                          {booking.packageTitle}
                        </h3>
                        <p className="text-[11px] text-[#9C9890] mt-1 font-mono">{booking.id}</p>
                      </div>
                      <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border capitalize ${STATUS_STYLE[booking.status] ?? STATUS_STYLE.pending}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[booking.status] ?? STATUS_DOT.pending}`} />
                        {booking.status}
                      </span>
                    </div>

                    <div className="px-6 py-5">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                        <div>
                          <p className="text-[11px] text-[#9C9890] uppercase tracking-[1.5px] font-medium mb-1">Booked on</p>
                          <p className="font-medium text-[#1C1A17]">{formatDate(booking.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C9890] uppercase tracking-[1.5px] font-medium mb-1">Start date</p>
                          <p className="font-medium text-[#1C1A17]">{booking.startDate || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C9890] uppercase tracking-[1.5px] font-medium mb-1">Travelers</p>
                          <p className="font-medium text-[#1C1A17]">{booking.travelers}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C9890] uppercase tracking-[1.5px] font-medium mb-1">Total paid</p>
                          <p className="text-lg" style={{ ...serif, fontWeight: 700, color: '#C2470A' }}>{formatCurrency(booking.totalPrice)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#F0EDE8]">
                        <button className="text-[#1C1A17] text-xs font-medium hover:text-[#C2470A] transition-colors">
                          View details →
                        </button>
                        <button className="text-[#9C9890] text-xs hover:text-[#1C1A17] transition-colors">
                          Download receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  )
}