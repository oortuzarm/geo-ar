import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className = '', id, ...rest }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'bg-gray-800 border rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors',
          error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600',
          className,
        ].join(' ')}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className = '', id, ...rest }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={3}
        className={[
          'bg-gray-800 border rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-500 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors',
          error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600',
          className,
        ].join(' ')}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
