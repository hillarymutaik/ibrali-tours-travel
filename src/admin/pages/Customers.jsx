import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarCheck, ChevronRight, Download, Mail, Phone, ShieldCheck, ShieldOff, UsersRound } from 'lucide-react'
import { useAdmin, usePaged } from '../context'
import { adminPost } from '../api'
import {
  Avatar, Badge, Button, Card, ConfirmDialog, CopyButton, Drawer, EmptyState, PageHeader, Pagination, SearchInput, Segmented,
  StatusBadge,
} from '../ui'
import { dateShort, downloadCsv, isEarned, money, num, parseDate, relative, todayStamp } from '../format'
import { rowCls, tdCls, thCls } from '../styles'

function RoleBadge({ role }) {
  return role === 'admin'
    ? <Badge tone="brand" icon={ShieldCheck}>Admin</Badge>
    : <Badge>Customer</Badge>
}

export default function Customers() {
  const { users, bookings, me, run, prefs } = useAdmin()
  const [params, setParams] = useSearchParams()
  const role = ['customer', 'admin'].includes(params.get('role')) ? params.get('role') : 'all'
  const query = params.get('q') || ''
  const openId = Number(params.get('open')) || null
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, String(value))
    setParams(next, { replace: true })
  }

  const totals = useMemo(() => {
    const m = new Map()
    for (const b of bookings) {
      if (b.userId === null) continue
      const t = m.get(b.userId) ?? { count: 0, spent: 0 }
      t.count += 1
      if (isEarned(b)) t.spent += b.totalPrice
      m.set(b.userId, t)
    }
    return m
  }, [bookings])

  const admins = users.filter((u) => u.role === 'admin').length
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users
      .filter((u) => (role === 'all' ? true : u.role === role))
      .filter((u) => !q || [u.name, u.email, u.phone].some((v) => String(v ?? '').toLowerCase().includes(q)))
      .sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
  }, [users, role, query])
  const paged = usePaged(filtered, prefs.pageSize, `${role}|${query}|${prefs.pageSize}`)

  const open = openId ? users.find((u) => u.id === openId) : null
  const openBookings = open
    ? bookings.filter((b) => b.userId === open.id).sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
    : []

  const askRole = (u) => {
    const makeAdmin = u.role !== 'admin'
    setConfirm({
      title: makeAdmin ? `Give ${u.name} admin access?` : `Remove admin access from ${u.name}?`,
      description: makeAdmin
        ? 'They will be able to sign in to this console and manage bookings, packages, messages and other accounts.'
        : 'They will keep their customer account but can no longer sign in to this console.',
      label: makeAdmin ? 'Grant admin access' : 'Remove admin access',
      tone: makeAdmin ? 'brand' : 'danger',
      action: () => run(() => adminPost('user-role', { id: u.id, role: makeAdmin ? 'admin' : 'customer' }), makeAdmin ? `${u.name} is now an admin` : `${u.name} is no longer an admin`),
    })
  }

  const runConfirmed = async () => {
    setBusy(true)
    const ok = await confirm.action()
    setBusy(false)
    if (ok) setConfirm(null)
  }

  const exportCsv = () => downloadCsv(`ibrali-customers-${todayStamp()}.csv`, filtered, [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { label: 'Role', value: (u) => (u.role === 'admin' ? 'Admin' : 'Customer') },
    { label: 'Bookings', value: (u) => totals.get(u.id)?.count ?? 0 },
    { label: 'Total spent (USD)', value: (u) => totals.get(u.id)?.spent ?? 0 },
    { key: 'createdAt', label: 'Joined' },
  ])

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="Customers & team"
        description="Registered website accounts and the staff with console access."
        actions={<Button icon={Download} onClick={exportCsv} disabled={!filtered.length}>Export CSV</Button>}
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row gap-3 p-4 border-b border-[#E3DCCD]">
          <Segmented
            label="Role"
            value={role}
            onChange={(v) => setParam('role', v === 'all' ? null : v)}
            options={[
              { value: 'all', label: 'All', count: users.length },
              { value: 'customer', label: 'Customers', count: users.length - admins },
              { value: 'admin', label: 'Admins', count: admins },
            ]}
          />
          <SearchInput value={query} onChange={(v) => setParam('q', v)} placeholder="Search name, email or phone" className="flex-1" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={UsersRound} title={users.length ? 'No people match' : 'No accounts yet'} description={users.length ? 'Try another search or filter.' : 'Customers who register on the website will appear here.'} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px]">
                <thead>
                  <tr>
                    <th className={thCls}>Name</th>
                    <th className={thCls}>Phone</th>
                    <th className={thCls}>Role</th>
                    <th className={`${thCls} text-right`}>Bookings</th>
                    <th className={`${thCls} text-right`}>Total spent</th>
                    <th className={thCls}>Joined</th>
                    <th className={`${thCls} w-10`}><span className="sr-only">Open</span></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.pageItems.map((u) => {
                    const t = totals.get(u.id) ?? { count: 0, spent: 0 }
                    return (
                      <tr
                        key={u.id}
                        tabIndex={0}
                        onClick={() => setParam('open', u.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setParam('open', u.id) }}
                        className={`${rowCls} cursor-pointer hover:bg-[#FAF7F1] focus:outline-none focus-visible:bg-[#FAF7F1]`}
                      >
                        <td className={tdCls}>
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} size={36} tone={u.role === 'admin' ? 'brand' : 'neutral'} />
                            <div className="min-w-0">
                              <p className="font-medium text-[#1C1A17] flex items-center gap-1.5">
                                {u.name}
                                {u.id === me.id && <span className="text-xs font-normal text-[#7A7268]">(you)</span>}
                              </p>
                              <p className="text-xs text-[#7A7268]">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`${tdCls} whitespace-nowrap`}>{u.phone || '—'}</td>
                        <td className={tdCls}><RoleBadge role={u.role} /></td>
                        <td className={`${tdCls} text-right tabular-nums`}>{num(t.count)}</td>
                        <td className={`${tdCls} text-right tabular-nums font-medium text-[#1C1A17]`}>{money(t.spent)}</td>
                        <td className={`${tdCls} whitespace-nowrap`}>{dateShort(u.createdAt)}</td>
                        <td className={tdCls}><ChevronRight size={18} className="text-[#9C9890]" /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={paged.page} pageCount={paged.pageCount} total={paged.total} pageSize={paged.pageSize} onPage={paged.setPage} />
          </>
        )}
      </Card>

      <Drawer
        open={!!open}
        onClose={() => setParam('open', null)}
        title={open?.name}
        subtitle={open ? `Joined ${dateShort(open.createdAt)}` : ''}
        footer={open && (open.id === me.id ? (
          <p className="text-[13px] text-[#7A7268] mr-auto self-center">You can't change your own role.</p>
        ) : (
          <Button
            variant={open.role === 'admin' ? 'dangerOutline' : 'secondary'}
            icon={open.role === 'admin' ? ShieldOff : ShieldCheck}
            onClick={() => askRole(open)}
          >
            {open.role === 'admin' ? 'Remove admin access' : 'Make admin'}
          </Button>
        ))}
      >
        {open && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={open.name} size={56} tone={open.role === 'admin' ? 'brand' : 'neutral'} />
              <div className="min-w-0">
                <RoleBadge role={open.role} />
                <div className="mt-2 space-y-1 text-sm">
                  <p className="flex items-center gap-1.5 text-[#4A4540]">
                    <Mail size={15} className="text-[#9C9890]" />
                    <a href={`mailto:${open.email}`} className="hover:text-[#C2470A] break-all">{open.email}</a>
                    <CopyButton value={open.email} label="Copy email" />
                  </p>
                  {open.phone && (
                    <p className="flex items-center gap-1.5 text-[#4A4540]">
                      <Phone size={15} className="text-[#9C9890]" />
                      <a href={`tel:${open.phone}`} className="hover:text-[#C2470A]">{open.phone}</a>
                      <CopyButton value={open.phone} label="Copy phone" />
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#E3DCCD] p-4">
                <p className="text-xs font-medium text-[#7A7268]">Bookings</p>
                <p className="text-2xl font-semibold text-[#1C1A17] mt-1">{num(openBookings.length)}</p>
              </div>
              <div className="rounded-xl border border-[#E3DCCD] p-4">
                <p className="text-xs font-medium text-[#7A7268]">Total spent</p>
                <p className="text-2xl font-semibold text-[#1C1A17] mt-1">{money(openBookings.filter(isEarned).reduce((s, b) => s + b.totalPrice, 0))}</p>
              </div>
            </div>

            <section>
              <h3 className="text-sm font-semibold text-[#1C1A17] mb-2">Booking history</h3>
              {openBookings.length === 0 ? (
                <p className="text-sm text-[#7A7268]">No bookings made with this account yet.</p>
              ) : (
                <ul className="rounded-xl border border-[#E3DCCD] divide-y divide-[#E3DCCD] overflow-hidden">
                  {openBookings.map((b) => (
                    <li key={b.id}>
                      <Link to={`/admin/bookings?open=${encodeURIComponent(b.id)}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAF7F1]">
                        <CalendarCheck size={17} className="text-[#9C9890] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#1C1A17] truncate">{b.packageTitle}</p>
                          <p className="text-xs text-[#7A7268]"><span className="font-mono">{b.id}</span> · travels {dateShort(b.startDate)} · booked {relative(b.createdAt)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium text-[#1C1A17] tabular-nums">{money(b.totalPrice)}</p>
                          <div className="mt-1"><StatusBadge status={b.status} /></div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </Drawer>

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
