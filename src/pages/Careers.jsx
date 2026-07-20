import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'

const serif = { fontFamily: "'Playfair Display', serif" }

function Icon({ name, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  const paths = {
    briefcase: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="2" y1="13" x2="22" y2="13" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    ),
    growth: (
      <>
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <polyline points="17 6 23 6 23 12" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    mail: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </>
    ),
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function Careers() {
  const perks = [
    {
      icon: 'globe',
      title: 'Purpose-driven work',
      text: 'Help travellers explore the world while we protect its wonders — meaningful work with real impact.',
    },
    {
      icon: 'growth',
      title: 'Room to grow',
      text: 'We invest in our people with mentorship, training, and clear paths to advance across the business.',
    },
    {
      icon: 'heart',
      title: 'A team that cares',
      text: 'Collaboration, integrity, and genuine support sit at the heart of how we work together every day.',
    },
  ]

  const applyHref =
    'mailto:info@ibralitravels.com?subject=Open%20Application%20%E2%80%94%20Careers%20at%20Ibrali%20Tours%20%26%20Travel'

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        eyebrow="Careers"
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1500&q=70"
        subtitle="Join a premier travel and tourism company built on professionalism, integrity, and innovation. When roles open up, you'll find them here."
      >
        Build your career<br />
        <span className="heading-accent">with Ibrali</span>
      </PageHero>

      {/* Why work with us */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="flex justify-center"><div className="eyebrow mb-4">Why join us</div></div>
          <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 46px)', lineHeight: 1.1 }}>
            Grow with a team that <span className="heading-accent">loves what it does</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div key={perk.title} className="card-surface !rounded-2xl p-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0', color: '#B07E1C' }}
              >
                <Icon name={perk.icon} />
              </div>
              <h3 className="text-lg font-medium mb-2">{perk.title}</h3>
              <p className="text-[#7A7268] text-sm leading-relaxed">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open positions — none at the moment */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex justify-center"><div className="eyebrow mb-4">Open positions</div></div>
            <h2 className="heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.1 }}>
              Current <span className="heading-accent">openings</span>
            </h2>
          </div>

          <div
            className="rounded-3xl px-8 py-16 text-center"
            style={{ background: '#fff', border: '0.5px solid #E3DCCD' }}
          >
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6"
              style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0', color: '#B07E1C' }}
            >
              <Icon name="briefcase" size={30} />
            </div>
            <h3 className="text-xl mb-3" style={{ ...serif, fontWeight: 700 }}>
              No open positions at the moment
            </h3>
            <p className="text-[#7A7268] text-sm leading-relaxed max-w-md mx-auto">
              We don't have any vacancies right now, but we're always glad to hear from talented,
              passionate people. Send us your CV and we'll keep it on file for future opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a href={applyHref} className="btn btn-gold px-7 py-3.5">
                <Icon name="mail" size={17} /> Send an open application
              </a>
              <Link to="/contact" className="btn btn-light px-7 py-3.5">
                Get in touch
              </Link>
            </div>
          </div>

          {/* Stay-in-touch note */}
          <div className="flex items-center justify-center gap-2.5 mt-8 text-sm text-[#7A7268]">
            <span style={{ color: '#B07E1C' }}><Icon name="bell" size={16} /></span>
            New roles are posted on this page — check back soon.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
