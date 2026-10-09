import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  CircleCheck, ExternalLink, Eye, EyeOff, KeyRound, Keyboard, LogOut, MonitorSmartphone, RefreshCw, RotateCcw, Server,
  ShieldCheck, SlidersHorizontal, TriangleAlert, UserRound, UsersRound,
} from 'lucide-react'
import { useAdmin, useToast } from '../context'
import { API_BASE, changePassword, signOutOtherDevices, updateProfile } from '../api'
import { Avatar, Badge, Button, Card, ConfirmDialog, CopyButton, Field, PageHeader } from '../ui'
import { dateShort, num, relative } from '../format'
import { DEFAULT_PREFS, PREF_OPTIONS, refreshLabel } from '../prefs'
import { inputCls } from '../styles'

const TABS = [
  { id: 'account', label: 'Account', icon: UserRound },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { id: 'system', label: 'System', icon: Server },
]

const websiteUrl = () => `${window.location.origin}${window.location.pathname}#/`
const consoleUrl = () => `${window.location.origin}${window.location.pathname}#/admin`

/** Settings row: what it is on the left, the controls on the right. */
function Section({ title, description, children }) {
  return (
    <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-4 lg:gap-8 py-7 border-b border-[#E3DCCD] last:border-0">
      <div>
        <h2 className="text-sm font-semibold text-[#4A4540]">{title}</h2>
        {description && <p className="text-sm text-[#6B6560] mt-1 leading-relaxed">{description}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function PasswordInput({ id, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} className={`${inputCls} pr-11`} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center text-[#7A7268] hover:text-[#4A4540] hover:bg-[#F2EDE5]"
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
}

/* ── Account ────────────────────────────────────────────────────────── */

function AccountTab() {
  const { me, users, updateMe, run, signOut } = useAdmin()
  const record = users.find((u) => u.id === me.id)
  const [form, setForm] = useState({ name: me.name ?? '', phone: me.phone ?? record?.phone ?? '' })
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  const nameError = !form.name.trim() ? 'Enter your name' : form.name.trim().length > 120 ? 'Use 120 characters or fewer' : ''
  const phoneError = form.phone.trim().length > 30 ? 'Use 30 characters or fewer' : ''
  const changed = form.name.trim() !== (me.name ?? '') || form.phone.trim() !== (me.phone ?? record?.phone ?? '')

  const save = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (nameError || phoneError) return
    setSaving(true)
    await run(async () => updateMe(await updateProfile(form.name.trim(), form.phone.trim())), 'Profile updated')
    setSaving(false)
  }

  return (
    <>
      <Section title="Profile" description="How you appear to other admins in this console.">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={form.name || me.name} size={56} />
            <div className="min-w-0">
              <p className="text-base font-semibold text-[#1C1A17] truncate">{me.name}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge tone="brand" icon={ShieldCheck}>Administrator</Badge>
                {record?.createdAt && <span className="text-xs text-[#7A7268]">Member since {dateShort(record.createdAt)}</span>}
              </div>
            </div>
          </div>
          <form onSubmit={save} className="space-y-5" noValidate>
            <Field label="Full name" htmlFor="s-name" error={touched ? nameError : ''}>
              <input id="s-name" className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoComplete="name" />
            </Field>
            <Field label="Email" htmlFor="s-email" hint="Used to sign in, so it can't be changed here.">
              <input id="s-email" className={`${inputCls} bg-[#FAF7F1] text-[#7A7268] cursor-not-allowed`} value={me.email} readOnly aria-readonly="true" />
            </Field>
            <Field label="Phone" htmlFor="s-phone" error={touched ? phoneError : ''}>
              <input id="s-phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+254 …" autoComplete="tel" />
            </Field>
            <div className="flex justify-end gap-2.5">
              {changed && <Button onClick={() => { setForm({ name: me.name ?? '', phone: me.phone ?? record?.phone ?? '' }); setTouched(false) }}>Discard</Button>}
              <Button type="submit" variant="primary" loading={saving} disabled={!changed}>Save changes</Button>
            </div>
          </form>
        </Card>
      </Section>

      <Section title="Sign out" description="End your session on this device. You'll need your password to sign in again.">
        <Card className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <MonitorSmartphone size={20} className="text-[#7A7268] flex-shrink-0" />
            <p className="text-sm text-[#4A4540] min-w-0">Signed in as <span className="font-medium text-[#1C1A17] break-all">{me.email}</span></p>
          </div>
          <Button icon={LogOut} onClick={signOut}>Sign out</Button>
        </Card>
      </Section>
    </>
  )
}

/* ── Security ───────────────────────────────────────────────────────── */

function SecurityTab() {
  const { users } = useAdmin()
  const toast = useToast()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState('')
  const [confirmOthers, setConfirmOthers] = useState(false)
  const [revoking, setRevoking] = useState(false)

  const errors = {
    current: !form.current ? 'Enter your current password' : '',
    next: form.next.length < 8 ? 'Use at least 8 characters' : form.next === form.current ? 'Choose a password different from the current one' : '',
    confirm: form.confirm !== form.next ? 'Passwords do not match' : '',
  }
  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setServerError('') }

  const submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.values(errors).some(Boolean)) return
    setBusy(true)
    try {
      // A wrong current password is a 401 here — shown inline, not treated as a lost session
      await changePassword(form.current, form.next)
      setForm({ current: '', next: '', confirm: '' })
      setTouched(false)
      toast.success('Password updated. Other devices have been signed out.')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const revokeOthers = async () => {
    setRevoking(true)
    try {
      const { revoked } = await signOutOtherDevices()
      toast.success(revoked ? `Signed out of ${revoked} other session${revoked === 1 ? '' : 's'}` : 'No other sessions were signed in')
      setConfirmOthers(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setRevoking(false)
    }
  }

  const admins = users.filter((u) => u.role === 'admin')

  return (
    <>
      <Section title="Password" description="Use at least 8 characters. Changing it signs you out on every other device.">
        <Card className="p-5 sm:p-6">
          <form onSubmit={submit} className="space-y-5" noValidate>
            {serverError && (
              <p role="alert" className="flex items-start gap-2.5 rounded-lg border border-[#FECDCA] bg-[#FEF3F2] px-3.5 py-3 text-sm text-[#B42318]">
                <TriangleAlert size={17} className="flex-shrink-0 mt-px" />{serverError}
              </p>
            )}
            <Field label="Current password" htmlFor="pw-current" error={touched ? errors.current : ''}>
              <PasswordInput id="pw-current" value={form.current} onChange={set('current')} autoComplete="current-password" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="New password" htmlFor="pw-next" error={touched ? errors.next : ''}>
                <PasswordInput id="pw-next" value={form.next} onChange={set('next')} autoComplete="new-password" />
              </Field>
              <Field label="Confirm new password" htmlFor="pw-confirm" error={touched ? errors.confirm : ''}>
                <PasswordInput id="pw-confirm" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" icon={KeyRound} loading={busy}>Update password</Button>
            </div>
          </form>
        </Card>
      </Section>

      <Section title="Sessions" description="If you signed in on a shared or lost device, sign it out from here.">
        <Card className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MonitorSmartphone size={20} className="text-[#7A7268] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#1C1A17]">This device</p>
              <p className="text-[13px] text-[#7A7268]">Stays signed in. All other devices will need to sign in again.</p>
            </div>
          </div>
          <Button variant="dangerOutline" icon={LogOut} onClick={() => setConfirmOthers(true)}>Sign out other devices</Button>
        </Card>
      </Section>

      <Section title="Admin access" description="People who can sign in to this console and manage everything in it.">
        <Card className="overflow-hidden">
          <ul className="divide-y divide-[#E3DCCD]">
            {admins.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={u.name} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#1C1A17] truncate">{u.name}</p>
                  <p className="text-xs text-[#7A7268] truncate">{u.email}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-5 py-3.5 border-t border-[#E3DCCD] bg-[#FAF7F1] flex items-center justify-between gap-3">
            <p className="text-[13px] text-[#6B6560]">{num(admins.length)} admin{admins.length === 1 ? '' : 's'}</p>
            <Link to="/admin/customers?role=admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2470A] hover:text-[#96380D]">
              <UsersRound size={16} /> Manage team
            </Link>
          </div>
        </Card>
      </Section>

      <ConfirmDialog
        open={confirmOthers}
        tone="danger"
        title="Sign out all other devices?"
        description="Any other browser or device signed in to your account will be signed out immediately. This device stays signed in."
        confirmLabel="Sign out other devices"
        busy={revoking}
        onConfirm={revokeOthers}
        onCancel={() => setConfirmOthers(false)}
      />
    </>
  )
}

/* ── Preferences ────────────────────────────────────────────────────── */

function PreferencesTab() {
  const { prefs, updatePrefs } = useAdmin()
  const toast = useToast()
  const change = (key, raw) => {
    const option = PREF_OPTIONS[key].find((o) => String(o.value) === raw)
    if (!option) return
    updatePrefs({ [key]: option.value })
    toast.success('Preference saved')
  }
  const isDefault = Object.keys(DEFAULT_PREFS).every((k) => prefs[k] === DEFAULT_PREFS[k])

  const rows = [
    { key: 'defaultRange', title: 'Default dashboard period', description: 'The date range the dashboard opens with.' },
    { key: 'refreshSeconds', title: 'Auto-refresh', description: 'How often new bookings and messages are pulled in while the console is open.' },
    { key: 'pageSize', title: 'Rows per page', description: 'How many rows tables show before paging.' },
  ]

  return (
    <>
      {rows.map((r) => (
        <Section key={r.key} title={r.title} description={r.description}>
          <Card className="p-5 sm:p-6">
            <select
              value={String(prefs[r.key])}
              onChange={(e) => change(r.key, e.target.value)}
              className={`${inputCls} sm:max-w-xs`}
              aria-label={r.title}
            >
              {PREF_OPTIONS[r.key].map((o) => <option key={o.value} value={String(o.value)}>{o.label}</option>)}
            </select>
          </Card>
        </Section>
      ))}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6">
        <p className="text-[13px] text-[#7A7268]">Preferences are saved in this browser.</p>
        <Button
          icon={RotateCcw}
          disabled={isDefault}
          onClick={() => { updatePrefs(DEFAULT_PREFS); toast.success('Preferences reset to defaults') }}
        >
          Reset to defaults
        </Button>
      </div>
    </>
  )
}

/* ── System ─────────────────────────────────────────────────────────── */

function SystemTab() {
  const { error, updatedAt, refreshing, load, prefs, bookings, packages, users, subscribers, messages } = useAdmin()
  const stats = [
    { label: 'Bookings', value: bookings.length, sub: `${num(bookings.filter((b) => b.status === 'pending').length)} pending` },
    { label: 'Packages', value: packages.length, sub: `${num(packages.filter((p) => p.isActive).length)} live` },
    { label: 'Accounts', value: users.length, sub: (() => { const n = users.filter((u) => u.role === 'admin').length; return `${num(n)} admin${n === 1 ? '' : 's'}` })() },
    { label: 'Subscribers', value: subscribers.length, sub: 'Newsletter' },
    { label: 'Messages', value: messages.length, sub: `${num(messages.filter((m) => !m.isRead).length)} unread` },
  ]

  return (
    <>
      <Section title="Backend connection" description="The booking system this console reads from and writes to.">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Server size={20} className="text-[#7A7268] flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[#1C1A17] break-all">{API_BASE}</p>
                <CopyButton value={API_BASE} label="Copy address" />
              </div>
              <p className="text-[13px] text-[#7A7268] mt-1">
                Last synced {updatedAt ? relative(updatedAt) : '—'} · {refreshLabel(prefs.refreshSeconds)}
              </p>
              {error && <p className="text-[13px] text-[#B42318] mt-2">{error}</p>}
            </div>
            <div className="flex items-center gap-2.5">
              {error
                ? <Badge tone="warning" icon={TriangleAlert}>Connection problem</Badge>
                : <Badge tone="success" icon={CircleCheck}>Connected</Badge>}
              <Button size="sm" icon={RefreshCw} loading={refreshing} onClick={() => load({ silent: true })}>Sync now</Button>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Data overview" description="Everything currently stored in the booking system.">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-[13px] text-[#6B6560]">{s.label}</p>
              <p className="text-2xl font-semibold text-[#1C1A17] leading-tight mt-1">{num(s.value)}</p>
              <p className="text-xs text-[#7A7268] mt-0.5">{s.sub}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Links" description="Quick access to the public site and this console's address.">
        <Card className="divide-y divide-[#E3DCCD]">
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1C1A17]">Public website</p>
              <p className="text-xs text-[#7A7268] truncate">{websiteUrl()}</p>
            </div>
            <a href={websiteUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2470A] hover:text-[#96380D] flex-shrink-0">
              Open <ExternalLink size={15} />
            </a>
          </div>
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1C1A17]">Admin console address</p>
              <p className="text-xs text-[#7A7268] truncate">{consoleUrl()}</p>
            </div>
            <CopyButton value={consoleUrl()} label="Copy console address" />
          </div>
        </Card>
      </Section>

      <Section title="Keyboard shortcuts" description="Work faster without the mouse.">
        <Card className="divide-y divide-[#E3DCCD]">
          {[
            ['Search everything', ['Ctrl', 'K']],
            ['Close a panel or dialog', ['Esc']],
            ['Open the selected row', ['Enter']],
            ['Move through search results', ['↑', '↓']],
          ].map(([label, keys]) => (
            <div key={label} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <span className="flex items-center gap-2.5 text-sm text-[#4A4540]"><Keyboard size={16} className="text-[#9C9890]" />{label}</span>
              <span className="flex gap-1">
                {keys.map((k) => (
                  <kbd key={k} className="min-w-[28px] text-center text-xs font-medium text-[#4A4540] bg-[#FAF7F1] border border-[#E3DCCD] rounded-md px-1.5 py-1">{k}</kbd>
                ))}
              </span>
            </div>
          ))}
        </Card>
      </Section>
    </>
  )
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function Settings() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'account'

  return (
    <div className="max-w-5xl">
      <PageHeader eyebrow="Console" title="Settings" description="Manage your account, security and how the console works." />

      <div className="border-b border-[#E3DCCD] overflow-x-auto">
        <div role="tablist" aria-label="Settings sections" className="flex gap-6 min-w-max">
          {TABS.map((t) => {
            const active = t.id === tab
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setParams({ tab: t.id }, { replace: true })}
                className={`inline-flex items-center gap-2 pb-3 -mb-px border-b-2 text-sm font-semibold transition-colors ${active
                  ? 'border-[#E75A08] text-[#C2470A]'
                  : 'border-transparent text-[#7A7268] hover:text-[#4A4540] hover:border-[#D9CFBF]'}`}
              >
                <t.icon size={17} strokeWidth={1.9} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div role="tabpanel">
        {tab === 'account' && <AccountTab />}
        {tab === 'security' && <SecurityTab />}
        {tab === 'preferences' && <PreferencesTab />}
        {tab === 'system' && <SystemTab />}
      </div>
    </div>
  )
}
