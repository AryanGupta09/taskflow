import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi'
import Badge from '../common/Badge'
import { formatDate, getInitials, getAvatarColor, isOverdue, getDaysLeft } from '../../utils/helpers'
import useAuth from '../../hooks/useAuth'

const priorityLeft = { high: 'border-l-red-500', medium: 'border-l-amber-400', low: 'border-l-emerald-500' }

const TaskCard = ({ task, onEdit, onDelete, compact = false }) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed'

  return (
    <div className={`card hover:shadow-md transition-all duration-200 border-l-4 ${priorityLeft[task.priority] || 'border-l-gray-200'} overflow-hidden`}>
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-2.5">
          <Badge type="priority" value={task.priority} />
          <Badge type="status" value={task.status} dot />
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-gray-800 leading-snug mb-1">{task.title}</h4>

        {!compact && task.description && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">{task.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          {task.assignedTo ? (
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getAvatarColor(task.assignedTo.name)}`}>
                {getInitials(task.assignedTo.name)}
              </div>
              <span className="text-xs text-gray-500 font-medium">{task.assignedTo.name}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-300 italic">Unassigned</span>
          )}

          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs font-medium ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
              <FiCalendar size={10} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {overdue && (
          <div className="mt-2 px-2.5 py-1 bg-red-50 rounded-lg">
            <p className="text-xs text-red-500 font-semibold">⚠ {getDaysLeft(task.dueDate)}</p>
          </div>
        )}

        {isAdmin && (
          <div className="flex gap-1 mt-3 pt-2.5 border-t border-gray-50">
            <button onClick={() => onEdit?.(task)}
              className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-violet-600 hover:bg-violet-50 py-1.5 rounded-lg transition-colors font-medium">
              <FiEdit2 size={11} /> Edit
            </button>
            <button onClick={() => onDelete?.(task)}
              className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition-colors font-medium">
              <FiTrash2 size={11} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard
