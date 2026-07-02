import {
  PhoneWebShell,
  UbycaExperienceCard,
  AnalyticsCard,
  StreetGrid,
  StorePinSVG,
  PersonDotSVG,
} from './_shared'

const ACCENT = '#f97316'

// ─── Visual 1: Person enters brand activation zone (pop-up / stand) ───────────

export function BrandActivationEntryVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 55% at 36% 52%, ${ACCENT}0b 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Brand activation zone */}
        <circle cx={168} cy={175} r={108} fill={`${ACCENT}06`} />
        <circle cx={168} cy={175} r={108} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.60} />
        <StorePinSVG cx={168} cy={175} color={ACCENT} />
        {/* Zone label */}
        <rect x={112} y={224} width={112} height={13} rx={3} fill={`${ACCENT}09`} stroke={`${ACCENT}22`} strokeWidth={0.8} />
        <text x={168} y={234} textAnchor="middle" fill={`${ACCENT}88`} fontSize={6.5} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          ZONA DE ACTIVACIÓN
        </text>
        {/* Person entering zone */}
        <PersonDotSVG cx={264} cy={175} color={ACCENT} />
        <line x1={304} y1={175} x2={272} y2={175} stroke={`${ACCENT}45`} strokeWidth={1.5} strokeDasharray="4 2.5" />
        <path d="M272,171 L264,175 L272,179" fill="none" stroke={`${ACCENT}55`} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/lanzamiento-2025" width={152}>
          <UbycaExperienceCard
            brand="Lanzamiento 2025"
            accent={ACCENT}
            message="Estás en la zona del evento. Accede al contenido exclusivo de la activación."
            buttons={[{ label: 'Ver contenido', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 2: Premium content unlocked after minimum dwell time ──────────────

export function BrandActivationDwellVisual() {
  const pX = 210
  const pY = 158
  const ringR = 24
  const circ = 2 * Math.PI * ringR
  const filled = 0.80 * circ

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={178} cy={175} r={84} fill={`${ACCENT}07`} />
        <circle cx={178} cy={175} r={84} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        {/* Dwell trail */}
        <circle cx={188} cy={190} r={2.5} fill={`${ACCENT}22`} />
        <circle cx={198} cy={176} r={3}   fill={`${ACCENT}38`} />
        <circle cx={205} cy={166} r={3}   fill={`${ACCENT}52`} />
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
        <PhoneWebShell url="exp.ubyca.com/lanzamiento-2025" width={152}>
          <UbycaExperienceCard
            brand="Lanzamiento 2025"
            accent={ACCENT}
            message="Ya llevas el tiempo en zona. Contenido exclusivo desbloqueado para ti."
            buttons={[
              { label: 'Ver contenido exclusivo', icon: 'video' },
              { label: 'Obtener beneficio', icon: 'link' },
            ]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 3: Conquest zones — competitor area vs brand zone ─────────────────

export function BrandActivationConquestVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 52% 52%, ${ACCENT}08 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Competitor zone — neutral / muted */}
        <circle cx={135} cy={175} r={80} fill="rgba(255,255,255,0.018)" />
        <circle cx={135} cy={175} r={80} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="5 4" />
        <rect x={103} y={102} width={64} height={12} rx={2.5} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" strokeWidth={0.8} />
        <text x={135} y={112} textAnchor="middle" fill="rgba(255,255,255,0.32)" fontSize={6.5} fontWeight={700} letterSpacing={0.8} fontFamily="monospace">
          COMPETENCIA
        </text>
        {/* Brand activation zone — active */}
        <circle cx={302} cy={175} r={80} fill={`${ACCENT}07`} />
        <circle cx={302} cy={175} r={80} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.70} />
        <rect x={252} y={102} width={100} height={12} rx={2.5} fill={`${ACCENT}09`} stroke={`${ACCENT}25`} strokeWidth={0.8} />
        <text x={302} y={112} textAnchor="middle" fill={`${ACCENT}99`} fontSize={6.5} fontWeight={700} letterSpacing={0.8} fontFamily="monospace">
          TU ACTIVACIÓN
        </text>
        {/* Person in competitor zone receiving brand message */}
        <PersonDotSVG cx={145} cy={175} color={ACCENT} />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/tu-marca" width={152}>
          <UbycaExperienceCard
            brand="Tu Marca"
            accent={ACCENT}
            message="Antes de decidir, conoce lo que tenemos para ti a 200m de aquí."
            buttons={[{ label: 'Ver propuesta', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 4: Activation reach analytics ────────────────────────────────────

export function BrandActivationAnalyticsVisual() {
  const dots = [
    { cx: 148, cy: 142 }, { cx: 172, cy: 130 }, { cx: 194, cy: 152 },
    { cx: 158, cy: 168 }, { cx: 182, cy: 158 }, { cx: 204, cy: 144 },
    { cx: 138, cy: 184 }, { cx: 165, cy: 195 }, { cx: 188, cy: 178 },
    { cx: 215, cy: 162 }, { cx: 125, cy: 160 }, { cx: 178, cy: 145 },
    { cx: 142, cy: 200 }, { cx: 200, cy: 195 }, { cx: 220, cy: 178 },
    { cx: 130, cy: 145 }, { cx: 195, cy: 130 },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 52% 48% at 46% 50%, ${ACCENT}07 0%, transparent 68%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={172} cy={168} r={130} fill="rgba(255,255,255,0.015)" />
        <circle cx={172} cy={168} r={130} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
        <circle cx={175} cy={162} r={72}  fill={`${ACCENT}04`} />
        <circle cx={175} cy={162} r={44}  fill={`${ACCENT}08`} />
        <circle cx={175} cy={162} r={22}  fill={`${ACCENT}12`} />
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.cx} cy={d.cy} r={8}   fill="rgba(255,255,255,0.04)" />
            <circle cx={d.cx} cy={d.cy} r={4.5} fill="rgba(255,255,255,0.16)" />
            <circle cx={d.cx} cy={d.cy} r={2.2} fill="rgba(255,255,255,0.82)" />
          </g>
        ))}
      </svg>
      <div className="absolute flex items-center gap-2" style={{ top: 14, left: 16 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
        <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.08em' }}>EN VIVO</span>
      </div>
      <div className="absolute flex flex-col gap-3" style={{ bottom: 16, right: 16 }}>
        <AnalyticsCard label="Personas alcanzadas" value="1.248" large />
        <AnalyticsCard label="Permanencia promedio" value="11" unit="min" accent={ACCENT} />
      </div>
    </div>
  )
}
