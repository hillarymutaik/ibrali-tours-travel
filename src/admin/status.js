import { CircleCheck, CircleX, Clock, Flag } from 'lucide-react'

/** Booking status — rendered as icon + label, never colour alone. */
export const BOOKING_STATUS = {
  pending: { label: 'Pending', tone: 'warning', icon: Clock },
  confirmed: { label: 'Confirmed', tone: 'success', icon: CircleCheck },
  completed: { label: 'Completed', tone: 'info', icon: Flag },
  cancelled: { label: 'Cancelled', tone: 'danger', icon: CircleX },
}

export const STATUS_ORDER = ['pending', 'confirmed', 'completed', 'cancelled']

/** Package categories offered in the editor (the API accepts any short slug). */
export const PACKAGE_CATEGORIES = ['safari', 'beach', 'trekking', 'city', 'wildlife', 'cultural', 'adventure']
