import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronLeft, ChevronRight, CircleCheck, CircleX, Copy, Loader2, Search, X } from 'lucide-react'
import { useEscape, useToast } from './context'
import { cardCls, labelCls } from './styles'
import { initials } from './format'
import { BOOKING_STATUS } from './status'

/* ── Buttons ────────────────────────────────────────────────────────── */

const BUTTON_VARIANTS = {
  primary: 'bg-[#E75A08] text-white hover:bg-[#C2470A] shadow-[0_1px_2px_rgba(28,26,23,0.05)]',
  secondary: 'bg-white text-[#4A4540] border border-[#D9CFBF] hover:bg-[#FAF7F1] hover:text-[#1C1A17] shadow-[0_1px_2px_rgba(28,26,23,0.05)]',
  ghost: 'text-[#6B6560] hover:bg-[#F2EDE5] hover:text-[#1C1A17]',
  danger: 'bg-[#D92D20] text-white hover:bg-[#B42318] shadow-[0_1px_2px_rgba(28,26,23,0.05)]',
  dangerOutline: 'bg-white text-[#B42318] border border-[#FDA29B] hover:bg-[#FEF3F2]',
}
const BUTTON_SIZES = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
}

export function Button({ variant = 'secondary', size = 'md', icon: Icon, loading, children, className = '', ...props }) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} strokeWidth={2} />}
      {children}
    </button>
  )
}

