import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDownRight, ArrowUpRight, AtSign, CalendarCheck, ChevronRight, CircleDollarSign, Inbox, Minus,
  PlaneTakeoff, ReceiptText, UserPlus, UsersRound,
} from 'lucide-react'
import { useAdmin } from '../context'
import { Card, CardHeader, EmptyState, PageHeader, Segmented, StatusBadge } from '../ui'
import { BarList, ChartCard, ColumnChart } from '../charts'
import {
  RANGES, buildBuckets, daysFromToday, inWindow, isEarned, money, moneyCompact, num, parseDate, pctChange, rangeWindow,
  relative, travelHint, dateShort,
} from '../format'
import { STATUS_ORDER } from '../status'
import { rowCls, tdCls, thCls } from '../styles'

const greeting = (d) => (d.getHours() < 12 ? 'Good morning' : d.getHours() < 18 ? 'Good afternoon' : 'Good evening')

/** Signed change vs the previous period — colour follows "up is good". */
function Delta({ pct, label }) {
  if (pct === null) {
    // No comparable base (all-time view, or nothing in the previous period)
    return <span className="text-[13px] text-[#7A7268]">{label === 'All time' ? label : `— ${label}`}</span>
  }
  const rounded = Math.round(pct)
  const tone = rounded > 0 ? 'text-[#067647]' : rounded < 0 ? 'text-[#B42318]' : 'text-[#6B6560]'
  const Icon = rounded > 0 ? ArrowUpRight : rounded < 0 ? ArrowDownRight : Minus
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6B6560]">
      <span className={`inline-flex items-center gap-0.5 font-semibold ${tone}`}>
        <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
        {rounded > 0 ? '+' : ''}{rounded}%
      </span>
      {label}
    </span>
  )
}

function KpiTile({ icon: Icon, label, value, pct, compareLabel, sub }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#6B6560]">{label}</p>
        <span className="w-9 h-9 rounded-lg border border-[#E3DCCD] flex items-center justify-center text-[#6B6560] flex-shrink-0">
          <Icon size={18} strokeWidth={1.9} />
        </span>
      </div>
      <p className="text-[30px] leading-none font-semibold text-[#1C1A17] tracking-[-0.02em] mt-3">{value}</p>
      <div className="mt-3 min-h-[20px]"><Delta pct={pct} label={compareLabel} /></div>
      {sub && <p className="text-xs text-[#7A7268] mt-1">{sub}</p>}
    </Card>
  )
}

function AttentionCard({ to, icon: Icon, count, label, clearLabel }) {
  const active = count > 0
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border border-[#E3DCCD] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(28,26,23,0.05)] hover:border-[#D9CFBF] transition-colors"
    >
      <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-[#FFF4ED] text-[#C2470A]' : 'bg-[#F2EDE5] text-[#7A7268]'}`}>
        <Icon size={19} strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1C1A17]">{active ? `${count} ${label}` : clearLabel}</p>
        <p className="text-xs text-[#7A7268] mt-0.5">{active ? 'Needs attention' : 'Nothing waiting'}</p>
      </div>
      <ChevronRight size={18} className="text-[#9C9890] group-hover:text-[#6B6560] group-hover:translate-x-0.5 transition" />
    </Link>
  )
}

