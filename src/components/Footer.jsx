import React from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/my-bookings', label: 'My Trips' },
  { to: '/booking', label: 'Book a trip' },
]

const CONTACT_INFO = [
  { icon: '✉', label: 'info@ibrali-tours.com' },
  { icon: '📞', label: '+254 712 345 678' },
  { icon: '📍', label: 'Nairobi, Kenya' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'fb' },
  { label: 'Instagram', href: '#', icon: 'ig' },
  { label: 'Twitter / X', href: '#', icon: 'tw' },
  { label: 'WhatsApp', href: '#', icon: 'wa' },
]

function SocialIcon({ icon }) {
  const paths = {
    fb: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    ig: 'M22 16a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6zm-6-9h.01M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
    tw: 'M4 4l16 16M4 20 20 4',
    wa: 'M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21',
  }
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7A6A55"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon === 'ig' ? (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="#7A6A55" />
        </>
      ) : (
        <path d={paths[icon]} />
      )}
    </svg>
  )
}

function ContactIcon({ type }) {
  const icons = {
    mail: (
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5"
        stroke="#C4962A"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    phone: (
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.04z"
        stroke="#C4962A"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    pin: (
      <>
        <path
          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
          stroke="#C4962A"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle
          cx="12"
          cy="10"
          r="3"
          stroke="#C4962A"
          strokeWidth="1.8"
          fill="none"
        />
      </>
    ),
  }

  const key = type === 'mail' ? 'mail' : type === 'phone' ? 'phone' : 'pin'
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {icons[key]}
    </svg>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        background: '#0F0C07',
        color: '#C9B99A',
        fontFamily: "'Inter', sans-serif",
        paddingTop: '64px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 32px',
        }}
      >

        {/* STATUS PILL */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '0.5px solid #2A2216',
              borderRadius: '100px',
              padding: '6px 16px',
              background: '#1A1610',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#2DB563',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '11px',
                color: '#7A6A55',
                letterSpacing: '0.3px',
              }}
            >
              Booking open · Kenya, Tanzania &amp; beyond
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
            gap: '40px',
            marginBottom: '56px',
          }}
        >

          {/* BRAND COLUMN */}
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '26px',
                color: '#F2E2C4',
                letterSpacing: '-0.5px',
                margin: '0 0 10px',
                fontWeight: 700,
              }}
            >
              Ibrali Tours &amp; Travel
            </h1>
            <p
              style={{
                fontSize: '13px',
                color: '#7A6A55',
                lineHeight: '1.7',
                maxWidth: '240px',
                margin: '0 0 20px',
              }}
            >
              Crafting unforgettable African journeys — from the Maasai Mara to the Zanzibar coast.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Safari', 'Beach', 'Culture', 'Adventure'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: '#1E1810',
                    border: '0.5px solid #2E2418',
                    color: '#9A8A74',
                    fontSize: '11px',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* NAV COLUMN */}
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: '#7A6A55',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                margin: '0 0 20px',
              }}
            >
              Explore
            </p>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'block',
                  fontSize: '13.5px',
                  color: '#9A8A74',
                  textDecoration: 'none',
                  marginBottom: '12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#F2E2C4')}
                onMouseLeave={(e) => (e.target.style.color = '#9A8A74')}
              >
                <span style={{ fontSize: '11px', marginRight: '8px', color: '#C4962A' }}>→</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* CONTACT COLUMN */}
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: '#7A6A55',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                margin: '0 0 20px',
              }}
            >
              Get in touch
            </p>
            {[
              { type: 'mail', label: 'info@ibrali-tours.com' },
              { type: 'phone', label: '+254 712 345 678' },
              { type: 'pin', label: 'Nairobi, Kenya' },
            ].map(({ type, label }) => (
              <div
                key={type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: '#1A1610',
                    border: '0.5px solid #2A2216',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ContactIcon type={type} />
                </div>
                <span style={{ fontSize: '13px', color: '#9A8A74', lineHeight: '1.4' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* SOCIAL COLUMN */}
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: '#7A6A55',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                margin: '0 0 20px',
              }}
            >
              Follow us
            </p>
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('.social-icon-box').style.borderColor = '#C4962A'
                  e.currentTarget.querySelector('.social-label').style.color = '#F2E2C4'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('.social-icon-box').style.borderColor = '#2A2216'
                  e.currentTarget.querySelector('.social-label').style.color = '#7A6A55'
                }}
              >
                <div
                  className="social-icon-box"
                  style={{
                    width: '34px',
                    height: '34px',
                    border: '0.5px solid #2A2216',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#1A1610',
                    transition: 'border-color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <SocialIcon icon={icon} />
                </div>
                <span
                  className="social-label"
                  style={{
                    fontSize: '13px',
                    color: '#7A6A55',
                    transition: 'color 0.2s',
                  }}
                >
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ORNAMENT DIVIDER */}
        <div style={{ position: 'relative', marginBottom: '28px' }}>
          <div style={{ width: '100%', height: '0.5px', background: '#2A2216' }} />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '-5px',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#0F0C07',
              padding: '0 16px',
            }}
          >
            <div style={{ width: '40px', height: '0.5px', background: '#C4962A', opacity: 0.4 }} />
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#C4962A',
              }}
            />
            <div style={{ width: '40px', height: '0.5px', background: '#C4962A', opacity: 0.4 }} />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          style={{
            padding: '20px 0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#4A3E2E', margin: 0 }}>
            © {currentYear}{' '}
            <span style={{ color: '#7A6A55' }}>Ibrali Tours &amp; Travel</span>. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Support'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: '12px',
                  color: '#4A3E2E',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#9A8A74')}
                onMouseLeave={(e) => (e.target.style.color = '#4A3E2E')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
