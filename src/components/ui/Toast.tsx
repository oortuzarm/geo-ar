import { useGeoStore } from '../../store/geoStore'

export default function ToastContainer() {
  const { toasts, removeToast } = useGeoStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl',
            'border animate-slide-up text-sm font-medium max-w-xs',
            toast.type === 'success'
              ? 'bg-green-900/90 border-green-700 text-green-100'
              : toast.type === 'error'
              ? 'bg-red-900/90 border-red-700 text-red-100'
              : 'bg-gray-800/90 border-gray-700 text-gray-100',
          ].join(' ')}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
