import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Input from '../common/Input'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../utils/constants'
import useAuth from '../../hooks/useAuth'

const defaultForm = {
  title: '',
  description: '',
  project: '',
  assignedTo: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
}

const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  task = null,
  projects = [],
  users = [],
  defaultProjectId = '',
  isLoading,
}) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isEditing = !!task
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        project: task.project?._id || task.project || '',
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : '',
      })
    } else {
      setForm({ ...defaultForm, project: defaultProjectId })
    }
    setErrors({})
  }, [task, isOpen, defaultProjectId])

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (form.title.length > 200) errs.title = 'Title cannot exceed 200 characters'
    if (!form.project) errs.project = 'Project is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    const payload = { ...form }
    if (!payload.assignedTo) delete payload.assignedTo
    if (!payload.dueDate) delete payload.dueDate
    if (!payload.description) delete payload.description
    onSubmit(payload)
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          required
          value={form.title}
          onChange={handleChange('title')}
          error={errors.title}
          placeholder="Task title..."
          disabled={!isAdmin}
          maxLength={200}
        />

        <div>
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            rows={2}
            maxLength={1000}
            placeholder="Optional description..."
            disabled={!isAdmin}
            className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              value={form.project}
              onChange={handleChange('project')}
              disabled={!isAdmin}
              className={`input-field disabled:bg-gray-50 ${errors.project ? 'border-red-400' : ''}`}
            >
              <option value="">— Select project —</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.project && (
              <p className="mt-1 text-xs text-red-600">{errors.project}</p>
            )}
          </div>

          <div>
            <label className="label">Assigned To</label>
            <select
              value={form.assignedTo}
              onChange={handleChange('assignedTo')}
              disabled={!isAdmin}
              className="input-field disabled:bg-gray-50"
            >
              <option value="">— Unassigned —</option>
              {users.length === 0 && isAdmin && (
                <option disabled>Loading users...</option>
              )}
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              value={form.status}
              onChange={handleChange('status')}
              className="input-field"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Priority</label>
            <select
              value={form.priority}
              onChange={handleChange('priority')}
              disabled={!isAdmin}
              className="input-field disabled:bg-gray-50"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={handleChange('dueDate')}
            disabled={!isAdmin}
          />
        </div>

        {!isAdmin && (
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            As a member, you can only update the task status.
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default TaskForm
