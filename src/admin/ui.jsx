import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronLeft, ChevronRight, CircleCheck, CircleX, Copy, Loader2, Search, X } from 'lucide-react'
import { useEscape, useToast } from './context'
import { cardCls, labelCls } from './styles'
import { initials } from './format'
import { BOOKING_STATUS } from './status'

/* ── Buttons ────────────────────────────────────────────────────────── */

const BUTTON_VARIANTS = {
  primary: 'bg-[#E75A08] text-white hover:bg-[#C2470A] shadow-[0_1px_2px_rgba(16,24,40,0.05)]',
  secondary: 'bg-white text-[#344054] border border-[#D0D5DD] hover:bg-[#F9FAFB] hover:text-[#182230] shadow-[0_1px_2px_rgba(16,24,40,0.05)]',
  ghost: 'text-[#475467] hover:bg-[#F2F4F7] hover:text-[#182230]',
  danger: 'bg-[#D92D20] text-white hover:bg-[#B42318] shadow-[0_1px_2px_rgba(16,24,40,0.05)]',
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
      className={`inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
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
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#475467] hover:bg-[#F2F4F7] hover:text-[#182230] transition-colors disabled:opacity-40 ${className}`}
    >
      <Icon size={18} strokeWidth={1.9} />
    </button>
  )
}

/* ── Layout ─────────────────────────────────────────────────────────── */

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-[22px] sm:text-2xl font-semibold text-[#101828] tracking-[-0.01em]">{title}</h1>
        {description && <p className="text-sm text-[#475467] mt-1">{description}</p>}
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
        <h2 className="text-base font-semibold text-[#101828]">{title}</h2>
        {subtitle && <p className="text-[13px] text-[#475467] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}

/* ── Badges ─────────────────────────────────────────────────────────── */

const BADGE_TONES = {
  neutral: 'bg-[#F9FAFB] text-[#344054] ring-[#EAECF0]',
  brand: 'bg-[#FFF4ED] text-[#C2470A] ring-[#FFD6AE]',
  success: 'bg-[#ECFDF3] text-[#067647] ring-[#ABEFC6]',
  warning: 'bg-[#FFFAEB] text-[#B54708] ring-[#FEDF89]',
  danger: 'bg-[#FEF3F2] text-[#B42318] ring-[#FECDCA]',
  info: 'bg-[#F0F9FF] text-[#026AA2] ring-[#B9E6FE]',
}

export function Badge({ tone = 'neutral', icon: Icon, children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${BADGE_TONES[tone]} ${className}`}>
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
  const toneCls = tone === 'brand' ? 'bg-[#FFF4ED] text-[#C2470A] ring-[#FFD6AE]' : 'bg-[#F2F4F7] text-[#475467] ring-[#EAECF0]'
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
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full h-10 pl-9 pr-9 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#101828] placeholder:text-[#667085] shadow-[0_1px_2px_rgba(16,24,40,0.05)] focus-visible:outline-none focus:border-[#F2843A] focus:ring-4 focus:ring-[#E75A08]/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-[#667085] hover:bg-[#F2F4F7]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

/** Segmented tabs with optional counts, e.g. status filters. */
export function Segmented({ options, value, onChange, label }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F2F4F7] border border-[#EAECF0]">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[13px] font-semibold transition-colors ${active
              ? 'bg-white text-[#182230] shadow-[0_1px_3px_rgba(16,24,40,0.1)]'
              : 'text-[#667085] hover:text-[#344054]'}`}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={`min-w-[20px] px-1.5 py-px rounded-full text-[11px] tabular-nums ${active ? 'bg-[#F2F4F7] text-[#344054]' : 'bg-white/70 text-[#667085]'}`}>
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
        <p className="text-[13px] text-[#667085] mt-1.5">{hint}</p>
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
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-[#E75A08]' : 'bg-[#EAECF0]'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(16,24,40,0.2)] transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
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
      className="w-4 h-4 rounded border-[#D0D5DD] cursor-pointer"
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
      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[#98A2B3] hover:text-[#344054] hover:bg-[#F2F4F7] transition-colors"
    >
      {done ? <Check size={14} className="text-[#067647]" /> : <Copy size={14} />}
    </button>
  )
}

/* ── Feedback ───────────────────────────────────────────────────────── */

export function Spinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2.5 py-16 text-sm text-[#667085]">
      <Loader2 size={18} className="animate-spin text-[#E75A08]" />
      {label}…
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action, compact }) {
  return (
    <div className={`flex flex-col items-center text-center px-6 ${compact ? 'py-10' : 'py-16'}`}>
      {Icon && (
        <span className="w-12 h-12 rounded-full bg-[#F2F4F7] ring-8 ring-[#F9FAFB] flex items-center justify-center text-[#475467] mb-4">
          <Icon size={22} strokeWidth={1.8} />
        </span>
      )}
      <p className="text-base font-semibold text-[#101828]">{title}</p>
      {description && <p className="text-sm text-[#475467] mt-1 max-w-sm">{description}</p>}
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
      <div className="absolute inset-0 bg-[#0C111D]/40 backdrop-blur-[2px] animate-[admin-fade_150ms_ease-out]" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className="relative h-full w-full bg-white shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)] flex flex-col focus:outline-none animate-[admin-slide_220ms_cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxWidth: width }}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#EAECF0]">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-[#101828]">{title}</div>
            {subtitle && <div className="text-sm text-[#475467] mt-0.5">{subtitle}</div>}
          </div>
          <IconButton label="Close" icon={X} onClick={onClose} className="-mr-2 -mt-1" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[#EAECF0] flex flex-wrap justify-end gap-2.5">{footer}</div>}
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
      <div className="absolute inset-0 bg-[#0C111D]/50 backdrop-blur-[2px] animate-[admin-fade_150ms_ease-out]" onClick={onClose} />
      <div
        ref={box}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full bg-white rounded-xl shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)] focus:outline-none animate-[admin-pop_180ms_cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxWidth }}
      >
        <div className="p-6">
          {icon}
          <h2 className="text-lg font-semibold text-[#101828]">{title}</h2>
          {description && <p className="text-sm text-[#475467] mt-1.5 leading-relaxed">{description}</p>}
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
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#EAECF0]">
      <p className="text-[13px] text-[#475467]">
        Showing <span className="font-medium text-[#344054]">{from}–{to}</span> of <span className="font-medium text-[#344054]">{total}</span>
      </p>
      {pageCount > 1 && (
        <div className="flex items-center gap-2">
          <Button size="sm" icon={ChevronLeft} onClick={() => onPage(page - 1)} disabled={page <= 1}>Previous</Button>
          <span className="text-[13px] text-[#475467] tabular-nums px-1">{page} / {pageCount}</span>
          <Button size="sm" onClick={() => onPage(page + 1)} disabled={page >= pageCount}>
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}
