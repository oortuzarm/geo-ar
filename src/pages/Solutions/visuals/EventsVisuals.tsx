import {
  PhoneWebShell,
  UbycaExperienceCard,
  AnalyticsCard,
  StreetGrid,
  StorePinSVG,
  PersonDotSVG,
} from './_shared'

const ACCENT = '#10b981'

// ─── Visual 1: Venue entry — arrive at event → see program ───────────────────

export function EventsEntryVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 55% at 36% 52%, ${ACCENT}0b 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Venue geofence — larger than a single store */}
        <circle cx={168} cy={175} r={108} fill={`${ACCENT}06`} />
        <circle cx={168} cy={175} r={108} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.60} />
        <StorePinSVG cx={168} cy={175} color={ACCENT} />
        {/* Person approaching */}
        <PersonDotSVG cx={262} cy={175} color={ACCENT} />
        <line x1={302} y1={175} x2={270} y2={175} stroke={`${ACCENT}45`} strokeWidth={1.5} strokeDasharray="4 2.5" />
        <path d="M270,171 L262,175 L270,179" fill="none" stroke={`${ACCENT}55`} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/summit-2025" width={152}>
          <UbycaExperienceCard
            brand="Summit Tech 2025"
            accent={ACCENT}
            message="Este recinto tiene el programa del evento disponible."
            buttons={[{ label: 'Ver programa', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 2: Zone within event — inner zone activates sponsor content ───────

export function EventsZoneVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 45% 50% at 32% 52%, ${ACCENT}0c 0%, transparent 62%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Outer venue perimeter — faint */}
        <circle cx={185} cy={175} r={145} fill="rgba(255,255,255,0.012)" />
        <circle cx={185} cy={175} r={145} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
        {/* Inner sponsor zone — active */}
        <circle cx={142} cy={175} r={65} fill={`${ACCENT}08`} />
        <circle cx={142} cy={175} r={65} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.7} />
        {/* Zone label */}
        <rect x={88} y={101} width={108} height={14} rx={3} fill={`${ACCENT}09`} stroke={`${ACCENT}25`} strokeWidth={0.8} />
        <text x={142} y={112} textAnchor="middle" fill={`${ACCENT}99`} fontSize={7} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          STAND PATROCINADOR
        </text>
        {/* Person inside inner zone */}
        <PersonDotSVG cx={148} cy={168} color={ACCENT} />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/summit-2025" width={152}>
          <UbycaExperienceCard
            brand="Summit Tech 2025"
            accent={ACCENT}
            message="Esta zona tiene contenido del patrocinador disponible."
            buttons={[{ label: 'Abrir contenido', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 3: Dwell at session — minimum time → download slides ─────────────

export function EventsDwellVisual() {
  const pX = 210
  const pY = 160
  const ringR = 24
  const circ = 2 * Math.PI * ringR
  const filled = 0.82 * circ

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Session room zone — no center pin (represents a bounded area) */}
        <circle cx={178} cy={175} r={84} fill={`${ACCENT}07`} />
        <circle cx={178} cy={175} r={84} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        {/* Dwell trail */}
        <circle cx={188} cy={190} r={2.5} fill={`${ACCENT}22`} />
        <circle cx={198} cy={177} r={3}   fill={`${ACCENT}38`} />
        <circle cx={205} cy={167} r={3}   fill={`${ACCENT}52`} />
        <PersonDotSVG cx={pX} cy={pY} color={ACCENT} />
        {/* Progress ring */}
        <circle cx={pX} cy={pY} r={ringR} fill="none" stroke={`${ACCENT}18`} strokeWidth={2.5} />
        <circle
          cx={pX} cy={pY} r={ringR}
          fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round"
          strokeDasharray={`${filled.toFixed(1)} ${circ.toFixed(1)}`}
          transform={`rotate(-90 ${pX} ${pY})`} opacity={0.72}
        />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/summit-2025" width={152}>
          <UbycaExperienceCard
            brand="Summit Tech 2025"
            accent={ACCENT}
            message="El material de esta sesión está disponible ahora."
            buttons={[{ label: 'Descargar presentación', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 4: Live event analytics — presence distribution ──────────────────

export function EventsAnalyticsVisual() {
  const dots = [
    { cx: 148, cy: 142 }, { cx: 172, cy: 130 }, { cx: 194, cy: 152 },
    { cx: 158, cy: 168 }, { cx: 182, cy: 158 }, { cx: 204, cy: 144 },
    { cx: 138, cy: 184 }, { cx: 165, cy: 195 }, { cx: 188, cy: 178 },
    { cx: 215, cy: 162 }, { cx: 125, cy: 160 }, { cx: 178, cy: 145 },
    { cx: 142, cy: 200 }, { cx: 200, cy: 195 },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 52% 48% at 46% 50%, rgba(251,146,60,0.06) 0%, transparent 68%)',
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={172} cy={168} r={130} fill="rgba(255,255,255,0.015)" />
        <circle cx={172} cy={168} r={130} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
        <circle cx={175} cy={162} r={72}  fill="rgba(251,146,60,0.04)" />
        <circle cx={175} cy={162} r={44}  fill="rgba(251,146,60,0.08)" />
        <circle cx={175} cy={162} r={22}  fill="rgba(251,146,60,0.12)" />
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.cx} cy={d.cy} r={8}   fill="rgba(255,255,255,0.04)" />
            <circle cx={d.cx} cy={d.cy} r={4.5}  fill="rgba(255,255,255,0.16)" />
            <circle cx={d.cx} cy={d.cy} r={2.2}  fill="rgba(255,255,255,0.82)" />
          </g>
        ))}
      </svg>
      <div className="absolute flex items-center gap-2" style={{ top: 14, left: 16 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
        <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.08em' }}>EN VIVO</span>
      </div>
      <div className="absolute flex flex-col gap-3" style={{ bottom: 16, right: 16 }}>
        <AnalyticsCard label="Personas en recinto" value="847" large />
        <AnalyticsCard label="Permanencia promedio" value="38" unit="min" accent={ACCENT} />
      </div>
    </div>
  )
}
