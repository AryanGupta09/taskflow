import { format, isPast, formatDistanceToNow, parseISO } from 'date-fns'

/**
 * Format a date string to "Jan 15, 2025"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

/**
 * Check if a due date is in the past
 * @param {string|Date} dueDate
 * @returns {boolean}
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false
  try {
    const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
    return isPast(d)
  } catch {
    return false
  }
}

/**
 * Get initials from a full name
 * @param {string} name
 * @returns {string} e.g. "JD" from "John Doe"
 */
export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate text to a max length with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get human-readable days left or overdue message
 * @param {string|Date} dueDate
 * @returns {string}
 */
export const getDaysLeft = (dueDate) => {
  if (!dueDate) return null
  try {
    const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
    const distance = formatDistanceToNow(d, { addSuffix: false })
    if (isPast(d)) {
      return `${distance} overdue`
    }
    return `${distance} left`
  } catch {
    return null
  }
}

/**
 * Generate a consistent avatar background color from a name
 * @param {string} name
 * @returns {string} Tailwind bg class
 */
export const getAvatarColor = (name) => {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-red-500', 'bg-teal-500', 'bg-orange-500',
  ]
  if (!name) return colors[0]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
