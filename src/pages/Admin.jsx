import { useState, useEffect, useCallback } from 'react'
import { API_URL } from '../utils/constants'
import { formatCurrency, formatDate } from '../utils/helpers'

/**
 * Standalone admin dashboard — completely separate from the public site.
 * Has its own login screen, its own session (adminToken/adminUser in
 * localStorage, independent of the customer session), and its own
 * sidebar layout. Every API action is verified server-side against the
 * admin role.
 */

const serif = { fontFamily: "'Playfair Display', serif" }

const STATUS_STYLE = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-[#F2EDE5] text-[#6B6560] border-[#E3DCCD]',
  pending: 'bg-[#FAF3E4] text-[#B07E1C] border-[#EBD9B0]',
}

const getAdminToken = () => localStorage.getItem('adminToken')
const getAdminUser = () => {
  try { return JSON.parse(localStorage.getItem('adminUser')) } catch { return null }
}

async function adminApi(action, body) {
  const res = await fetch(`${API_URL}/admin.php?action=${action}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
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

/* ── Admin login screen ────────────────────────────────────────────── */

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await fetch(`${API_URL}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json.ok === false) throw new Error(json.error || 'Sign-in failed')
      if (json.data.user.role !== 'admin') throw new Error('This account does not have admin access')
      localStorage.setItem('adminToken', json.data.token)
      localStorage.setItem('adminUser', JSON.stringify(json.data.user))
      onLogin(json.data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 font-sans" style={{ background: '#382C1C' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/ibrali-tours-travel/logo-dark.jpeg"
            alt="Ibrali Tours & Travel"
            className="w-24 h-24 rounded-full mx-auto mb-5 object-cover"
            style={{ border: '1.5px solid rgba(196,150,42,0.4)' }}
          />
          <h1 className="text-white text-2xl" style={{ ...serif, fontWeight: 700 }}>
            Ibrali <span style={{ color: '#EDB84A', fontStyle: 'italic', fontWeight: 400 }}>Admin</span>
          </h1>
          <p className="text-white/40 text-xs mt-2 tracking-widest uppercase">Staff access only</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl p-7 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(196,150,42,0.25)' }}>
          {error && (
            <div className="p-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(220,60,60,0.12)', border: '0.5px solid rgba(220,60,60,0.35)' }}>
              {error}
            </div>
          )}
          <div>
            <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Email</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.15)', color: '#fff' }}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Password</label>
            <input
              type="password" required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.15)', color: '#fff' }}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={busy} className="btn btn-gold w-full py-3.5 !rounded-xl">
            {busy ? 'Signing in…' : 'Sign in to dashboard →'}
          </button>
        </form>

        <p className="text-center text-white/25 text-xs mt-6">
          Not staff? <a href="#/" className="text-white/50 hover:text-white/80 transition-colors">Return to the website</a>
        </p>
      </div>
    </div>
  )
}

/* ── Sections ──────────────────────────────────────────────────────── */

