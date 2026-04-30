import { useState } from 'react'
import { FiUserPlus, FiX } from 'react-icons/fi'
import { getInitials, getAvatarColor } from '../../utils/helpers'
import Modal from '../common/Modal'
import Button from '../common/Button'
import useAuth from '../../hooks/useAuth'

const MembersList = ({ project, allUsers = [], onAddMember, onRemoveMember }) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const memberIds = project?.members?.map((m) => m._id) || []
  const ownerId = project?.owner?._id

  // Users not already in the project
  const availableUsers = allUsers.filter(
    (u) => !memberIds.includes(u._id) && u._id !== ownerId
  )

  const handleAdd = async () => {
    if (!selectedUserId) return
    setIsLoading(true)
    try {
      await onAddMember(selectedUserId)
      setSelectedUserId('')
      setAddModalOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Members ({project?.members?.length || 0})
        </h3>
        {isAdmin && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <FiUserPlus size={13} />
            Add Member
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Owner */}
        {project?.owner && (
          <div className="flex items-center gap-2 bg-indigo-50 rounded-full pl-1 pr-3 py-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(
                project.owner.name
              )}`}
            >
              {getInitials(project.owner.name)}
            </div>
            <span className="text-xs font-medium text-indigo-700">
              {project.owner.name}
            </span>
            <span className="text-xs text-indigo-400">(owner)</span>
          </div>
        )}

        {/* Members */}
        {project?.members?.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-2 py-1"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(
                member.name
              )}`}
            >
              {getInitials(member.name)}
            </div>
            <span className="text-xs font-medium text-gray-700">
              {member.name}
            </span>
            {isAdmin && member._id !== user?._id && (
              <button
                onClick={() => onRemoveMember(member._id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                title="Remove member"
              >
                <FiX size={12} />
              </button>
            )}
          </div>
        ))}

        {!project?.members?.length && !project?.owner && (
          <p className="text-sm text-gray-400">No members yet.</p>
        )}
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Member"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Select User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="input-field"
            >
              <option value="">— Choose a user —</option>
              {availableUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            {!availableUsers.length && (
              <p className="text-xs text-gray-500 mt-1">
                All users are already members.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAdd}
              disabled={!selectedUserId}
              isLoading={isLoading}
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MembersList
