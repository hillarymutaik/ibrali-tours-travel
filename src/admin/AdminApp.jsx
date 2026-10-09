import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  AtSign, Bell, CalendarCheck, CircleAlert, CircleCheck, CornerDownLeft, ExternalLink, Inbox, LayoutDashboard,
  LogOut, Map as MapIcon, Menu, PanelLeftClose, PanelLeftOpen, PlaneTakeoff, RefreshCw, Search, Settings,
  TriangleAlert, Users, X,
} from 'lucide-react'
import { AdminContext, ToastContext, useClickOutside, useEscape, useToast } from './context'
import { adminGet, isAuthError, session, signOut as apiSignOut } from './api'
import { daysFromToday, relative } from './format'
import { Avatar, Button, EmptyState, Spinner } from './ui'
import Login from './Login'
import Overview from './pages/Overview'
import Bookings from './pages/Bookings'
import Messages from './pages/Messages'
import Packages from './pages/Packages'
import Customers from './pages/Customers'
import Subscribers from './pages/Subscribers'
import SettingsPage from './pages/Settings'
import { loadPrefs, savePrefs } from './prefs'

const NAV = [
  { items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  {
    group: 'Operations',
    items: [
      { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck, badge: 'pending' },
      { to: '/admin/messages', label: 'Messages', icon: Inbox, badge: 'unread' },
    ],
  },
  { group: 'Catalogue', items: [{ to: '/admin/packages', label: 'Packages', icon: MapIcon }] },
  {
    group: 'People',
    items: [
      { to: '/admin/customers', label: 'Customers & team', icon: Users },
      { to: '/admin/subscribers', label: 'Subscribers', icon: AtSign },
    ],
  },
]

/** Pinned to the bottom of the sidebar. */
const SETTINGS_ITEM = { to: '/admin/settings', label: 'Settings', icon: Settings }

/** Extra search-palette shortcuts straight into Settings tabs. */
const SETTINGS_SHORTCUTS = [
  { to: '/admin/settings?tab=account', label: 'Account details', icon: Settings },
  { to: '/admin/settings?tab=security', label: 'Change password', icon: Settings },
  { to: '/admin/settings?tab=preferences', label: 'Preferences', icon: Settings },
  { to: '/admin/settings?tab=system', label: 'System status', icon: Settings },
]

const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/bookings': 'Bookings',
  '/admin/messages': 'Messages',
  '/admin/packages': 'Packages',
  '/admin/customers': 'Customers & team',
  '/admin/subscribers': 'Subscribers',
  '/admin/settings': 'Settings',
}

const websiteUrl = () => `${window.location.pathname}#/`

