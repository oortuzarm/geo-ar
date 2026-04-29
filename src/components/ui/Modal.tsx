import type { ReactNode } from 'react'
import Button from './Button'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
  children?: ReactNode
}

export default function Modal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
  children,
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          {description && <p className="mt-2 text-sm text-gray-400">{description}</p>}
          {children && <div className="mt-4">{children}</div>}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
