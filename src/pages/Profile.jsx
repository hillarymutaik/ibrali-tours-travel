import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isValidEmail, isValidPhone } from '../utils/helpers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const serif = { fontFamily: "'Playfair Display', serif" }
const gold = '#C4962A'

/* Compact inline icon set */
function Icon({ name }) {
  const common = { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: '#B07E1C', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
    phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><line x1="11" y1="18" x2="13" y2="18" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function ActionIcon({ name }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    trips: <><path d="M6 8h12l1 12H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    plane: <path d="M2 12l20-7-7 20-3-8-8-3z" />,
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, login, register, logout } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'password123',
    name: '',
    phone: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        if (!formData.email || !formData.password) { setError('Email and password are required'); return }
        if (!isValidEmail(formData.email)) { setError('Invalid email format'); return }
        await login(formData.email, formData.password)
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
          setError('All fields are required'); return
        }
        if (!isValidEmail(formData.email)) { setError('Invalid email format'); return }
        if (!isValidPhone(formData.phone)) { setError('Invalid phone number'); return }
        await register(formData)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const labelCls = "block text-[11px] font-medium text-[#6B6560] uppercase tracking-[1.5px] mb-2"
  const inputCls = "w-full px-4 py-3.5 bg-white border border-[#E3DCCD] rounded-xl text-sm text-[#1C1A17] placeholder-[#B0A99E] input-safari"

  /* ── LOGGED-IN VIEW ─────────────────────────────────────── */
  if (user) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] font-sans">
        <Navbar />

        {/* Dark hero */}
        <section className="relative pt-28 pb-20 px-6 overflow-hidden" style={{ background: '#0A0703' }}>
          <div className="absolute inset-0 opacity-15 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=60')" }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,7,3,0.4), #0A0703)' }} />
          <div className="relative max-w-7xl mx-auto flex items-end gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: gold, color: '#0A0703', ...serif, fontWeight: 700, fontSize: '38px' }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-6 h-px" style={{ background: gold }} />
                <span className="text-[11px] font-medium uppercase" style={{ color: '#EDB84A', letterSpacing: '2.5px' }}>My Profile</span>
              </div>
              <h1 className="text-white leading-tight" style={{ ...serif, fontWeight: 700, fontSize: 'clamp(34px, 5vw, 50px)' }}>{user.name}</h1>
              <p className="text-white/50 text-sm mt-1">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Profile content */}
        <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8">

          {/* Info card */}
          <div className="md:col-span-2 bg-white rounded-2xl overflow-hidden" style={{ border: '0.5px solid #E3DCCD' }}>
            <div className="px-7 py-5 border-b border-[#F0EDE8]">
              <h2 className="text-lg text-[#1C1A17]" style={{ ...serif, fontWeight: 700 }}>Account information</h2>
            </div>
            <div className="px-7 py-6 space-y-5">
              {[
                { label: 'Full name', value: user.name, icon: 'user' },
                { label: 'Email address', value: user.email, icon: 'mail' },
                { label: 'Phone number', value: user.phone || '—', icon: 'phone' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0' }}>
                    <Icon name={icon} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#9C9890] uppercase tracking-[1.5px]">{label}</p>
                    <p className="text-[#1C1A17] font-medium text-sm mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="rounded-2xl p-6 text-white" style={{ background: '#0A0703' }}>
              <p className="text-white/40 text-[11px] font-medium uppercase tracking-[1.5px] mb-3">Quick actions</p>
              {[
                { to: '/my-bookings', label: 'My trips', icon: 'trips', border: true },
                { to: '/packages', label: 'Browse packages', icon: 'globe', border: true },
                { to: '/booking', label: 'Book a safari', icon: 'plane', border: false },
              ].map(({ to, label, icon, border }) => (
                <Link key={to} to={to}
                  className={`flex items-center justify-between gap-3 w-full py-3 text-sm font-medium text-white/80 hover:text-white transition group ${border ? 'border-b border-white/10' : ''}`}
                >
                  <span className="flex items-center gap-2.5">
                    <ActionIcon name={icon} /> {label}
                  </span>
                  <span style={{ color: '#EDB84A' }} className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              ))}
            </div>

            <button
              onClick={async () => { await logout(); navigate('/') }}
              className="w-full py-3.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-all duration-200"
            >
              Sign out
            </button>
          </div>

        </section>

        <Footer />
      </div>
    )
  }

  /* ── AUTH FORM VIEW ─────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">
      <Navbar />

      <div className="min-h-screen grid lg:grid-cols-2">

        {/* Left — branding panel */}
        <div
          className="hidden lg:flex flex-col justify-end p-14 relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547970827-f33b90fde688?w=900&q=80')" }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,7,3,0.92), rgba(10,7,3,0.3) 60%, transparent)' }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-7 h-px" style={{ background: gold }} />
              <span className="text-[11px] font-medium uppercase" style={{ color: '#EDB84A', letterSpacing: '2.5px' }}>
                Kenya's Premier Safari Company
              </span>
            </div>
            <h2 className="text-white leading-tight mb-4" style={{ ...serif, fontWeight: 700, fontSize: 'clamp(36px, 4vw, 52px)' }}>
              Every journey<br />begins with<br /><span style={{ fontStyle: 'italic', fontWeight: 400, color: '#EDB84A' }}>a first step.</span>
            </h2>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
              Create an account to save your bookings, manage trips, and unlock member-exclusive experiences.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center px-6 py-20 bg-[#F5F0E8]">
          <div className="w-full max-w-md">

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-white rounded-xl mb-8 w-fit" style={{ border: '0.5px solid #E3DCCD' }}>
              {['Sign in', 'Create account'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => { setIsLogin(i === 0); setError('') }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isLogin === (i === 0)
                    ? 'bg-[#0A0703] text-white'
                    : 'text-[#6B6560] hover:text-[#1C1A17]'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '0.5px solid #E3DCCD' }}>
              <div className="px-8 py-6 border-b border-[#F0EDE8]">
                <h1 className="text-2xl text-[#1C1A17]" style={{ ...serif, fontWeight: 700 }}>
                  {isLogin ? 'Welcome back' : 'Join Ibrali Tours'}
                </h1>
                <p className="text-[#9C9890] text-sm mt-1">
                  {isLogin ? 'Sign in to your account to continue' : 'Create your account in seconds'}
                </p>
              </div>

              <div className="px-8 py-7">
                {error && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fadeIn">
                    <span className="text-red-500 mt-0.5 text-sm">✗</span>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className={labelCls}>Full name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Jane Doe" className={inputCls} />
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>Email address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="jane@example.com" className={inputCls} />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className={labelCls}>Phone number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+254 712 345 678" className={inputCls} />
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={inputCls} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: gold, color: '#0A0703' }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#EDB84A' }}
                    onMouseLeave={(e) => (e.currentTarget.style.background = gold)}
                  >
                    {loading ? 'Please wait…' : isLogin ? 'Sign in →' : 'Create account →'}
                  </button>
                </form>

                {/* Demo credentials */}
                {isLogin && (
                  <div className="mt-6 p-4 rounded-xl" style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0' }}>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: '#B07E1C' }}>Demo credentials</p>
                    <p className="text-xs font-mono" style={{ color: '#8A6418' }}>demo@example.com</p>
                    <p className="text-xs font-mono" style={{ color: '#8A6418' }}>password123</p>
                  </div>
                )}

                <p className="text-center text-xs text-[#9C9890] mt-5">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => { setIsLogin(!isLogin); setError('') }}
                    className="text-[#1C1A17] font-medium hover:text-[#B07E1C] transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}