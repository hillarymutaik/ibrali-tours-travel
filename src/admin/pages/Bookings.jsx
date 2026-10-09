import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Ban, CalendarCheck, CalendarDays, Check, ChevronRight, CircleCheck, Download, Flag, Mail, Phone, RotateCcw,
  Trash2, TriangleAlert, UserRound, UsersRound,
} from 'lucide-react'
import { useAdmin, usePaged } from '../context'
import { adminPost } from '../api'
import {
  Badge, Button, Card, Checkbox, ConfirmDialog, CopyButton, Drawer, EmptyState, PageHeader, Pagination, SearchInput,
  Segmented, StatusBadge,
} from '../ui'
import { dateShort, dateTime, daysFromToday, downloadCsv, money, num, parseDate, relative, todayStamp, travelHint } from '../format'
import { BOOKING_STATUS, STATUS_ORDER } from '../status'
import { inputCls, rowCls, tdCls, thCls } from '../styles'

const TRAVEL_FILTERS = [
  { value: 'any', label: 'Any travel date' },
  { value: 'week', label: 'Departing in 7 days' },
  { value: 'upcoming', label: 'Upcoming trips' },
  { value: 'past', label: 'Past trips' },
]

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'travel', label: 'Travel date (soonest)' },
  { value: 'amount', label: 'Amount (highest)' },
]

function matchesTravel(b, filter) {
  if (filter === 'any') return true
  const d = daysFromToday(b.startDate)
  if (d === null) return false
  if (filter === 'week') return d >= 0 && d <= 7 && b.status !== 'cancelled'
  if (filter === 'upcoming') return d >= 0
  return d < 0
}

function sortBookings(list, sort) {
  const by = {
    newest: (a, b) => parseDate(b.createdAt) - parseDate(a.createdAt),
    oldest: (a, b) => parseDate(a.createdAt) - parseDate(b.createdAt),
    travel: (a, b) => parseDate(a.startDate) - parseDate(b.startDate),
    amount: (a, b) => b.totalPrice - a.totalPrice,
  }
  return [...list].sort(by[sort])
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#F2EDE5] last:border-0">
      <Icon size={17} strokeWidth={1.9} className="text-[#9C9890] mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#7A7268]">{label}</p>
        <div className="text-sm text-[#1C1A17] mt-0.5">{children}</div>
      </div>
    </div>
  )
}

