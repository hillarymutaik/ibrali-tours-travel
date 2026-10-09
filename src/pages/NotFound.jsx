import React from 'react'
import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useSeo from '../hooks/useSeo'

export default function NotFound() {
  const { t } = useLanguage()
  useSeo({ title: t('notfound.seoTitle'), description: t('notfound.seoDesc') })
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F1] font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-28">
        <div className="text-center max-w-lg">

          {/* Large 404 */}
          <p className="text-[140px] sm:text-[180px] font-black leading-none text-[#EAE6DF] select-none">
            404
          </p>

          {/* Icon + message overlaid */}
          <div className="-mt-10 relative z-10">
            <div
              className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-[#FFD9B3]/60 text-white"
              style={{ background: 'var(--color-gold)' }}
            >
              <Compass size={28} strokeWidth={1.8} />
            </div>

            <h1 className="heading text-4xl text-[#1C1A17] mb-3">
              {t('notfound.title1')} <span className="heading-accent">{t('notfound.title2')}</span>
            </h1>
            <p className="text-[#6B6560] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              {t('notfound.desc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="btn btn-dark px-8 py-3.5">
                {t('notfound.home')}
              </Link>
              <Link to="/packages" className="btn btn-light px-8 py-3.5">
                {t('notfound.explore')}
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
