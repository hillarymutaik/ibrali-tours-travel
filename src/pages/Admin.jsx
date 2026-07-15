import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../utils/constants'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency, formatDate } from '../utils/helpers'
import authService from '../services/authService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'

const serif = { fontFamily: "'Playfair Display', serif" }

const STATUS_STYLE = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-[#F2EDE5] text-[#6B6560] border-[#E3DCCD]',
  pending: 'bg-[#FAF3E4] text-[#B07E1C] border-[#EBD9B0]',
}

async function adminApi(action, body) {
  const res = await fetch(`${API_URL}/admin.php?action=${action}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authService.getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) throw new Error(json.error || `Request failed (${res.status})`)
  return json.data
}

/* ── Shared bits ───────────────────────────────────────────────────── */

const panelCls = 'bg-white rounded-2xl overflow-hidden'
const panelStyle = { border: '0.5px solid #E3DCCD' }
const labelCls = 'text-[11px] font-medium text-[#9C9890] uppercase tracking-[1.5px]'
const inputCls = 'w-full px-3 py-2 bg-white border border-[#E3DCCD] rounded-lg text-sm text-[#1C1A17] input-safari'

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={panelStyle}>
      <p className={labelCls}>{label}</p>
      <p className="mt-2" style={{ ...serif, fontWeight: 700, fontSize: '28px', color: accent ? '#B07E1C' : '#1C1A17' }}>
        {value}
      </p>
    </div>
  )
}

function EmptyRow({ children }) {
  return <p className="px-6 py-10 text-center text-sm text-[#9C9890]">{children}</p>
}

/* ── Guard for non-admins ──────────────────────────────────────────── */

function Denied({ signedIn }) {
  return (
    <div className="min-h-screen bg-[#FAF7F1] font-sans">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pt-40 pb-24 text-center">
        <div className={`${panelCls} p-12`} style={panelStyle}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#FAF3E4', border: '0.5px solid #EBD9B0' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B07E1C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl text-[#1C1A17] mb-2" style={{ ...serif, fontWeight: 700 }}>
            Admins only
          </h1>
          <p className="text-[#6B6560] text-sm mb-8 leading-relaxed">
            {signedIn
              ? 'This account does not have admin access.'
              : 'Sign in with an admin account to manage Ibrali Tours & Travel.'}
          </p>
          <Link to="/profile" className="btn btn-gold px-8 py-3.5">
            {signedIn ? 'Switch account →' : 'Sign in →'}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

/* ── Sections ──────────────────────────────────────────────────────── */

function Overview({ stats, bookings }) {
  if (!stats) return <EmptyRow>Loading…</EmptyRow>
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total bookings" value={stats.bookingsTotal} />
        <StatCard label="Pending bookings" value={stats.bookingsPending} accent />
        <StatCard label="Confirmed revenue" value={formatCurrency(stats.revenue)} accent />
        <StatCard label="Pipeline value" value={formatCurrency(stats.pipeline)} />
        <StatCard label="Registered users" value={stats.users} />
        <StatCard label="Subscribers" value={stats.subscribers} />
        <StatCard label="Unread messages" value={stats.messagesUnread} accent={stats.messagesUnread > 0} />
        <StatCard label="Active packages" value={stats.packagesActive} />
      </div>

      <div className={panelCls} style={panelStyle}>
        <div className="px-6 py-4 border-b border-[#F0EDE8]">
          <h2 className="text-base text-[#1C1A17]" style={{ ...serif, fontWeight: 700 }}>Latest bookings</h2>
        </div>
        {bookings.slice(0, 5).map(b => (
          <div key={b.id} className="px-6 py-3.5 border-b border-[#F0EDE8] last:border-0 flex items-center justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="font-medium text-[#1C1A17] truncate">{b.fullName} · {b.packageTitle}</p>
              <p className="text-xs text-[#9C9890] font-mono mt-0.5">{b.id}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-medium" style={{ color: '#B07E1C' }}>{formatCurrency(b.totalPrice)}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${STATUS_STYLE[b.status]}`}>{b.status}</span>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <EmptyRow>No bookings yet.</EmptyRow>}
      </div>
    </>
  )
}

