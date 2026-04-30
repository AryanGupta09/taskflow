import { NavLink } from 'react-router-dom'
import { FiGrid, FiFolder, FiCheckSquare, FiUsers, FiLogOut, FiZap } from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'
import { getInitials, getAvatarColor } from '../../utils/helpers'

const navItems = [
  { to: '/dashboard', icon: FiGrid,        label: 'Dashboard' },
  { to: '/projects',  icon: FiFolder,      label: 'Projects'  },
  { to: '/tasks',     icon: FiCheckSquare, label: 'Tasks'     },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        bg-gray-950 text-white
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/40">
            <FiZap size={17} className="text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">TaskFlow</span>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Workspace</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Menu</p>

          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                  : 'text-gray-400 hover:bg-white/8 hover:text-white'}
              `}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink to="/users" onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                  : 'text-gray-400 hover:bg-white/8 hover:text-white'}
              `}
            >
              <FiUsers size={17} />
              Users
            </NavLink>
          )}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${getAvatarColor(user?.name)}`}>
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                user?.role === 'admin' ? 'bg-violet-500/30 text-violet-300' : 'bg-white/10 text-gray-400'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
          >
            <FiLogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
