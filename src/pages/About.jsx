import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'

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
  }

  return <svg {...common}>{paths[name]}</svg>
}

export default function About() {
  const values = [
    {
      icon: 'award',
      title: 'Professionalism',
      text: 'We are committed to delivering excellence with expertise and accountability.',
    },
    {
      icon: 'users',
      title: 'Teamwork',
      text: 'We collaborate, support, and succeed together to create unforgettable experiences.',
    },
    {
      icon: 'bulb',
      title: 'Innovation',
      text: 'We embrace creativity and continuous improvement to lead in travel experiences.',
    },
    {
      icon: 'shield',
      title: 'Integrity',
      text: 'We operate with honesty, transparency, and strong ethical standards.',
    },
  ]

  const clients = [
    'Corporate Organizations',
    'Schools',
    'NGOs',
    'Government Institutions',
    'Families',
    'International Tourists',
  ]

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        eyebrow="About Ibrali Tours & Travel"
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
              We believe every journey should be exciting, comfortable, and unforgettable. Our team is dedicated to exceptional travel experiences with personalized service, reliable planning, and affordable packages tailored to your needs.
            </p>
            <p className="text-[#6B6560] leading-relaxed mt-4">
              From our home in Nairobi we offer domestic travellers opportunities to explore Kenya's natural beauty, cultural richness, and scenic destinations — and connect international travellers with carefully curated journeys across East Africa and beyond.
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
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547970827-f33b90fde688?w=700&q=75')" }}
            />
            <div className="space-y-4 pt-10">
              <div
                className="min-h-[170px] rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=700&q=75')" }}
              />
              <div className="rounded-2xl p-6 text-white" style={{ background: '#0A0703' }}>
                <p style={{ ...serif, fontWeight: 700, fontSize: '38px', color: '#EDB84A' }}>10+</p>
                <p className="text-white/50 text-xs uppercase tracking-[1.5px] mt-1">Years of industry expertise</p>
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
              style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0', color: '#B07E1C' }}
            >
              <Icon name="target" />
            </div>
            <div className="eyebrow mb-3">Our mission</div>
            <p className="text-[#1C1A17] text-lg leading-relaxed" style={serif}>
              To sustainably connect millions with personalized local and international travel and tour experiences, emphasizing human connection and comprehensive services.
            </p>
          </div>

          <div className="rounded-2xl p-9 text-white" style={{ background: '#0A0703', border: '0.5px solid rgba(196,150,42,0.25)' }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: '#1A1610', color: '#EDB84A', border: '0.5px solid rgba(196,150,42,0.25)' }}
            >
              <Icon name="eye" />
            </div>
            <div className="eyebrow eyebrow-light mb-3">Our vision</div>
            <p className="text-white/90 text-lg leading-relaxed" style={serif}>
              To redefine travel and vacation experiences for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="px-6 py-20" style={{ background: '#0A0703' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="eyebrow eyebrow-light mb-4">Our core values</div>
            <h2 className="heading text-white" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
              Guided by values, <span className="heading-accent">driven by excellence.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item) => (
              <div key={item.title} className="p-7 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(196,150,42,0.2)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: '#1A1610', color: '#EDB84A', border: '0.5px solid rgba(196,150,42,0.25)' }}>
                  <Icon name={item.icon} />
                </div>
                <h3 className="text-white text-lg font-medium mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message from the founder */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-center">
          <div className="mx-auto lg:mx-0">
            <div
              className="w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden"
              style={{ border: '3px solid rgba(196,150,42,0.45)', boxShadow: '0 24px 60px -24px rgba(28,26,23,0.35)' }}
            >
              <img
                src="/ibrali-tours-travel/founder.jpg"
                alt="Hon. Lingo Ngbandani Ibrahim Prince, Chairman of Ibrali Tours & Travel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="eyebrow mb-4">Message from the founder</div>
            <p
              className="text-[#1C1A17] leading-relaxed"
              style={{ ...serif, fontSize: 'clamp(18px, 2.4vw, 24px)' }}
            >
              “In an ever-evolving travel landscape, our commitment remains steadfast: delivering exceptional travel experiences marked by safety, quality, and meticulous attention to detail. With over 10 years of industry expertise, we understand that every traveler is unique — our team delivers personalized service that exceeds expectations, from the moment you inquire to the moment you return home.”
            </p>
            <p className="mt-6 text-sm font-semibold text-[#1C1A17]">
              Hon. Lingo Ngbandani Ibrahim Prince
            </p>
            <p className="text-xs uppercase tracking-[1.5px] text-[#9C9890] mt-1">
              Chairman · Ibrali Tours &amp; Travel
            </p>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto card-surface !rounded-3xl px-8 py-12 text-center">
          <div className="flex justify-center"><div className="eyebrow mb-4">Travel experiences globally</div></div>
          <h2 className="heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
            Who we <span className="heading-accent">proudly serve</span>
          </h2>
          <p className="text-[#6B6560] leading-relaxed mt-4 max-w-2xl mx-auto">
            We serve corporate organizations, schools, NGOs, government institutions, families, and international tourists seeking dependable and unforgettable travel experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {clients.map((client) => (
              <span
                key={client}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-[#6B6560]"
                style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0' }}
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
