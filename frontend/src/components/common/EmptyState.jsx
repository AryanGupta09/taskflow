import { FiInbox } from 'react-icons/fi'

const EmptyState = ({ icon: Icon = FiInbox, title = 'Nothing here yet', description = '', action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-violet-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
      <Icon size={26} className="text-violet-400" />
    </div>
    <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 max-w-xs mb-5 leading-relaxed">{description}</p>}
    {action && <div>{action}</div>}
  </div>
)

export default EmptyState
