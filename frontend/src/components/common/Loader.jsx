const Loader = ({ size = 'md', text = '', fullScreen = false }) => {
  const ring = {
    sm: 'h-5 w-5 border-2',
    md: 'h-9 w-9 border-2',
    lg: 'h-14 w-14 border-[3px]',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${ring[size]} rounded-full border-violet-100 border-t-violet-600 animate-spin`} />
      {text && <p className="text-sm text-gray-400 font-medium">{text}</p>}
    </div>
  )

  if (fullScreen) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
      {spinner}
    </div>
  )

  return <div className="flex items-center justify-center py-16">{spinner}</div>
}

export const SkeletonCard = () => (
  <div className="card p-5 animate-pulse space-y-3">
    <div className="flex justify-between">
      <div className="h-3.5 bg-gray-100 rounded-full w-1/2" />
      <div className="h-5 bg-gray-100 rounded-full w-16" />
    </div>
    <div className="h-3 bg-gray-100 rounded-full w-full" />
    <div className="h-3 bg-gray-100 rounded-full w-3/4" />
    <div className="flex gap-2 pt-1">
      <div className="h-5 bg-gray-100 rounded-full w-14" />
      <div className="h-5 bg-gray-100 rounded-full w-18" />
    </div>
  </div>
)

export default Loader