export default function Bookings() {
  const { bookings, run, prefs } = useAdmin()
  const [params, setParams] = useSearchParams()
  const status = params.get('status') || 'all'
  const travel = params.get('travel') || 'any'
  const query = params.get('q') || ''
  const openId = params.get('open')
  const [sort, setSort] = useState('newest')
  const [selected, setSelected] = useState(() => new Set())
  const [confirm, setConfirm] = useState(null) // { title, description, label, tone, action }
  const [busy, setBusy] = useState(false)

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const counts = useMemo(() => {
    const c = { all: bookings.length }
    for (const s of STATUS_ORDER) c[s] = bookings.filter((b) => b.status === s).length
    return c
  }, [bookings])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = bookings.filter((b) => {
      if (status !== 'all' && b.status !== status) return false
      if (!matchesTravel(b, travel)) return false
      if (!q) return true
      return [b.id, b.fullName, b.email, b.phone, b.packageTitle].some((v) => String(v ?? '').toLowerCase().includes(q))
    })
    return sortBookings(list, sort)
  }, [bookings, status, travel, query, sort])

  const paged = usePaged(filtered, prefs.pageSize, `${status}|${travel}|${query}|${sort}|${prefs.pageSize}`)
  const open = openId ? bookings.find((b) => b.id === openId) : null

  const selectedIds = filtered.filter((b) => selected.has(b.id)).map((b) => b.id)
  const allOnPage = paged.pageItems.length > 0 && paged.pageItems.every((b) => selected.has(b.id))
  const someOnPage = paged.pageItems.some((b) => selected.has(b.id))

  const toggleOne = (id, on) => setSelected((s) => {
    const next = new Set(s)
    if (on) next.add(id); else next.delete(id)
    return next
  })
  const togglePage = (on) => setSelected((s) => {
    const next = new Set(s)
    for (const b of paged.pageItems) { if (on) next.add(b.id); else next.delete(b.id) }
    return next
  })

  const setStatus = (ids, next) =>
    run(
      async () => { for (const id of ids) await adminPost('booking-status', { id, status: next }) },
      ids.length === 1 ? `Booking ${ids[0]} marked ${BOOKING_STATUS[next].label.toLowerCase()}` : `${ids.length} bookings marked ${BOOKING_STATUS[next].label.toLowerCase()}`
    )

  const runConfirmed = async () => {
    setBusy(true)
    const ok = await confirm.action()
    setBusy(false)
    if (ok) setConfirm(null)
  }

  const askCancel = (ids) => setConfirm({
    title: ids.length === 1 ? `Cancel booking ${ids[0]}?` : `Cancel ${ids.length} bookings?`,
    description: 'The booking stays on record with a Cancelled status. You can restore it later if needed.',
    label: 'Cancel booking' + (ids.length === 1 ? '' : 's'),
    tone: 'danger',
    action: async () => { const ok = await setStatus(ids, 'cancelled'); if (ok) setSelected(new Set()); return ok },
  })

  const askDelete = (b) => setConfirm({
    title: `Delete booking ${b.id}?`,
    description: `This permanently removes ${b.fullName}'s booking for ${b.packageTitle}. This cannot be undone — cancel it instead if you want to keep a record.`,
    label: 'Delete permanently',
    tone: 'danger',
    action: async () => {
      const ok = await run(() => adminPost('booking-delete', { id: b.id }), `Booking ${b.id} deleted`)
      if (ok) setParam('open', null)
      return ok
    },
  })

  const exportCsv = (list) => downloadCsv(`ibrali-bookings-${todayStamp()}.csv`, list, [
    { key: 'id', label: 'Reference' },
    { label: 'Status', value: (b) => BOOKING_STATUS[b.status]?.label ?? b.status },
    { key: 'fullName', label: 'Customer' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'packageTitle', label: 'Package' },
    { key: 'startDate', label: 'Travel date' },
    { key: 'travelers', label: 'Travellers' },
    { key: 'totalPrice', label: 'Amount (USD)' },
    { label: 'Account', value: (b) => (b.isGuest ? 'Guest' : 'Registered') },
    { key: 'createdAt', label: 'Booked at' },
    { key: 'specialRequests', label: 'Special requests' },
  ])

  const statusActions = (b) => {
    const actions = []
    if (b.status === 'pending') actions.push(<Button key="c" variant="primary" icon={CircleCheck} onClick={() => setStatus([b.id], 'confirmed')}>Confirm booking</Button>)
    if (b.status === 'confirmed') actions.push(<Button key="d" variant="primary" icon={Flag} onClick={() => setStatus([b.id], 'completed')}>Mark as completed</Button>)
    if (b.status === 'completed') actions.push(<Button key="r" icon={RotateCcw} onClick={() => setStatus([b.id], 'confirmed')}>Reopen as confirmed</Button>)
    if (b.status === 'cancelled') actions.push(<Button key="p" icon={RotateCcw} onClick={() => setStatus([b.id], 'pending')}>Restore to pending</Button>)
    if (b.status === 'pending' || b.status === 'confirmed') actions.push(<Button key="x" variant="dangerOutline" icon={Ban} onClick={() => askCancel([b.id])}>Cancel booking</Button>)
    return actions
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Bookings"
        description="Review, confirm and manage every reservation."
        actions={<Button icon={Download} onClick={() => exportCsv(filtered)} disabled={!filtered.length}>Export CSV</Button>}
      />

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 p-4 border-b border-[#E3DCCD]">
          <div className="overflow-x-auto -mx-1 px-1">
            <Segmented
              label="Booking status"
              value={status}
              onChange={(v) => setParam('status', v, 'all')}
              options={[{ value: 'all', label: 'All', count: counts.all }, ...STATUS_ORDER.map((s) => ({ value: s, label: BOOKING_STATUS[s].label, count: counts[s] }))]}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <SearchInput value={query} onChange={(v) => setParam('q', v)} placeholder="Search reference, customer, email or package" className="flex-1" />
            <select value={travel} onChange={(e) => setParam('travel', e.target.value, 'any')} className={`${inputCls} md:w-52`} aria-label="Travel date">
              {TRAVEL_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${inputCls} md:w-52`} aria-label="Sort bookings">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-[#FFF4ED] border-b border-[#FFD9B3]">
            <p className="text-sm font-semibold text-[#96380D] mr-2">{selectedIds.length} selected</p>
            <Button size="sm" icon={CircleCheck} onClick={async () => { if (await setStatus(selectedIds, 'confirmed')) setSelected(new Set()) }}>Confirm</Button>
            <Button size="sm" icon={Flag} onClick={async () => { if (await setStatus(selectedIds, 'completed')) setSelected(new Set()) }}>Mark completed</Button>
            <Button size="sm" variant="dangerOutline" icon={Ban} onClick={() => askCancel(selectedIds)}>Cancel</Button>
            <Button size="sm" icon={Download} onClick={() => exportCsv(filtered.filter((b) => selected.has(b.id)))}>Export</Button>
            <button type="button" onClick={() => setSelected(new Set())} className="ml-auto text-sm font-semibold text-[#96380D] hover:underline">Clear selection</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title={bookings.length ? 'No bookings match these filters' : 'No bookings yet'}
            description={bookings.length ? 'Try a different status, travel date or search term.' : 'Bookings made on the website will appear here.'}
            action={bookings.length ? <Button onClick={() => setParams(new URLSearchParams(), { replace: true })}>Clear filters</Button> : null}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr>
                    <th className={`${thCls} w-12`}>
                      <Checkbox checked={allOnPage} indeterminate={!allOnPage && someOnPage} onChange={togglePage} label="Select all on this page" />
                    </th>
                    <th className={thCls}>Booking</th>
                    <th className={thCls}>Customer</th>
                    <th className={thCls}>Package</th>
                    <th className={thCls}>Travel date</th>
                    <th className={`${thCls} text-right`}>Guests</th>
                    <th className={`${thCls} text-right`}>Amount</th>
                    <th className={thCls}>Status</th>
                    <th className={`${thCls} w-10`}><span className="sr-only">Open</span></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.pageItems.map((b) => (
                    <tr
                      key={b.id}
                      tabIndex={0}
                      onClick={() => setParam('open', b.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setParam('open', b.id) }}
                      className={`${rowCls} cursor-pointer hover:bg-[#FAF7F1] focus:outline-none focus-visible:bg-[#FAF7F1] ${selected.has(b.id) ? 'bg-[#FFFAF5]' : ''}`}
                    >
                      <td className={tdCls} onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.has(b.id)} onChange={(on) => toggleOne(b.id, on)} label={`Select booking ${b.id}`} />
                      </td>
                      <td className={tdCls}>
                        <p className="font-mono text-[13px] font-medium text-[#1C1A17]">{b.id}</p>
                        <p className="text-xs text-[#7A7268]">{relative(b.createdAt)}</p>
                      </td>
                      <td className={tdCls}>
                        <p className="font-medium text-[#1C1A17] flex items-center gap-1.5">
                          {b.fullName}
                          {b.isGuest && <Badge>Guest</Badge>}
                        </p>
                        <p className="text-xs text-[#7A7268]">{b.email}</p>
                      </td>
                      <td className={`${tdCls} max-w-[220px]`}><p className="truncate">{b.packageTitle}</p></td>
                      <td className={tdCls}>
                        <p className="text-[#4A4540] whitespace-nowrap">{dateShort(b.startDate)}</p>
                        <p className="text-xs text-[#7A7268]">{travelHint(b.startDate)}</p>
                      </td>
                      <td className={`${tdCls} text-right tabular-nums`}>{b.travelers}</td>
                      <td className={`${tdCls} text-right font-medium text-[#1C1A17] tabular-nums whitespace-nowrap`}>{money(b.totalPrice)}</td>
                      <td className={tdCls}><StatusBadge status={b.status} /></td>
                      <td className={tdCls}><ChevronRight size={18} className="text-[#9C9890]" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={paged.page} pageCount={paged.pageCount} total={paged.total} pageSize={paged.pageSize} onPage={paged.setPage} />
          </>
        )}
      </Card>

      {/* Booking detail */}
      <Drawer
        open={!!open}
        onClose={() => setParam('open', null)}
        title={open ? <span className="flex items-center gap-2.5 flex-wrap"><span className="font-mono">{open.id}</span><StatusBadge status={open.status} /></span> : ''}
        subtitle={open ? `Booked ${dateTime(open.createdAt)}` : ''}
        footer={open && (
          <>
            <Button variant="ghost" icon={Trash2} onClick={() => askDelete(open)} className="mr-auto !text-[#B42318] hover:!bg-[#FEF3F2]">Delete</Button>
            {statusActions(open)}
          </>
        )}
      >
        {open && (
          <div className="space-y-6">
            {(open.status === 'pending' || open.status === 'confirmed') && daysFromToday(open.startDate) < 0 && (
              <div className="flex items-start gap-3 rounded-lg border border-[#FEC84B] bg-[#FFFCF5] px-3.5 py-3">
                <TriangleAlert size={18} className="text-[#DC6803] flex-shrink-0 mt-px" />
                <p className="text-sm text-[#93370D]">
                  The travel date has passed but this booking is still {BOOKING_STATUS[open.status].label.toLowerCase()}.
                  {open.status === 'confirmed' ? ' Mark it as completed once the trip is done.' : ' Confirm or cancel it to keep reports accurate.'}
                </p>
              </div>
            )}
            <div className="rounded-xl border border-[#E3DCCD] bg-[#FAF7F1] p-4">
              <p className="text-xs font-medium text-[#7A7268]">Total</p>
              <p className="text-[28px] font-semibold text-[#1C1A17] leading-tight">{money(open.totalPrice)}</p>
              <p className="text-sm text-[#6B6560] mt-0.5">{open.packageTitle} · {open.travelers} traveller{open.travelers === 1 ? '' : 's'}</p>
            </div>

            <section>
              <h3 className="text-sm font-semibold text-[#1C1A17] mb-1">Trip</h3>
              <DetailRow icon={CalendarDays} label="Travel date">{dateShort(open.startDate)} <span className="text-[#7A7268]">· {travelHint(open.startDate)}</span></DetailRow>
              <DetailRow icon={UsersRound} label="Travellers">{num(open.travelers)}</DetailRow>
              <DetailRow icon={Check} label="Account">{open.isGuest ? 'Guest checkout' : 'Registered customer'}</DetailRow>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-[#1C1A17] mb-1">Customer</h3>
              <DetailRow icon={UserRound} label="Name">{open.fullName}</DetailRow>
              <DetailRow icon={Mail} label="Email">
                <span className="flex items-center gap-1">
                  <a href={`mailto:${open.email}`} className="text-[#C2470A] hover:underline break-all">{open.email}</a>
                  <CopyButton value={open.email} label="Copy email" />
                </span>
              </DetailRow>
              <DetailRow icon={Phone} label="Phone">
                <span className="flex items-center gap-1">
                  <a href={`tel:${open.phone}`} className="text-[#C2470A] hover:underline">{open.phone}</a>
                  <CopyButton value={open.phone} label="Copy phone" />
                </span>
              </DetailRow>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-[#1C1A17] mb-2">Special requests</h3>
              {open.specialRequests ? (
                <p className="text-sm text-[#4A4540] whitespace-pre-wrap leading-relaxed rounded-lg border border-[#E3DCCD] p-3.5">{open.specialRequests}</p>
              ) : (
                <p className="text-sm text-[#7A7268]">None provided.</p>
              )}
            </section>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent(`Your Ibrali Tours & Travel booking ${open.id}`)}&body=${encodeURIComponent(`Dear ${open.fullName},\n\n`)}`}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[#D9CFBF] bg-white text-sm font-semibold text-[#4A4540] hover:bg-[#FAF7F1] shadow-[0_1px_2px_rgba(28,26,23,0.05)]"
              >
                <Mail size={16} /> Email customer
              </a>
              <a
                href={`tel:${open.phone}`}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[#D9CFBF] bg-white text-sm font-semibold text-[#4A4540] hover:bg-[#FAF7F1] shadow-[0_1px_2px_rgba(28,26,23,0.05)]"
              >
                <Phone size={16} /> Call
              </a>
            </div>
          </div>
        )}
      </Drawer>

      {openId && !open && (
        <Drawer open onClose={() => setParam('open', null)} title="Booking not found">
          <EmptyState icon={CalendarCheck} title="This booking no longer exists" description={`No booking with reference ${openId}. It may have been deleted.`} />
        </Drawer>
      )}

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        description={confirm?.description}
        confirmLabel={confirm?.label}
        tone={confirm?.tone}
        busy={busy}
        onConfirm={runConfirmed}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
