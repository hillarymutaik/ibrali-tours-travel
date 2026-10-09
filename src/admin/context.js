import { createContext, useContext, useEffect, useRef, useState } from 'react'

/** Admin data + actions (bookings, messages, …) shared by every admin page. */
export const AdminContext = createContext(null)
/** Toast notifications for the admin console. */
export const ToastContext = createContext(null)

export const useAdmin = () => useContext(AdminContext)
export const useToast = () => useContext(ToastContext)

/** Calls onEscape when Escape is pressed while `active`. */
export function useEscape(active, onEscape) {
  const handler = useRef(onEscape)
  useEffect(() => { handler.current = onEscape })
  useEffect(() => {
    if (!active) return
    const onKey = (e) => { if (e.key === 'Escape') handler.current?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
}

/**
 * Client-side pagination. Jumps back to page 1 whenever `resetKey` changes
 * (e.g. a new search or filter), using React's "adjust state during render"
 * pattern rather than an effect.
 */
export function usePaged(items, pageSize = 10, resetKey = '') {
  const [page, setPage] = useState(1)
  const [lastKey, setLastKey] = useState(resetKey)
  if (lastKey !== resetKey) {
    setLastKey(resetKey)
    setPage(1)
  }
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(page, pageCount)
  return {
    page: current,
    setPage,
    pageCount,
    pageSize,
    total: items.length,
    pageItems: items.slice((current - 1) * pageSize, current * pageSize),
  }
}

/** Calls onOutside when a pointerdown lands outside `ref` while `active`. */
export function useClickOutside(ref, active, onOutside) {
  const handler = useRef(onOutside)
  useEffect(() => { handler.current = onOutside })
  useEffect(() => {
    if (!active) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) handler.current?.() }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [ref, active])
}
