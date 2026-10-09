import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import useSeo from '../hooks/useSeo'
import { useLanguage } from '../hooks/useLanguage'

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
  const { t } = useLanguage()
  useSeo({
    title: t('careers.seoTitle'),
    description: t('careers.seoDesc'),
  })

  const perks = [
    { icon: 'globe', title: t('careers.p1.title'), text: t('careers.p1.text') },
    { icon: 'growth', title: t('careers.p2.title'), text: t('careers.p2.text') },
    { icon: 'heart', title: t('careers.p3.title'), text: t('careers.p3.text') },
  ]

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] overflow-x-hidden font-sans">
      <Navbar />

      <PageHero
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1500&q=70"
        subtitle={t('careers.heroSub')}
      >
        {t('careers.hero1')}<br />
        <span className="heading-accent">{t('careers.hero2')}</span>
      </PageHero>

      {/* Why work with us */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="flex justify-center"><div className="eyebrow mb-4">{t('careers.whyEyebrow')}</div></div>
          <h2 className="heading" style={{ fontSize: 'clamp(28px, 5vw, 46px)', lineHeight: 1.1 }}>
            {t('careers.whyTitle1')} <span className="heading-accent">{t('careers.whyTitle2')}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div key={perk.title} className="card-surface !rounded-2xl p-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}
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
            <div className="flex justify-center"><div className="eyebrow mb-4">{t('careers.openEyebrow')}</div></div>
            <h2 className="heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.1 }}>
              {t('careers.openTitle1')} <span className="heading-accent">{t('careers.openTitle2')}</span>
            </h2>
          </div>

          <div
            className="rounded-3xl px-8 py-16 text-center"
            style={{ background: '#fff', border: '0.5px solid #E3DCCD' }}
          >
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6"
              style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}
            >
              <Icon name="briefcase" size={30} />
            </div>
            <h3 className="text-xl mb-3" style={{ ...serif, fontWeight: 700 }}>
              {t('careers.noneTitle')}
            </h3>
            <p className="text-[#7A7268] text-sm leading-relaxed max-w-md mx-auto">
              {t('careers.noneDesc')}
            </p>
          </div>

          {/* Stay-in-touch note */}
          <div className="flex items-center justify-center gap-2.5 mt-8 text-sm text-[#7A7268]">
            <span style={{ color: '#C2470A' }}><Icon name="bell" size={16} /></span>
            {t('careers.notice')}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
