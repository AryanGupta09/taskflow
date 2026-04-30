import Modal from './Modal'
import Button from './Button'
import { FiAlertTriangle } from 'react-icons/fi'

const ConfirmDialog = ({
  isOpen, onClose, onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure? This action cannot be undone.',
  confirmLabel = 'Delete',
  isLoading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex flex-col items-center text-center gap-4 py-2">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
        <FiAlertTriangle size={24} className="text-red-500" />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
      <div className="flex gap-3 w-full pt-1">
        <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" className="flex-1" onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
)

export default ConfirmDialog