function Overview({ stats, bookings }) {
  if (!stats) return <EmptyRow>Loading…</EmptyRow>
  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
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
        {bookings.slice(0, 6).map(b => (
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

function Bookings({ bookings, onStatus, onDelete }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = bookings.filter(b => {
    const q = query.toLowerCase()
    const matchesQuery = !q
      || b.fullName.toLowerCase().includes(q)
      || b.email.toLowerCase().includes(q)
      || b.id.toLowerCase().includes(q)
      || b.packageTitle.toLowerCase().includes(q)
    const matchesStatus = status === 'all' || b.status === status
    return matchesQuery && matchesStatus
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, email, reference or package…"
          className="flex-1 px-4 py-2.5 bg-white border border-[#E3DCCD] rounded-xl text-sm input-safari"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium border capitalize transition ${status === s
                ? 'bg-[#382C1C] text-white border-[#382C1C]'
                : 'bg-white text-[#6B6560] border-[#E3DCCD] hover:border-[#382C1C]'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={panelCls} style={panelStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="border-b border-[#F0EDE8] text-left">
                {['Reference', 'Traveller', 'Package', 'Start', 'Pax', 'Total', 'Status', ''].map((h, i) => (
                  <th key={i} className={`px-4 py-3.5 ${labelCls}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { if (window.confirm(`Delete booking ${b.id}? This cannot be undone.`)) onDelete(b.id) }}
                      className="text-xs text-[#9C9890] hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyRow>{bookings.length === 0 ? 'No bookings yet.' : 'No bookings match your search.'}</EmptyRow>}
      </div>
    </>
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
            <div className="flex gap-3 flex-shrink-0">
              <a href={`mailto:${m.email}`} className="text-xs font-medium text-[#1C1A17] hover:text-[#B07E1C] transition-colors">Reply</a>
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
    <div className="px-5 py-4 bg-[#FAF7F1] border-t border-[#F0EDE8] grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <div className="xl:col-span-2">
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
      <div className="xl:col-span-2">
        <label className={labelCls}>Image URL</label>
        <input className={inputCls} value={form.image} onChange={set('image')} />
      </div>
      <div className="xl:col-span-2">
        <label className={labelCls}>Best time</label>
        <input className={inputCls} value={form.bestTime} onChange={set('bestTime')} />
      </div>
      <div className="sm:col-span-2 xl:col-span-4">
        <label className={labelCls}>Description</label>
        <textarea className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={set('description')} />
      </div>
      <div className="sm:col-span-2 xl:col-span-4 flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-[#4A4540]">
          <input type="checkbox" checked={form.isActive} onChange={set('isActive')} style={{ accentColor: '#C4962A' }} />
          Visible on the site
        </label>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E3DCCD] bg-white text-sm text-[#6B6560] hover:border-[#382C1C] transition">
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
  const [editingId, setEditingId] = useState(null)
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

function Audience({ subscribers, users, me, onRole }) {
  return (
    <div className="grid xl:grid-cols-2 gap-6">
      <div className={panelCls} style={panelStyle}>
        <div className="px-6 py-4 border-b border-[#F0EDE8]">
          <h2 className="text-base text-[#1C1A17]" style={{ ...serif, fontWeight: 700 }}>Registered users</h2>
        </div>
        {users.map(u => (
          <div key={u.id} className="px-6 py-3 border-b border-[#F0EDE8] last:border-0 flex items-center justify-between gap-3 text-sm">
            <div>
              <p className="text-[#1C1A17] font-medium">{u.name}{u.id === me?.id && <span className="text-xs text-[#9C9890]"> (you)</span>}</p>
              <p className="text-xs text-[#9C9890]">{u.email}{u.phone ? ` · ${u.phone}` : ''}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${u.role === 'admin' ? 'bg-[#FAF3E4] text-[#B07E1C] border-[#EBD9B0]' : 'bg-[#F2EDE5] text-[#6B6560] border-[#E3DCCD]'}`}>
                {u.role}
              </span>
              {u.id !== me?.id && (
                <button
                  onClick={() => onRole(u.id, u.role === 'admin' ? 'customer' : 'admin')}
                  className="text-xs font-medium text-[#6B6560] hover:text-[#1C1A17] transition-colors whitespace-nowrap"
                >
                  {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                </button>
              )}
            </div>
          </div>
        ))}
        {users.length === 0 && <EmptyRow>No users yet.</EmptyRow>}
      </div>

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
    </div>
  )
}

/* ── Sidebar nav item ──────────────────────────────────────────────── */

function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${active
        ? 'text-[#382C1C] font-medium'
        : 'text-white/55 hover:text-white/90'
        }`}
      style={active ? { background: '#C4962A' } : undefined}
    >
      <span className="w-4 flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-[#382C1C] text-[#EDB84A]' : 'bg-[#C4962A] text-[#382C1C]'}`}>
          {badge}
        </span>
      )}
    </button>
  )
}

const NAV_ICONS = {
  overview: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  bookings: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>,
  messages: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  packages: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  audience: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
}

/* ── Dashboard shell ───────────────────────────────────────────────── */

export default function Admin() {
  const [admin, setAdmin] = useState(getAdminUser)
  const [tab, setTab] = useState('overview')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([])
  const [packages, setPackages] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [users, setUsers] = useState([])

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
      if (/401|Authentication/i.test(err.message)) {
        // stale/expired admin session — back to the login screen
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        setAdmin(null)
        return
      }
      setError(err.message)
    }
  }, [])

  useEffect(() => { if (admin && getAdminToken()) loadAll() }, [admin, loadAll])

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/auth.php?action=logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      })
    } catch { /* best-effort */ }
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setAdmin(null)
  }

  if (!admin || !getAdminToken()) return <AdminLogin onLogin={setAdmin} />

  const act = (fn) => async (...args) => {
    setError('')
    try { await fn(...args); await loadAll() } catch (err) { setError(err.message) }
  }

  const unread = messages.filter(m => !m.isRead).length
  const nav = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'bookings', label: 'Bookings', badge: stats?.bookingsPending },
    { id: 'messages', label: 'Messages', badge: unread },
    { id: 'packages', label: 'Packages' },
    { id: 'audience', label: 'Audience' },
  ]
  const titles = {
    overview: 'Dashboard',
    bookings: 'Bookings',
    messages: 'Contact messages',
    packages: 'Tour packages',
    audience: 'Users & subscribers',
  }

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#F2EDE3' }}>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 p-5 sticky top-0 h-screen" style={{ background: '#382C1C' }}>
        <div className="flex items-center gap-3 px-2 mb-10">
          <img
            src="/ibrali-tours-travel/logo-dark.jpeg"
            alt="Ibrali Tours & Travel"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            style={{ border: '1px solid rgba(196,150,42,0.4)' }}
          />
          <div>
            <p className="text-white text-sm leading-none" style={{ ...serif, fontWeight: 700 }}>Ibrali Admin</p>
            <p className="text-white/30 text-[10px] tracking-widest uppercase mt-1">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {nav.map(n => (
            <NavItem key={n.id} icon={NAV_ICONS[n.id]} label={n.label} badge={n.badge} active={tab === n.id} onClick={() => setTab(n.id)} />
          ))}
        </nav>

        <div className="pt-5 space-y-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#C4962A', color: '#382C1C' }}>
              {admin.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white/85 text-xs font-medium truncate">{admin.name}</p>
              <p className="text-white/30 text-[10px] truncate">{admin.email}</p>
            </div>
          </div>
          <button onClick={signOut} className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-white/50 hover:text-white transition-colors text-left" style={{ background: 'rgba(255,255,255,0.05)' }}>
            ← Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between gap-4 backdrop-blur-lg" style={{ background: 'rgba(242,237,227,0.92)', borderBottom: '0.5px solid #E3DCCD' }}>
          <h1 className="text-xl text-[#1C1A17]" style={{ ...serif, fontWeight: 700 }}>{titles[tab]}</h1>
          <div className="flex items-center gap-3">
            <button onClick={loadAll} className="px-4 py-2 rounded-full text-xs font-medium border border-[#E3DCCD] bg-white text-[#6B6560] hover:border-[#382C1C] transition">
              ↻ Refresh
            </button>
            <button onClick={signOut} className="lg:hidden px-4 py-2 rounded-full text-xs font-medium border border-[#E3DCCD] bg-white text-[#6B6560] hover:text-red-600 hover:border-red-200 transition">
              Sign out
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden px-6 pt-4 flex gap-2 flex-wrap">
          {nav.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium border transition ${tab === n.id
                ? 'bg-[#382C1C] text-white border-[#382C1C]'
                : 'bg-white text-[#6B6560] border-[#E3DCCD]'
                }`}
            >
              {n.label}{n.badge > 0 ? ` (${n.badge})` : ''}
            </button>
          ))}
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error} — is the XAMPP backend running?
            </div>
          )}

          {tab === 'overview' && <Overview stats={stats} bookings={bookings} />}
          {tab === 'bookings' && (
            <Bookings
              bookings={bookings}
              onStatus={act((id, status) => adminApi('booking-status', { id, status }))}
              onDelete={act((id) => adminApi('booking-delete', { id }))}
            />
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
          {tab === 'audience' && (
            <Audience
              subscribers={subscribers}
              users={users}
              me={admin}
              onRole={act((id, role) => adminApi('user-role', { id, role }))}
            />
          )}
        </div>
      </main>
    </div>
  )
}
