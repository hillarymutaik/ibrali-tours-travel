import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pause, Play, Search } from 'lucide-react'
import { TOUR_PACKAGES, API_URL, TRIP_LENGTHS, GROUP_SIZES } from '../utils/constants'
import { useLanguage } from '../hooks/useLanguage'
import Navbar from '../components/Navbar'
import PackageCard from '../components/PackageCard'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import useSeo from '../hooks/useSeo'

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
    paw: (<><ellipse cx="7" cy="7" rx="1.6" ry="2" /><ellipse cx="12" cy="5.5" rx="1.6" ry="2" /><ellipse cx="17" cy="7" rx="1.6" ry="2" /><path d="M12 11c-3 0-6 2.2-6 5.2a2.8 2.8 0 0 0 2.8 2.8c1 0 1.6-.5 3.2-.5s2.2.5 3.2.5a2.8 2.8 0 0 0 2.8-2.8c0-3-3-5.2-6-5.2z" /></>),
  }
  return <svg {...p}>{paths[name]}</svg>
}

function StatCard({ end, suffix, label, iconName, active }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let cur = 0
    const step = end / (1800 / 16)
    const timer = setInterval(() => {
      cur = Math.min(cur + step, end)
      setCount(Math.floor(cur))
      if (cur >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [active, end])

  return (
    <div className="text-center p-8 rounded-2xl bg-white" style={{ border: '0.5px solid #FFD9B3' }}>
      <div className="w-12 h-12 mx-auto mb-5 rounded-xl flex items-center justify-center" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}>
        <Icon name={iconName} size={22} />
      </div>
      <p className="heading" style={{ fontSize: 'clamp(38px,6vw,58px)', color: '#E75A08', lineHeight: 1 }}>
        {count}{suffix}
      </p>
      <p className="text-[#9C9890] text-xs mt-3 tracking-widest uppercase">{label}</p>
    </div>
  )
}

// How long each hero slide stays on screen (ms)
const SLIDE_INTERVAL = 10000

// Defined outside Home so it isn't re-created on every render (a re-created
// component remounts its <select> and drops focus after each change)
const SelectField = ({ label, value, onChange, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] tracking-widest uppercase" style={{ color: '#9C9890' }}>{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none text-sm px-4 py-3 rounded-xl focus:outline-none pr-9"
        style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#1C1A17' }}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C2470A' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </div>
  </div>
)

const Eyebrow = ({ children, light }) => (
  <div className={`eyebrow mb-4 ${light ? 'eyebrow-light' : ''}`}>{children}</div>
)

export default function Home() {
  const { t } = useLanguage()
  useSeo({
    description: t('home.seo'),
  })
  const [activeTab, setActiveTab]     = useState('all')
  const [statsVisible, setStatsVisible] = useState(false)
  const [heroSearch, setHeroSearch]   = useState({ destination: '', duration: '', guests: '' })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState('idle') // idle | sending | done | error
  const statsRef = useRef(null)

  const heroSlides = [
    // Okapi — Ibrali's logo animal, native to DR Congo's rainforest (photo: Douglas Cioffi, Unsplash License)
    { image: 'https://images.unsplash.com/photo-1785277168940-9ac364c6c085?w=1920&q=90', label: t('home.slide.okapi') },
    { image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=90', label: t('home.slide.masai') },
    { image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=90', label: t('home.slide.dubai') },
    { image: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=1920&q=90', label: t('home.slide.maldives') },
  ]
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  // Bumped whenever the slider resumes, so the progress bar restarts in step with the timer
  const [resumeKey, setResumeKey] = useState(0)
  const touchStartX = useRef(null)
  const sliderPaused = !isPlaying || isHovering

  // Each slide gets a full SLIDE_INTERVAL; manual navigation restarts the countdown
  useEffect(() => {
    if (sliderPaused) return
    const timer = setTimeout(() => {
      setActiveSlide((s) => (s + 1) % heroSlides.length)
    }, SLIDE_INTERVAL)
    return () => clearTimeout(timer)
  }, [activeSlide, sliderPaused, heroSlides.length])

  const goToSlide = (i) => setActiveSlide(i)
  const prevSlide = () => setActiveSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)
  const nextSlide = () => setActiveSlide((s) => (s + 1) % heroSlides.length)

  const togglePlay = () => {
    if (!isPlaying) setResumeKey((k) => k + 1)
    setIsPlaying((p) => !p)
  }
  const handleMouseLeave = () => {
    setIsHovering(false)
    setResumeKey((k) => k + 1)
  }
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) (dx < 0 ? nextSlide : prevSlide)()
    touchStartX.current = null
  }

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
    // `state` pre-filters the packages page; Air Travel is a service, not a package, so it goes to Contact
    { label: t('home.cat.wildlife'), img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=700&fit=crop', count: t('home.cat.wildlifeCount'), state: { category: 'safari' } },
    { label: t('home.cat.air'), img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&h=700&fit=crop', count: t('home.cat.airCount'), to: '/contact' },
    { label: t('home.cat.beach'), img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=700&fit=crop', count: t('home.cat.beachCount'), state: { category: 'beach' } },
    { label: t('home.cat.mountain'), img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop', count: t('home.cat.mountainCount'), state: { category: 'trekking' } },
    { label: t('home.cat.cultural'), img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=700&fit=crop', count: t('home.cat.culturalCount'), state: { category: 'cultural' } },
    { label: t('home.cat.luxury'), img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=700&fit=crop', count: t('home.cat.luxuryCount'), state: { search: 'Luxury' } },
  ]

  // Destination names are proper nouns and stay as-is; tags and counts are translated
  const destinations = [
    { name: 'Masai Mara',   tag: t('home.dest.tag.safari'),    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop', count: t('home.dest.count.18'), span: 'col-span-2 md:col-span-2', tall: true },
    { name: 'Mombasa',      tag: t('home.dest.tag.coast'),     img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=380&fit=crop', count: t('home.dest.count.12'), span: '' },
    { name: 'Mount Kenya',  tag: t('home.dest.tag.alpine'),    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=380&fit=crop', count: t('home.dest.count.8'),  span: '' },
    { name: 'Nairobi',      tag: t('home.dest.tag.city'),      img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=380&fit=crop', count: t('home.dest.count.6'),  span: '' },
    { name: 'Lake Nakuru',  tag: t('home.dest.tag.flamingo'),  img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=380&fit=crop', count: t('home.dest.count.5'),  span: '' },
    { name: 'Dubai',        tag: t('home.dest.tag.desert'),    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=380&fit=crop', count: t('home.dest.count.3'),  span: '' },
    { name: 'DR Congo',     tag: t('home.dest.tag.rainforest'), img: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=500&h=380&fit=crop', count: t('home.dest.count.2'),  span: '' },
    { name: 'Samburu',      tag: t('home.dest.tag.flyin'),     img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=380&fit=crop', count: t('home.dest.count.4'), span: 'col-span-2 md:col-span-3' },
  ]

  const testimonials = [
    {
      quote: t('home.testi.q1'),
      author: 'Sarah M.', location: t('home.testi.l1'), trip: t('home.testi.t1'), rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    },
    {
      quote: t('home.testi.q2'),
      author: 'James & Anika R.', location: t('home.testi.l2'), trip: t('home.testi.t2'), rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    },
    {
      quote: t('home.testi.q3'),
      author: 'Kenji T.', location: t('home.testi.l3'), trip: t('home.testi.t3'), rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    },
  ]

  const howItWorks = [
    { step: '01', title: t('home.how.s1.title'), desc: t('home.how.s1.desc'), icon: 'map' },
    { step: '02', title: t('home.how.s2.title'), desc: t('home.how.s2.desc'), icon: 'calendar' },
    { step: '03', title: t('home.how.s3.title'), desc: t('home.how.s3.desc'), icon: 'shield' },
    { step: '04', title: t('home.how.s4.title'), desc: t('home.how.s4.desc'), icon: 'compass' },
  ]

  const features = [
    { icon: 'compass',  title: t('home.why.f1.title'), desc: t('home.why.f1.desc') },
    { icon: 'gem',      title: t('home.why.f2.title'), desc: t('home.why.f2.desc') },
    { icon: 'calendar', title: t('home.why.f3.title'), desc: t('home.why.f3.desc') },
    { icon: 'briefcase', title: t('home.why.f4.title'), desc: t('home.why.f4.desc') },
    { icon: 'star',     title: t('home.why.f5.title'), desc: t('home.why.f5.desc') },
    { icon: 'support',  title: t('home.why.f6.title'), desc: t('home.why.f6.desc') },
    { icon: 'shield',   title: t('home.why.f7.title'), desc: t('home.why.f7.desc') },
  ]

  const clientTypes = [1, 2, 3, 4, 5, 6, 7].map((n) => t(`home.clients.${n}`))

  const serviceCategories = [
    {
      icon: 'plane',
      title: t('home.services.travel'),
      items: [1, 2, 3, 4].map((n) => t(`home.services.travel${n}`)),
    },
    {
      icon: 'hotel',
      title: t('home.services.accom'),
      items: [1, 2, 3, 4].map((n) => t(`home.services.accom${n}`)),
    },
    {
      icon: 'briefcase',
      title: t('home.services.corp'),
      items: [1, 2, 3, 4].map((n) => t(`home.services.corp${n}`)),
    },
    {
      icon: 'paw',
      title: t('home.services.leisure'),
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => t(`home.services.leisure${n}`)),
    },
    {
      icon: 'shield',
      title: t('home.services.protect'),
      items: [1, 2].map((n) => t(`home.services.protect${n}`)),
    },
  ]

  const galleryPhotos = [
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
  ]

  return (
      <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
        <Navbar />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          className="relative min-h-screen flex flex-col justify-end overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding background images — fills the section at every screen size.
              The active photo drifts slowly (Ken Burns) so the hero never feels static */}
          {heroSlides.map((slide, i) => (
            <div
              key={slide.image}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === activeSlide ? 1 : 0 }}
              aria-hidden={i !== activeSlide}
            >
              <div
                className={`absolute inset-0 bg-cover bg-center ${i === activeSlide ? 'animate-kenburns' : ''}`}
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
            </div>
          ))}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(56,44,28,0.88) 0%, rgba(56,44,28,0.42) 45%, rgba(56,44,28,0.06) 100%)' }}
          />
          {/* Scrims so the nav and headline stay legible on bright photos (e.g. the okapi
              in sunlit forest) without dimming the whole image */}
          <div
            className="absolute inset-x-0 top-0 h-40 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(28,22,14,0.55), rgba(28,22,14,0))' }}
          />
          <div
            className="absolute inset-0 hidden md:block pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(40,30,18,0.62) 0%, rgba(40,30,18,0.35) 38%, rgba(40,30,18,0) 68%)' }}
          />

          {/* Slide arrows */}
          <button
            onClick={prevSlide}
            aria-label={t('home.aria.prevSlide')}
            className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center text-white transition-all duration-300 hover:bg-white/15"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.25)' }}
          >
            <ChevronLeft size={20} strokeWidth={1.8} />
          </button>
          <button
            onClick={nextSlide}
            aria-label={t('home.aria.nextSlide')}
            className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center text-white transition-all duration-300 hover:bg-white/15"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.25)' }}
          >
            <ChevronRight size={20} strokeWidth={1.8} />
          </button>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="pb-14 md:pb-16 animate-fadeIn">
              <h1
                className="heading text-white max-w-4xl mt-24 md:mt-32"
                style={{ fontSize: 'clamp(44px, 8vw, 92px)', lineHeight: 0.98 }}
              >
                {t('home.hero.line1')}<br />
                <span className="heading-accent">{t('home.hero.line2')}</span>
              </h1>
              <p className="text-white/70 text-lg mt-6 max-w-xl leading-relaxed">
                {t('home.hero.desc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link to="/packages" className="btn btn-gold px-8 py-4">
                  {t('home.hero.explore')} <span className="text-base">→</span>
                </Link>
                <Link to="/contact" className="btn btn-ghost px-8 py-4">
                  {t('home.hero.plan')}
                </Link>
              </div>

              {/* Hidden on phones: the same figures appear in the stats section, and the hero is crowded there */}
              <div className="hidden sm:flex flex-wrap gap-10 mt-16 pt-8 border-t border-white/12">
                {[
                  { value: '500+', label: t('home.hero.stat.safaris') },
                  { value: '98%',  label: t('home.hero.stat.satisfaction') },
                  { value: '10+',  label: t('home.hero.stat.years') },
                  { value: '40+',  label: t('home.hero.stat.destinations') },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="heading" style={{ fontSize: '34px', color: '#F2843A' }}>{s.value}</p>
                    <p className="text-white/45 text-xs mt-1 tracking-wide uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide indicators + progress toward the next slide + play/pause */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-6">
              <div className="flex items-center gap-2">
                {heroSlides.map((slide, i) => (
                  <button
                    key={slide.image}
                    onClick={() => goToSlide(i)}
                    aria-label={t('home.aria.showSlide', null, { label: slide.label })}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === activeSlide ? '22px' : '7px',
                      background: i === activeSlide ? '#E75A08' : 'rgba(255,255,255,0.4)',
                    }}
                  />
                ))}
              </div>
              <div className="hidden sm:block w-28 h-[2px] rounded-full bg-white/20 overflow-hidden" aria-hidden="true">
                <div
                  key={`${activeSlide}-${resumeKey}`}
                  className="h-full bg-[#E75A08] animate-progress"
                  style={{
                    animationDuration: `${SLIDE_INTERVAL}ms`,
                    animationPlayState: sliderPaused ? 'paused' : 'running',
                  }}
                />
              </div>
              <span className="text-white/50 text-xs tracking-wide uppercase">{heroSlides[activeSlide].label}</span>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? t('home.aria.pause') : t('home.aria.play')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                style={{ border: '0.5px solid rgba(255,255,255,0.3)' }}
              >
                {isPlaying ? <Pause size={13} fill="currentColor" strokeWidth={0} /> : <Play size={13} fill="currentColor" strokeWidth={0} />}
              </button>
            </div>

            {/* Search widget — sits at the bottom of the hero, anchored to trust bar */}
            <div
              className="rounded-t-3xl px-6 md:px-8 py-6"
              style={{ background: 'rgba(255,248,242,0.96)', backdropFilter: 'blur(28px)', border: '0.5px solid #FFD9B3', borderBottom: 'none' }}
            >
              <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: '#9C9890' }}>{t('home.search.title')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <SelectField
                  label={t('home.search.destination')}
                  value={heroSearch.destination}
                  onChange={e => setHeroSearch(s => ({ ...s, destination: e.target.value }))}
                >
                  <option value="">{t('home.search.anyDestination')}</option>
                  <option>Masai Mara</option>
                  <option>Mombasa</option>
                  <option>Mount Kenya</option>
                  <option>Lake Nakuru</option>
                  <option>Samburu</option>
                  <option>Nairobi</option>
                  <option>Dubai</option>
                  <option>DR Congo</option>
                  <option>Paris</option>
                  <option>Maldives</option>
                </SelectField>

                <SelectField
                  label={t('home.search.duration')}
                  value={heroSearch.duration}
                  onChange={e => setHeroSearch(s => ({ ...s, duration: e.target.value }))}
                >
                  <option value="">{t('home.search.anyLength')}</option>
                  {TRIP_LENGTHS.map((l) => (
                    <option key={l.value} value={l.value}>{t(l.labelKey)}</option>
                  ))}
                </SelectField>

                <SelectField
                  label={t('home.search.travellers')}
                  value={heroSearch.guests}
                  onChange={e => setHeroSearch(s => ({ ...s, guests: e.target.value }))}
                >
                  <option value="">{t('home.search.anyGroup')}</option>
                  {GROUP_SIZES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </SelectField>

                {/* Carry the chosen destination into the packages page as its search */}
                <Link
                  to="/packages"
                  state={{ search: heroSearch.destination, duration: heroSearch.duration, groupSize: heroSearch.guests }}
                  className="btn btn-gold py-3 text-sm"
                >
                  <Search size={15} strokeWidth={2} /> {t('home.search.submit')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ────────────────────────────────────── */}
        <div style={{ background: '#FFF1E6', borderBottom: '0.5px solid #FFD9B3' }}>
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {/* TripAdvisor */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00AA6C' }}>
                  <svg viewBox="0 0 20 20" fill="white" width="10" height="10"><circle cx="10" cy="10" r="4" fill="white"/><circle cx="10" cy="10" r="2.5" fill="#00AA6C"/></svg>
                </div>
                <div>
                  <p className="text-[#1C1A17] text-xs font-medium">Tripadvisor</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#00AA6C', fontSize: '10px' }}>★</span>)}
                    <span className="text-[#9C9890] text-[10px] ml-1">4.9</span>
                  </div>
                </div>
              </div>

              <div className="w-px h-5 bg-[#FFD9B3] hidden sm:block" />

              {/* Google */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <span style={{ fontWeight: 800, fontSize: '13px', color: '#4285F4' }}>G</span>
                </div>
                <div>
                  <p className="text-[#1C1A17] text-xs font-medium">Google Reviews</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#FBBC04', fontSize: '10px' }}>★</span>)}
                    <span className="text-[#9C9890] text-[10px] ml-1">4.8 · 200+</span>
                  </div>
                </div>
              </div>

              <div className="w-px h-5 bg-[#FFD9B3] hidden sm:block" />

              {/* Award */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E75A08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[#1C1A17] text-xs font-medium">{t('home.trust.award')}</p>
                  <p className="text-[#9C9890] text-[10px]">{t('home.trust.awardBy')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs" style={{ color: '#9C9890' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              {t('home.trust.travellers')}
            </div>
          </div>
        </div>

        {/* ── EXPERIENCE CATEGORIES ──────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-14">
              <Eyebrow>{t('home.explore.eyebrow')}</Eyebrow>
              <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                {t('home.explore.title1')} <span className="heading-accent">{t('home.explore.title2')}</span>
              </h2>
              <p className="text-[#7A7268] text-base mt-4 max-w-lg mx-auto leading-relaxed">
                {t('home.explore.desc')}
              </p>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  to={cat.to || '/packages'}
                  state={cat.state}
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
                    style={{ background: 'rgba(231, 90, 8,0.92)' }}
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
              <div className="flex justify-center"><Eyebrow>{t('home.services.eyebrow')}</Eyebrow></div>
              <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                {t('home.services.title1')} <span className="heading-accent">{t('home.services.title2')}</span>
              </h2>
              <p className="text-[#7A7268] text-base mt-4 max-w-lg mx-auto leading-relaxed">
                {t('home.services.desc')}
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCategories.map((cat) => (
                <div key={cat.title} className="card-surface !rounded-2xl p-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}
                  >
                    <Icon name={cat.icon} size={22} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#1C1A17] mb-3">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#7A7268] leading-relaxed">
                        <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#E75A08' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/contact" className="btn btn-dark px-8 py-4">
                {t('home.services.request')} →
              </Link>
            </div>
          </div>
        </section>

        {/* ── MARQUEE STRIP ────────────────────────────────── */}
        <div className="py-3.5 overflow-hidden border-y" style={{ background: '#FFF1E6', borderColor: '#FFD9B3' }}>
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {Array(6).fill(['Masai Mara', 'Dubai', 'Amboseli', 'DR Congo', 'Samburu', 'Mombasa', 'Paris', 'Tsavo', 'Maldives']).flat().map((d, i) => (
              <span key={i} className="text-sm tracking-widest uppercase flex items-center gap-4" style={{ color: '#6B6560' }}>
                {d} <span style={{ color: '#E75A08' }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── FEATURED PACKAGES ────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <Eyebrow>{t('home.feat.eyebrow')}</Eyebrow>
                <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                  {t('home.feat.title1')} <span className="heading-accent">{t('home.feat.title2')}</span>
                </h2>
              </div>
              <Link to="/packages" className="link-underline self-start md:self-auto">
                {t('home.feat.viewAll')} →
              </Link>
            </Reveal>

            {/* Tab Filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={activeTab === tab
                    ? { background: '#E75A08', color: '#fff' }
                    : { background: '#fff', color: '#7A7268', border: '0.5px solid #E3DCCD' }
                  }
                >
                  {t(`home.tab.${tab}`)}
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
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&q=80')" }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(255,241,230,0.85)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-16">
              <Eyebrow>{t('home.stats.eyebrow')}</Eyebrow>
              <h2 className="heading text-[#1C1A17]" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
                {t('home.stats.title1')} <span className="heading-accent">{t('home.stats.title2')}</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { end: 500, suffix: '+', label: t('home.stats.safaris'),       iconName: 'compass' },
                { end: 98,  suffix: '%', label: t('home.stats.satisfaction'),  iconName: 'star' },
                { end: 10,  suffix: '+', label: t('home.stats.years'),         iconName: 'shield' },
                { end: 40,  suffix: '+', label: t('home.stats.destinations'),  iconName: 'map' },
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
                <Eyebrow>{t('home.dest.eyebrow')}</Eyebrow>
                <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                  {t('home.dest.title1')} <span className="heading-accent">{t('home.dest.title2')}</span>
                </h2>
              </div>
              <Link to="/packages" className="link-underline self-start md:self-auto">
                {t('home.dest.viewAll')} →
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ gridAutoRows: 'minmax(180px, auto)' }}>
              {destinations.map((dest, i) => (
                <Link
                  key={i}
                  to="/packages"
                  state={{ search: dest.name }}
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
                        style={{ background: 'rgba(231, 90, 8,0.28)', color: '#F2843A', border: '0.5px solid rgba(231, 90, 8,0.4)' }}
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
                      style={{ background: '#E75A08' }}
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
        <section className="py-24" style={{ background: '#FFF1E6' }}>
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-16">
              <Eyebrow>{t('home.how.eyebrow')}</Eyebrow>
              <h2 className="heading text-[#1C1A17]" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                {t('home.how.title1')} <span className="heading-accent">{t('home.how.title2')}</span>
              </h2>
              <p className="text-[#6B6560] text-base mt-4 max-w-md mx-auto leading-relaxed">
                {t('home.how.desc')}
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {howItWorks.map((step, i) => (
                <Reveal key={i} delay={i * 0.08} className="relative">
                  <div
                    className="relative p-8 rounded-2xl h-full bg-white"
                    style={{ border: '0.5px solid #FFD9B3' }}
                  >
                    {i < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 z-10">
                        <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                          <path d="M0 5H24M24 5L20 1M24 5L20 9" stroke="rgba(231, 90, 8,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <p
                      className="mb-4 leading-none select-none"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', fontWeight: 700, color: 'rgba(231, 90, 8,0.16)' }}
                    >
                      {step.step}
                    </p>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}
                    >
                      <Icon name={step.icon} size={18} />
                    </div>
                    <h3 className="text-[#1C1A17] font-medium text-base mb-2">{step.title}</h3>
                    <p className="text-[#7A7268] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link to="/booking" className="btn btn-gold px-10 py-4">
                {t('home.how.start')} →
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ────────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal className="mb-14 text-center">
              <div className="flex justify-center"><Eyebrow>{t('home.why.eyebrow')}</Eyebrow></div>
              <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                {t('home.why.title1')} <span className="heading-accent">{t('home.why.title2')}</span>
              </h2>
              <p className="text-[#7A7268] text-base mt-4 max-w-lg mx-auto leading-relaxed">
                {t('home.why.desc')}
              </p>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group card-surface p-8 !rounded-2xl transition-transform duration-500 hover:-translate-y-1"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}
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
                {t('home.clients.proudly')}
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
              <Eyebrow>{t('home.testi.eyebrow')}</Eyebrow>
              <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                {t('home.testi.title1')} <span className="heading-accent">{t('home.testi.title2')}</span>
              </h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item, i) => (
                <div key={i} className="card-surface !rounded-2xl p-8 relative flex flex-col">
                  <div className="flex items-center gap-0.5 mb-5">
                    {[...Array(item.rating)].map((_, j) => (
                      <svg key={j} className="w-4 h-4" fill="#F2843A" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div
                    className="absolute top-6 right-6 select-none"
                    style={{ fontSize: '56px', lineHeight: 1, color: 'rgba(231, 90, 8,0.12)', fontFamily: 'Georgia, serif', fontWeight: 700 }}
                  >"</div>
                  <p className="text-[#1C1A17] text-sm leading-relaxed flex-1 relative z-10">"{item.quote}"</p>
                  <div className="flex items-center gap-3 pt-5 mt-5 border-t border-[#E3DCCD]">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1C1A17]">{item.author}</p>
                      <p className="text-xs text-[#9C9890] mt-0.5">{item.location} · {item.trip}</p>
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
                <span className="font-medium text-[#1C1A17]">4.9&thinsp;/&thinsp;5</span> {t('home.testi.onTripadvisor')}
              </div>
              <div className="w-px h-4 bg-[#E3DCCD] hidden sm:block" />
              <div className="flex items-center gap-2 text-sm text-[#7A7268]">
                <span className="w-5 h-5 rounded-full bg-white border border-[#E3DCCD] flex items-center justify-center text-[11px] font-bold" style={{ color: '#4285F4' }}>G</span>
                <span className="font-medium text-[#1C1A17]">4.8&thinsp;/&thinsp;5</span> {t('home.testi.onGoogle')}
              </div>
              <div className="w-px h-4 bg-[#E3DCCD] hidden sm:block" />
              <p className="text-sm text-[#7A7268]">
                ★&ensp;<span className="font-medium text-[#1C1A17]">{t('home.testi.verified')}</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── PHOTO GALLERY ────────────────────────────────── */}
        <section className="py-24 px-6" style={{ background: '#FFF1E6' }}>
          <div className="max-w-7xl mx-auto">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <Eyebrow>{t('home.gallery.eyebrow')}</Eyebrow>
                <h2 className="heading text-[#1C1A17]" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1 }}>
                  {t('home.gallery.title1')} <span className="heading-accent">{t('home.gallery.title2')}</span>
                </h2>
              </div>
              <a href="https://www.instagram.com/ibralitravels" target="_blank" rel="noopener noreferrer" className="link-underline self-start md:self-auto">
                {t('home.gallery.follow')} →
              </a>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {galleryPhotos.map((photo, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl" style={{ aspectRatio: '1' }}>
                  <img
                    src={photo}
                    alt={t('home.gallery.alt', null, { n: i + 1 })}
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
            <Eyebrow>{t('home.news.eyebrow')}</Eyebrow>
            <h2 className="heading mb-4" style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.15 }}>
              {t('home.news.title1')} <span className="heading-accent">{t('home.news.title2')}</span>
            </h2>
            <p className="text-[#7A7268] text-base mb-8 leading-relaxed max-w-lg mx-auto">
              {t('home.news.desc')}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder={t('home.news.placeholder')}
                className="input-safari flex-1 px-5 py-3.5 rounded-full text-sm bg-white text-[#1C1A17] placeholder:text-[#9C9890]"
                style={{ border: '0.5px solid #E3DCCD' }}
              />
              <button type="submit" disabled={newsletterState === 'sending'} className="btn btn-gold px-7 py-3.5 whitespace-nowrap">
                {newsletterState === 'sending' ? t('home.news.sending') : `${t('home.news.subscribe')} →`}
              </button>
            </form>
            {newsletterState === 'done' ? (
              <p className="text-emerald-700 text-xs mt-4 font-medium">{t('home.news.done')}</p>
            ) : newsletterState === 'error' ? (
              <p className="text-red-600 text-xs mt-4">{t('home.news.error')}</p>
            ) : (
              <p className="text-[#9C9890] text-xs mt-4">{t('home.news.privacy')}</p>
            )}
          </Reveal>
        </section>

        {/* ── SPLIT CTA ────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div
              className="min-h-[50vh] lg:min-h-[580px] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=960&q=85')" }}
            />
            <Reveal className="flex flex-col justify-center px-10 py-16 lg:px-16 h-full" style={{ background: '#FFF1E6' }}>
              <Eyebrow>{t('home.cta.eyebrow')}</Eyebrow>
              <h2 className="heading text-[#1C1A17] mb-6" style={{ fontSize: 'clamp(30px, 5vw, 50px)', lineHeight: 1.1 }}>
                {t('home.cta.line1')}<br />
                {t('home.cta.line2')}<br />
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#E75A08' }}>{t('home.cta.line3')}</span>
              </h2>
              <p className="text-[#6B6560] text-base leading-relaxed mb-8 max-w-sm">
                {t('home.cta.desc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/packages" className="btn btn-gold px-8 py-4">
                  {t('home.cta.browse')} →
                </Link>
                <Link to="/contact" className="btn btn-light px-8 py-4">
                  {t('home.cta.talk')}
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-[#FFD9B3]">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
                  ].map((src, i) => (
                    <img key={i} src={src} alt={t('home.cta.travellerAlt')} className="w-8 h-8 rounded-full object-cover" style={{ border: '2px solid #FFF1E6' }} />
                  ))}
                </div>
                <p className="text-[#9C9890] text-sm">
                  {t('home.cta.joinBefore')} <span className="text-[#1C1A17] font-medium">{t('home.cta.joinCount')}</span> {t('home.cta.joinAfter')}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </div>
  )
}
