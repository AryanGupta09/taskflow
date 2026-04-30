import { useEffect, useState, useCallback } from 'react'
import { FiPlus, FiGrid, FiList, FiCheckSquare, FiEdit2, FiTrash2 } from 'react-icons/fi'
import useTasks from '../hooks/useTasks'
import useProjects from '../hooks/useProjects'
import useAuth from '../hooks/useAuth'
import TaskCard from '../components/tasks/TaskCard'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskForm from '../components/tasks/TaskForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import { formatDate, getInitials, getAvatarColor, isOverdue } from '../utils/helpers'
import toast from 'react-hot-toast'

const Tasks = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { tasks, pagination, isLoading, fetchTasks, createTask, updateTask, deleteTask, users, fetchUsers } = useTasks()
  const { projects, fetchProjects } = useProjects()

  const [filters, setFilters]         = useState({ page: 1, limit: 10 })
  const [view, setView]               = useState('grid')
  const [taskFormOpen, setFormOpen]   = useState(false)
  const [editing, setEditing]         = useState(null)
  const [delTarget, setDelTarget]     = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [delLoading, setDelLoading]   = useState(false)

  useEffect(() => { fetchTasks(filters) }, [fetchTasks, filters])
  useEffect(() => {
    fetchProjects({ limit: 100 })
    fetchUsers()   // always fetch — needed for assignedTo dropdown
  }, [fetchProjects, fetchUsers])

  const handleCreate = async (data) => {
    setFormLoading(true)
    try { await createTask(data); setFormOpen(false) }
    catch (err) { toast.error(err.message) }
    finally { setFormLoading(false) }
  }

  const handleUpdate = async (data) => {
    setFormLoading(true)
    try { await updateTask(editing._id, data); setEditing(null); setFormOpen(false) }
    catch (err) { toast.error(err.message) }
    finally { setFormLoading(false) }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try { await deleteTask(delTarget._id); setDelTarget(null) }
    catch (err) { toast.error(err.message) }
    finally { setDelLoading(false) }
  }

  const openEdit = t => { setEditing(t); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditing(null) }

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">All Tasks</h1>
          <p className="page-subtitle">{pagination.total} task{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
            {[['grid', FiGrid], ['list', FiList]].map(([v, Icon]) => (
              <button key={v} onClick={() => setView(v)}
                className={`p-2 rounded-lg transition-all ${view === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                <Icon size={14} />
              </button>
            ))}
          </div>
          {isAdmin && <Button icon={<FiPlus size={15} />} onClick={() => setFormOpen(true)}>New Task</Button>}
        </div>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} projects={projects} users={users} />

      {isLoading ? <Loader text="Loading tasks..." /> :
       tasks.length === 0 ? (
        <EmptyState icon={FiCheckSquare} title="No tasks found"
          description="Try adjusting your filters or create a new task."
          action={isAdmin && <Button size="sm" icon={<FiPlus size={13} />} onClick={() => setFormOpen(true)}>Create Task</Button>}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tasks.map(t => <TaskCard key={t._id} task={t} onEdit={openEdit} onDelete={setDelTarget} />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-th">Title</th>
                <th className="table-th hidden md:table-cell">Project</th>
                <th className="table-th hidden lg:table-cell">Assignee</th>
                <th className="table-th">Priority</th>
                <th className="table-th">Status</th>
                <th className="table-th hidden sm:table-cell">Due</th>
                <th className="table-th" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tasks.map(t => (
                <tr key={t._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="table-td font-semibold text-gray-800 max-w-[180px] truncate">{t.title}</td>
                  <td className="table-td hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg font-medium">{t.project?.name || '—'}</span>
                  </td>
                  <td className="table-td hidden lg:table-cell">
                    {t.assignedTo ? (
                      <div className="flex items-center gap-1.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${getAvatarColor(t.assignedTo.name)}`}>
                          {getInitials(t.assignedTo.name)}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{t.assignedTo.name}</span>
                      </div>
                    ) : <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="table-td"><Badge type="priority" value={t.priority} /></td>
                  <td className="table-td"><Badge type="status" value={t.status} dot /></td>
                  <td className="table-td hidden sm:table-cell">
                    <span className={`text-xs font-medium ${isOverdue(t.dueDate) && t.status !== 'completed' ? 'text-red-500' : 'text-gray-400'}`}>
                      {formatDate(t.dueDate)}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(t)} className="icon-btn" title="Edit"><FiEdit2 size={13} /></button>
                      {isAdmin && <button onClick={() => setDelTarget(t)} className="icon-btn hover:!text-red-500 hover:!bg-red-50" title="Delete"><FiTrash2 size={13} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</Button>
          <span className="text-sm text-gray-500 font-medium">Page {filters.page} of {pagination.pages}</span>
          <Button variant="secondary" size="sm" disabled={filters.page === pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</Button>
        </div>
      )}

      <TaskForm isOpen={taskFormOpen} onClose={closeForm} onSubmit={editing ? handleUpdate : handleCreate}
        task={editing} projects={projects} users={users} isLoading={formLoading} />
      <ConfirmDialog isOpen={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete}
        title="Delete Task" message={`Delete "${delTarget?.title}"?`} isLoading={delLoading} />
    </div>
  )
}

export default Tasks
