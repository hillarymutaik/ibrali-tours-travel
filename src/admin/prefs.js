/* Console preferences, saved per browser (localStorage). Every value is
   validated on load, so an old or edited entry falls back to the default. */

const KEY = 'adminPrefs'

export const PREF_OPTIONS = {
  defaultRange: [
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '12m', label: 'Last 12 months' },
    { value: 'all', label: 'All time' },
  ],
  refreshSeconds: [
    { value: 30, label: 'Every 30 seconds' },
    { value: 60, label: 'Every minute' },
    { value: 300, label: 'Every 5 minutes' },
    { value: 0, label: 'Off — refresh manually' },
  ],
  pageSize: [
    { value: 10, label: '10 rows' },
    { value: 25, label: '25 rows' },
    { value: 50, label: '50 rows' },
  ],
}

export const DEFAULT_PREFS = { defaultRange: '30d', refreshSeconds: 60, pageSize: 10 }

export function loadPrefs() {
  let saved = {}
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {} } catch { saved = {} }
  const prefs = { ...DEFAULT_PREFS }
  for (const key of Object.keys(DEFAULT_PREFS)) {
    if (PREF_OPTIONS[key].some((o) => o.value === saved[key])) prefs[key] = saved[key]
  }
  return prefs
}

export function savePrefs(prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs))
}

export const refreshLabel = (seconds) =>
  seconds === 0 ? 'auto-refresh off' : seconds < 60 ? `refreshes every ${seconds} seconds` : seconds === 60 ? 'refreshes every minute' : `refreshes every ${seconds / 60} minutes`
