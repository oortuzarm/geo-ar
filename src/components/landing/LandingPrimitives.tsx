import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-widest uppercase text-brand-400 mb-4">
      {children}
    </p>
  )
}

export function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="h-10 bg-[#0d1117] border-b border-white/[0.06] flex items-center gap-3 px-4 flex-shrink-0">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
      </div>
      <div className="flex-1 flex justify-center min-w-0">
        <div className="bg-white/[0.05] rounded-md px-4 py-0.5 text-[11px] text-slate-500 truncate max-w-[260px]">
          {url}
        </div>
      </div>
    </div>
  )
}
