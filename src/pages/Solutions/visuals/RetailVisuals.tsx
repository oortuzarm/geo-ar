// ─── Retail use-case visual panels — v4 ──────────────────────────────────────
// All mockups represent real Ubyca capabilities.
// Availability: GPS radius geofence. Actions: message + CTA button (URL / WhatsApp).
// Case 1: map + geofence + phone  (entry trigger → open URL)
// Case 2: phone dominant + map faint  (entry trigger → open WhatsApp)
// Case 3: two territories + phone  (competitor zone trigger → open URL)
// Case 4: analytics dashboard, no phone  (Studio operational view)

import React from 'react'

const ACCENT = '#0ea5e9'

// ─── Phone chrome ─────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 5px', background: '#07090f' }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.72)', fontFamily: 'system-ui' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 10 }}>
          {[4, 6, 8, 10].map((h, i) => (
            <div key={i} style={{ width: 2.5, height: h, borderRadius: 1, background: `rgba(255,255,255,${0.35 + i * 0.15})` }} />
          ))}
        </div>
        <div style={{ width: 20, height: 10, border: '1px solid rgba(255,255,255,0.32)', borderRadius: 2.5, position: 'relative', marginLeft: 2 }}>
          <div style={{ position: 'absolute', left: 1.5, top: 1.5, width: '65%', height: 'calc(100% - 3px)', background: 'rgba(255,255,255,0.65)', borderRadius: 1 }} />
          <div style={{ position: 'absolute', right: -3.5, top: '50%', transform: 'translateY(-50%)', width: 2.5, height: 5, background: 'rgba(255,255,255,0.25)', borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

function BrowserBar({ url }: { url: string }) {
  return (
    <div style={{ background: '#0b0d1c', padding: '3px 10px 6px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ background: 'rgba(255,255,255,0.055)', borderRadius: 7, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="7" height="8" viewBox="0 0 7 8" fill="none">
          <rect x="0.8" y="3.8" width="5.4" height="3.8" rx="0.8" fill="rgba(255,255,255,0.30)" />
          <path d="M1.8 3.8V2.8a1.7 1.7 0 013.4 0V3.8" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        </svg>
        <span style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', flex: 1, textAlign: 'center' }}>{url}</span>
      </div>
    </div>
  )
}

function HomeIndicator() {
  return (
    <div style={{ height: 18, background: '#07090f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 38, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
    </div>
  )
}

// ─── Phone shell: mobile browser ─────────────────────────────────────────────

function PhoneWebShell({ children, url = 'exp.ubyca.com/nova-moda', width = 164 }: {
  children: React.ReactNode
  url?: string
  width?: number
}) {
  return (
    <div style={{
      width,
      borderRadius: 28,
      border: '2px solid rgba(255,255,255,0.14)',
      background: '#07090f',
      overflow: 'hidden',
      boxShadow: '0 24px 56px rgba(0,0,0,0.80), 0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
      flexShrink: 0,
    }}>
      <StatusBar />
      <BrowserBar url={url} />
      {children}
      <HomeIndicator />
    </div>
  )
}

// ─── Ubyca experience card ────────────────────────────────────────────────────
// Represents the actual product output: welcome message + action buttons.

type BtnIcon = 'link' | 'whatsapp' | 'video' | 'audio'

function ActionButton({ label, icon, accent, primary }: {
  label: string; icon: BtnIcon; accent: string; primary: boolean
}) {
  const iconEls: Record<BtnIcon, React.ReactNode> = {
    link: (
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 7L7 1M7 1H4.5M7 1V3.5" />
      </svg>
    ),
    whatsapp: (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 1C2.6 1 1 2.6 1 4.5c0 .6.2 1.2.5 1.7L1 8l1.8-.5c.5.3 1.1.5 1.7.5C6.4 8 8 6.4 8 4.5S6.4 1 4.5 1z" />
        <path d="M3.3 3.8c.1.2.3.6.5.8.2.2.5.5.8.6" />
      </svg>
    ),
    video: (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="4.5" cy="4.5" r="3.5" />
        <path d="M3.5 3L6.5 4.5L3.5 6V3Z" fill="currentColor" stroke="none" />
      </svg>
    ),
    audio: (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <rect x="3.3" y="0.8" width="2.4" height="4.4" rx="1.2" />
        <path d="M1.8 5c0 1.5 1.2 2.7 2.7 2.7S7.2 6.5 7.2 5M4.5 7.7V9" />
      </svg>
    ),
  }

  return (
    <div style={{
      borderRadius: 9, padding: '7px 10px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: primary ? accent : `${accent}12`,
      border: primary ? 'none' : `1px solid ${accent}28`,
      color: primary ? 'white' : accent,
    }}>
      <span style={{ fontSize: 8.5, fontWeight: 700, fontFamily: 'system-ui' }}>{label}</span>
      {iconEls[icon]}
    </div>
  )
}

function UbycaExperienceCard({ brand, message, accent, buttons }: {
  brand: string
  message: string
  accent: string
  buttons: Array<{ label: string; icon: BtnIcon; primary?: boolean }>
}) {
  return (
    <div style={{ background: '#08091a' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px',
        background: `${accent}09`,
        borderBottom: `1px solid ${accent}18`,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5.5,
          background: `${accent}18`, border: `1px solid ${accent}38`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
        </div>
        <div>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontFamily: 'system-ui', display: 'block', lineHeight: 1.2 }}>{brand}</span>
          <span style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.28)', fontFamily: 'system-ui' }}>Experiencia activada · ahora</span>
        </div>
      </div>

      <div style={{ padding: '12px 12px 10px' }}>
        <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.60)', lineHeight: 1.55, fontFamily: 'system-ui', margin: 0 }}>{message}</p>
      </div>

      <div style={{ padding: '2px 10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {buttons.map((btn, i) => (
          <ActionButton
            key={i}
            label={btn.label}
            icon={btn.icon}
            accent={accent}
            primary={btn.primary ?? i === 0}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Shared: SVG map primitives ───────────────────────────────────────────────

function StreetGrid() {
  return (
    <g>
      <line x1="0" y1="68"  x2="480" y2="82"  stroke="rgba(255,255,255,0.042)" strokeWidth="16" />
      <line x1="0" y1="165" x2="480" y2="172" stroke="rgba(255,255,255,0.028)" strokeWidth="9" />
      <line x1="0" y1="248" x2="480" y2="255" stroke="rgba(255,255,255,0.042)" strokeWidth="16" />
      <line x1="0" y1="308" x2="480" y2="312" stroke="rgba(255,255,255,0.022)" strokeWidth="7" />
      <line x1="88"  y1="0" x2="83"  y2="340" stroke="rgba(255,255,255,0.028)" strokeWidth="9" />
      <line x1="210" y1="0" x2="215" y2="340" stroke="rgba(255,255,255,0.042)" strokeWidth="16" />
      <line x1="338" y1="0" x2="342" y2="340" stroke="rgba(255,255,255,0.028)" strokeWidth="9" />
      <line x1="428" y1="0" x2="425" y2="340" stroke="rgba(255,255,255,0.020)" strokeWidth="6" />
      <line x1="0"   y1="340" x2="210" y2="0"  stroke="rgba(255,255,255,0.014)" strokeWidth="6" />
      <line x1="280" y1="0"   x2="480" y2="220" stroke="rgba(255,255,255,0.014)" strokeWidth="6" />
    </g>
  )
}

function StorePinSVG({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <rect x={cx - 9} y={cy - 10} width={18} height={16} rx={2.5} fill={`${color}16`} stroke={`${color}55`} strokeWidth={1} />
      <rect x={cx - 6} y={cy - 7} width={4} height={4} rx={1} fill={`${color}35`} />
      <rect x={cx + 2} y={cy - 7} width={4} height={4} rx={1} fill={`${color}35`} />
      <rect x={cx - 2} y={cy - 1} width={4} height={7} rx={1} fill={`${color}40`} />
    </g>
  )
}

function PersonDotSVG({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={15} fill={`${color}07`} />
      <circle cx={cx} cy={cy} r={9}  fill={`${color}16`} />
      <circle cx={cx} cy={cy} r={5.5} fill={color} />
      <circle cx={cx} cy={cy} r={2.2} fill="white" />
    </g>
  )
}

// ─── Visual 1: Entry ──────────────────────────────────────────────────────────

export function RetailEntryVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={178} cy={175} r={88} fill={`${ACCENT}07`} />
        <circle cx={178} cy={175} r={88} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        <StorePinSVG cx={178} cy={175} color={ACCENT} />
        <PersonDotSVG cx={252} cy={175} color={ACCENT} />
        <line x1={292} y1={175} x2={260} y2={175} stroke={`${ACCENT}45`} strokeWidth={1.5} strokeDasharray="4 2.5" />
        <path d="M260,171 L252,175 L260,179" fill="none" stroke={`${ACCENT}55`} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/nova-moda" width={152}>
          <UbycaExperienceCard
            brand="Nova Moda"
            accent={ACCENT}
            message="Esta sucursal tiene una promoción activa. Válida hoy hasta las 20:00."
            buttons={[{ label: 'Ver promoción', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 2: Visit benefit ──────────────────────────────────────────────────

export function RetailLoyaltyVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 80% 80% at 50% 48%, ${ACCENT}0a 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.28 }}>
        <StreetGrid />
        <circle cx={240} cy={175} r={105} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="5 3" opacity={0.18} />
        <circle cx={240} cy={175} r={5} fill={`${ACCENT}20`} />
        <circle cx={240} cy={175} r={2.5} fill={`${ACCENT}40`} />
      </svg>
      <div className="absolute inset-x-0 flex justify-center" style={{ top: 18 }}>
        <PhoneWebShell url="exp.ubyca.com/nova-moda" width={164}>
          <UbycaExperienceCard
            brand="Nova Moda"
            accent={ACCENT}
            message="Hay un beneficio disponible en esta tienda. Actívalo antes de salir."
            buttons={[{ label: 'Reclamar en WhatsApp', icon: 'whatsapp' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 3: Competitor conquesting ─────────────────────────────────────────

export function RetailCompetitorVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 35% 45% at 28% 52%, rgba(148,163,184,0.06) 0%, transparent 60%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 30% 40% at 68% 52%, ${ACCENT}0a 0%, transparent 60%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={142} cy={175} r={74} fill="rgba(148,163,184,0.055)" />
        <circle cx={142} cy={175} r={74} fill="none" stroke="rgba(148,163,184,0.45)" strokeWidth={1.5} strokeDasharray="5 2.5" />
        <rect x={133} y={165} width={18} height={16} rx={2.5} fill="rgba(148,163,184,0.12)" stroke="rgba(148,163,184,0.35)" strokeWidth={1} />
        <rect x={136} y={168} width={4} height={4} rx={1} fill="rgba(148,163,184,0.25)" />
        <rect x={142} y={168} width={4} height={4} rx={1} fill="rgba(148,163,184,0.25)" />
        <rect x={88} y={106} width={108} height={14} rx={3} fill="rgba(148,163,184,0.06)" stroke="rgba(148,163,184,0.15)" strokeWidth={0.8} />
        <text x={142} y={117} textAnchor="middle" fill="rgba(148,163,184,0.45)" fontSize={7} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          COMPETENCIA
        </text>
        <circle cx={336} cy={175} r={68} fill={`${ACCENT}07`} />
        <circle cx={336} cy={175} r={68} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        <StorePinSVG cx={336} cy={175} color={ACCENT} />
        <rect x={285} y={104} width={102} height={14} rx={3} fill={`${ACCENT}09`} stroke={`${ACCENT}25`} strokeWidth={0.8} />
        <text x={336} y={115} textAnchor="middle" fill={`${ACCENT}99`} fontSize={7} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          TU TIENDA
        </text>
        <PersonDotSVG cx={162} cy={175} color="rgba(148,163,184,0.9)" />
        <line x1={172} y1={175} x2={220} y2={175} stroke={`${ACCENT}35`} strokeWidth={1} strokeDasharray="3 2" />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/nova-moda" width={152}>
          <UbycaExperienceCard
            brand="Nova Moda"
            accent={ACCENT}
            message="Hay una tienda Nova Moda a metros de aquí con una oferta activa hoy."
            buttons={[{ label: 'Ver oferta', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 4: People presence map ───────────────────────────────────────────
// Story: Ubyca shows who is inside right now — no speculation, no estimates.

export function RetailAnalyticsVisual() {
  const dots = [
    { cx: 192, cy: 155 }, { cx: 215, cy: 148 }, { cx: 238, cy: 161 },
    { cx: 180, cy: 176 }, { cx: 210, cy: 172 }, { cx: 234, cy: 168 },
    { cx: 252, cy: 182 }, { cx: 196, cy: 196 }, { cx: 222, cy: 200 },
    { cx: 246, cy: 194 }, { cx: 168, cy: 162 }, { cx: 260, cy: 154 },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>

      {/* Warm ambient glow — indicates activity */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 52% 48% at 46% 50%, rgba(251,146,60,0.07) 0%, transparent 68%)',
      }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />

        {/* Store boundary */}
        <circle cx={215} cy={175} r={128} fill="rgba(255,255,255,0.015)" />
        <circle cx={215} cy={175} r={128} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />

        {/* Heat — single warm center, three opacity rings */}
        <circle cx={220} cy={168} r={72} fill="rgba(251,146,60,0.04)" />
        <circle cx={220} cy={168} r={44} fill="rgba(251,146,60,0.08)" />
        <circle cx={220} cy={168} r={22} fill="rgba(251,146,60,0.13)" />

        {/* People inside — uniform white dots */}
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.cx} cy={d.cy} r={8}  fill="rgba(255,255,255,0.04)" />
            <circle cx={d.cx} cy={d.cy} r={4.5} fill="rgba(255,255,255,0.16)" />
            <circle cx={d.cx} cy={d.cy} r={2.2} fill="rgba(255,255,255,0.82)" />
          </g>
        ))}
      </svg>

      {/* Live indicator */}
      <div className="absolute flex items-center gap-2" style={{ top: 14, left: 16 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
        <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.08em' }}>EN VIVO</span>
      </div>

      {/* Two metric cards — editorial, no deltas */}
      <div className="absolute flex flex-col gap-3" style={{ bottom: 16, right: 16 }}>
        <div style={{
          padding: '11px 16px',
          background: 'rgba(6,9,16,0.90)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          backdropFilter: 'blur(16px)',
          minWidth: 116,
        }}>
          <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', fontFamily: 'system-ui', marginBottom: 5, letterSpacing: '0.02em' }}>Personas dentro</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: 'rgba(255,255,255,0.88)', lineHeight: 1, fontFamily: 'system-ui', letterSpacing: '-0.02em' }}>28</p>
        </div>
        <div style={{
          padding: '11px 16px',
          background: 'rgba(6,9,16,0.90)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          backdropFilter: 'blur(16px)',
          minWidth: 116,
        }}>
          <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', fontFamily: 'system-ui', marginBottom: 5, letterSpacing: '0.02em' }}>Permanencia promedio</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: ACCENT, lineHeight: 1, fontFamily: 'system-ui', letterSpacing: '-0.02em' }}>
            18 <span style={{ fontSize: 14, fontWeight: 600, color: `${ACCENT}70` }}>min</span>
          </p>
        </div>
      </div>
    </div>
  )
}
