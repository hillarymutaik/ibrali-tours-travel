import React from 'react'
import { Link } from 'react-router-dom'
import { TOUR_PACKAGES } from '../utils/constants'
import Navbar from '../components/Navbar'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

/* ── Inline line-icon set (replaces emoji) ─────────────── */
function Icon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  const paths = {
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polygon points="16 8 10.5 10.5 8 16 13.5 13.5 16 8" />
      </>
    ),
    guide: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </>
    ),
    gem: (
      <>
        <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
        <line x1="2" y1="9" x2="22" y2="9" />
        <line x1="12" y1="22" x2="9" y2="9" />
        <line x1="12" y1="22" x2="15" y2="9" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    star: (
      <polygon points="12 2 15.1 8.6 22 9.3 17 14 18.2 21 12 17.5 5.8 21 7 14 2 9.3 8.9 8.6 12 2" />
    ),
    support: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="2" y="13" width="4" height="6" rx="1.5" />
        <rect x="18" y="13" width="4" height="6" rx="1.5" />
        <path d="M20 18v1a3 3 0 0 1-3 3h-3" />
      </>
    ),
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function Home() {
  const featuredPackages = [...TOUR_PACKAGES]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  const destinations = [
    { name: 'Masai Mara', tag: 'Wildlife Safari' },
    { name: 'Mombasa', tag: 'Coastal Escape' },
    { name: 'Mount Kenya', tag: 'Alpine Trek' },
    { name: 'Nairobi', tag: 'City Experience' },
    { name: 'Lake Nakuru', tag: 'Flamingo Haven' },
    { name: 'Samburu', tag: 'Remote Adventure' },
    { name: 'Maasai Village', tag: 'Cultural Immersion' },
    { name: 'Multi-City', tag: 'Grand Tour' },
  ]

  const features = [
    { icon: 'compass', title: 'Immersive journeys', desc: 'Curated storytelling tours that place you inside the destination, not outside looking in.' },
    { icon: 'guide', title: 'Expert local guides', desc: 'Vetted local professionals who know the land, the culture, and the hidden paths.' },
    { icon: 'gem', title: 'Premium value', desc: 'Luxury experiences at transparent, competitive pricing — no hidden costs.' },
    { icon: 'shield', title: 'Trusted safety', desc: 'Strict safety protocols so you focus on the adventure, not the risk.' },
    { icon: 'star', title: '5-star rated', desc: 'Loved by thousands of global travellers with consistently outstanding reviews.' },
    { icon: 'support', title: 'Always-on support', desc: 'Responsive assistance around the clock, wherever your journey takes you.' },
  ]

  const serif = { fontFamily: "'Playfair Display', serif" }

  /* Reusable section eyebrow */
  const Eyebrow = ({ children, light }) => (
    <div className={`eyebrow mb-4 ${light ? 'eyebrow-light' : ''}`}>{children}</div>
  )

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F5F0E8] text-[#1C1A17] overflow-x-hidden font-sans">

        <Navbar />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1800&q=80')" }}
          />

          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,7,3,0.92) 0%, rgba(10,7,3,0.35) 45%, rgba(10,7,3,0.15) 100%)' }}
          />

          {/* Floating status badge */}
          <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 text-white/90 text-xs px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Booking open · 2025 season
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 md:pb-28 w-full">

            <div className="eyebrow eyebrow-light mb-5">Kenya's Premier Safari Company</div>

            <h1
              className="text-white leading-[0.98] max-w-4xl"
              style={{ ...serif, fontWeight: 700, fontSize: 'clamp(44px, 8vw, 92px)' }}
            >
              Where the<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#EDB84A' }}>wild</span> begins.
            </h1>

            <p className="text-white/70 text-lg mt-6 max-w-lg leading-relaxed">
              Handcrafted safaris and cultural journeys across Kenya's most extraordinary landscapes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link to="/packages" className="btn btn-gold px-8 py-4">
                View all packages <span className="text-base">→</span>
              </Link>
              <Link to="/booking" className="btn btn-ghost px-8 py-4">
                Book a safari
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-10 mt-16 pt-8 border-t border-white/15">
              {[
                { value: '500+', label: 'Safaris completed' },
                { value: '98%', label: 'Guest satisfaction' },
                { value: '12+', label: 'Years in Kenya' },
                { value: '40+', label: 'Destinations' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-white" style={{ ...serif, fontWeight: 700, fontSize: '34px', color: '#EDB84A' }}>{s.value}</p>
                  <p className="text-white/50 text-xs mt-1 tracking-wide uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARQUEE STRIP ────────────────────────────────── */}
        <div className="py-3.5 overflow-hidden border-y" style={{ background: '#0A0703', borderColor: 'rgba(196,150,42,0.2)' }}>
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {Array(6).fill(['Masai Mara', 'Amboseli', 'Lake Nakuru', 'Samburu', 'Mombasa', 'Mount Kenya', 'Tsavo']).flat().map((d, i) => (
              <span key={i} className="text-sm tracking-widest uppercase flex items-center gap-4" style={{ color: '#C9B99A' }}>
                {d} <span style={{ color: 'rgba(196,150,42,0.5)' }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── FEATURED PACKAGES ────────────────────────────── */}
        <section className="py-24 px-6 max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
            <div>
              <Eyebrow>Handpicked for you</Eyebrow>
              <h2 style={{ ...serif, fontWeight: 700, fontSize: 'clamp(34px, 5vw, 52px)', lineHeight: 1.05 }}>
                Featured <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#B07E1C' }}>adventures</span>
              </h2>
            </div>
            <Link
              to="/packages"
              className="self-start md:self-auto inline-flex items-center gap-2 text-sm font-medium pb-1 transition-colors"
              style={{ color: '#1C1A17', borderBottom: '1.5px solid #C4962A' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#B07E1C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#1C1A17')}
            >
              See all packages →
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg) => (
              <div key={pkg.id} className="group hover:-translate-y-2 transition-transform duration-500">
                <PackageCard package={pkg} />
              </div>
            ))}
          </div>
        </section>

        {/* ── DESTINATIONS GRID ────────────────────────────── */}
        <section className="py-24" style={{ background: '#0A0703' }}>
          <div className="max-w-7xl mx-auto px-6">

            <div className="mb-16">
              <Eyebrow light>Explore Kenya</Eyebrow>
              <h2 className="text-white" style={{ ...serif, fontWeight: 700, fontSize: 'clamp(34px, 5vw, 52px)', lineHeight: 1.05 }}>
                Top destinations
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.map((dest, i) => (
                <Link
                  key={i}
                  to="/packages"
                  className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{ border: '0.5px solid rgba(196,150,42,0.18)', background: 'rgba(255,255,255,0.03)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(196,150,42,0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                >
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: '#C4962A' }} />
                  <p className="font-medium text-white text-base leading-snug">{dest.name}</p>
                  <p className="text-white/40 text-xs mt-1.5 tracking-wide">{dest.tag}</p>
                  <span className="absolute top-4 right-4 text-white/20 group-hover:text-amber-400 transition text-lg">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ───────────────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">

            <div className="mb-16 text-center">
              <div className="flex justify-center">
                <Eyebrow>Our promise</Eyebrow>
              </div>
              <h2 style={{ ...serif, fontWeight: 700, fontSize: 'clamp(34px, 5vw, 52px)', lineHeight: 1.1 }}>
                Why travellers <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#B07E1C' }}>choose us</span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl bg-white transition-all duration-500 hover:-translate-y-1"
                  style={{ border: '0.5px solid #E3DCCD' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C4962A')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E3DCCD')}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0', color: '#B07E1C' }}
                  >
                    <Icon name={f.icon} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{f.title}</h3>
                  <p className="text-[#7A7268] text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IMMERSIVE SPLIT CTA ──────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="grid lg:grid-cols-2">

            <div
              className="min-h-[50vh] lg:min-h-[600px] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547970827-f33b90fde688?w=900&q=80')" }}
            />

            <div className="flex flex-col justify-center px-10 py-16 lg:px-16" style={{ background: '#0A0703' }}>
              <Eyebrow light>Ready to go?</Eyebrow>
              <h2 className="text-white mb-6" style={{ ...serif, fontWeight: 700, fontSize: 'clamp(34px, 5vw, 52px)', lineHeight: 1.1 }}>
                Your next<br />
                adventure<br />
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#EDB84A' }}>starts here.</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-10 max-w-sm">
                Discover Kenya's untamed beauty with a company built on passion, expertise, and a deep respect for the land.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/packages" className="btn btn-gold px-8 py-4">
                  Browse packages →
                </Link>
                <Link to="/profile" className="btn btn-ghost px-8 py-4">
                  Create account
                </Link>
              </div>
            </div>

          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  )
}