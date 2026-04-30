import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DATA_CONFIG = [
  { key: 'todoTasks',       name: 'Todo',        color: '#94a3b8' },
  { key: 'inProgressTasks', name: 'In Progress', color: '#6366f1' },
  { key: 'completedTasks',  name: 'Completed',   color: '#10b981' },
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700">{payload[0].name}</p>
      <p className="text-gray-500">{payload[0].value} tasks</p>
    </div>
  )
}

const TaskStatusChart = ({ data }) => {
  const chartData = DATA_CONFIG
    .map(c => ({ name: c.name, value: data?.[c.key] || 0, color: c.color }))
    .filter(d => d.value > 0)

  if (!chartData.length) return (
    <div className="flex items-center justify-center h-52 text-gray-300 text-sm">No data yet</div>
  )

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={88}
          paddingAngle={4} dataKey="value" strokeWidth={0}>
          {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8}
          formatter={v => <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default TaskStatusChart
