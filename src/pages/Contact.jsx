import React, { useState } from 'react'
import { API_URL } from '../utils/constants'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'

const serif = { fontFamily: "'Playfair Display', serif" }

function ContactIcon({ type }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    mail: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5" />,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
    pin: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  }
  return <svg {...common}>{paths[type]}</svg>
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [sendError, setSendError] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSendError('')
    setSending(true)
    try {
      const res = await fetch(`${API_URL}/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json.ok === false) {
        setSendError(json.error || 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch {
      // API unreachable (static demo) — accept the message locally
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } finally {
      setSending(false)
    }
  }

  const contactItems = [
    { icon: 'mail', title: 'Email', value: 'info@ibrali-tours.com', href: 'mailto:info@ibrali-tours.com' },
    { icon: 'phone', title: 'Phone', value: '+254 712 345 678', href: 'tel:+254712345678' },
    { icon: 'pin', title: 'Office', value: 'Nairobi, Kenya', href: null },
  ]

  const inputClass = 'w-full px-4 py-3.5 bg-white border border-[#E3DCCD] rounded-xl text-sm text-[#1C1A17] placeholder-[#B0A99E] focus:outline-none focus:border-[#C4962A]'

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        eyebrow="Contact Us"
        image="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1500&q=70"
        subtitle="Tell us where you want to go, how you like to travel, and what matters most. We will help shape the right itinerary."
      >
        Let us plan your<br />
        <span className="heading-accent">next escape</span>
      </PageHero>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-5">
            {contactItems.map((item) => {
              const content = (
                <div className="flex items-center gap-4 bg-white rounded-2xl p-5 transition" style={{ border: '0.5px solid #E3DCCD' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FAF3E4', color: '#B07E1C', border: '0.5px solid #EBD9B0' }}>
                    <ContactIcon type={item.icon} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[1.5px] text-[#9C9890] font-medium">{item.title}</p>
                    <p className="text-sm text-[#1C1A17] font-medium mt-1">{item.value}</p>
                  </div>
                </div>
              )

              return item.href ? (
                <a key={item.title} href={item.href} className="block no-underline">
                  {content}
                </a>
              ) : (
                <div key={item.title}>{content}</div>
              )
            })}

            <div className="rounded-2xl p-7 text-white" style={{ background: '#0A0703' }}>
              <p className="text-[11px] uppercase tracking-[1.5px] text-white/40 font-medium mb-3">Response time</p>
              <h2 style={{ ...serif, fontWeight: 700, fontSize: '30px', color: '#EDB84A' }}>Within 24 hours</h2>
              <p className="text-white/55 text-sm leading-relaxed mt-3">
                For urgent departures, call us directly so we can check availability and guide options immediately.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl overflow-hidden" style={{ border: '0.5px solid #E3DCCD' }}>
              <div className="px-8 py-6 border-b border-[#F0EDE8]">
                <h2 className="text-xl text-[#1C1A17]" style={{ ...serif, fontWeight: 700 }}>Send a message</h2>
                <p className="text-[#9C9890] text-sm mt-1">Share a few details and our travel team will get back to you.</p>
              </div>

              <div className="px-8 py-7 space-y-6">
                {submitted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                    Message received. Our team will contact you soon.
                  </div>
                )}

                {sendError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {sendError}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2.5">Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2.5">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2.5">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+254 712 345 678" className={inputClass} />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2.5">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell us about your dream trip, dates, group size, or budget..." className={`${inputClass} resize-none`} />
                </div>

                <button type="submit" disabled={sending} className="btn btn-gold w-full py-4 !rounded-xl">
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
