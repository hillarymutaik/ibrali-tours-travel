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
    map: (
      <>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}

export default function About() {
  const values = [
    {
      icon: 'map',
      title: 'Local knowledge',
      text: 'We design trips with people who know the routes, seasons, wildlife patterns, and communities behind every destination.',
    },
    {
      icon: 'heart',
      title: 'Responsible travel',
      text: 'Our journeys are built around respect for culture, conservation, and the families who call these landscapes home.',
    },
    {
      icon: 'shield',
      title: 'Clear support',
      text: 'From first enquiry to the ride back from the airport, our team stays reachable and practical about every detail.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        eyebrow="About Ibrali Tours"
        image="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1500&q=70"
        subtitle="Ibrali Tours & Travel creates thoughtful safari, air travel, beach, culture, and adventure experiences across Kenya and East Africa — including charter and scheduled flights to every destination we serve."
      >
        Travel led by<br />
        <span className="heading-accent">people who care</span>
      </PageHero>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow mb-4">Our story</div>
            <h2 className="heading" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
              Built for journeys that feel personal.
            </h2>
            <p className="text-[#6B6560] leading-relaxed mt-6">
              We started with a simple belief: the best trips are not rushed checklists. They are well-paced, human, and rooted in the places they visit.
            </p>
            <p className="text-[#6B6560] leading-relaxed mt-4">
              Our team connects travellers with trusted guides, comfortable stays, and flexible itineraries that leave room for real discovery.
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
                <p style={{ ...serif, fontWeight: 700, fontSize: '38px', color: '#EDB84A' }}>12+</p>
                <p className="text-white/50 text-xs uppercase tracking-[1.5px] mt-1">Years crafting East African travel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20" style={{ background: '#0A0703' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="eyebrow eyebrow-light mb-4">What guides us</div>
            <h2 className="heading text-white" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
              Careful planning, honest advice, memorable days.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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

      <Footer />
    </div>
  )
}
