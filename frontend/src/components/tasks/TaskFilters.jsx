import { FiFilter, FiX } from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'

const Select = ({ value, onChange, children }) => (
  <select value={value} onChange={onChange}
    className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-700 font-medium cursor-pointer hover:border-gray-300 transition-colors">
    {children}
  </select>
)

const TaskFilters = ({ filters, onChange, projects = [], users = [] }) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const set = field => e => onChange({ ...filters, [field]: e.target.value, page: 1 })
  const hasActive = Object.entries(filters).some(([k, v]) => !['page','limit'].includes(k) && v)

  return (
    <div className="card px-4 py-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
          <FiFilter size={12} /> Filters
        </div>

        <Select value={filters.status || ''} onChange={set('status')}>
          <option value="">All Statuses</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>

        <Select value={filters.priority || ''} onChange={set('priority')}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>

        <Select value={filters.project || ''} onChange={set('project')}>
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </Select>

        {isAdmin && (
          <Select value={filters.assignedTo || ''} onChange={set('assignedTo')}>
            <option value="">All Assignees</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </Select>
        )}

        {hasActive && (
          <button onClick={() => onChange({ page: 1, limit: 10 })}
            className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 px-2.5 py-2 rounded-xl hover:bg-red-50 transition-colors">
            <FiX size={12} /> Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default TaskFilters