export function IconButton({ label, icon: Icon, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-[#6B6560] hover:bg-[#F2EDE5] hover:text-[#1C1A17] transition-colors disabled:opacity-40 ${className}`}
    >
      <Icon size={18} strokeWidth={1.9} />
    </button>
  )
}

/* ── Layout ─────────────────────────────────────────────────────────── */

/** Page title in the website's style: orange eyebrow + Playfair Display heading. */
export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-2.5">{eyebrow}</div>}
        <h1 className="heading text-[28px] sm:text-[34px] text-[#1C1A17]">{title}</h1>
        {description && <p className="text-sm text-[#6B6560] mt-2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <section className={`${cardCls} ${className}`}>{children}</section>
}

export function CardHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 px-5 pt-5 pb-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="heading text-lg text-[#1C1A17]">{title}</h2>
        {subtitle && <p className="text-[13px] text-[#6B6560] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}

/* ── Badges ─────────────────────────────────────────────────────────── */

const BADGE_TONES = {
  neutral: 'bg-[#FAF7F1] text-[#4A4540] ring-[#E3DCCD]',
  brand: 'bg-[#FFF4ED] text-[#C2470A] ring-[#FFD9B3]',
  success: 'bg-[#ECFDF3] text-[#067647] ring-[#ABEFC6]',
  warning: 'bg-[#FFFAEB] text-[#B54708] ring-[#FEDF89]',
  danger: 'bg-[#FEF3F2] text-[#B42318] ring-[#FECDCA]',
  info: 'bg-[#F0F9FF] text-[#026AA2] ring-[#B9E6FE]',
}

export function Badge({ tone = 'neutral', icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tracking-normal ring-1 ring-inset whitespace-nowrap ${BADGE_TONES[tone]} ${className}`}
      // Badges can sit inside serif headings (e.g. drawer titles) — always use the body font
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {Icon && <Icon size={12} strokeWidth={2.4} aria-hidden="true" />}
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const s = BOOKING_STATUS[status] ?? { label: status, tone: 'neutral' }
  return <Badge tone={s.tone} icon={s.icon}>{s.label}</Badge>
}

export function Avatar({ name, size = 36, tone = 'brand' }) {
  const toneCls = tone === 'brand' ? 'bg-[#FFF4ED] text-[#C2470A] ring-[#FFD9B3]' : 'bg-[#F2EDE5] text-[#6B6560] ring-[#E3DCCD]'
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full font-semibold ring-1 ring-inset flex-shrink-0 ${toneCls}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials(name)}
    </span>
  )
}

/* ── Inputs ─────────────────────────────────────────────────────────── */

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '', autoFocus }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7268] pointer-events-none" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full h-10 pl-9 pr-9 rounded-xl border border-[#E3DCCD] bg-white text-sm text-[#1C1A17] placeholder:text-[#7A7268] shadow-[0_1px_2px_rgba(28,26,23,0.05)] focus-visible:outline-none focus:border-[#F2843A] focus:ring-4 focus:ring-[#E75A08]/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-[#7A7268] hover:bg-[#F2EDE5]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

/** Pill filters with optional counts — the same style as the website's package filters. */
export function Segmented({ options, value, onChange, label }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap items-center gap-2">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full border text-[13px] font-medium transition-colors ${active
              ? 'bg-[#382C1C] text-white border-[#382C1C]'
              : 'bg-white text-[#6B6560] border-[#E3DCCD] hover:border-[#382C1C] hover:text-[#1C1A17]'}`}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={`min-w-[20px] px-1.5 py-px rounded-full text-[11px] tabular-nums ${active ? 'bg-white/15 text-white' : 'bg-[#F2EDE5] text-[#6B6560]'}`}>
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Field({ label, hint, error, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label htmlFor={htmlFor} className={labelCls}>{label}</label>}
      {children}
      {error ? (
        <p className="text-[13px] text-[#D92D20] mt-1.5">{error}</p>
      ) : hint ? (
        <p className="text-[13px] text-[#7A7268] mt-1.5">{hint}</p>
      ) : null}
    </div>
  )
}

export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-[#E75A08]' : 'bg-[#E3DCCD]'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(28,26,23,0.2)] transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  )
}

export function Checkbox({ checked, indeterminate, onChange, label }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="w-4 h-4 rounded border-[#D9CFBF] cursor-pointer"
      style={{ accentColor: '#E75A08' }}
    />
  )
}

export function CopyButton({ value, label = 'Copy' }) {
  const toast = useToast()
  const [done, setDone] = useState(false)
  const copy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    } catch {
      toast.error('Could not copy to the clipboard')
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} ${value}`}
      title={label}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[#9C9890] hover:text-[#4A4540] hover:bg-[#F2EDE5] transition-colors"
    >
      {done ? <Check size={14} className="text-[#067647]" /> : <Copy size={14} />}
    </button>
  )
}

/* ── Feedback ───────────────────────────────────────────────────────── */

export function Spinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2.5 py-16 text-sm text-[#7A7268]">
      <Loader2 size={18} className="animate-spin text-[#E75A08]" />
      {label}…
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action, compact }) {
  return (
    <div className={`flex flex-col items-center text-center px-6 ${compact ? 'py-10' : 'py-16'}`}>
      {Icon && (
        <span className="w-12 h-12 rounded-full bg-[#F2EDE5] ring-8 ring-[#FAF7F1] flex items-center justify-center text-[#6B6560] mb-4">
          <Icon size={22} strokeWidth={1.8} />
        </span>
      )}
      <p className="heading text-lg text-[#1C1A17]">{title}</p>
      {description && <p className="text-sm text-[#6B6560] mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* ── Overlays ───────────────────────────────────────────────────────── */

function useBodyLock(active) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [active])
}

/** Right-hand side panel for details and forms. */
export function Drawer({ open, onClose, title, subtitle, children, footer, width = 520 }) {
  const panel = useRef(null)
  useEscape(open, onClose)
  useBodyLock(open)
  useEffect(() => { if (open) panel.current?.focus() }, [open])
  if (!open) return null
  return createPortal(
    <div className="admin-app fixed inset-0 z-50 flex justify-end" dir="ltr" lang="en">
      <div className="absolute inset-0 bg-[#1C1A17]/40 backdrop-blur-[2px] animate-[admin-fade_150ms_ease-out]" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className="relative h-full w-full bg-white shadow-[0_20px_24px_-4px_rgba(28,26,23,0.08),0_8px_8px_-4px_rgba(28,26,23,0.03)] flex flex-col focus:outline-none animate-[admin-slide_220ms_cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxWidth: width }}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E3DCCD]">
          <div className="min-w-0">
            <div className="heading text-xl text-[#1C1A17]">{title}</div>
            {subtitle && <div className="text-sm text-[#6B6560] mt-0.5">{subtitle}</div>}
          </div>
          <IconButton label="Close" icon={X} onClick={onClose} className="-mr-2 -mt-1" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[#E3DCCD] flex flex-wrap justify-end gap-2.5">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export function Modal({ open, onClose, title, description, icon, children, footer, maxWidth = 440 }) {
  const box = useRef(null)
  useEscape(open, onClose)
  useBodyLock(open)
  useEffect(() => { if (open) box.current?.focus() }, [open])
  if (!open) return null
  return createPortal(
    <div className="admin-app fixed inset-0 z-[60] flex items-center justify-center p-4" dir="ltr" lang="en">
      <div className="absolute inset-0 bg-[#1C1A17]/50 backdrop-blur-[2px] animate-[admin-fade_150ms_ease-out]" onClick={onClose} />
      <div
        ref={box}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full bg-white rounded-xl shadow-[0_20px_24px_-4px_rgba(28,26,23,0.08),0_8px_8px_-4px_rgba(28,26,23,0.03)] focus:outline-none animate-[admin-pop_180ms_cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxWidth }}
      >
        <div className="p-6">
          {icon}
          <h2 className="heading text-xl text-[#1C1A17]">{title}</h2>
          {description && <p className="text-sm text-[#6B6560] mt-1.5 leading-relaxed">{description}</p>}
          {children && <div className="mt-5">{children}</div>}
        </div>
        {footer && <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

/** Confirmation for destructive or sensitive actions. */
export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', tone = 'danger', busy, onConfirm, onCancel }) {
  const iconCls = tone === 'danger' ? 'bg-[#FEE4E2] ring-[#FEF3F2] text-[#D92D20]' : 'bg-[#FFF4ED] ring-[#FFFAF5] text-[#C2470A]'
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onCancel}
      title={title}
      description={description}
      icon={
        <span className={`w-12 h-12 rounded-full ring-8 flex items-center justify-center mb-4 ${iconCls}`}>
          <CircleX size={22} strokeWidth={1.9} className={tone === 'danger' ? '' : 'hidden'} />
          <CircleCheck size={22} strokeWidth={1.9} className={tone === 'danger' ? 'hidden' : ''} />
        </span>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy} className="sm:min-w-[96px]">Cancel</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={busy} className="sm:min-w-[96px]">
            {confirmLabel}
          </Button>
        </>
      }
    />
  )
}

/* ── Pagination ─────────────────────────────────────────────────────── */

export function Pagination({ page, pageCount, total, pageSize, onPage }) {
  if (total === 0) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#E3DCCD]">
      <p className="text-[13px] text-[#6B6560]">
        Showing <span className="font-medium text-[#4A4540]">{from}–{to}</span> of <span className="font-medium text-[#4A4540]">{total}</span>
      </p>
      {pageCount > 1 && (
        <div className="flex items-center gap-2">
          <Button size="sm" icon={ChevronLeft} onClick={() => onPage(page - 1)} disabled={page <= 1}>Previous</Button>
          <span className="text-[13px] text-[#6B6560] tabular-nums px-1">{page} / {pageCount}</span>
          <Button size="sm" onClick={() => onPage(page + 1)} disabled={page >= pageCount}>
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}
