import { createContext, useReducer, useCallback } from 'react'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'

export const TaskContext = createContext(null)

const initialState = {
  tasks: [],
  projects: [],
  users: [],
  dashboard: null,
  pagination: { page: 1, pages: 1, total: 0 },
  projectPagination: { page: 1, pages: 1, total: 0 },
  isLoading: false,
  usersLoading: false,   // separate loading flag for users
  error: null,
}

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }

    // Tasks
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload.tasks,
        pagination: {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        },
        isLoading: false,
      }
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      }

    // Projects
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload.projects,
        projectPagination: {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        },
        isLoading: false,
      }
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
      }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p._id !== action.payload),
      }

    // Users
    case 'SET_USERS_LOADING':
      return { ...state, usersLoading: action.payload }
    case 'SET_USERS':
      return { ...state, users: action.payload, usersLoading: false, isLoading: false }
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        ),
      }
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((u) => u._id !== action.payload),
      }

    // Dashboard
    case 'SET_DASHBOARD':
      return { ...state, dashboard: action.payload, isLoading: false }

    default:
      return state
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // ── Tasks ──────────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await axiosInstance.get('/tasks', { params })
      dispatch({ type: 'SET_TASKS', payload: data })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      toast.error(err.message)
    }
  }, [])

  const createTask = async (taskData) => {
    const { data } = await axiosInstance.post('/tasks', taskData)
    dispatch({ type: 'ADD_TASK', payload: data.task })
    toast.success('Task created successfully.')
    return data.task
  }

  const updateTask = async (id, taskData) => {
    const { data } = await axiosInstance.patch(`/tasks/${id}`, taskData)
    dispatch({ type: 'UPDATE_TASK', payload: data.task })
    toast.success('Task updated successfully.')
    return data.task
  }

  const deleteTask = async (id) => {
    await axiosInstance.delete(`/tasks/${id}`)
    dispatch({ type: 'DELETE_TASK', payload: id })
    toast.success('Task deleted.')
  }

  const fetchDashboard = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await axiosInstance.get('/tasks/dashboard')
      dispatch({ type: 'SET_DASHBOARD', payload: data.dashboard })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      toast.error(err.message)
    }
  }, [])

  // ── Projects ───────────────────────────────────────────────────────────────
  const fetchProjects = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await axiosInstance.get('/projects', { params })
      dispatch({ type: 'SET_PROJECTS', payload: data })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      toast.error(err.message)
    }
  }, [])

  const createProject = async (projectData) => {
    const { data } = await axiosInstance.post('/projects', projectData)
    dispatch({ type: 'ADD_PROJECT', payload: data.project })
    toast.success('Project created successfully.')
    return data.project
  }

  const updateProject = async (id, projectData) => {
    const { data } = await axiosInstance.patch(`/projects/${id}`, projectData)
    dispatch({ type: 'UPDATE_PROJECT', payload: data.project })
    toast.success('Project updated successfully.')
    return data.project
  }

  const deleteProject = async (id) => {
    await axiosInstance.delete(`/projects/${id}`)
    dispatch({ type: 'DELETE_PROJECT', payload: id })
    toast.success('Project deleted.')
  }

  const addProjectMember = async (projectId, userId) => {
    const { data } = await axiosInstance.post(`/projects/${projectId}/members`, { userId })
    dispatch({ type: 'UPDATE_PROJECT', payload: data.project })
    toast.success('Member added.')
    return data.project
  }

  const removeProjectMember = async (projectId, userId) => {
    const { data } = await axiosInstance.delete(`/projects/${projectId}/members/${userId}`)
    dispatch({ type: 'UPDATE_PROJECT', payload: data.project })
    toast.success('Member removed.')
    return data.project
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    // Don't re-fetch if already loaded
    dispatch({ type: 'SET_USERS_LOADING', payload: true })
    try {
      const { data } = await axiosInstance.get('/users')
      dispatch({ type: 'SET_USERS', payload: data.users })
    } catch (err) {
      dispatch({ type: 'SET_USERS_LOADING', payload: false })
      // Silently fail for non-admins (403 expected) — don't show toast
      if (err.response?.status !== 403) {
        toast.error(err.message)
      }
    }
  }, [])

  const updateUserRole = async (id, role) => {
    const { data } = await axiosInstance.patch(`/users/${id}`, { role })
    dispatch({ type: 'UPDATE_USER', payload: data.user })
    toast.success('User role updated.')
    return data.user
  }

  const deleteUser = async (id) => {
    await axiosInstance.delete(`/users/${id}`)
    dispatch({ type: 'DELETE_USER', payload: id })
    toast.success('User deleted.')
  }

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        fetchDashboard,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        addProjectMember,
        removeProjectMember,
        fetchUsers,
        updateUserRole,
        deleteUser,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
