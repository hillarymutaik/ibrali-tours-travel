/* Formatting, dates, CSV and time-bucketing helpers for the admin console.
   The console is staff-facing and always English (en-US), independent of the
   language chosen on the public website. */

const LOCALE = 'en-US'
const DAY = 24 * 60 * 60 * 1000

/** Parses MySQL "YYYY-MM-DD HH:MM:SS" and "YYYY-MM-DD" as local time. */
export function parseDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  const s = String(value)
  const iso = s.length === 10 ? `${s}T00:00:00` : s.replace(' ', 'T')
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

const moneyFmt = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const moneyCompactFmt = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })
const numFmt = new Intl.NumberFormat(LOCALE)
const compactFmt = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 })

export const money = (n) => moneyFmt.format(Number(n) || 0)
export const moneyCompact = (n) => moneyCompactFmt.format(Number(n) || 0)
export const num = (n) => numFmt.format(Number(n) || 0)
export const numCompact = (n) => compactFmt.format(Number(n) || 0)

export const dateShort = (v) => {
  const d = parseDate(v)
  return d ? d.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
}
export const dateTime = (v) => {
  const d = parseDate(v)
  return d ? d.toLocaleString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'
}

/** "just now", "5 min ago", "3 h ago", "2 d ago", then a date. */
export function relative(v, now = new Date()) {
  const d = parseDate(v)
  if (!d) return '—'
  const diff = now - d
  const mins = Math.round(diff / 60000)
  // A few minutes "in the future" is clock skew (e.g. a fresh sync vs a cached clock)
  if (diff < -5 * 60000) return dateShort(d)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days} d ago`
  return dateShort(d)
}

/** Whole days from today to a date: positive = future. */
export function daysFromToday(v, now = new Date()) {
  const d = parseDate(v)
  if (!d) return null
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return Math.round((target - start) / DAY)
}

export function travelHint(v, now = new Date()) {
  const days = daysFromToday(v, now)
  if (days === null) return ''
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days > 1) return `In ${days} days`
  if (days === -1) return 'Yesterday'
  return `${Math.abs(days)} days ago`
}

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'

/* ── CSV export ─────────────────────────────────────────────────────── */

export function downloadCsv(filename, rows, columns) {
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [
    columns.map((c) => escape(c.label)).join(','),
    ...rows.map((r) => columns.map((c) => escape(c.value ? c.value(r) : r[c.key])).join(',')),
  ]
  // BOM so Excel opens UTF-8 names correctly
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export const todayStamp = () => new Date().toISOString().slice(0, 10)

/* ── Date ranges & buckets for the dashboard ───────────────────────── */

export const RANGES = [
  { id: '30d', label: 'Last 30 days', short: '30 days' },
  { id: '90d', label: 'Last 90 days', short: '90 days' },
  { id: '12m', label: 'Last 12 months', short: '12 months' },
  { id: 'all', label: 'All time', short: 'all time' },
]

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const monthName = (d, style = 'short') => d.toLocaleDateString(LOCALE, { month: style })
const dayLabel = (d) => d.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' })

/**
 * The window a range covers: { start, end } (end exclusive), plus the
 * equally long window right before it for period-over-period deltas.
 * 'all' has no fixed start and no previous period.
 */
export function rangeWindow(rangeId, now = new Date(), earliest = null) {
  const tomorrow = addDays(startOfDay(now), 1)
  if (rangeId === '30d' || rangeId === '90d') {
    // 90d is 13 whole weeks (91 days) so the KPIs cover exactly what the weekly chart shows
    const days = rangeId === '30d' ? 30 : 91
    const start = addDays(tomorrow, -days)
    return { start, end: tomorrow, prevStart: addDays(start, -days), prevEnd: start }
  }
  if (rangeId === '12m') {
    const start = addMonths(startOfMonth(now), -11)
    return { start, end: tomorrow, prevStart: addMonths(start, -12), prevEnd: start }
  }
  return { start: earliest ? startOfMonth(earliest) : null, end: tomorrow, prevStart: null, prevEnd: null }
}

/** Time buckets for the range: days (30d), weeks (90d), months (12m / all). */
export function buildBuckets(rangeId, now = new Date(), earliest = null) {
  const buckets = []
  if (rangeId === '30d') {
    const start = addDays(startOfDay(now), -29)
    for (let i = 0; i < 30; i++) {
      const s = addDays(start, i)
      buckets.push({ start: s, end: addDays(s, 1), label: dayLabel(s), longLabel: s.toLocaleDateString(LOCALE, { weekday: 'short', month: 'short', day: 'numeric' }) })
    }
  } else if (rangeId === '90d') {
    const start = addDays(startOfDay(now), -90)
    for (let i = 0; i < 13; i++) {
      const s = addDays(start, i * 7)
      buckets.push({ start: s, end: addDays(s, 7), label: dayLabel(s), longLabel: `Week of ${dayLabel(s)}` })
    }
  } else {
    let first = addMonths(startOfMonth(now), -11)
    if (rangeId === 'all') {
      const sixBack = addMonths(startOfMonth(now), -5)
      first = earliest && startOfMonth(earliest) < sixBack ? startOfMonth(earliest) : sixBack
    }
    for (let m = first; m <= now; m = addMonths(m, 1)) {
      const showYear = m.getMonth() === 0 || m.getTime() === first.getTime()
      buckets.push({
        start: m,
        end: addMonths(m, 1),
        label: showYear ? `${monthName(m)} ’${String(m.getFullYear()).slice(2)}` : monthName(m),
        longLabel: `${monthName(m, 'long')} ${m.getFullYear()}`,
      })
    }
  }
  return buckets
}

export const inWindow = (date, start, end) => {
  const d = parseDate(date)
  return !!d && (!start || d >= start) && d < end
}

/** Bookings that count as earned revenue. */
export const isEarned = (b) => b.status === 'confirmed' || b.status === 'completed'

/** Percentage change, or null when there's no meaningful base. */
export function pctChange(current, previous) {
  if (previous === null || previous === undefined) return null
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}
