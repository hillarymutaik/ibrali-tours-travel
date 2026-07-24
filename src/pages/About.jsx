import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import useSeo from '../hooks/useSeo'

const serif = { fontFamily: "'Playfair Display', serif" }

function Icon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  const paths = {
    award: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    bulb: (
      <>
        <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z" />
        <line x1="9" y1="21" x2="15" y2="21" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    eye: (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    briefcase: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="2" y1="13" x2="22" y2="13" />
      </>
    ),
    bank: (
      <>
        <polygon points="12 3 21 9 3 9" />
        <line x1="5" y1="9" x2="5" y2="21" />
        <line x1="9" y1="9" x2="9" y2="21" />
        <line x1="15" y1="9" x2="15" y2="21" />
        <line x1="19" y1="9" x2="19" y2="21" />
        <line x1="3" y1="21" x2="21" y2="21" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    cap: (
      <>
        <path d="M22 10 12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
        <path d="M22 10v6" />
      </>
    ),
    church: (
      <>
        <path d="M12 2v3" />
        <path d="M9 7l3-3 3 3" />
        <path d="M5 21V11l7-5 7 5v10" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <line x1="4" y1="21" x2="20" y2="21" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    ),
    map: (
      <>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}

export default function About() {
  useSeo({
    title: 'About Us',
    description: 'IBRALI Tours & Travel is a Kenyan travel management company providing personalized domestic and international travel solutions for individuals, corporate organizations, institutions, and special interest groups.',
  })

  const values = [
    {
      icon: 'award',
      title: 'Professionalism',
      text: 'We are committed to delivering excellence with expertise and accountability.',
    },
    {
      icon: 'shield',
      title: 'Integrity',
      text: 'We operate with honesty, transparency, and strong ethical standards.',
    },
    {
      icon: 'bulb',
      title: 'Innovation',
      text: 'We embrace creativity and continuous improvement to lead in travel experiences.',
    },
    {
      icon: 'users',
      title: 'Teamwork',
      text: 'We collaborate, support, and succeed together to create unforgettable experiences.',
    },
  ]

  const whoWeServe = [
    { icon: 'briefcase', title: 'Corporate Organizations', text: 'Travel management, conferences, and executive travel.' },
    { icon: 'bank', title: 'Government Institutions', text: 'Official travel coordination and event logistics.' },
    { icon: 'globe', title: 'NGOs & Development Organizations', text: 'Mission travel and conference support.' },
    { icon: 'cap', title: 'Schools & Universities', text: 'Educational tours and excursions.' },
    { icon: 'church', title: 'Religious Organizations', text: 'Pilgrimages, retreats, and group travel.' },
    { icon: 'heart', title: 'Families & Leisure Travelers', text: 'Vacations, holidays, and memorable experiences.' },
    { icon: 'map', title: 'Tour Groups', text: 'Group tours and special interest travel experiences.' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        image="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1500&q=70"
        subtitle="IBRALI Tours & Travel is a premier travel and tourism company based in Nairobi, Kenya, dedicated to delivering exceptional local and international travel experiences with professionalism, integrity, and innovation."
      >
        Exploring the world,<br />
        <span className="heading-accent">protecting its wonders</span>
      </PageHero>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow mb-4">Who we are</div>
            <h2 className="heading" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
              Built for journeys that feel personal.
            </h2>
            <p className="text-[#6B6560] leading-relaxed mt-6">
              IBRALI Tours &amp; Travel is a Kenyan travel management company providing personalized domestic and international travel solutions for individuals, corporate organizations, institutions, and special interest groups. Every journey we plan is built to be exciting, comfortable, and unforgettable.
            </p>
            <p className="text-[#6B6560] leading-relaxed mt-4">
              From our home in Nairobi, our goal is to create memorable travel experiences while promoting sustainable tourism and fostering meaningful connections between people, cultures, and destinations — from Kenya's natural beauty to curated journeys across the Democratic Republic of Congo, Dubai, and the rest of the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-9">
              <Link to="/packages" className="btn btn-dark px-7 py-3.5">
                Explore packages
              </Link>
              <Link to="/contact" className="btn btn-light px-7 py-3.5">
                Talk to us
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="min-h-[360px] rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=700&q=75')" }}
            />
            <div className="space-y-4 pt-10">
              <div
                className="min-h-[170px] rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=700&q=75')" }}
              />
              <div className="rounded-2xl p-6 text-white" style={{ background: '#E75A08' }}>
                <p style={{ ...serif, fontWeight: 700, fontSize: '38px', color: '#fff' }}>10+</p>
                <p className="text-white/75 text-xs uppercase tracking-[1.5px] mt-1">Years of industry expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-surface !rounded-2xl p-9">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}
            >
              <Icon name="target" />
            </div>
            <div className="eyebrow mb-3">Our mission</div>
            <p className="text-[#1C1A17] text-lg leading-relaxed" style={serif}>
              To provide personalized local and international travel experiences that create lasting memories while delivering exceptional service and value.
            </p>
          </div>

          <div className="rounded-2xl p-9 text-white" style={{ background: '#E75A08' }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}
            >
              <Icon name="eye" />
            </div>
            <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[2px] mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.85)' }} />
              Our vision
            </div>
            <p className="text-white/95 text-lg leading-relaxed" style={serif}>
              To redefine travel experiences through personalized, innovative, and sustainable tourism solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="px-6 py-20" style={{ background: '#FFF1E6' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="eyebrow mb-4">Our core values</div>
            <h2 className="heading text-[#1C1A17]" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
              Guided by values, <span className="heading-accent">driven by excellence.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item) => (
              <div key={item.title} className="p-7 rounded-2xl bg-white" style={{ border: '0.5px solid #FFD9B3' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: '#FFF4ED', color: '#C2470A', border: '0.5px solid #FFD9B3' }}>
                  <Icon name={item.icon} />
                </div>
                <h3 className="text-[#1C1A17] text-lg font-medium mb-3">{item.title}</h3>
                <p className="text-[#7A7268] text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message from the founder — teaser, full message lives on its own page */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Link
          to="/founder"
          className="group card-surface !rounded-3xl p-8 lg:p-10 flex flex-col sm:flex-row items-center gap-8"
        >
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: '3px solid rgba(231, 90, 8,0.45)', boxShadow: '0 24px 60px -24px rgba(28,26,23,0.35)' }}
          >
            <img
              src="/ibrali-tours-travel/founder.jpg"
              alt="Hon. Lingo Ngbandani Prince Ibrahim, Founder & Managing Director of Ibrali Tours & Travel"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <p className="text-[#1C1A17] text-lg leading-relaxed" style={serif}>
              “Our goal is not merely to book travel, but to create meaningful experiences that connect people, cultures, and opportunities.”
            </p>
            <p className="mt-4 text-sm font-semibold text-[#1C1A17]">
              Hon. Lingo Ngbandani Prince Ibrahim
              <span className="font-normal text-[#9C9890]"> · Founder &amp; Managing Director</span>
            </p>
          </div>
          <span
            className="link-underline flex-shrink-0 whitespace-nowrap"
          >
            Read the full message <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </section>

      {/* Who we serve */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center"><div className="eyebrow mb-4">Partner with us</div></div>
            <h2 className="heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
              Who we <span className="heading-accent">proudly serve</span>
            </h2>
            <p className="text-[#6B6560] leading-relaxed mt-4 max-w-2xl mx-auto">
              From corporate boardrooms to school excursions, pilgrimages, and family holidays — we tailor every itinerary to who's travelling.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whoWeServe.map((item) => (
              <div key={item.title} className="card-surface !rounded-2xl p-7">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}
                >
                  <Icon name={item.icon} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#1C1A17] mb-1.5">{item.title}</h3>
                <p className="text-[#7A7268] text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
