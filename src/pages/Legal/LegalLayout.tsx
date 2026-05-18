import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050810] text-white">

      <LandingNavBar />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 pt-16 py-14 md:py-20">

        {/* Page header */}
        <div className="mb-12 md:mb-16 pb-8 border-b border-white/[0.06]">
          <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-4">
            {lastUpdated}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {title}
          </h1>
        </div>

        {/* Legal content */}
        <div className="space-y-10 md:space-y-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="mt-16">
        <SiteFooter />
      </div>

    </div>
  )
}
