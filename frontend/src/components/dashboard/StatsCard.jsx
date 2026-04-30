const themes = {
  blue:   { grad: 'from-blue-500 to-indigo-600',   bg: 'bg-blue-50',   text: 'text-blue-600',   num: 'text-blue-700',   ring: 'ring-blue-100'   },
  green:  { grad: 'from-emerald-400 to-teal-500',  bg: 'bg-emerald-50',text: 'text-emerald-600',num: 'text-emerald-700',ring: 'ring-emerald-100' },
  yellow: { grad: 'from-amber-400 to-orange-500',  bg: 'bg-amber-50',  text: 'text-amber-600',  num: 'text-amber-700',  ring: 'ring-amber-100'   },
  red:    { grad: 'from-red-400 to-rose-600',      bg: 'bg-red-50',    text: 'text-red-600',    num: 'text-red-700',    ring: 'ring-red-100'     },
  violet: { grad: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', num: 'text-violet-700', ring: 'ring-violet-100'  },
}

const StatsCard = ({ title, value, icon: Icon, color = 'blue', subtitle, trend }) => {
  const t = themes[color] || themes.blue
  return (
    <div className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.grad} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-0.5">{title}</p>
        <p className={`text-3xl font-extrabold tracking-tight ${t.num}`}>{value ?? 0}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}

export default StatsCard
