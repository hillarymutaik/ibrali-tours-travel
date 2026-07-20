import React from 'react'

/**
 * Shared dark page header used by interior pages (About, Contact, …).
 * Keeps the eyebrow + serif headline + subtitle consistent across the site.
 *
 * Props:
 *  - eyebrow:  small uppercase label above the title
 *  - image:    background photo URL (rendered low-opacity behind the gradient)
 *  - subtitle: supporting paragraph under the title
 *  - actions:  optional right-aligned content (e.g. a button), pushes the header into a row layout
 *  - children: the headline (use <span className="heading-accent"> for the gold italic part)
 */
export default function PageHero({ eyebrow, image, subtitle, actions, children }) {
  return (
    <section className="relative pt-28 pb-20 px-6 overflow-hidden" style={{ background: '#382C1C' }}>
      {image && (
        <div
          className="absolute inset-0 opacity-45 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(56,44,28,0.25), rgba(56,44,28,0.92))' }}
      />
      <div className={`relative max-w-7xl mx-auto ${actions ? 'flex flex-col sm:flex-row sm:items-end justify-between gap-6' : ''}`}>
        <div>
          {eyebrow && <div className="eyebrow eyebrow-light mb-5">{eyebrow}</div>}
          <h1 className="heading text-white leading-[1.0]" style={{ fontSize: 'clamp(40px, 7vw, 70px)' }}>
            {children}
          </h1>
          {subtitle && (
            <p className="text-white/60 mt-6 text-base max-w-xl leading-relaxed">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </section>
  )
}
