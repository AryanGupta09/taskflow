import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const NotFound = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
    <div className="text-center">
      <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-indigo-600 mb-4">
        404
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
      <p className="text-gray-500 mb-8 max-w-sm text-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/dashboard"
        className="inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-violet-700 transition-colors text-sm">
        <FiArrowLeft size={15} />
        Back to Dashboard
      </Link>
    </div>
  </div>
)

export default NotFound
