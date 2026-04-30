import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiUsers, FiCheckSquare, FiCalendar, FiArrowUpRight } from 'react-icons/fi'
import Badge from '../common/Badge'
import { formatDate, truncateText, isOverdue } from '../../utils/helpers'
import { getInitials, getAvatarColor } from '../../utils/helpers'
import useAuth from '../../hooks/useAuth'

const statusGrad = {
  active:    'from-emerald-400 to-teal-500',
  completed: 'from-blue-400 to-indigo-500',
  archived:  'from-gray-300 to-gray-400',
}

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const grad = statusGrad[project.status] || statusGrad.active

  return (
    <div className="card-hover flex flex-col overflow-hidden group">
      {/* Colour bar */}
      <div className={`h-1.5 bg-gradient-to-r ${grad}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="font-bold text-gray-900 truncate text-base group-hover:text-violet-700 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">by {project.owner?.name || 'Unknown'}</p>
          </div>
          <Badge type="status" value={project.status} dot />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 flex-1 leading-relaxed">
          {truncateText(project.description, 85) || <span className="italic text-gray-300">No description</span>}
        </p>

        {/* Member avatars */}
        {project.members?.length > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {project.members.slice(0, 4).map((m, i) => (
              <div key={m._id || i} title={m.name}
                className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold -ml-1 first:ml-0 ${getAvatarColor(m.name)}`}>
                {getInitials(m.name)}
              </div>
            ))}
            {project.members.length > 4 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 -ml-1">
                +{project.members.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 font-medium">
          <span className="flex items-center gap-1">
            <FiUsers size={11} /> {project.members?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FiCheckSquare size={11} /> {project.taskCount ?? 0} tasks
          </span>
          {project.deadline && (
            <span className={`flex items-center gap-1 ${isOverdue(project.deadline) && project.status !== 'completed' ? 'text-red-400' : ''}`}>
              <FiCalendar size={11} /> {formatDate(project.deadline)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
          <button
            onClick={() => navigate(`/projects/${project._id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-white hover:bg-violet-600 py-2 rounded-xl transition-all duration-150"
          >
            Open <FiArrowUpRight size={12} />
          </button>
          {isAdmin && (
            <>
              <button onClick={() => onEdit(project)} className="icon-btn" title="Edit">
                <FiEdit2 size={14} />
              </button>
              <button onClick={() => onDelete(project)} className="icon-btn hover:!text-red-500 hover:!bg-red-50" title="Delete">
                <FiTrash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
