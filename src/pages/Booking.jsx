import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBooking } from '../hooks/useBooking'
import { useLanguage } from '../hooks/useLanguage'
import { TOUR_PACKAGES } from '../utils/constants'
import { formatCurrency, isValidEmail, isValidPhone, generateBookingId } from '../utils/helpers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import useSeo from '../hooks/useSeo'

const NEXT_STEPS = [1, 2, 3, 4, 5]

/* Compact inline icon set */
function TrustIcon({ name }) {
  const common = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: '#C2470A', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    check: <polyline points="20 6 9 17 4 12" />,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function Booking() {
  const { t, locale } = useLanguage()
  useSeo({
    title: t('booking.seoTitle'),
    description: t('booking.seoDesc'),
  })

  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { createBooking } = useBooking()

  const [selectedPackageId, setSelectedPackageId] = useState(location.state?.packageId || '')
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    travelers: 1,
    startDate: '',
    specialRequests: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedPackage = TOUR_PACKAGES.find(p => p.id === parseInt(selectedPackageId))
  const totalPrice = selectedPackage ? selectedPackage.price * formData.travelers : 0

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] font-sans overflow-x-hidden">
        <Navbar />
        <PageHero
          image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=60"
          subtitle={t('booking.guestSub')}
        >
          {t('booking.hero1')}<br />
          <span className="heading-accent">{t('booking.hero2')}</span>
        </PageHero>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="bg-white rounded-2xl p-12" style={{ border: '0.5px solid #E3DCCD' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C2470A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#1C1A17] mb-2 heading">{t('booking.guestTitle')}</h2>
            <p className="text-[#6B6560] text-sm mb-8 max-w-xs mx-auto leading-relaxed">
              {t('booking.guestDesc')}
            </p>
            <Link
              to="/profile"
              state={{ from: '/booking', ...location.state }}
              className="btn btn-gold px-8 py-3.5"
            >
              {t('common.signInArrow')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'travelers' ? parseInt(value) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!selectedPackageId) { setError(t('booking.err.selectPackage')); return }
      if (!formData.fullName || !formData.email || !formData.phone || !formData.startDate) {
        setError(t('booking.err.required')); return
      }
      if (!isValidEmail(formData.email)) { setError(t('common.invalidEmail')); return }
      if (!isValidPhone(formData.phone)) { setError(t('common.invalidPhone')); return }

      const bookingData = {
        id: generateBookingId(),
        userId: user?.id || null,
        packageId: selectedPackageId,
        packageTitle: selectedPackage.title,
        ...formData,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      // Persists via the PHP/MySQL API; guests are stored as guest bookings
      await createBooking(bookingData)

      setSubmitted(true)
      setFormData({ fullName: user?.name || '', email: user?.email || '', phone: user?.phone || '', travelers: 1, startDate: '', specialRequests: '' })
      setSelectedPackageId('')
      setTimeout(() => { setSubmitted(false); navigate('/my-bookings') }, 3000)
    } catch (err) {
      setError(err.message ? t(`common.msg.${err.message}`, err.message) : t('common.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  const labelCls = "block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2.5"
  const inputCls = "w-full px-4 py-3.5 bg-white border border-[#E3DCCD] rounded-xl text-sm text-[#1C1A17] placeholder-[#B0A99E] input-safari"
  const gold = '#E75A08'

  const packageTitle = (p) => t(`pkg.${p.id}.title`, p.title)
  const packageDestination = (p) => t(`pkg.${p.id}.destination`, p.destination)

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C1A17] font-sans overflow-x-hidden">
      <Navbar />

      {/* ── HERO HEADER ─────────────────────────────────── */}
      <PageHero
        image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=60"
        subtitle={t('booking.heroSub')}
      >
        {t('booking.hero1')}<br />
        <span className="heading-accent">{t('booking.hero2')}</span>
      </PageHero>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="max-w-6xl mx-auto">

          <div className="grid lg:grid-cols-5 gap-10">

            {/* ── FORM ───────────────────────────────────── */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl overflow-hidden" style={{ border: '0.5px solid #E3DCCD' }}>

                <div className="px-8 py-6 border-b border-[#F0EDE8]">
                  <h2 className="heading text-xl text-[#1C1A17]">{t('booking.details')}</h2>
                  <p className="text-[#9C9890] text-sm mt-1">{t('booking.requiredA')} <span style={{ color: gold }}>*</span> {t('booking.requiredB')}</p>
                </div>

                <div className="px-8 py-7 space-y-7">

                  {submitted && (
                    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-4 animate-fadeIn">
                      <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-lg">✓</span>
                      <div>
                        <p className="font-medium text-emerald-800">{t('booking.submitted')}</p>
                        <p className="text-emerald-600 text-sm">{t('booking.redirecting')}</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 animate-fadeIn">
                      <span className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 text-lg">!</span>
                      <div>
                        <p className="font-medium text-red-800">{t('booking.errTitle')}</p>
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Package selector */}
                  <div>
                    <label className={labelCls}>{t('booking.package')} <span style={{ color: gold }}>*</span></label>
                    <div className="relative">
                      <select
                        value={selectedPackageId}
                        onChange={e => setSelectedPackageId(e.target.value)}
                        className={`${inputCls} pr-10 font-medium appearance-none cursor-pointer`}
                      >
                        <option value="">{t('booking.selectPackage')}</option>
                        {TOUR_PACKAGES.map(p => (
                          <option key={p.id} value={p.id}>
                            {packageTitle(p)} · {packageDestination(p)} · {formatCurrency(p.price, 'USD', locale)}{t('common.perPerson')}
                          </option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9890]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>{t('booking.fullName')} <span style={{ color: gold }}>*</span></label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Jane Doe" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t('contact.email')} <span style={{ color: gold }}>*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" className={inputCls} />
                    </div>
                  </div>

                  {/* Phone + Start date */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>{t('contact.phone')} <span style={{ color: gold }}>*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+254 786 000 100" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t('booking.startDate')} <span style={{ color: gold }}>*</span></label>
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputCls} />
                    </div>
                  </div>

                  {/* Travelers */}
                  <div>
                    <label className={labelCls}>{t('booking.travelers')} <span style={{ color: gold }}>*</span></label>
                    <div className="relative">
                      <select name="travelers" value={formData.travelers} onChange={handleChange} className={`${inputCls} pr-10 font-medium appearance-none cursor-pointer`}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? t('booking.traveler') : t('booking.travelers')}</option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9890]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Special requests */}
                  <div>
                    <label className={labelCls}>{t('booking.specialRequests')}</label>
                    <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={3}
                      placeholder={t('booking.specialPlaceholder')}
                      className={`${inputCls} resize-none`} />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!selectedPackageId || loading}
                    className="btn btn-gold w-full py-4 !rounded-xl tracking-wide"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('booking.processing')}
                      </>
                    ) : `${t('booking.complete')} →`}
                  </button>

                </div>
              </form>
            </div>

            {/* ── SIDEBAR ────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {selectedPackage ? (
                <div className="rounded-2xl p-6 text-white animate-fadeIn" style={{ background: '#382C1C' }}>
                  <p className="text-white/40 text-[11px] font-medium uppercase tracking-[1.5px] mb-1">{t('booking.summary')}</p>
                  <h3 className="heading text-white text-lg mb-4 leading-snug">{packageTitle(selectedPackage)}</h3>

                  <div className="space-y-2.5 text-sm pb-4 mb-4" style={{ borderBottom: '0.5px solid rgba(231, 90, 8,0.2)' }}>
                    <div className="flex justify-between"><span className="text-white/50">{t('common.pricePerPerson')}</span><span className="font-medium">{formatCurrency(selectedPackage.price, 'USD', locale)}</span></div>
                    <div className="flex justify-between"><span className="text-white/50">{t('booking.travelers')}</span><span className="font-medium">{formData.travelers}</span></div>
                    <div className="flex justify-between"><span className="text-white/50">{t('detail.statDuration')}</span><span className="font-medium">{t('detail.days', null, { n: selectedPackage.duration })}</span></div>
                    <div className="flex justify-between"><span className="text-white/50">{t('detail.destination')}</span><span className="font-medium">{packageDestination(selectedPackage)}</span></div>
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="text-white/50 text-xs">{t('booking.totalTaxes')}</span>
                    <span className="heading" style={{ fontSize: '30px', color: '#F2843A' }}>{formatCurrency(totalPrice, 'USD', locale)}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '0.5px solid #E3DCCD' }}>
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C2470A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#1C1A17]">{t('booking.noPackage')}</p>
                  <p className="text-xs text-[#9C9890] mt-1">{t('booking.noPackageSub')}</p>
                </div>
              )}

              {/* Trust badges */}
              <div className="bg-white rounded-2xl p-5 space-y-3.5" style={{ border: '0.5px solid #E3DCCD' }}>
                {[
                  { icon: 'check', label: t('detail.trust.cancel'), sub: t('detail.trust.cancelSub') },
                  { icon: 'lock', label: t('booking.trust.payment'), sub: t('detail.trust.secureSub') },
                  { icon: 'bolt', label: t('booking.trust.instant'), sub: t('detail.trust.instantSub') },
                ].map(badge => (
                  <div key={badge.label} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3' }}>
                      <TrustIcon name={badge.icon} />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-[#1C1A17]">{badge.label}</p>
                      <p className="text-[11px] text-[#9C9890]">{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What's next */}
              <div className="bg-white rounded-2xl p-5" style={{ border: '0.5px solid #E3DCCD' }}>
                <p className="text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-4">{t('booking.whatNext')}</p>
                <ol className="space-y-3">
                  {NEXT_STEPS.map((n) => (
                    <li key={n} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full text-[10px] font-medium flex items-center justify-center flex-shrink-0" style={{ background: '#FFF4ED', border: '0.5px solid #FFD9B3', color: '#C2470A' }}>
                        {n}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-[#1C1A17]">{t(`booking.next${n}.title`)}</p>
                        <p className="text-[11px] text-[#9C9890]">{t(`booking.next${n}.sub`)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