function Bookings({ bookings, onStatus }) {
  return (
    <div className={panelCls} style={panelStyle}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="border-b border-[#F0EDE8] text-left">
              {['Reference', 'Traveller', 'Package', 'Start', 'Pax', 'Total', 'Status'].map(h => (
                <th key={h} className={`px-4 py-3.5 ${labelCls}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b border-[#F0EDE8] last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-[#6B6560]">{b.id}{b.isGuest && <span className="ml-1.5 text-[10px] text-[#9C9890]">(guest)</span>}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1C1A17]">{b.fullName}</p>
                  <p className="text-xs text-[#9C9890]">{b.email}</p>
                </td>
                <td className="px-4 py-3 text-[#4A4540]">{b.packageTitle}</td>
                <td className="px-4 py-3 text-[#4A4540] whitespace-nowrap">{b.startDate}</td>
                <td className="px-4 py-3 text-[#4A4540]">{b.travelers}</td>
                <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: '#B07E1C' }}>{formatCurrency(b.totalPrice)}</td>
                <td className="px-4 py-3">
                  <select
                    value={b.status}
                    onChange={e => onStatus(b.id, e.target.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border capitalize cursor-pointer ${STATUS_STYLE[b.status]}`}
                  >
                    {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && <EmptyRow>No bookings yet.</EmptyRow>}
    </div>
  )
}

function Messages({ messages, onRead, onDelete }) {
  return (
    <div className="space-y-4">
      {messages.map(m => (
        <div key={m.id} className={`${panelCls} p-5`} style={m.isRead ? panelStyle : { border: '0.5px solid #C4962A' }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-medium text-[#1C1A17] text-sm">
                {m.name}
                {!m.isRead && <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: '#FAF3E4', color: '#B07E1C', border: '0.5px solid #EBD9B0' }}>NEW</span>}
              </p>
              <p className="text-xs text-[#9C9890] mt-0.5">{m.email}{m.phone ? ` · ${m.phone}` : ''} · {formatDate(m.createdAt)}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!m.isRead && (
                <button onClick={() => onRead(m.id)} className="text-xs font-medium text-[#1C1A17] hover:text-[#B07E1C] transition-colors">
                  Mark read
                </button>
              )}
              <button onClick={() => onDelete(m.id)} className="text-xs text-[#9C9890] hover:text-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
          <p className="text-sm text-[#4A4540] leading-relaxed">{m.message}</p>
        </div>
      ))}
      {messages.length === 0 && (
        <div className={panelCls} style={panelStyle}><EmptyRow>No contact messages yet.</EmptyRow></div>
      )}
    </div>
  )
}

function PackageEditor({ pkg, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: pkg?.title ?? '',
    destination: pkg?.destination ?? '',
    price: pkg?.price ?? '',
    duration: pkg?.duration ?? 3,
    category: pkg?.category ?? 'safari',
    difficulty: pkg?.difficulty ?? 'Easy',
    maxTravelers: pkg?.maxTravelers ?? 10,
    bestTime: pkg?.bestTime ?? 'Year-round',
    image: pkg?.image ?? '',
    description: pkg?.description ?? '',
    isActive: pkg?.isActive ?? true,
  })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="px-5 py-4 bg-[#FAF7F1] border-t border-[#F0EDE8] grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="lg:col-span-2">
        <label className={labelCls}>Title</label>
        <input className={inputCls} value={form.title} onChange={set('title')} />
      </div>
      <div>
        <label className={labelCls}>Destination</label>
        <input className={inputCls} value={form.destination} onChange={set('destination')} />
      </div>
      <div>
        <label className={labelCls}>Price (USD)</label>
        <input className={inputCls} type="number" min="1" value={form.price} onChange={set('price')} />
      </div>
      <div>
        <label className={labelCls}>Days</label>
        <input className={inputCls} type="number" min="1" value={form.duration} onChange={set('duration')} />
      </div>
      <div>
        <label className={labelCls}>Category</label>
        <input className={inputCls} value={form.category} onChange={set('category')} />
      </div>
      <div>
        <label className={labelCls}>Difficulty</label>
        <select className={inputCls} value={form.difficulty} onChange={set('difficulty')}>
          {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Max travellers</label>
        <input className={inputCls} type="number" min="1" value={form.maxTravelers} onChange={set('maxTravelers')} />
      </div>
      <div className="lg:col-span-2">
        <label className={labelCls}>Image URL</label>
        <input className={inputCls} value={form.image} onChange={set('image')} />
      </div>
      <div className="lg:col-span-2">
        <label className={labelCls}>Best time</label>
        <input className={inputCls} value={form.bestTime} onChange={set('bestTime')} />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <label className={labelCls}>Description</label>
        <textarea className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={set('description')} />
      </div>
      <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-[#4A4540]">
          <input type="checkbox" checked={form.isActive} onChange={set('isActive')} style={{ accentColor: '#C4962A' }} />
          Visible on the site
        </label>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E3DCCD] bg-white text-sm text-[#6B6560] hover:border-[#0A0703] transition">
            Cancel
          </button>
          <button onClick={() => onSave({ ...form, id: pkg?.id })} className="btn btn-gold px-6 py-2 !rounded-lg text-sm">
            Save package
          </button>
        </div>
      </div>
    </div>
  )
}

function Packages({ packages, onSave, onToggle }) {
  const [editingId, setEditingId] = useState(null) // package id | 'new' | null
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditingId('new')} className="btn btn-dark px-5 py-2.5 text-sm">
          + New package
        </button>
      </div>

      {editingId === 'new' && (
        <div className={panelCls} style={panelStyle}>
          <div className="px-5 py-3.5">
            <p className="text-sm font-medium text-[#1C1A17]">New package</p>
          </div>
          <PackageEditor
            onSave={async (form) => { await onSave(form); setEditingId(null) }}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      <div className={panelCls} style={panelStyle}>
        {packages.map(p => (
          <div key={p.id} className="border-b border-[#F0EDE8] last:border-0">
            <div className="px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {p.image && <img src={p.image} alt="" className="w-12 h-9 rounded-lg object-cover flex-shrink-0" />}
                <div className="min-w-0">
                  <p className="font-medium text-[#1C1A17] text-sm truncate">
                    {p.title}
                    {!p.isActive && <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600 border border-red-200">hidden</span>}
                  </p>
                  <p className="text-xs text-[#9C9890]">{p.destination} · {p.duration}d · {p.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="font-medium text-sm" style={{ color: '#B07E1C' }}>{formatCurrency(p.price)}</span>
                <button onClick={() => onToggle(p.id)} className="text-xs font-medium text-[#6B6560] hover:text-[#1C1A17] transition-colors">
                  {p.isActive ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                  className="text-xs font-medium text-[#1C1A17] hover:text-[#B07E1C] transition-colors"
                >
                  {editingId === p.id ? 'Close' : 'Edit'}
                </button>
              </div>
            </div>
            {editingId === p.id && (
              <PackageEditor
                pkg={p}
                onSave={async (form) => { await onSave(form); setEditingId(null) }}
                onCancel={() => setEditingId(null)}
              />
            )}
          </div>
        ))}
        {packages.length === 0 && <EmptyRow>No packages found.</EmptyRow>}
      </div>
    </div>
  )
}

function Subscribers({ subscribers, users }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className={panelCls} style={panelStyle}>
        <div className="px-6 py-4 border-b border-[#F0EDE8]">
          <h2 className="text-base text-[#1C1A17]" style={{ ...serif, fontWeight: 700 }}>Newsletter subscribers</h2>
        </div>
        {subscribers.map(s => (
          <div key={s.id} className="px-6 py-3 border-b border-[#F0EDE8] last:border-0 flex justify-between text-sm">
            <span className="text-[#1C1A17]">{s.email}</span>
            <span className="text-xs text-[#9C9890]">{formatDate(s.createdAt)}</span>
          </div>
        ))}
        {subscribers.length === 0 && <EmptyRow>No subscribers yet.</EmptyRow>}
      </div>

      <div className={panelCls} style={panelStyle}>
        <div className="px-6 py-4 border-b border-[#F0EDE8]">
          <h2 className="text-base text-[#1C1A17]" style={{ ...serif, fontWeight: 700 }}>Registered users</h2>
        </div>
        {users.map(u => (
          <div key={u.id} className="px-6 py-3 border-b border-[#F0EDE8] last:border-0 flex items-center justify-between gap-3 text-sm">
            <div>
              <p className="text-[#1C1A17] font-medium">{u.name}</p>
              <p className="text-xs text-[#9C9890]">{u.email}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${u.role === 'admin' ? 'bg-[#FAF3E4] text-[#B07E1C] border-[#EBD9B0]' : 'bg-[#F2EDE5] text-[#6B6560] border-[#E3DCCD]'}`}>
              {u.role}
            </span>
          </div>
        ))}
        {users.length === 0 && <EmptyRow>No users yet.</EmptyRow>}
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([])
  const [packages, setPackages] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [users, setUsers] = useState([])

  const isAdmin = user?.role === 'admin'

  const loadAll = useCallback(async () => {
    setError('')
    try {
      const [s, b, m, p, n, u] = await Promise.all([
        adminApi('stats'),
        adminApi('bookings'),
        adminApi('messages'),
        adminApi('packages'),
        adminApi('subscribers'),
        adminApi('users'),
      ])
      setStats(s); setBookings(b); setMessages(m); setPackages(p); setSubscribers(n); setUsers(u)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => { if (isAdmin) loadAll() }, [isAdmin, loadAll])

  if (!isAdmin) return <Denied signedIn={!!user} />

  const act = (fn) => async (...args) => {
    setError('')
    try { await fn(...args); await loadAll() } catch (err) { setError(err.message) }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: `Bookings (${bookings.length})` },
    { id: 'messages', label: `Messages (${messages.filter(m => !m.isRead).length} new)` },
    { id: 'packages', label: `Packages (${packages.length})` },
    { id: 'audience', label: 'Audience' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF7F1] font-sans text-[#1C1A17]">
      <Navbar />

      <PageHero
        eyebrow="Admin Panel"
        subtitle={`Signed in as ${user.name} — manage bookings, packages, messages and subscribers.`}
        actions={
          <button onClick={loadAll} className="btn btn-ghost px-5 py-2.5 text-sm">
            ↻ Refresh
          </button>
        }
      >
        Command <span className="heading-accent">centre</span>
      </PageHero>

      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${tab === t.id
                ? 'bg-[#0A0703] text-white border-[#0A0703]'
                : 'bg-white text-[#6B6560] border-[#E3DCCD] hover:border-[#0A0703]'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error} — is the XAMPP backend running?
          </div>
        )}

        {tab === 'overview' && <Overview stats={stats} bookings={bookings} />}
        {tab === 'bookings' && (
          <Bookings bookings={bookings} onStatus={act((id, status) => adminApi('booking-status', { id, status }))} />
        )}
        {tab === 'messages' && (
          <Messages
            messages={messages}
            onRead={act((id) => adminApi('message-read', { id }))}
            onDelete={act((id) => adminApi('message-delete', { id }))}
          />
        )}
        {tab === 'packages' && (
          <Packages
            packages={packages}
            onSave={act((form) => adminApi('package-save', form))}
            onToggle={act((id) => adminApi('package-toggle', { id }))}
          />
        )}
        {tab === 'audience' && <Subscribers subscribers={subscribers} users={users} />}
      </section>

      <Footer />
    </div>
  )
}