export default function Overview() {
  const { me, bookings, messages, users, subscribers, refreshing, prefs } = useAdmin()
  const navigate = useNavigate()
  const [range, setRange] = useState(prefs.defaultRange)
  const now = new Date()
  const rangeMeta = RANGES.find((r) => r.id === range)

  const earliest = useMemo(
    () => bookings.reduce((min, b) => {
      const d = parseDate(b.createdAt)
      return d && (!min || d < min) ? d : min
    }, null),
    [bookings]
  )

  const view = useMemo(() => {
    const at = new Date()
    const win = rangeWindow(range, at, earliest)
    const inRange = bookings.filter((b) => inWindow(b.createdAt, win.start, win.end))
    const prev = win.prevStart ? bookings.filter((b) => inWindow(b.createdAt, win.prevStart, win.prevEnd)) : null

    const earned = (list) => list.filter(isEarned)
    const revenueOf = (list) => earned(list).reduce((s, b) => s + b.totalPrice, 0)
    const avgOf = (list) => (earned(list).length ? revenueOf(list) / earned(list).length : 0)
    const travellersOf = (list) => list.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.travelers, 0)

    const buckets = buildBuckets(range, at, earliest)
    const series = buckets.map((bk, i) => {
      const inBucket = bookings.filter((b) => inWindow(b.createdAt, bk.start, bk.end))
      return { key: i, label: bk.label, longLabel: bk.longLabel, revenue: revenueOf(inBucket), count: inBucket.length }
    })

    const byPackage = new Map()
    for (const b of earned(inRange)) {
      const cur = byPackage.get(b.packageTitle) ?? { key: b.packageTitle, label: b.packageTitle, value: 0, count: 0 }
      cur.value += b.totalPrice
      cur.count += 1
      byPackage.set(b.packageTitle, cur)
    }
    const topPackages = [...byPackage.values()].sort((a, b) => b.value - a.value).slice(0, 5)
      .map((p) => ({ ...p, sub: `${p.count} booking${p.count === 1 ? '' : 's'}` }))

    const statusMix = STATUS_ORDER.map((s) => {
      const list = inRange.filter((b) => b.status === s)
      return { status: s, count: list.length, value: list.reduce((sum, b) => sum + b.totalPrice, 0) }
    })

    const newUsers = users.filter((u) => inWindow(u.createdAt, win.start, win.end)).length
    const prevUsers = win.prevStart ? users.filter((u) => inWindow(u.createdAt, win.prevStart, win.prevEnd)).length : null
    const newSubs = subscribers.filter((s) => inWindow(s.createdAt, win.start, win.end)).length
    const prevSubs = win.prevStart ? subscribers.filter((s) => inWindow(s.createdAt, win.prevStart, win.prevEnd)).length : null

    return {
      inRange,
      revenue: revenueOf(inRange), prevRevenue: prev ? revenueOf(prev) : null,
      count: inRange.length, prevCount: prev ? prev.length : null,
      avg: avgOf(inRange), prevAvg: prev ? avgOf(prev) : null,
      travellers: travellersOf(inRange), prevTravellers: prev ? travellersOf(prev) : null,
      pending: inRange.filter((b) => b.status === 'pending'),
      series, topPackages, statusMix,
      newUsers, prevUsers, newSubs, prevSubs,
      latest: [...inRange].sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt)).slice(0, 6),
    }
  }, [bookings, users, subscribers, range, earliest])

  const pendingAll = bookings.filter((b) => b.status === 'pending').length
  const unread = messages.filter((m) => !m.isRead).length
  const departures = bookings.filter((b) => {
    const d = daysFromToday(b.startDate)
    return b.status === 'confirmed' && d !== null && d >= 0 && d <= 7
  }).length

  const compare = range === 'all' ? 'All time' : `vs previous ${rangeMeta.short}`
  const totalInRange = view.statusMix.reduce((s, x) => s + x.count, 0)
  const pendingValue = view.pending.reduce((s, b) => s + b.totalPrice, 0)

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title={`${greeting(now)}, ${me.name.split(' ')[0]}`}
        description="Here's what's happening across Ibrali Tours & Travel."
      />

      {/* Live state — not affected by the date range below */}
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <AttentionCard to="/admin/bookings?status=pending" icon={CalendarCheck} count={pendingAll} label={pendingAll === 1 ? 'booking to confirm' : 'bookings to confirm'} clearLabel="No bookings to confirm" />
        <AttentionCard to="/admin/messages?filter=unread" icon={Inbox} count={unread} label={unread === 1 ? 'unread message' : 'unread messages'} clearLabel="Inbox is clear" />
        <AttentionCard to="/admin/bookings?travel=week" icon={PlaneTakeoff} count={departures} label={departures === 1 ? 'departure this week' : 'departures this week'} clearLabel="No departures this week" />
      </div>

      {/* One filter row, scoping everything below it */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <Segmented label="Date range" options={RANGES.map((r) => ({ value: r.id, label: r.label }))} value={range} onChange={setRange} />
        <p className="text-[13px] text-[#7A7268]">Based on booking date</p>
      </div>

      <div className={`space-y-6 transition-opacity duration-200 ${refreshing ? 'opacity-60' : ''}`}>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiTile icon={CircleDollarSign} label="Revenue" value={money(view.revenue)} pct={pctChange(view.revenue, view.prevRevenue)} compareLabel={compare} sub="Confirmed and completed bookings" />
          <KpiTile icon={CalendarCheck} label="Bookings" value={num(view.count)} pct={pctChange(view.count, view.prevCount)} compareLabel={compare} sub={`${view.pending.length} pending · ${money(pendingValue)} in pipeline`} />
          <KpiTile icon={ReceiptText} label="Average booking value" value={money(view.avg)} pct={pctChange(view.avg, view.prevAvg)} compareLabel={compare} sub="Per confirmed booking" />
          <KpiTile icon={UsersRound} label="Travellers" value={num(view.travellers)} pct={pctChange(view.travellers, view.prevTravellers)} compareLabel={compare} sub="Excluding cancelled bookings" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard
            title="Revenue"
            subtitle="Confirmed and completed bookings"
            table={{ columns: [{ label: 'Period' }, { label: 'Revenue', align: 'right' }], rows: view.series.map((s) => [s.longLabel, money(s.revenue)]) }}
          >
            <ColumnChart
              label={`Revenue by period, ${rangeMeta.label.toLowerCase()}`}
              data={view.series.map((s) => ({ key: s.key, label: s.label, longLabel: s.longLabel, value: s.revenue }))}
              format={money}
              formatAxis={moneyCompact}
            />
          </ChartCard>
          <ChartCard
            title="Bookings received"
            subtitle="All bookings, any status"
            table={{ columns: [{ label: 'Period' }, { label: 'Bookings', align: 'right' }], rows: view.series.map((s) => [s.longLabel, num(s.count)]) }}
          >
            <ColumnChart
              label={`Bookings by period, ${rangeMeta.label.toLowerCase()}`}
              data={view.series.map((s) => ({ key: s.key, label: s.label, longLabel: s.longLabel, value: s.count }))}
              format={(v) => `${num(v)} booking${v === 1 ? '' : 's'}`}
              formatAxis={num}
              integer
            />
          </ChartCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard
            title="Top packages"
            subtitle="By revenue"
            table={view.topPackages.length ? {
              columns: [{ label: 'Package' }, { label: 'Bookings', align: 'right' }, { label: 'Revenue', align: 'right' }],
              rows: view.topPackages.map((p) => [p.label, num(p.count), money(p.value)]),
            } : null}
          >
            {view.topPackages.length ? (
              <BarList items={view.topPackages} format={money} />
            ) : (
              <EmptyState compact icon={CircleDollarSign} title="No revenue yet" description="Confirmed bookings in this period will rank packages here." />
            )}
          </ChartCard>

          <Card>
            <CardHeader title="Booking status" subtitle={`${num(totalInRange)} booking${totalInRange === 1 ? '' : 's'} in this period`} />
            <ul className="px-5 pb-4">
              {view.statusMix.map((s) => {
                const share = totalInRange ? s.count / totalInRange : 0
                return (
                  <li key={s.status}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/bookings?status=${s.status}`)}
                      className="w-full flex items-center gap-4 py-3 border-b border-[#F2EDE5] last:border-0 text-left group"
                    >
                      <span className="w-[112px] flex-shrink-0"><StatusBadge status={s.status} /></span>
                      <span className="flex-1 min-w-0">
                        <span className="block h-2 rounded-r-[4px] bg-[#E75A08] group-hover:bg-[#C2470A] transition-colors" style={{ width: `${share * 100}%`, minWidth: s.count ? 3 : 0 }} />
                      </span>
                      <span className="w-12 text-right text-sm font-semibold text-[#1C1A17] tabular-nums">{num(s.count)}</span>
                      <span className="w-12 text-right text-[13px] text-[#7A7268] tabular-nums">{Math.round(share * 100)}%</span>
                      <span className="hidden sm:block w-24 text-right text-[13px] text-[#6B6560] tabular-nums">{money(s.value)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 overflow-hidden">
            <CardHeader
              title="Latest bookings"
              subtitle="Most recent in this period"
              actions={<Link to="/admin/bookings" className="text-sm font-semibold text-[#C2470A] hover:text-[#96380D]">View all</Link>}
            />
            {view.latest.length === 0 ? (
              <EmptyState compact icon={CalendarCheck} title="No bookings in this period" description="New bookings from the website will appear here." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px]">
                  <thead>
                    <tr>
                      <th className={thCls}>Customer</th>
                      <th className={thCls}>Package</th>
                      <th className={thCls}>Travel date</th>
                      <th className={`${thCls} text-right`}>Amount</th>
                      <th className={thCls}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.latest.map((b) => (
                      <tr
                        key={b.id}
                        tabIndex={0}
                        onClick={() => navigate(`/admin/bookings?open=${encodeURIComponent(b.id)}`)}
                        onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/bookings?open=${encodeURIComponent(b.id)}`) }}
                        className={`${rowCls} cursor-pointer hover:bg-[#FAF7F1] focus:outline-none focus-visible:bg-[#FAF7F1]`}
                      >
                        <td className={tdCls}>
                          <p className="font-medium text-[#1C1A17]">{b.fullName}</p>
                          <p className="text-xs text-[#7A7268]"><span className="font-mono">{b.id}</span> · {relative(b.createdAt)}</p>
                        </td>
                        <td className={`${tdCls} max-w-[220px] truncate`}>{b.packageTitle}</td>
                        <td className={tdCls}>
                          <p className="text-[#4A4540]">{dateShort(b.startDate)}</p>
                          <p className="text-xs text-[#7A7268]">{travelHint(b.startDate)}</p>
                        </td>
                        <td className={`${tdCls} text-right font-medium text-[#1C1A17] tabular-nums`}>{money(b.totalPrice)}</td>
                        <td className={tdCls}><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Audience growth" subtitle="New sign-ups in this period" />
            <div className="px-5 pb-5 space-y-3">
              {[
                { icon: UserPlus, label: 'New customer accounts', value: view.newUsers, prev: view.prevUsers, to: '/admin/customers' },
                { icon: AtSign, label: 'New newsletter subscribers', value: view.newSubs, prev: view.prevSubs, to: '/admin/subscribers' },
              ].map((row) => (
                <Link key={row.label} to={row.to} className="flex items-center gap-4 rounded-lg border border-[#E3DCCD] p-4 hover:border-[#D9CFBF] transition-colors">
                  <span className="w-10 h-10 rounded-lg bg-[#F2EDE5] text-[#6B6560] flex items-center justify-center flex-shrink-0">
                    <row.icon size={19} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-[#6B6560]">{row.label}</p>
                    <p className="text-2xl font-semibold text-[#1C1A17] leading-tight mt-0.5">{num(row.value)}</p>
                    <div className="mt-1"><Delta pct={pctChange(row.value, row.prev)} label={compare} /></div>
                  </div>
                </Link>
              ))}
              <p className="text-xs text-[#7A7268] pt-1">
                {num(users.length)} accounts and {num(subscribers.length)} subscribers in total.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
