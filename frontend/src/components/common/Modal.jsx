import { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-xl', xl: 'max-w-2xl' }

const Modal = ({ isOpen, onClose, title, children, size = 'md', hideClose = false }) => {
  const overlayRef = useRef(null)

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className={`
        relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl
        border border-gray-100 overflow-hidden
        animate-[modalIn_0.18s_ease-out]
      `}
        style={{ animation: 'modalIn 0.18s ease-out' }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {!hideClose && (
            <button onClick={onClose} className="icon-btn">
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export default Modal
