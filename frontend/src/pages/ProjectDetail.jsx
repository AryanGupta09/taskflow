import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiEdit2,
  FiCalendar,
  FiUser,
  FiList,
  FiColumns,
} from 'react-icons/fi'
import axiosInstance from '../api/axios'
import useAuth from '../hooks/useAuth'
import useTasks from '../hooks/useTasks'
import useProjects from '../hooks/useProjects'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import MembersList from '../components/projects/MembersList'
import ProjectForm from '../components/projects/ProjectForm'
import KanbanBoard from '../components/tasks/KanbanBoard'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const { updateProject, addProjectMember, removeProjectMember } = useProjects()
  const { createTask, updateTask, deleteTask, users, fetchUsers } = useTasks()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('kanban')

  // Modals
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('todo')
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadProject = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/projects/${id}`)
      setProject(data.project)
    } catch (err) {
      toast.error(err.message)
      navigate('/projects')
    }
  }, [id, navigate])

  const loadTasks = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/tasks', {
        params: { project: id, limit: 100 },
      })
      setTasks(data.tasks)
    } catch (err) {
      toast.error(err.message)
    }
  }, [id])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([loadProject(), loadTasks(), fetchUsers()])
      setLoading(false)
    }
    init()
  }, [loadProject, loadTasks, fetchUsers])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleUpdateProject = async (data) => {
    setFormLoading(true)
    try {
      const updated = await updateProject(id, data)
      setProject(updated)
      setEditProjectOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleAddMember = async (userId) => {
    const updated = await addProjectMember(id, userId)
    setProject(updated)
  }

  const handleRemoveMember = async (userId) => {
    const updated = await removeProjectMember(id, userId)
    setProject(updated)
  }

  const handleAddTask = (status = 'todo') => {
    setDefaultStatus(status)
    setEditingTask(null)
    setTaskFormOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }

  const handleTaskSubmit = async (data) => {
    setFormLoading(true)
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, data)
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        )
      } else {
        const created = await createTask({ ...data, project: id })
        setTasks((prev) => [created, ...prev])
      }
      setTaskFormOpen(false)
      setEditingTask(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    setDeleteLoading(true)
    try {
      await deleteTask(deleteTarget._id)
      setTasks((prev) => prev.filter((t) => t._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Inline status change for list view
  const handleStatusChange = async (taskId, status) => {
    try {
      const updated = await updateTask(taskId, { status })
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <Loader text="Loading project..." />

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <FiArrowLeft size={15} />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
              <Badge type="status" value={project?.status} />
            </div>
            {project?.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <FiUser size={13} />
                Owner: <strong className="text-gray-700">{project?.owner?.name}</strong>
              </span>
              {project?.deadline && (
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={13} />
                  Deadline: <strong className="text-gray-700">{formatDate(project.deadline)}</strong>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                Tasks: <strong className="text-gray-700">{tasks.length}</strong>
              </span>
            </div>
          </div>
          {isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              icon={<FiEdit2 size={13} />}
              onClick={() => setEditProjectOpen(true)}
            >
              Edit
            </Button>
          )}
        </div>

        {/* Members */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <MembersList
            project={project}
            allUsers={users}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
          />
        </div>
      </div>

      {/* Tasks section */}
      <div className="space-y-4">
        {/* Tab bar */}
        <div className="flex items-center justify-between">
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiColumns size={14} /> Kanban
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiList size={14} /> List
            </button>
          </div>
          {isAdmin && (
            <Button
              size="sm"
              icon={<FiEdit2 size={13} />}
              onClick={() => handleAddTask('todo')}
            >
              Add Task
            </Button>
          )}
        </div>

        {/* Kanban view */}
        {activeTab === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={setDeleteTarget}
          />
        )}

        {/* List view */}
        {activeTab === 'list' && (
          <div className="card overflow-hidden">
            {tasks.length === 0 ? (
              <EmptyState title="No tasks yet" description="Add tasks to this project." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Assignee</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Due</th>
                      {isAdmin && <th className="py-3 px-4" />}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900 max-w-[200px] truncate">
                          {task.title}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-500 text-xs">
                          {task.assignedTo?.name || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge type="priority" value={task.priority} />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          >
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell text-xs text-gray-500">
                          {formatDate(task.dueDate)}
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                <FiEdit2 size={13} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(task)}
                                className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <FiEdit2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      <ProjectForm
        isOpen={editProjectOpen}
        onClose={() => setEditProjectOpen(false)}
        onSubmit={handleUpdateProject}
        project={project}
        isLoading={formLoading}
      />

      {/* Task Form Modal */}
      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => { setTaskFormOpen(false); setEditingTask(null) }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        projects={project ? [project] : []}
        users={users}
        defaultProjectId={id}
        isLoading={formLoading}
      />

      {/* Delete Task Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        isLoading={deleteLoading}
      />
    </div>
  )
}

export default ProjectDetail
