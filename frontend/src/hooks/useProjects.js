import { useContext } from 'react'
import { TaskContext } from '../context/TaskContext'

const useProjects = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useProjects must be used within a TaskProvider')
  }
  const {
    projects,
    projectPagination,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
  } = context

  return {
    projects,
    pagination: projectPagination,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
  }
}

export default useProjects
