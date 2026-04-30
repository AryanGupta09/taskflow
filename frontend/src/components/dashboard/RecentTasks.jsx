import { Link } from 'react-router-dom'
import Badge from '../common/Badge'
import { formatDate, getInitials, getAvatarColor, isOverdue } from '../../utils/helpers'
import { FiArrowRight } from 'react-icons/fi'

const RecentTasks = ({ tasks = [] }) => {
  if (!tasks.length) return (
    <div className="text-center py-10 text-gray-400 text-sm">No recent tasks yet.</div>
  )

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="table-th">Task</th>
              <th className="table-th hidden md:table-cell">Project</th>
              <th className="table-th hidden lg:table-cell">Assignee</th>
              <th className="table-th">Status</th>
              <th className="table-th hidden sm:table-cell">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.map(task => (
              <tr key={task._id} className="hover:bg-gray-50/60 transition-colors group">
                <td className="table-td">
                  <p className="font-semibold text-gray-800 truncate max-w-[200px] group-hover:text-violet-600 transition-colors">
                    {task.title}
                  </p>
                </td>
                <td className="table-td hidden md:table-cell">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg font-medium">
                    {task.project?.name || '—'}
                  </span>
                </td>
                <td className="table-td hidden lg:table-cell">
                  {task.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(task.assignedTo.name)}`}>
                        {getInitials(task.assignedTo.name)}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{task.assignedTo.name}</span>
                    </div>
                  ) : <span className="text-xs text-gray-300">—</span>}
                </td>
                <td className="table-td">
                  <Badge type="status" value={task.status} dot />
                </td>
                <td className="table-td hidden sm:table-cell">
                  {task.dueDate ? (
                    <span className={`text-xs font-medium ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-500' : 'text-gray-400'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pt-4 mt-2 border-t border-gray-100">
        <Link to="/tasks" className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold transition-colors">
          View all tasks <FiArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export default RecentTasks
