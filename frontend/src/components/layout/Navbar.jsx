import { useState } from 'react'
import { FiMenu, FiBell, FiChevronDown, FiLogOut } from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'
import { getInitials, getAvatarColor } from '../../utils/helpers'

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      {/* Left */}
      <button onClick={onMenuToggle} className="lg:hidden icon-btn">
        <FiMenu size={19} />
      </button>

      {/* Right */}
      <div className="flex items-center gap-2 ml-auto">
        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(user?.name)}`}>
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-gray-400 capitalize">{user?.role}</p>
            </div>
            <FiChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                <div className="px-4 py-3.5 bg-gradient-to-br from-violet-50 to-indigo-50 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setOpen(false); logout() }}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    <FiLogOut size={14} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
