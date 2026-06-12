import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBooking } from '../hooks/useBooking'
import { formatCurrency, formatDate } from '../utils/helpers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const serif = { fontFamily: "'Playfair Display', serif" }
const gold = '#C4962A'

const STATUS_STYLE = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-[#F2EDE5] text-[#6B6560] border-[#E3DCCD]',
  pending: 'bg-[#FAF3E4] text-[#B07E1C] border-[#EBD9B0]',
}
const STATUS_DOT = {
  confirmed: 'bg-emerald-400',
  cancelled: 'bg-red-400',
  completed: 'bg-[#9C9890]',
  pending: 'bg-[#C4962A]',
}

function HeroHeader({ children, subtitle }) {
  return (
    <section className="relative pt-28 pb-20 px-6 overflow-hidden" style={{ background: '#0A0703' }}>
      <div className="absolute inset-0 opacity-15 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=60')" }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,7,3,0.5), #0A0703)' }} />
      <div className="relative max-w-7xl mx-auto">{children}</div>
    </section>
  )
}

function Eyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2 mb-5">
      <span className="w-7 h-px" style={{ background: gold }} />
      <span className="text-[11px] font-medium uppercase" style={{ color: '#EDB84A', letterSpacing: '2.5px' }}>{children}</span>
    </div>
  )
}

/* ── NOT SIGNED IN ─────────────────────────────────────────── */
function GuestView() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">
      <Navbar />
      <HeroHeader>
        <Eyebrow>My Trips</Eyebrow>
        <h1 className="text-white leading-[1.0]" style={{ ...serif, fontWeight: 700, fontSize: 'clamp(40px, 7vw, 60px)' }}>Your adventures</h1>
      </HeroHeader>

      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="bg-white rounded-2xl p-12" style={{ border: '0.5px solid #E3DCCD' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B07E1C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <h2 className="text-2xl text-[#1C1A17] mb-2" style={{ ...serif, fontWeight: 700 }}>Sign in to view your trips</h2>
          <p className="text-[#6B6560] text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Log in to track your bookings, manage upcoming trips, and download receipts.
          </p>
          <Link to="/profile" className="btn btn-gold px-8 py-3.5">
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
    <div className="min-h-screen bg-[#F5F0E8] font-sans text-[#1C1A17]">
      <Navbar />

      <HeroHeader>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <Eyebrow>My Trips</Eyebrow>
            <h1 className="text-white leading-[1.0]" style={{ ...serif, fontWeight: 700, fontSize: 'clamp(40px, 7vw, 64px)' }}>
              Your adventures
            </h1>
            <p className="text-white/50 mt-3 text-sm">
              {userBookings.length} booking{userBookings.length !== 1 ? 's' : ''} on record
            </p>
          </div>
          <Link to="/booking" className="btn btn-gold self-start sm:self-auto px-6 py-3">
            + New booking
          </Link>
        </div>
      </HeroHeader>

      <section className="max-w-7xl mx-auto px-6 py-12">

        {userBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center" style={{ border: '0.5px solid #E3DCCD' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B07E1C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 16l7-2 4-9 2 1-1 8 5 2v2l-7-1-3 5-2-1 1-5-6 1z" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#1C1A17] mb-2" style={{ ...serif, fontWeight: 700 }}>No trips yet</h2>
            <p className="text-[#6B6560] text-sm mb-8 max-w-xs mx-auto leading-relaxed">
              Start exploring Kenya's most extraordinary landscapes and book your first safari.
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
                    ? 'bg-[#0A0703] text-white border-[#0A0703]'
                    : 'bg-white text-[#6B6560] border-[#E3DCCD] hover:border-[#0A0703]'
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
                          <p className="text-lg" style={{ ...serif, fontWeight: 700, color: '#B07E1C' }}>{formatCurrency(booking.totalPrice)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#F0EDE8]">
                        <button className="text-[#1C1A17] text-xs font-medium hover:text-[#B07E1C] transition-colors">
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