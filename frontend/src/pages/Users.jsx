import { useEffect, useState } from 'react'
import { FiUsers, FiSearch, FiTrash2, FiShield, FiUser, FiLoader } from 'react-icons/fi'
import useTasks from '../hooks/useTasks'
import useAuth from '../hooks/useAuth'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import { formatDate, getInitials, getAvatarColor } from '../utils/helpers'
import toast from 'react-hot-toast'

const Users = () => {
  const { user: me } = useAuth()
  const { users, isLoading, fetchUsers, updateUserRole, deleteUser } = useTasks()
  const [search, setSearch]         = useState('')
  const [delTarget, setDelTarget]   = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [roleLoading, setRoleLoading] = useState(null)

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleToggleRole = async (u) => {
    setRoleLoading(u._id)
    try { await updateUserRole(u._id, u.role === 'admin' ? 'member' : 'admin') }
    catch (err) { toast.error(err.message) }
    finally { setRoleLoading(null) }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try { await deleteUser(delTarget._id); setDelTarget(null) }
    catch (err) { toast.error(err.message) }
    finally { setDelLoading(false) }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading && !users.length) return <Loader text="Loading users..." />

  return (
    <div className="space-y-5 page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Members</h1>
          <p className="page-subtitle">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-sm">
          <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field pl-9" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FiUsers} title="No users found"
          description={search ? 'Try a different search term.' : 'No users registered yet.'} />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-th">User</th>
                <th className="table-th hidden md:table-cell">Email</th>
                <th className="table-th">Role</th>
                <th className="table-th hidden lg:table-cell">Joined</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => {
                const isSelf = u._id === me?._id
                return (
                  <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${getAvatarColor(u.name)}`}>
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {u.name}
                            {isSelf && <span className="ml-1.5 text-xs text-violet-500 font-normal">(you)</span>}
                          </p>
                          <p className="text-xs text-gray-400 md:hidden">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td hidden md:table-cell text-gray-500 text-sm">{u.email}</td>
                    <td className="table-td">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                        u.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role === 'admin' ? <FiShield size={10} /> : <FiUser size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="table-td hidden lg:table-cell text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggleRole(u)} disabled={isSelf || roleLoading === u._id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                            u.role === 'admin'
                              ? 'text-gray-500 hover:bg-gray-100'
                              : 'text-violet-600 hover:bg-violet-50'
                          }`}>
                          {roleLoading === u._id
                            ? <span className="animate-spin text-sm">⟳</span>
                            : <FiShield size={11} />}
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button onClick={() => setDelTarget(u)} disabled={isSelf}
                          className="icon-btn hover:!text-red-500 hover:!bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete}
        title="Delete User" message={`Delete "${delTarget?.name}"? This cannot be undone.`} isLoading={delLoading} />
    </div>
  )
}

export default Users
