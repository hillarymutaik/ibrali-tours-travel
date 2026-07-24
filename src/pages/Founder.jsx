import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import useSeo from '../hooks/useSeo'

const serif = { fontFamily: "'Playfair Display', serif" }

export default function Founder() {
  useSeo({
    title: 'Message From Our Founder',
    description: 'A message from Hon. Lingo Ngbandani Prince Ibrahim, Founder & Managing Director of Ibrali Tours & Travel.',
  })

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1500&q=70"
        subtitle="The passion and principles driving Ibrali Tours & Travel, in the words of our founder and managing director."
      >
        A message from<br />
        <span className="heading-accent">our founder</span>
      </PageHero>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[320px_1fr] gap-14 items-center">
          <div className="mx-auto lg:mx-0">
            <div
              className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden"
              style={{ border: '3px solid rgba(231, 90, 8,0.45)', boxShadow: '0 24px 60px -24px rgba(28,26,23,0.35)' }}
            >
              <img
                src="/ibrali-tours-travel/founder.jpg"
                alt="Hon. Lingo Ngbandani Prince Ibrahim, Founder & Managing Director of Ibrali Tours & Travel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p
              className="text-[#1C1A17] leading-relaxed"
              style={{ ...serif, fontSize: 'clamp(20px, 2.6vw, 28px)' }}
            >
              “Welcome to IBRALI Tours &amp; Travel. In an ever-evolving travel landscape, our commitment remains steadfast: delivering exceptional travel experiences characterized by safety, quality, reliability, and meticulous attention to detail.”
            </p>
            <p className="text-[#6B6560] leading-relaxed mt-6 text-base">
              As a growing travel management company, we understand that every traveler is unique. Our dedicated team is committed to providing personalized travel solutions that exceed expectations — from the moment you make an inquiry to the moment you return home. Our goal is not merely to book travel, but to create meaningful experiences that connect people, cultures, and opportunities.
            </p>
            <p className="text-[#6B6560] leading-relaxed mt-4 text-base">
              We look forward to serving you and helping you explore the world with confidence.
            </p>
            <p className="mt-8 text-base font-semibold text-[#1C1A17]" style={serif}>
              Hon. Lingo Ngbandani Prince Ibrahim
            </p>
            <p className="text-xs uppercase tracking-[1.5px] text-[#9C9890] mt-1">
              Founder &amp; Managing Director · Ibrali Tours &amp; Travel
            </p>
          </div>
        </div>
      </section>

      {/* Continue exploring */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto card-surface !rounded-3xl px-8 py-12 text-center">
          <div className="eyebrow mb-4 flex justify-center">Keep exploring</div>
          <h2 className="heading" style={{ fontSize: 'clamp(24px, 3.5vw, 34px)' }}>
            Learn more <span className="heading-accent">about Ibrali</span>
          </h2>
          <p className="text-[#6B6560] leading-relaxed mt-4 max-w-xl mx-auto">
            Discover our story, mission, and the values that guide every trip we plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/about" className="btn btn-dark px-7 py-3.5">
              Our story
            </Link>
            <Link to="/contact" className="btn btn-light px-7 py-3.5">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
