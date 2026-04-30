import { STATUS_COLORS, PRIORITY_COLORS, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants'

const dotColors = {
  'todo':        'bg-gray-400',
  'in-progress': 'bg-blue-500',
  'completed':   'bg-emerald-500',
  'active':      'bg-emerald-500',
  'archived':    'bg-gray-400',
  'low':         'bg-emerald-500',
  'medium':      'bg-amber-400',
  'high':        'bg-red-500',
}

const Badge = ({ type = 'status', value, className = '', dot = false }) => {
  const colorMap  = type === 'priority' ? PRIORITY_COLORS : STATUS_COLORS
  const labelMap  = type === 'priority' ? PRIORITY_LABELS : STATUS_LABELS
  const colorClass = colorMap[value] || 'bg-gray-100 text-gray-600'
  const label      = labelMap[value]  || value
  const dotColor   = dotColors[value] || 'bg-gray-400'

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
      text-xs font-semibold tracking-wide ${colorClass} ${className}
    `}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {label}
    </span>
  )
}

export default Badge