/* ── Toasts ─────────────────────────────────────────────────────────── */

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const push = useCallback((tone, message) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t.slice(-3), { id, tone, message }])
    setTimeout(() => dismiss(id), 4200)
  }, [dismiss])
  const api = useMemo(() => ({
    success: (m) => push('success', m),
    error: (m) => push('error', m),
  }), [push])

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="admin-app fixed bottom-4 right-4 z-[80] flex flex-col gap-2.5 w-[calc(100%-2rem)] max-w-sm" aria-live="polite" dir="ltr" lang="en">
          {toasts.map((t) => (
            <div key={t.id} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3.5 shadow-[0_12px_16px_-4px_rgba(28,26,23,0.08),0_4px_6px_-2px_rgba(28,26,23,0.03)] ring-1 ring-[#E3DCCD] animate-[admin-pop_180ms_cubic-bezier(0.16,1,0.3,1)]">
              {t.tone === 'success'
                ? <CircleCheck size={20} className="text-[#079455] flex-shrink-0 mt-px" />
                : <CircleAlert size={20} className="text-[#D92D20] flex-shrink-0 mt-px" />}
              <p className="text-sm text-[#4A4540] flex-1 leading-snug">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-[#9C9890] hover:text-[#6B6560]">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

/* ── Sidebar ────────────────────────────────────────────────────────── */

function SideLink({ item, collapsed, count = 0, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `relative flex items-center gap-3 h-10 rounded-lg text-sm font-medium transition-colors ${collapsed ? 'justify-center px-0' : 'px-3'} ${isActive
          ? 'bg-[#E75A08]/[0.16] text-white'
          : 'text-[#F5ECD8]/70 hover:bg-white/[0.06] hover:text-white'}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#E75A08]" />}
          <item.icon size={18} strokeWidth={1.9} className="flex-shrink-0" />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {count > 0 && (
            <span className={collapsed
              ? 'absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-[#E75A08] ring-2 ring-[#382C1C]'
              : 'min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#E75A08] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums'}>
              {collapsed ? '' : count}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

function SidebarContent({ collapsed, counts, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-3 h-16 flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
        <img src="/ibrali-tours-travel/logo.webp" alt="" className="w-9 h-9 rounded-full object-cover bg-white ring-2 ring-white/10 flex-shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="heading text-[17px] text-white leading-tight truncate">Ibrali Tours</p>
            <p className="text-[10px] uppercase tracking-[1.5px] text-[#F5ECD8]/55 leading-tight mt-1">Admin console</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5" aria-label="Admin">
        {NAV.map((section, si) => (
          <div key={si}>
            {section.group && !collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-medium uppercase tracking-[2px] text-[#F2843A]/80">{section.group}</p>
            )}
            {section.group && collapsed && <div className="mx-3 mb-2 h-px bg-white/10" />}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <SideLink item={item} collapsed={collapsed} count={item.badge ? counts[item.badge] : 0} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3 flex-shrink-0">
        <SideLink item={SETTINGS_ITEM} collapsed={collapsed} onNavigate={onNavigate} />
      </div>
    </div>
  )
}

/* ── Dropdowns in the top bar ───────────────────────────────────────── */

function Dropdown({ button, children, width = 300 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, open, () => setOpen(false))
  useEscape(open, () => setOpen(false))
  return (
    <div ref={ref} className="relative">
      {button({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-40 rounded-xl bg-white shadow-[0_12px_16px_-4px_rgba(28,26,23,0.08),0_4px_6px_-2px_rgba(28,26,23,0.03)] ring-1 ring-[#E3DCCD] overflow-hidden animate-[admin-pop_150ms_ease-out]"
          style={{ width }}
          onClick={(e) => { if (e.target.closest('a,button[data-close]')) setOpen(false) }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function MenuLink({ to, href, icon: Icon, children, sub, onClick, danger }) {
  const cls = `w-full flex items-start gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#FAF7F1] ${danger ? 'text-[#B42318]' : 'text-[#4A4540]'}`
  const inner = (
    <>
      {Icon && <Icon size={17} strokeWidth={1.9} className={`mt-px flex-shrink-0 ${danger ? '' : 'text-[#7A7268]'}`} />}
      <span className="min-w-0">
        <span className="block font-medium">{children}</span>
        {sub && <span className="block text-xs text-[#7A7268] mt-0.5">{sub}</span>}
      </span>
    </>
  )
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  if (to) return <NavLink to={to} className={cls}>{inner}</NavLink>
  return <button type="button" data-close onClick={onClick} className={cls}>{inner}</button>
}

/* ── Command palette (Ctrl/⌘ K) ─────────────────────────────────────── */

function CommandPalette({ open, onClose, data }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [lastOpen, setLastOpen] = useState(open)
  if (lastOpen !== open) {
    setLastOpen(open)
    if (open) { setQuery(''); setActive(0) }
  }
  useEscape(open, onClose)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const has = (...vals) => vals.some((v) => String(v ?? '').toLowerCase().includes(q))
    const pageItems = [...NAV.flatMap((s) => s.items), SETTINGS_ITEM, ...(q ? SETTINGS_SHORTCUTS : [])]
    const pages = pageItems.filter((i) => !q || has(i.label))
      .map((i) => ({ id: `p${i.to}`, group: 'Pages', icon: i.icon, label: i.label, to: i.to }))
    if (!q) return pages
    return [
      ...pages,
      ...data.bookings.filter((b) => has(b.id, b.fullName, b.email, b.packageTitle)).slice(0, 5)
        .map((b) => ({ id: `b${b.id}`, group: 'Bookings', icon: CalendarCheck, label: b.fullName, sub: `${b.id} · ${b.packageTitle}`, to: `/admin/bookings?open=${encodeURIComponent(b.id)}` })),
      ...data.users.filter((u) => has(u.name, u.email, u.phone)).slice(0, 4)
        .map((u) => ({ id: `u${u.id}`, group: 'Customers', icon: Users, label: u.name, sub: u.email, to: `/admin/customers?open=${u.id}` })),
      ...data.messages.filter((m) => has(m.name, m.email, m.message)).slice(0, 4)
        .map((m) => ({ id: `m${m.id}`, group: 'Messages', icon: Inbox, label: m.name, sub: m.message.slice(0, 70), to: `/admin/messages?open=${m.id}` })),
      ...data.packages.filter((p) => has(p.title, p.destination, p.category)).slice(0, 4)
        .map((p) => ({ id: `k${p.id}`, group: 'Packages', icon: MapIcon, label: p.title, sub: p.destination, to: `/admin/packages?open=${p.id}` })),
      ...data.subscribers.filter((s) => has(s.email)).slice(0, 3)
        .map((s) => ({ id: `s${s.id}`, group: 'Subscribers', icon: AtSign, label: s.email, to: `/admin/subscribers?q=${encodeURIComponent(s.email)}` })),
    ]
  }, [query, data])

  if (!open) return null
  const go = (r) => { onClose(); navigate(r.to) }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active]) }
  }

  return createPortal(
    <div className="admin-app fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]" dir="ltr" lang="en">
      <div className="absolute inset-0 bg-[#1C1A17]/50 backdrop-blur-[2px]" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Search" className="relative w-full max-w-xl rounded-xl bg-white shadow-[0_24px_48px_-12px_rgba(28,26,23,0.18)] ring-1 ring-[#E3DCCD] overflow-hidden animate-[admin-pop_160ms_ease-out]">
        <div className="flex items-center gap-3 px-4 border-b border-[#E3DCCD]">
          <Search size={18} className="text-[#7A7268]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            placeholder="Search bookings, customers, messages, packages…"
            className="flex-1 h-14 text-[15px] text-[#1C1A17] placeholder:text-[#9C9890] bg-transparent focus:outline-none"
            aria-label="Search the admin console"
          />
          <kbd className="text-[11px] font-medium text-[#7A7268] border border-[#E3DCCD] rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
          {results.length === 0 && <li className="px-4 py-8 text-center text-sm text-[#7A7268]">No results for “{query}”</li>}
          {results.map((r, i) => {
            const header = i === 0 || results[i - 1].group !== r.group ? r.group : null
            return (
              <li key={r.id}>
                {header && <p className="px-4 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9890]">{header}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(r)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${i === active ? 'bg-[#FAF7F1]' : ''}`}
                >
                  <r.icon size={17} strokeWidth={1.9} className="text-[#7A7268] flex-shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[#1C1A17] truncate">{r.label}</span>
                    {r.sub && <span className="block text-xs text-[#7A7268] truncate">{r.sub}</span>}
                  </span>
                  {i === active && <CornerDownLeft size={15} className="text-[#9C9890]" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>,
    document.body
  )
}

/* ── Signed-in workspace ────────────────────────────────────────────── */

const EMPTY = { stats: null, bookings: [], messages: [], packages: [], subscribers: [], users: [] }
const fetchAll = () => Promise.all(['stats', 'bookings', 'messages', 'packages', 'subscribers', 'users'].map(adminGet))

function Workspace({ me, onSignedOut, onMeUpdated }) {
  const location = useLocation()
  const toast = useToast()
  const [data, setData] = useState(EMPTY)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [now, setNow] = useState(() => new Date())
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('adminSidebarCollapsed') === '1')
  const [mobileNav, setMobileNav] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [prefs, setPrefs] = useState(loadPrefs)

  const updatePrefs = useCallback((patch) => {
    setPrefs((p) => {
      const next = { ...p, ...patch }
      savePrefs(next)
      return next
    })
  }, [])

  const applyData = useCallback(([stats, bookings, messages, packages, subscribers, users]) => {
    setData({ stats, bookings, messages, packages, subscribers, users })
    setUpdatedAt(new Date())
    setError('')
    setStatus('ready')
  }, [])

  const applyError = useCallback((err) => {
    if (isAuthError(err)) {
      session.clear()
      onSignedOut('Your session has expired. Please sign in again.')
      return
    }
    setError(err.message)
    setStatus((s) => (s === 'loading' ? 'error' : s))
  }, [onSignedOut])

  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true)
    try {
      applyData(await fetchAll())
    } catch (err) {
      applyError(err)
    } finally {
      setRefreshing(false)
    }
  }, [applyData, applyError])

  // Initial load — state is only set once the request settles
  useEffect(() => { fetchAll().then(applyData, applyError) }, [applyData, applyError])
  // Quiet background refresh at the interval chosen in Settings → Preferences;
  // the current view stays on screen while it runs
  useEffect(() => {
    if (!prefs.refreshSeconds) return
    const id = setInterval(() => load({ silent: true }), prefs.refreshSeconds * 1000)
    return () => clearInterval(id)
  }, [load, prefs.refreshSeconds])
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    const page = PAGE_TITLES[location.pathname.replace(/\/$/, '')] ?? 'Admin'
    document.title = `${page} · Ibrali Admin`
  }, [location.pathname])

  /** Runs an API action, then refreshes. Returns true on success. */
  const run = useCallback(async (fn, successMessage) => {
    try {
      await fn()
      if (successMessage) toast.success(successMessage)
      await load({ silent: true })
      return true
    } catch (err) {
      if (isAuthError(err)) {
        session.clear()
        onSignedOut('Your session has expired. Please sign in again.')
        return false
      }
      toast.error(err.message)
      return false
    }
  }, [load, onSignedOut, toast])

  const signOut = useCallback(async () => {
    await apiSignOut()
    onSignedOut('You have been signed out.')
  }, [onSignedOut])

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      localStorage.setItem('adminSidebarCollapsed', c ? '0' : '1')
      return !c
    })
  }

  const counts = {
    pending: data.bookings.filter((b) => b.status === 'pending').length,
    unread: data.messages.filter((m) => !m.isRead).length,
  }
  const departures = data.bookings.filter((b) => {
    const d = daysFromToday(b.startDate, now)
    return b.status === 'confirmed' && d !== null && d >= 0 && d <= 7
  }).length
  const alerts = counts.pending + counts.unread

  const ctx = useMemo(
    () => ({ ...data, me, updateMe: onMeUpdated, load, run, refreshing, updatedAt, signOut, error, prefs, updatePrefs }),
    [data, me, onMeUpdated, load, run, refreshing, updatedAt, signOut, error, prefs, updatePrefs]
  )

  return (
    <AdminContext.Provider value={ctx}>
      <div className="min-h-screen flex">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:block flex-shrink-0 sticky top-0 h-screen bg-[#382C1C] transition-[width] duration-200"
          style={{ width: collapsed ? 76 : 264 }}
        >
          <SidebarContent collapsed={collapsed} counts={counts} />
        </aside>

        {/* Mobile sidebar */}
        {mobileNav && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-[#1C1A17]/50" onClick={() => setMobileNav(false)} />
            <aside className="absolute inset-y-0 left-0 w-[280px] bg-[#382C1C] animate-[admin-slide-left_220ms_cubic-bezier(0.16,1,0.3,1)]">
              <button type="button" onClick={() => setMobileNav(false)} aria-label="Close menu" className="absolute top-4 -right-12 w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center">
                <X size={18} />
              </button>
              <SidebarContent collapsed={false} counts={counts} onNavigate={() => setMobileNav(false)} />
            </aside>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-[#FAF7F1]/95 backdrop-blur-xl border-b border-[#E3DCCD]">
            <button type="button" onClick={() => setMobileNav(true)} aria-label="Open menu" className="lg:hidden w-9 h-9 -ml-1 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F2EDE5]">
              <Menu size={20} />
            </button>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex w-9 h-9 -ml-2 rounded-lg items-center justify-center text-[#6B6560] hover:bg-[#F2EDE5]"
            >
              {collapsed ? <PanelLeftOpen size={19} strokeWidth={1.9} /> : <PanelLeftClose size={19} strokeWidth={1.9} />}
            </button>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex-1 max-w-md h-10 flex items-center gap-2.5 px-4 rounded-full border border-[#E3DCCD] bg-white text-sm text-[#7A7268] hover:border-[#E75A08] transition-colors"
            >
              <Search size={16} />
              <span className="truncate">Search<span className="hidden sm:inline"> bookings, customers, messages…</span></span>
              <kbd className="ml-auto hidden sm:inline text-[11px] font-medium text-[#7A7268] border border-[#E3DCCD] rounded px-1.5 py-0.5">Ctrl K</kbd>
            </button>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {updatedAt && (
                <span className="hidden xl:inline text-xs text-[#7A7268] mr-1">Updated {relative(updatedAt, now)}</span>
              )}
              <button
                type="button"
                onClick={() => load({ silent: true })}
                aria-label="Refresh data"
                title="Refresh data"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F2EDE5]"
              >
                <RefreshCw size={18} strokeWidth={1.9} className={refreshing ? 'animate-spin' : ''} />
              </button>

              <Dropdown
                width={320}
                button={({ toggle, open }) => (
                  <button type="button" onClick={toggle} aria-expanded={open} aria-label={`Notifications${alerts ? `, ${alerts} need attention` : ''}`} className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F2EDE5]">
                    <Bell size={18} strokeWidth={1.9} />
                    {alerts > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E75A08] ring-2 ring-white" />}
                  </button>
                )}
              >
                <div className="px-4 py-3 border-b border-[#E3DCCD]">
                  <p className="text-sm font-semibold text-[#1C1A17]">Needs attention</p>
                </div>
                {alerts === 0 && departures === 0 ? (
                  <p className="px-4 py-6 text-sm text-center text-[#7A7268]">You're all caught up.</p>
                ) : (
                  <div className="py-1.5">
                    {counts.pending > 0 && (
                      <MenuLink to="/admin/bookings?status=pending" icon={CalendarCheck} sub="Review and confirm">
                        {counts.pending} booking{counts.pending === 1 ? '' : 's'} awaiting confirmation
                      </MenuLink>
                    )}
                    {counts.unread > 0 && (
                      <MenuLink to="/admin/messages?filter=unread" icon={Inbox} sub="From the contact form">
                        {counts.unread} unread message{counts.unread === 1 ? '' : 's'}
                      </MenuLink>
                    )}
                    {departures > 0 && (
                      <MenuLink to="/admin/bookings?travel=week" icon={PlaneTakeoff} sub="Confirmed trips in the next 7 days">
                        {departures} departure{departures === 1 ? '' : 's'} this week
                      </MenuLink>
                    )}
                  </div>
                )}
              </Dropdown>

              <Dropdown
                width={260}
                button={({ toggle, open }) => (
                  <button type="button" onClick={toggle} aria-expanded={open} aria-label="Account menu" className="ml-1 rounded-full focus-visible:ring-4 focus-visible:ring-[#E75A08]/20">
                    <Avatar name={me.name} size={36} />
                  </button>
                )}
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E3DCCD]">
                  <Avatar name={me.name} size={36} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1C1A17] truncate">{me.name}</p>
                    <p className="text-xs text-[#6B6560] truncate">{me.email}</p>
                  </div>
                </div>
                <div className="py-1.5 border-b border-[#E3DCCD]">
                  <MenuLink to="/admin/settings" icon={Settings} sub="Account, security and preferences">Settings</MenuLink>
                  <MenuLink href={websiteUrl()} icon={ExternalLink}>View website</MenuLink>
                </div>
                <div className="py-1.5">
                  <MenuLink onClick={signOut} icon={LogOut} danger>Sign out</MenuLink>
                </div>
              </Dropdown>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 w-full max-w-[1400px] mx-auto">
            {status === 'loading' && <Spinner label="Loading the console" />}

            {status === 'error' && (
              <EmptyState
                icon={TriangleAlert}
                title="Couldn't load the console"
                description={error}
                action={<Button variant="primary" icon={RefreshCw} onClick={() => { setStatus('loading'); load() }}>Try again</Button>}
              />
            )}

            {status === 'ready' && (
              <>
                {error && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#FEC84B] bg-[#FFFCF5] px-4 py-3">
                    <TriangleAlert size={18} className="text-[#DC6803] flex-shrink-0 mt-0.5" />
                    <p className="flex-1 text-sm text-[#93370D]">Couldn't refresh the latest data: {error}</p>
                    <Button size="sm" onClick={() => load({ silent: true })}>Retry</Button>
                  </div>
                )}
                <Routes>
                  <Route index element={<Overview />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="packages" element={<Packages />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="subscribers" element={<Subscribers />} />
                  <Route path="settings" element={<SettingsPage />} />
                  {/* Old address from before Settings existed */}
                  <Route path="account" element={<Navigate to="/admin/settings?tab=security" replace />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </>
            )}
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} data={data} />
    </AdminContext.Provider>
  )
}

/* ── Entry ──────────────────────────────────────────────────────────── */

/**
 * The admin console — a standalone app at /#/admin with its own sign-in and
 * session, separate from the public website. Always English and left-to-right,
 * whatever language the website visitor picked.
 */
export default function AdminApp() {
  const [me, setMe] = useState(() => (session.token() ? session.user() : null))
  const [notice, setNotice] = useState('')
  const handleSignedOut = useCallback((message = '') => {
    setNotice(message)
    setMe(null)
  }, [])

  return (
    <div className="admin-app min-h-screen bg-[#F7F4EE] text-[#1C1A17] antialiased" dir="ltr" lang="en">
      <ToastProvider>
        {me ? (
          <Workspace me={me} onSignedOut={handleSignedOut} onMeUpdated={setMe} />
        ) : (
          <Login notice={notice} onSignedIn={(user) => { setNotice(''); setMe(user) }} />
        )}
      </ToastProvider>
    </div>
  )
}
