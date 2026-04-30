import { useContext } from 'react'
import { TaskContext } from '../context/TaskContext'

const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  const {
    tasks,
    pagination,
    dashboard,
    users,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchDashboard,
    fetchUsers,
    updateUserRole,
    deleteUser,
  } = context

  return {
    tasks,
    pagination,
    dashboard,
    users,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchDashboard,
    fetchUsers,
    updateUserRole,
    deleteUser,
  }
}

export default useTasks
