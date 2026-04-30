import { useEffect } from 'react'
import { FiCheckSquare, FiClock, FiAlertCircle, FiList } from 'react-icons/fi'
import useTasks from '../hooks/useTasks'
import useAuth from '../hooks/useAuth'
import StatsCard from '../components/dashboard/StatsCard'
import TaskStatusChart from '../components/dashboard/TaskStatusChart'
import PriorityChart from '../components/dashboard/PriorityChart'
import RecentTasks from '../components/dashboard/RecentTasks'
import Loader from '../components/common/Loader'

const Dashboard = () => {
  const { dashboard, isLoading, fetchDashboard } = useTasks()
  const { user } = useAuth()

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  if (isLoading && !dashboard) return <Loader text="Loading dashboard..." />

  const pct = dashboard?.totalTasks
    ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
    : 0

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span className="text-violet-600">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="page-subtitle">Here's what's happening with your team today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Tasks"  value={dashboard?.totalTasks ?? 0}      icon={FiList}        color="violet" />
        <StatsCard title="Completed"    value={dashboard?.completedTasks ?? 0}   icon={FiCheckSquare} color="green"  subtitle={`${pct}% done`} />
        <StatsCard title="In Progress"  value={dashboard?.inProgressTasks ?? 0}  icon={FiClock}       color="yellow" />
        <StatsCard title="Overdue"      value={dashboard?.overdueTasks ?? 0}      icon={FiAlertCircle} color="red"    />
      </div>

      {/* Progress bar */}
      {dashboard?.totalTasks > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Overall Progress</p>
            <span className="text-sm font-bold text-violet-600">{pct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
            <span>{dashboard.completedTasks} completed</span>
            <span>{dashboard.totalTasks - dashboard.completedTasks} remaining</span>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="text-sm font-bold text-gray-700 mb-1">Task Status</p>
          <p className="text-xs text-gray-400 mb-4">Distribution across all statuses</p>
          <TaskStatusChart data={dashboard} />
        </div>
        <div className="card p-5">
          <p className="text-sm font-bold text-gray-700 mb-1">Priority Breakdown</p>
          <p className="text-xs text-gray-400 mb-4">Tasks grouped by priority level</p>
          <PriorityChart data={dashboard?.tasksByPriority} />
        </div>
      </div>

      {/* Recent tasks */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-gray-700">Recent Tasks</p>
            <p className="text-xs text-gray-400 mt-0.5">Last 5 updated tasks</p>
          </div>
        </div>
        <RecentTasks tasks={dashboard?.recentTasks || []} />
      </div>
    </div>
  )
}

export default Dashboard
