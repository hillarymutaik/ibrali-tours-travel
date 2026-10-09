import { useEffect, useState } from 'react'
import { ArrowLeft, CircleAlert, Eye, EyeOff, Info, LockKeyhole } from 'lucide-react'
import { signIn } from './api'
import { Button, Field } from './ui'
import { inputCls } from './styles'

export default function Login({ notice, onSignedIn }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { document.title = 'Sign in · Ibrali Admin' }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      onSignedIn(await signIn(form.email.trim(), form.password))
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-white">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#382C1C]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=70')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#382C1C] via-[#382C1C]/70 to-[#382C1C]/30" />
        <div className="relative flex items-center gap-3">
          <img src="/ibrali-tours-travel/logo.webp" alt="" className="w-11 h-11 rounded-full object-cover bg-white ring-2 ring-white/15" />
          <div>
            <p className="text-white font-semibold leading-tight">Ibrali Tours &amp; Travel</p>
            <p className="text-sm text-[#9C9890] leading-tight">Admin console</p>
          </div>
        </div>
        <div className="relative max-w-md">
          <p className="heading text-4xl text-white">
            Run bookings, packages and customer care from one place.
          </p>
          <p className="text-[#9C9890] mt-4 leading-relaxed">
            Confirm reservations, answer enquiries, update the catalogue and keep an eye on revenue — all in real time.
          </p>
        </div>
        <p className="relative text-xs text-[#7A7268]">© {new Date().getFullYear()} Ibrali Tours &amp; Travel · Staff access only</p>
      </div>

      {/* Form */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/ibrali-tours-travel/logo.webp" alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E3DCCD]" />
            <p className="font-semibold text-[#1C1A17]">Ibrali Admin</p>
          </div>

          <span className="w-12 h-12 rounded-xl border border-[#E3DCCD] shadow-[0_1px_2px_rgba(28,26,23,0.05)] flex items-center justify-center text-[#4A4540] mb-6">
            <LockKeyhole size={22} strokeWidth={1.8} />
          </span>
          <h1 className="heading text-[34px] text-[#1C1A17]">Sign in</h1>
          <p className="text-[#6B6560] mt-2">Use your Ibrali staff account to access the console.</p>

          {notice && !error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-[#B9E6FE] bg-[#F0F9FF] px-3.5 py-3 text-sm text-[#026AA2]">
              <Info size={17} className="flex-shrink-0 mt-px" />
              {notice}
            </div>
          )}
          {error && (
            <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-lg border border-[#FECDCA] bg-[#FEF3F2] px-3.5 py-3 text-sm text-[#B42318]">
              <CircleAlert size={17} className="flex-shrink-0 mt-px" />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field label="Email" htmlFor="admin-email">
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
                className={inputCls}
              />
            </Field>
            <Field label="Password" htmlFor="admin-password">
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center text-[#7A7268] hover:text-[#4A4540] hover:bg-[#F2EDE5]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </Field>
            <Button type="submit" variant="primary" loading={busy} className="w-full !h-11">
              {busy ? 'Signing in' : 'Sign in'}
            </Button>
          </form>

          <a href="#/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#6B6560] hover:text-[#1C1A17]">
            <ArrowLeft size={16} /> Back to the website
          </a>
        </div>
      </div>
    </div>
  )
}
