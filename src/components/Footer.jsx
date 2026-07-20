import React from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/about', label: 'About Us' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/my-bookings', label: 'My Trips' },
  { to: '/booking', label: 'Book a trip' },
]

const CONTACT_ITEMS = [
  { type: 'mail', label: 'info@ibralitravels.com', href: 'mailto:info@ibralitravels.com' },
  { type: 'phone', label: '+254 786 000 100', href: 'tel:+254786000100' },
  { type: 'phone', label: '+254 20 527 0005', href: 'tel:+254205270005' },
  { type: 'pin', label: 'Kayahwe & Galana Rd, Kilimani — P.O. Box 24646-00100, Nairobi, Kenya', href: null },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/ibralitravels', icon: 'ig' },
  { label: 'X (Twitter)', href: 'https://x.com/ibralitravels', icon: 'tw' },
  { label: 'Facebook', href: 'https://www.facebook.com/ibralitravels', icon: 'fb' },
  { label: 'YouTube', href: 'https://www.youtube.com/@ibralitravels', icon: 'yt' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ibrali-travels', icon: 'in' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@ibralitours', icon: 'tt' },
  { label: 'WhatsApp', href: 'https://wa.me/254786000100', icon: 'wa' },
]

function SocialIcon({ icon }) {
  const paths = {
    fb: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    tw: 'M4 4l16 16M4 20 20 4',
    wa: 'M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21',
    tt: 'M14.5 3v10.75a3.75 3.75 0 1 1-3.75-3.75M14.5 3c.35 2.4 2 4.3 4.5 4.7',
  }
  const compound = {
    ig: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </>
    ),
    yt: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9.5l4.5 2.5L10 14.5z" />
      </>
    ),
    in: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="3" />
        <line x1="7" y1="10.5" x2="7" y2="17" />
        <line x1="7" y1="7" x2="7" y2="7.01" />
        <path d="M11 17v-3.5a2.5 2.5 0 0 1 5 0V17" />
        <line x1="11" y1="10.5" x2="11" y2="17" />
      </>
    ),
  }
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      {compound[icon] ?? <path d={paths[icon]} />}
    </svg>
  )
}

function ContactIcon({ type }) {
  const paths = {
    mail: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5" />,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.04z" />,
    pin: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  }
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="#C4962A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  )
}

const columnTitle = 'text-[11px] font-medium uppercase tracking-[1.5px] text-[#A8916C] mb-5'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="pt-16 font-sans" style={{ background: '#382C1C', color: '#E3D4B4' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8">

        {/* STATUS PILL */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: '#463823', border: '0.5px solid #5A4930' }}>
            <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: '#2DB563' }} />
            <span className="text-[11px] tracking-wide text-[#A8916C]">
              Booking open · Kenya · East Africa · Worldwide
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 mb-14">

          {/* BRAND COLUMN */}
          <div>
            <h2 className="heading text-[26px] text-[#F2E2C4] mb-2.5">
              Ibrali Tours &amp; Travel
            </h2>
            <p className="text-[13px] italic text-[#E3D4B4] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              “Exploring the World, Protecting Its Wonders.”
            </p>
            <p className="text-[13px] text-[#A8916C] leading-relaxed max-w-[260px] mb-5">
              A premier travel and tourism company based in Nairobi, Kenya — delivering exceptional local and international travel experiences with professionalism, integrity, and innovation.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['Safaris', 'Air Travel', 'Hotels', 'Business Tourism', 'Excursions', 'Ticketing'].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] tracking-wide px-3 py-1 rounded-full text-[#C7B28D]"
                  style={{ background: '#463823', border: '0.5px solid #5A4930' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* NAV COLUMN */}
          <nav aria-label="Footer">
            <p className={columnTitle}>Explore</p>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block text-[13.5px] text-[#C7B28D] hover:text-[#F2E2C4] transition-colors mb-3"
              >
                <span className="text-[11px] mr-2" style={{ color: '#C4962A' }}>→</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CONTACT COLUMN */}
          <div>
            <p className={columnTitle}>Get in touch</p>
            {CONTACT_ITEMS.map(({ type, label, href }) => {
              const inner = (
                <>
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#463823', border: '0.5px solid #5A4930' }}
                  >
                    <ContactIcon type={type} />
                  </span>
                  <span className="text-[13px] leading-snug">{label}</span>
                </>
              )
              return href ? (
                <a key={label} href={href} className="flex items-center gap-2.5 mb-3.5 text-[#C7B28D] hover:text-[#F2E2C4] transition-colors">
                  {inner}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-2.5 mb-3.5 text-[#C7B28D]">
                  {inner}
                </div>
              )
            })}
          </div>

          {/* SOCIAL COLUMN */}
          <div>
            <p className={columnTitle}>Follow us</p>
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                className="group flex items-center gap-2.5 mb-2.5 text-[#A8916C] hover:text-[#F2E2C4] transition-colors"
              >
                <span
                  className="w-[34px] h-[34px] rounded-lg flex items-center justify-center flex-shrink-0 text-[#A8916C] border-[0.5px] border-[#5A4930] transition-colors group-hover:border-[#C4962A] group-hover:text-[#C4962A]"
                  style={{ background: '#463823' }}
                >
                  <SocialIcon icon={icon} />
                </span>
                <span className="text-[13px]">{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ORNAMENT DIVIDER */}
        <div className="relative mb-7">
          <div className="w-full h-px" style={{ background: '#5A4930' }} />
          <div
            className="absolute left-1/2 -top-[5px] -translate-x-1/2 flex items-center gap-2.5 px-4"
            style={{ background: '#382C1C' }}
          >
            <span className="w-10 h-px opacity-40" style={{ background: '#C4962A' }} />
            <span className="w-[5px] h-[5px] rounded-full" style={{ background: '#C4962A' }} />
            <span className="w-10 h-px opacity-40" style={{ background: '#C4962A' }} />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="py-5 pb-7 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-[#8F7C5D]">
            © {currentYear} <span className="text-[#A8916C]">Ibrali Tours &amp; Travel</span>. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Support'].map((item) => (
              <a key={item} href="#" className="text-xs text-[#8F7C5D] hover:text-[#C7B28D] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
