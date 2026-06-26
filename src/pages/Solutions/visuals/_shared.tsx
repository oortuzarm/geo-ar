// Shared visual primitives for industry pages (Tourism, Events, Marketing, Education).
// RetailVisuals.tsx is self-contained and does NOT import from here.
import React from 'react'

export type BtnIcon = 'link' | 'whatsapp' | 'video' | 'audio'

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

// ─── Phone shell ──────────────────────────────────────────────────────────────

export function PhoneWebShell({ children, url = 'exp.ubyca.com', width = 152 }: {
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

// ─── Action button ────────────────────────────────────────────────────────────

export function ActionButton({ label, icon, accent, primary }: {
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

// ─── Ubyca experience card ────────────────────────────────────────────────────

export function UbycaExperienceCard({ brand, message, accent, buttons }: {
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
          <ActionButton key={i} label={btn.label} icon={btn.icon} accent={accent} primary={btn.primary ?? i === 0} />
        ))}
      </div>
    </div>
  )
}

// ─── SVG map primitives ───────────────────────────────────────────────────────

export function StreetGrid() {
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

export function StorePinSVG({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <rect x={cx - 9} y={cy - 10} width={18} height={16} rx={2.5} fill={`${color}16`} stroke={`${color}55`} strokeWidth={1} />
      <rect x={cx - 6} y={cy - 7}  width={4}  height={4}  rx={1}   fill={`${color}35`} />
      <rect x={cx + 2} y={cy - 7}  width={4}  height={4}  rx={1}   fill={`${color}35`} />
      <rect x={cx - 2} y={cy - 1}  width={4}  height={7}  rx={1}   fill={`${color}40`} />
    </g>
  )
}

export function PersonDotSVG({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={15}  fill={`${color}07`} />
      <circle cx={cx} cy={cy} r={9}   fill={`${color}16`} />
      <circle cx={cx} cy={cy} r={5.5} fill={color} />
      <circle cx={cx} cy={cy} r={2.2} fill="white" />
    </g>
  )
}

// ─── Shared analytics card ────────────────────────────────────────────────────

export function AnalyticsCard({ label, value, unit, accent, large }: {
  label: string
  value: string
  unit?: string
  accent?: string
  large?: boolean
}) {
  const valueFontSize = value.length <= 2 ? 32 : value.length <= 3 ? 28 : 22
  return (
    <div style={{
      padding: '11px 16px',
      background: 'rgba(6,9,16,0.90)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
      backdropFilter: 'blur(16px)',
      minWidth: 116,
    }}>
      <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', fontFamily: 'system-ui', marginBottom: 5, letterSpacing: '0.02em' }}>{label}</p>
      <p style={{ fontSize: large ? valueFontSize : 32, fontWeight: 900, color: accent ?? 'rgba(255,255,255,0.88)', lineHeight: 1, fontFamily: 'system-ui', letterSpacing: '-0.02em' }}>
        {value}
        {unit && <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.7 }}> {unit}</span>}
      </p>
    </div>
  )
}
