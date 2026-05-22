import { Link } from 'react-router-dom'

interface PlanGateProps {
  emoji:       string
  title:       string
  description: string
}

export default function PlanGate({ emoji, title, description }: PlanGateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
      <div className="text-4xl">{emoji}</div>
      <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
      <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      <Link
        to="/app/plans"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                   bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium
                   transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500
                   focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Mejorar plan
      </Link>
    </div>
  )
}
