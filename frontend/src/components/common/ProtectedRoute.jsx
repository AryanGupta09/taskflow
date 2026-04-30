import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Loader from './Loader'

/**
 * Wraps routes that require authentication.
 * - If not authenticated → redirect to /login
 * - If adminOnly and user is not admin → redirect to /dashboard
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) return <Loader fullScreen text="Authenticating..." />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🚫</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          You don&apos;t have permission to view this page. Admin access required.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    )
  }

  return children
}

export default ProtectedRoute
