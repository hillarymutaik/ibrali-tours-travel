import { useEffect } from 'react'

// Form fields keep normal copy/paste so bookings, contact and login still work.
const isEditable = (target) => {
  const el = target instanceof Element ? target : target?.parentElement
  return !!el?.closest('input, textarea, select, [contenteditable="true"]')
}

const COPY_SHORTCUTS = ['c', 'x', 'a']

export default function ContentProtection() {
  useEffect(() => {
    const blockUnlessEditable = (e) => {
      if (!isEditable(e.target)) e.preventDefault()
    }

    const blockCopyShortcuts = (e) => {
      if (isEditable(e.target)) return
      if ((e.ctrlKey || e.metaKey) && COPY_SHORTCUTS.includes(e.key?.toLowerCase())) {
        e.preventDefault()
      }
    }

    document.addEventListener('copy', blockUnlessEditable)
    document.addEventListener('cut', blockUnlessEditable)
    document.addEventListener('contextmenu', blockUnlessEditable)
    document.addEventListener('selectstart', blockUnlessEditable)
    document.addEventListener('dragstart', blockUnlessEditable)
    document.addEventListener('keydown', blockCopyShortcuts)

    return () => {
      document.removeEventListener('copy', blockUnlessEditable)
      document.removeEventListener('cut', blockUnlessEditable)
      document.removeEventListener('contextmenu', blockUnlessEditable)
      document.removeEventListener('selectstart', blockUnlessEditable)
      document.removeEventListener('dragstart', blockUnlessEditable)
      document.removeEventListener('keydown', blockCopyShortcuts)
    }
  }, [])

  return null
}
