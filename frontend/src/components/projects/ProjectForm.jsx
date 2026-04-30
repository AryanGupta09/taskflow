import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Input from '../common/Input'
import { PROJECT_STATUS } from '../../utils/constants'

const defaultForm = {
  name: '',
  description: '',
  status: 'active',
  deadline: '',
}

const ProjectForm = ({ isOpen, onClose, onSubmit, project = null, isLoading }) => {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})
  const isEditing = !!project

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'active',
        deadline: project.deadline
          ? new Date(project.deadline).toISOString().split('T')[0]
          : '',
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
  }, [project, isOpen])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Project name is required'
    if (form.name.length > 100) errs.name = 'Name cannot exceed 100 characters'
    if (form.description.length > 500)
      errs.description = 'Description cannot exceed 500 characters'
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
    if (!payload.deadline) delete payload.deadline
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
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          required
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="e.g. Website Redesign"
          maxLength={100}
        />

        <div>
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            rows={3}
            maxLength={500}
            placeholder="Brief description of the project..."
            className={`input-field resize-none ${errors.description ? 'border-red-400 bg-red-50' : ''}`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-xs text-red-600">{errors.description}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">{form.description.length}/500</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              value={form.status}
              onChange={handleChange('status')}
              className="input-field"
            >
              {PROJECT_STATUS.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange('deadline')}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

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
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ProjectForm
