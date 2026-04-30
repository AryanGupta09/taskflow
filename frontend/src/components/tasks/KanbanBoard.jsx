import { FiPlus } from 'react-icons/fi'
import TaskCard from './TaskCard'
import EmptyState from '../common/EmptyState'
import { FiCheckSquare } from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'

const COLUMNS = [
  { key: 'todo',        label: 'Todo',        color: 'bg-gray-400',    header: 'bg-gray-50 border-gray-200',    count: 'bg-gray-200 text-gray-600'    },
  { key: 'in-progress', label: 'In Progress', color: 'bg-indigo-500',  header: 'bg-indigo-50 border-indigo-200',count: 'bg-indigo-100 text-indigo-700' },
  { key: 'completed',   label: 'Completed',   color: 'bg-emerald-500', header: 'bg-emerald-50 border-emerald-200',count:'bg-emerald-100 text-emerald-700'},
]

const KanbanBoard = ({ tasks = [], onAddTask, onEditTask, onDeleteTask }) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {COLUMNS.map(({ key, label, color, header, count }) => {
        const col = tasks.filter(t => t.status === key)
        return (
          <div key={key} className="flex flex-col min-h-[420px]">
            {/* Column header */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-t-2xl border ${header} mb-0`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-sm font-bold text-gray-700">{label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${count}`}>{col.length}</span>
              </div>
              {isAdmin && (
                <button onClick={() => onAddTask?.(key)}
                  className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-all shadow-sm">
                  <FiPlus size={13} />
                </button>
              )}
            </div>

            {/* Column body */}
            <div className="flex-1 bg-gray-50/80 rounded-b-2xl border border-t-0 border-gray-200 p-3 space-y-3">
              {col.length === 0 ? (
                <EmptyState icon={FiCheckSquare} title="Empty" description={`No ${label.toLowerCase()} tasks`} />
              ) : (
                col.map(task => (
                  <TaskCard key={task._id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} compact />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KanbanBoard
