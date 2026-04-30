import { useEffect, useState } from 'react'
import { FiPlus, FiFolder } from 'react-icons/fi'
import useProjects from '../hooks/useProjects'
import useAuth from '../hooks/useAuth'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectForm from '../components/projects/ProjectForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { SkeletonCard } from '../components/common/Loader'
import toast from 'react-hot-toast'

const Projects = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { projects, pagination, isLoading, fetchProjects, createProject, updateProject, deleteProject } = useProjects()

  const [formOpen, setFormOpen]       = useState(false)
  const [editing, setEditing]         = useState(null)
  const [delTarget, setDelTarget]     = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [delLoading, setDelLoading]   = useState(false)
  const [page, setPage]               = useState(1)
  const [statusFilter, setStatus]     = useState('')

  useEffect(() => { fetchProjects({ page, limit: 9, ...(statusFilter && { status: statusFilter }) }) },
    [fetchProjects, page, statusFilter])

  const handleCreate = async (data) => {
    setFormLoading(true)
    try { await createProject(data); setFormOpen(false) }
    catch (err) { toast.error(err.message) }
    finally { setFormLoading(false) }
  }

  const handleUpdate = async (data) => {
    setFormLoading(true)
    try { await updateProject(editing._id, data); setEditing(null); setFormOpen(false) }
    catch (err) { toast.error(err.message) }
    finally { setFormLoading(false) }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try { await deleteProject(delTarget._id); setDelTarget(null) }
    catch (err) { toast.error(err.message) }
    finally { setDelLoading(false) }
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{pagination.total} project{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-600 font-medium">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          {isAdmin && (
            <Button icon={<FiPlus size={15} />} onClick={() => setFormOpen(true)}>
              New Project
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState icon={FiFolder} title="No projects yet"
          description={isAdmin ? 'Create your first project to get started.' : 'You haven\'t been added to any projects yet.'}
          action={isAdmin && <Button icon={<FiPlus size={14} />} size="sm" onClick={() => setFormOpen(true)}>Create Project</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map(p => (
              <ProjectCard key={p._id} project={p}
                onEdit={p => { setEditing(p); setFormOpen(true) }}
                onDelete={setDelTarget}
              />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</Button>
              <span className="text-sm text-gray-500 font-medium">Page {page} of {pagination.pages}</span>
              <Button variant="secondary" size="sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</Button>
            </div>
          )}
        </>
      )}

      <ProjectForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={editing ? handleUpdate : handleCreate} project={editing} isLoading={formLoading} />

      <ConfirmDialog isOpen={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete}
        title="Delete Project"
        message={`Delete "${delTarget?.name}"? All tasks inside will also be deleted.`}
        isLoading={delLoading} />
    </div>
  )
}

export default Projects
