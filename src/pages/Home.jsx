import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { TOUR_PACKAGES, API_URL } from '../utils/constants'
import Navbar from '../components/Navbar'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

function Icon({ name, size = 20 }) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.6,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  const paths = {
    compass: (<><circle cx="12" cy="12" r="9" /><polygon points="16 8 10.5 10.5 8 16 13.5 13.5 16 8" /></>),
    guide:   (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></>),
    gem:     (<><polygon points="6 3 18 3 22 9 12 22 2 9 6 3" /><line x1="2" y1="9" x2="22" y2="9" /><line x1="12" y1="22" x2="9" y2="9" /><line x1="12" y1="22" x2="15" y2="9" /></>),
    shield:  (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>),
    star:    (<polygon points="12 2 15.1 8.6 22 9.3 17 14 18.2 21 12 17.5 5.8 21 7 14 2 9.3 8.9 8.6 12 2" />),
    support: (<><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2" y="13" width="4" height="6" rx="1.5" /><rect x="18" y="13" width="4" height="6" rx="1.5" /><path d="M20 18v1a3 3 0 0 1-3 3h-3" /></>),
    calendar:(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>),
    users:   (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
    map:     (<><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></>),
    check:   (<polyline points="20 6 9 17 4 12" />),
    plane:   (<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.2.6-.6.5-1.1z" />),
    hotel:   (<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M10 21v-3h4v3" /><line x1="8.5" y1="7" x2="9.5" y2="7" /><line x1="14.5" y1="7" x2="15.5" y2="7" /><line x1="8.5" y1="11" x2="9.5" y2="11" /><line x1="14.5" y1="11" x2="15.5" y2="11" /><line x1="8.5" y1="15" x2="9.5" y2="15" /><line x1="14.5" y1="15" x2="15.5" y2="15" /></>),
    briefcase: (<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>),
    ticket:  (<><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" /><line x1="13" y1="5" x2="13" y2="7" /><line x1="13" y1="11" x2="13" y2="13" /><line x1="13" y1="17" x2="13" y2="19" /></>),
    car:     (<><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 17h6" /></>),
    rescue:  (<><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>),
    presentation: (<><path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" /></>),
  }
  return <svg {...p}>{paths[name]}</svg>
}

function StatCard({ end, suffix, label, iconName, active }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let cur = 0
    const step = end / (1800 / 16)
    const t = setInterval(() => {
      cur = Math.min(cur + step, end)
      setCount(Math.floor(cur))
      if (cur >= end) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [active, end])

  return (
    <div className="text-center p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(196,150,42,0.25)' }}>
      <div className="w-12 h-12 mx-auto mb-5 rounded-xl flex items-center justify-center" style={{ background: 'rgba(196,150,42,0.15)', color: '#EDB84A' }}>
        <Icon name={iconName} size={22} />
      </div>
      <p className="heading" style={{ fontSize: 'clamp(38px,6vw,58px)', color: '#EDB84A', lineHeight: 1 }}>
        {count}{suffix}
      </p>
      <p className="text-white/50 text-xs mt-3 tracking-widest uppercase">{label}</p>
    </div>
  )
}

const Eyebrow = ({ children, light }) => (
  <div className={`eyebrow mb-4 ${light ? 'eyebrow-light' : ''}`}>{children}</div>
)

export default function Home() {
  const [activeTab, setActiveTab]     = useState('all')
  const [statsVisible, setStatsVisible] = useState(false)
  const [heroSearch, setHeroSearch]   = useState({ destination: '', duration: '', guests: '2' })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState('idle') // idle | sending | done | error
  const statsRef = useRef(null)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setNewsletterState('sending')
    try {
      const res = await fetch(`${API_URL}/newsletter.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json.ok === false) {
        setNewsletterState('error')
        return
      }
      setNewsletterState('done')
      setNewsletterEmail('')
    } catch {
      // API unreachable (static demo) — treat as subscribed
      setNewsletterState('done')
      setNewsletterEmail('')
    }
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true) },
      { threshold: 0.25 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const tabs = ['all', 'safari', 'beach', 'cultural', 'trekking']

  const filteredPackages = (() => {
    const base = activeTab === 'all'
      ? [...TOUR_PACKAGES].sort((a, b) => b.rating - a.rating)
      : TOUR_PACKAGES.filter(p => p.category === activeTab)
    return base.slice(0, 3).length ? base.slice(0, 3) : [...TOUR_PACKAGES].sort((a, b) => b.rating - a.rating).slice(0, 3)
  })()

  const categories = [
    { label: 'Wildlife Safari',  img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=700&fit=crop', count: '24 trips' },
    { label: 'Air Travel',       img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&h=700&fit=crop', count: 'Charter & scheduled' },
    { label: 'Beach Escapes',    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=700&fit=crop', count: '12 trips' },
    { label: 'Mountain Treks',   img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop', count: '8 trips' },
    { label: 'Cultural Tours',   img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=700&fit=crop', count: '10 trips' },
    { label: 'Luxury Stays',     img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=700&fit=crop', count: '6 trips' },
  ]

  const destinations = [
    { name: 'Masai Mara',   tag: 'Wildlife Safari',   img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop', count: '18 tours', span: 'col-span-2 md:col-span-2', tall: true },
    { name: 'Mombasa',      tag: 'Coastal Escape',    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=380&fit=crop', count: '12 tours', span: '' },
    { name: 'Mount Kenya',  tag: 'Alpine Trek',        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=380&fit=crop', count: '8 tours',  span: '' },
    { name: 'Nairobi',      tag: 'City Experience',   img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=380&fit=crop', count: '6 tours',  span: '' },
    { name: 'Lake Nakuru',  tag: 'Flamingo Haven',    img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=380&fit=crop', count: '5 tours',  span: '' },
    { name: 'Samburu',      tag: 'Fly-in Safari',     img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=380&fit=crop', count: '4 tours',  span: 'col-span-2 md:col-span-3' },
  ]

  const testimonials = [
    {
      quote: 'An absolutely life-changing experience. Our guide knew every animal by name, and the camp under the stars was breathtaking. We\'ll be back!',
      author: 'Sarah M.', location: 'London, UK', trip: 'Masai Mara Safari · 5 days', rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    },
    {
      quote: 'From the moment we landed to the final goodbye, everything was perfectly arranged. Ibrali made our honeymoon truly unforgettable.',
      author: 'James & Anika R.', location: 'Toronto, Canada', trip: 'Beach & Safari Combo · 10 days', rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    },
    {
      quote: 'Professional, knowledgeable, and genuinely passionate. The cultural immersion with the Maasai was unlike anything we\'ve ever experienced.',
      author: 'Kenji T.', location: 'Tokyo, Japan', trip: 'Cultural & Wildlife · 7 days', rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    },
  ]

  const howItWorks = [
    { step: '01', title: 'Browse & Discover',    desc: 'Explore our curated Kenya experiences — from Big Five safaris to coastal retreats and mountain treks.', icon: 'map' },
    { step: '02', title: 'Customise Your Trip',  desc: 'Tell us your dates, group size and preferences. We\'ll tailor every detail to your vision.', icon: 'calendar' },
    { step: '03', title: 'Book Securely',        desc: 'Reserve your safari with a simple deposit. Transparent pricing, no hidden fees, full refund policy.', icon: 'shield' },
    { step: '04', title: 'Experience Africa',    desc: 'Arrive and let Kenya\'s magic unfold — while our team handles everything behind the scenes.', icon: 'compass' },
  ]

  const features = [
    { icon: 'gem',     title: 'Best-rate negotiation',       desc: 'Strong negotiation skills secure the best travel and accommodation rates across East Africa and DR Congo.' },
    { icon: 'users',   title: 'Teams & conferences',         desc: 'Specialists in organizing team building trips, conferences, and seminars for organizations of every size.' },
    { icon: 'calendar',title: 'Instant CRS bookings',        desc: 'An advanced Computer Reservation System (CRS) confirms your reservations instantly.' },
    { icon: 'star',    title: 'Affordable packages',         desc: 'Affordable and unmatched tour packages and accommodation options tailored to your budget.' },
    { icon: 'map',     title: 'Domestic tourism experience', desc: 'Carefully curated journeys through Kenya\'s natural beauty, cultural richness, and scenic destinations.' },
    { icon: 'support', title: '24/7 support & air rescue',   desc: 'Round-the-clock assistance, with air rescue coordination in emergency situations.' },
  ]

  const clientTypes = [
    'Corporate Organizations', 'Schools', 'NGOs', 'Government Institutions', 'Families', 'International Tourists',
  ]

  const coreServices = [
    { icon: 'plane',     title: 'Air, Train, Hotel & Lodge Transfers',      desc: 'Seamless travel arrangements to ensure a comfortable and convenient journey.' },
    { icon: 'hotel',     title: 'Hotel, Restaurant & Airbnb Reservations',  desc: 'Handpicked stays and dining experiences tailored to your preferences.' },
    { icon: 'briefcase', title: 'Business Tourism',                         desc: 'Efficient travel solutions for corporate trips, meetings, and events.' },
    { icon: 'compass',   title: 'Excursions & Adventures',                  desc: 'Unforgettable experiences including school trips, city tours, and adventure activities.' },
    { icon: 'ticket',    title: 'Ticketing Services',                       desc: 'Reliable ticketing solutions for corporate clients and individuals.' },
  ]

  const additionalServices = [
    { icon: 'presentation', title: 'Conferences & Seminars',        desc: 'End-to-end planning and management of successful events.' },
    { icon: 'users',        title: 'Team Building & Workshops',     desc: 'Engaging activities that inspire teamwork and strengthen connections.' },
    { icon: 'car',          title: 'Car Hire & Cab Services',       desc: 'Reliable and comfortable transportation whenever you need it.' },
    { icon: 'shield',       title: 'Travel Insurance',              desc: 'Comprehensive coverage for a worry-free travel experience.' },
    { icon: 'rescue',       title: 'Air Rescue Coordination',       desc: '24/7 support and coordination in emergency situations.' },
  ]

  const galleryPhotos = [
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
  ]

  const SelectField = ({ label, value, onChange, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none text-sm px-4 py-3 rounded-xl focus:outline-none pr-9"
          style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>
    </div>
  )

  return (
      <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
        <Navbar />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=90')" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(56,44,28,0.88) 0%, rgba(56,44,28,0.42) 45%, rgba(56,44,28,0.06) 100%)' }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="pb-14 md:pb-16">
              <div className="eyebrow eyebrow-light mb-5 mt-24 md:mt-32">Safaris · Flights · Beach Escapes</div>
              <h1
                className="heading text-white max-w-4xl"
                style={{ fontSize: 'clamp(44px, 8vw, 92px)', lineHeight: 0.98 }}
              >
                Exploring the world,<br />
                <span className="heading-accent">protecting its wonders.</span>
              </h1>
              <p className="text-white/70 text-lg mt-6 max-w-xl leading-relaxed">
                Ibrali Tours &amp; Travel is a premier travel and tourism company based in Nairobi, Kenya — delivering exceptional local and international travel experiences with professionalism, integrity, and innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link to="/packages" className="btn btn-gold px-8 py-4">
                  Explore safaris <span className="text-base">→</span>
                </Link>
                <Link to="/contact" className="btn btn-ghost px-8 py-4">
                  Plan with an expert
                </Link>
              </div>

              <div className="flex flex-wrap gap-10 mt-16 pt-8 border-t border-white/12">
                {[
                  { value: '500+', label: 'Safaris completed' },
                  { value: '98%',  label: 'Guest satisfaction' },
                  { value: '10+',  label: 'Years of expertise' },
                  { value: '40+',  label: 'Destinations' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="heading" style={{ fontSize: '34px', color: '#EDB84A' }}>{s.value}</p>
                    <p className="text-white/45 text-xs mt-1 tracking-wide uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Search widget — sits at the bottom of the hero, anchored to trust bar */}
            <div
              className="rounded-t-3xl px-6 md:px-8 py-6"
              style={{ background: 'rgba(56,44,28,0.92)', backdropFilter: 'blur(28px)', border: '0.5px solid rgba(196,150,42,0.22)', borderBottom: 'none' }}
            >
              <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Find your perfect trip</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <SelectField
                  label="Destination"
                  value={heroSearch.destination}
                  onChange={e => setHeroSearch(s => ({ ...s, destination: e.target.value }))}
                >
                  <option value="">Any destination</option>
                  <option>Masai Mara</option>
                  <option>Mombasa</option>
                  <option>Mount Kenya</option>
                  <option>Lake Nakuru</option>
                  <option>Samburu</option>
                  <option>Nairobi</option>
                </SelectField>

                <SelectField
                  label="Duration"
                  value={heroSearch.duration}
                  onChange={e => setHeroSearch(s => ({ ...s, duration: e.target.value }))}
                >
                  <option value="">Any length</option>
                  <option>2–3 days</option>
                  <option>4–5 days</option>
                  <option>6–7 days</option>
                  <option>8–10 days</option>
                  <option>10+ days</option>
                </SelectField>

                <SelectField
                  label="Travellers"
                  value={heroSearch.guests}
                  onChange={e => setHeroSearch(s => ({ ...s, guests: e.target.value }))}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3–4</option>
                  <option>5–8</option>
                  <option>8+</option>
                </SelectField>

                <Link to="/packages" className="btn btn-gold py-3 text-sm">
                  Search trips →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ────────────────────────────────────── */}
        <div style={{ background: '#382C1C', borderBottom: '0.5px solid rgba(196,150,42,0.12)' }}>
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {/* TripAdvisor */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00AA6C' }}>
                  <svg viewBox="0 0 20 20" fill="white" width="10" height="10"><circle cx="10" cy="10" r="4" fill="white"/><circle cx="10" cy="10" r="2.5" fill="#00AA6C"/></svg>
                </div>
                <div>
                  <p className="text-white/85 text-xs font-medium">Tripadvisor</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#00AA6C', fontSize: '10px' }}>★</span>)}
                    <span className="text-white/35 text-[10px] ml-1">4.9</span>
                  </div>
                </div>
              </div>

              <div className="w-px h-5 bg-white/10 hidden sm:block" />

              {/* Google */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <span style={{ fontWeight: 800, fontSize: '13px', color: '#4285F4' }}>G</span>
                </div>
                <div>
                  <p className="text-white/85 text-xs font-medium">Google Reviews</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#FBBC04', fontSize: '10px' }}>★</span>)}
                    <span className="text-white/35 text-[10px] ml-1">4.8 · 200+</span>
                  </div>
                </div>
              </div>

              <div className="w-px h-5 bg-white/10 hidden sm:block" />

              {/* Award */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,150,42,0.18)', border: '0.5px solid rgba(196,150,42,0.35)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4962A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/85 text-xs font-medium">Best Safari 2024</p>
                  <p className="text-white/35 text-[10px]">East Africa Tourism Awards</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              Trusted by 5,000+ travellers worldwide
            </div>
          </div>
        </div>

        {/* ── EXPERIENCE CATEGORIES ──────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-14">
              <Eyebrow>Explore by type</Eyebrow>
              <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                Find your perfect <span className="heading-accent">adventure</span>
              </h2>
              <p className="text-[#7A7268] text-base mt-4 max-w-lg mx-auto leading-relaxed">
                Whether you dream of tracking lions at dawn or unwinding on pristine shores, Kenya has it all.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  to="/packages"
                  className="group relative overflow-hidden rounded-2xl"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(56,44,28,0.78) 0%, rgba(56,44,28,0.06) 60%, transparent 100%)' }} />

                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <p className="text-white font-semibold text-sm leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>{cat.label}</p>
                    <p className="text-white/50 text-[11px] mt-0.5">{cat.count}</p>
                  </div>

                  <div
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                    style={{ background: 'rgba(196,150,42,0.92)' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#382C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR SERVICES ─────────────────────────────────── */}
        <section className="py-24 px-6" style={{ background: '#F5EFE3' }}>
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-14">
              <div className="flex justify-center"><Eyebrow>What we do</Eyebrow></div>
              <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                Our <span className="heading-accent">services</span>
              </h2>
              <p className="text-[#7A7268] text-base mt-4 max-w-lg mx-auto leading-relaxed">
                From transfers and reservations to corporate travel and emergencies — every detail handled under one roof.
              </p>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-6">
              {[
                { label: 'Core services', items: coreServices },
                { label: 'Additional services', items: additionalServices },
              ].map((group) => (
                <div key={group.label} className="card-surface !rounded-2xl p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[1.5px] mb-6" style={{ color: '#B07E1C' }}>
                    {group.label}
                  </p>
                  <div className="space-y-6">
                    {group.items.map((service) => (
                      <div key={service.title} className="flex items-start gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0', color: '#B07E1C' }}
                        >
                          <Icon name={service.icon} size={19} />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-semibold text-[#1C1A17]">{service.title}</h3>
                          <p className="text-[#7A7268] text-sm leading-relaxed mt-1">{service.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/contact" className="btn btn-dark px-8 py-4">
                Request a service →
              </Link>
            </div>
          </div>
        </section>

        {/* ── MARQUEE STRIP ────────────────────────────────── */}
        <div className="py-3.5 overflow-hidden border-y" style={{ background: '#382C1C', borderColor: 'rgba(196,150,42,0.15)' }}>
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {Array(6).fill(['Masai Mara', 'Charter Flights', 'Amboseli', 'Lake Nakuru', 'Samburu', 'Mombasa', 'Mount Kenya', 'Tsavo', 'Maasai Village']).flat().map((d, i) => (
              <span key={i} className="text-sm tracking-widest uppercase flex items-center gap-4" style={{ color: '#E3D4B4' }}>
                {d} <span style={{ color: 'rgba(196,150,42,0.45)' }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── FEATURED PACKAGES ────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <Eyebrow>Handpicked for you</Eyebrow>
                <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                  Featured <span className="heading-accent">adventures</span>
                </h2>
              </div>
              <Link to="/packages" className="link-underline self-start md:self-auto">
                View all packages →
              </Link>
            </Reveal>

            {/* Tab Filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize"
                  style={activeTab === tab
                    ? { background: '#C4962A', color: '#382C1C' }
                    : { background: '#fff', color: '#7A7268', border: '0.5px solid #E3DCCD' }
                  }
                >
                  {tab === 'all' ? 'All trips' : tab}
                </button>
              ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="group hover:-translate-y-2 transition-transform duration-500">
                  <PackageCard package={pkg} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ANIMATED STATS ──────────────────────────────── */}
        <section ref={statsRef} className="relative py-28 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547970827-f33b90fde688?w=1800&q=80')" }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(56,44,28,0.72)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-16">
              <Eyebrow light>Our legacy</Eyebrow>
              <h2 className="heading text-white" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
                Numbers that <span className="heading-accent">speak</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { end: 500, suffix: '+', label: 'Safaris Completed',    iconName: 'compass' },
                { end: 98,  suffix: '%', label: 'Guest Satisfaction',   iconName: 'star' },
                { end: 10,  suffix: '+', label: 'Years Experience',     iconName: 'shield' },
                { end: 40,  suffix: '+', label: 'Destinations Covered', iconName: 'map' },
              ].map((stat, i) => (
                <StatCard key={i} {...stat} active={statsVisible} />
              ))}
            </div>
          </div>
        </section>

        {/* ── DESTINATIONS GRID ────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
              <div>
                <Eyebrow>Kenya awaits</Eyebrow>
                <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                  Top <span className="heading-accent">destinations</span>
                </h2>
              </div>
              <Link to="/packages" className="link-underline self-start md:self-auto">
                View all destinations →
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ gridAutoRows: 'minmax(180px, auto)' }}>
              {destinations.map((dest, i) => (
                <Link
                  key={i}
                  to="/packages"
                  className={`group relative overflow-hidden rounded-2xl ${dest.span}`}
                  style={{ minHeight: dest.tall ? '320px' : '200px' }}
                >
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(56,44,28,0.78) 0%, rgba(56,44,28,0.03) 60%, transparent 100%)' }} />
                  <div className="absolute bottom-0 left-0 p-5 w-full flex items-end justify-between">
                    <div>
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium mb-2"
                        style={{ background: 'rgba(196,150,42,0.28)', color: '#EDB84A', border: '0.5px solid rgba(196,150,42,0.4)' }}
                      >
                        {dest.tag}
                      </span>
                      <h3
                        className="text-white font-bold leading-snug"
                        style={{ fontFamily: "'Playfair Display', serif", fontSize: dest.tall ? '24px' : '18px' }}
                      >
                        {dest.name}
                      </h3>
                      <p className="text-white/45 text-xs mt-1">{dest.count}</p>
                    </div>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                      style={{ background: '#C4962A' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#382C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section className="py-24" style={{ background: '#382C1C' }}>
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-16">
              <Eyebrow light>Simple process</Eyebrow>
              <h2 className="heading text-white" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                How it <span className="heading-accent">works</span>
              </h2>
              <p className="text-white/45 text-base mt-4 max-w-md mx-auto leading-relaxed">
                From your first click to your last sunset, we take care of everything.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {howItWorks.map((step, i) => (
                <Reveal key={i} delay={i * 0.08} className="relative">
                  <div
                    className="relative p-8 rounded-2xl h-full"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(196,150,42,0.14)' }}
                  >
                    {i < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 z-10">
                        <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                          <path d="M0 5H24M24 5L20 1M24 5L20 9" stroke="rgba(196,150,42,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <p
                      className="mb-4 leading-none select-none"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', fontWeight: 700, color: 'rgba(196,150,42,0.18)' }}
                    >
                      {step.step}
                    </p>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'rgba(196,150,42,0.14)', color: '#EDB84A' }}
                    >
                      <Icon name={step.icon} size={18} />
                    </div>
                    <h3 className="text-white font-medium text-base mb-2">{step.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link to="/booking" className="btn btn-gold px-10 py-4">
                Start planning your trip →
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ────────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="mb-14 text-center">
              <div className="flex justify-center"><Eyebrow>Our promise</Eyebrow></div>
              <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                Why travellers <span className="heading-accent">choose us</span>
              </h2>
              <p className="text-[#7A7268] text-base mt-4 max-w-lg mx-auto leading-relaxed">
                Over 10 years of industry expertise has taught us what truly matters — from the moment you inquire to the moment you return home.
              </p>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group card-surface p-8 !rounded-2xl transition-transform duration-500 hover:-translate-y-1"
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

            <div className="mt-14 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[2px] text-[#9C9890] mb-5">
                Proudly serving
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {clientTypes.map((client) => (
                  <span
                    key={client}
                    className="px-4 py-2 rounded-full text-[13px] font-medium text-[#6B6560] bg-white"
                    style={{ border: '0.5px solid #E3DCCD' }}
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        <section className="py-24 px-6" style={{ background: '#F5EFE3' }}>
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-14">
              <Eyebrow>Real experiences</Eyebrow>
              <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                Stories from our <span className="heading-accent">travellers</span>
              </h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <div key={i} className="card-surface !rounded-2xl p-8 relative flex flex-col">
                  <div className="flex items-center gap-0.5 mb-5">
                    {[...Array(t.rating)].map((_, j) => (
                      <svg key={j} className="w-4 h-4" fill="#EDB84A" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div
                    className="absolute top-6 right-6 select-none"
                    style={{ fontSize: '56px', lineHeight: 1, color: 'rgba(196,150,42,0.12)', fontFamily: 'Georgia, serif', fontWeight: 700 }}
                  >"</div>
                  <p className="text-[#1C1A17] text-sm leading-relaxed flex-1 relative z-10">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-5 mt-5 border-t border-[#E3DCCD]">
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1C1A17]">{t.author}</p>
                      <p className="text-xs text-[#9C9890] mt-0.5">{t.location} · {t.trip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-2 text-sm text-[#7A7268]">
                <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#00AA6C' }}>
                  <svg viewBox="0 0 16 16" fill="white" width="8" height="8"><circle cx="8" cy="8" r="3" fill="white"/><circle cx="8" cy="8" r="2" fill="#00AA6C"/></svg>
                </span>
                <span className="font-medium text-[#1C1A17]">4.9&thinsp;/&thinsp;5</span> on Tripadvisor
              </div>
              <div className="w-px h-4 bg-[#E3DCCD] hidden sm:block" />
              <div className="flex items-center gap-2 text-sm text-[#7A7268]">
                <span className="w-5 h-5 rounded-full bg-white border border-[#E3DCCD] flex items-center justify-center text-[11px] font-bold" style={{ color: '#4285F4' }}>G</span>
                <span className="font-medium text-[#1C1A17]">4.8&thinsp;/&thinsp;5</span> on Google
              </div>
              <div className="w-px h-4 bg-[#E3DCCD] hidden sm:block" />
              <p className="text-sm text-[#7A7268]">
                ★&ensp;<span className="font-medium text-[#1C1A17]">200+ verified reviews</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── PHOTO GALLERY ────────────────────────────────── */}
        <section className="py-24 px-6" style={{ background: '#382C1C' }}>
          <div className="max-w-7xl mx-auto">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <Eyebrow light>Kenya in photos</Eyebrow>
                <h2 className="heading text-white" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                  Life through the <span className="heading-accent">lens</span>
                </h2>
              </div>
              <a href="#" className="link-underline link-underline-light self-start md:self-auto">
                Follow on Instagram →
              </a>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {galleryPhotos.map((photo, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl" style={{ aspectRatio: '1' }}>
                  <img
                    src={photo}
                    alt={`Kenya travel ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="3.5" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER ──────────────────────────────────── */}
        <section className="py-20 px-6">
          <Reveal className="max-w-2xl mx-auto text-center">
            <Eyebrow>Travel inspiration</Eyebrow>
            <h2 className="heading mb-4" style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.15 }}>
              Get Kenya travel <span className="heading-accent">insider tips</span>
            </h2>
            <p className="text-[#7A7268] text-base mb-8 leading-relaxed max-w-lg mx-auto">
              Monthly itinerary ideas, off-the-beaten-path destinations, and exclusive early-bird deals — delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="input-safari flex-1 px-5 py-3.5 rounded-full text-sm bg-white text-[#1C1A17] placeholder:text-[#9C9890]"
                style={{ border: '0.5px solid #E3DCCD' }}
              />
              <button type="submit" disabled={newsletterState === 'sending'} className="btn btn-gold px-7 py-3.5 whitespace-nowrap">
                {newsletterState === 'sending' ? 'Subscribing…' : 'Subscribe free →'}
              </button>
            </form>
            {newsletterState === 'done' ? (
              <p className="text-emerald-700 text-xs mt-4 font-medium">You're in! Watch your inbox for travel inspiration.</p>
            ) : newsletterState === 'error' ? (
              <p className="text-red-600 text-xs mt-4">That email doesn't look right — please try again.</p>
            ) : (
              <p className="text-[#9C9890] text-xs mt-4">No spam. Unsubscribe any time.</p>
            )}
          </Reveal>
        </section>

        {/* ── SPLIT CTA ────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div
              className="min-h-[50vh] lg:min-h-[580px] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547970827-f33b90fde688?w=960&q=85')" }}
            />
            <Reveal className="flex flex-col justify-center px-10 py-16 lg:px-16 h-full bg-[#382C1C]">
              <Eyebrow light>Ready to go?</Eyebrow>
              <h2 className="heading text-white mb-6" style={{ fontSize: 'clamp(30px, 5vw, 50px)', lineHeight: 1.1 }}>
                Your next<br />
                adventure<br />
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#EDB84A' }}>starts here.</span>
              </h2>
              <p className="text-white/55 text-base leading-relaxed mb-8 max-w-sm">
                Discover Kenya's untamed beauty with a company built on passion, expertise, and a deep respect for the land.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/packages" className="btn btn-gold px-8 py-4">
                  Browse packages →
                </Link>
                <Link to="/contact" className="btn btn-ghost px-8 py-4">
                  Talk to an expert
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="Traveller" className="w-8 h-8 rounded-full object-cover" style={{ border: '2px solid #382C1C' }} />
                  ))}
                </div>
                <p className="text-white/40 text-sm">
                  Join <span className="text-white/70 font-medium">5,000+</span> happy travellers
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </div>
  )
}
