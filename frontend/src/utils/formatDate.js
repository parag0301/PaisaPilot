// Format a date nicely — e.g. "18 May 2026"
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date)) return '—'

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Get today's date in YYYY-MM-DD format (for date input default value)
export function todayISO() {
  const d = new Date()
  return d.toISOString().split('T')[0]
}
