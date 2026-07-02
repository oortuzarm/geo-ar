import {
  PhoneWebShell,
  UbycaExperienceCard,
  AnalyticsCard,
  StreetGrid,
  StorePinSVG,
  PersonDotSVG,
} from './_shared'

const ACCENT = '#ef4444'

// ─── Visual 1: Interested buyer arrives at project / sales room ───────────────

export function RealEstateEntryVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 55% at 36% 52%, ${ACCENT}0b 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Project zone */}
        <circle cx={168} cy={175} r={105} fill={`${ACCENT}06`} />
        <circle cx={168} cy={175} r={105} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.60} />
        <StorePinSVG cx={168} cy={175} color={ACCENT} />
        {/* Zone label */}
        <rect x={112} y={224} width={112} height={13} rx={3} fill={`${ACCENT}09`} stroke={`${ACCENT}22`} strokeWidth={0.8} />
        <text x={168} y={234} textAnchor="middle" fill={`${ACCENT}88`} fontSize={6.5} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          PROYECTO CENTRAL
        </text>
        {/* Interested buyer approaching */}
        <PersonDotSVG cx={264} cy={175} color={ACCENT} />
        <line x1={304} y1={175} x2={272} y2={175} stroke={`${ACCENT}45`} strokeWidth={1.5} strokeDasharray="4 2.5" />
        <path d="M272,171 L264,175 L272,179" fill="none" stroke={`${ACCENT}55`} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/proyecto-central" width={152}>
          <UbycaExperienceCard
            brand="Proyecto Central"
            accent={ACCENT}
            message="Bienvenido al proyecto. Accede a la ficha técnica o contacta a un asesor."
            buttons={[
              { label: 'Ver ficha técnica', icon: 'link' },
              { label: 'Hablar con asesor', icon: 'whatsapp' },
            ]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 2: Zones within project — outer perimeter + inner sales room ──────

export function RealEstateZoneVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 45% 50% at 32% 52%, ${ACCENT}0c 0%, transparent 62%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Outer project perimeter — faint */}
        <circle cx={185} cy={175} r={145} fill="rgba(255,255,255,0.012)" />
        <circle cx={185} cy={175} r={145} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
        {/* Inner sales room / model unit — active */}
        <circle cx={142} cy={175} r={62} fill={`${ACCENT}08`} />
        <circle cx={142} cy={175} r={62} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.70} />
        {/* Zone label */}
        <rect x={90} y={101} width={104} height={14} rx={3} fill={`${ACCENT}09`} stroke={`${ACCENT}25`} strokeWidth={0.8} />
        <text x={142} y={112} textAnchor="middle" fill={`${ACCENT}99`} fontSize={7} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          SALA DE VENTAS
        </text>
        {/* Person inside inner zone */}
        <PersonDotSVG cx={148} cy={168} color={ACCENT} />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/proyecto-central" width={152}>
          <UbycaExperienceCard
            brand="Proyecto Central"
            accent={ACCENT}
            message="Estás en la sala de ventas. Descarga las plantas y especificaciones."
            buttons={[{ label: 'Ver plantas y specs', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 3: Dwell in sales room → full material unlocks ───────────────────

export function RealEstateDwellVisual() {
  const pX = 210
  const pY = 160
  const ringR = 24
  const circ = 2 * Math.PI * ringR
  const filled = 0.85 * circ

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={178} cy={175} r={82} fill={`${ACCENT}07`} />
        <circle cx={178} cy={175} r={82} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        {/* Dwell trail */}
        <circle cx={190} cy={190} r={2.5} fill={`${ACCENT}22`} />
        <circle cx={200} cy={176} r={3}   fill={`${ACCENT}38`} />
        <circle cx={207} cy={166} r={3}   fill={`${ACCENT}52`} />
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
        <PhoneWebShell url="exp.ubyca.com/proyecto-central" width={152}>
          <UbycaExperienceCard
            brand="Proyecto Central"
            accent={ACCENT}
            message="Gracias por visitar la sala. La cotización completa ya está disponible."
            buttons={[{ label: 'Ver cotización', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 4: Project visit analytics ───────────────────────────────────────

export function RealEstateAnalyticsVisual() {
  const dots = [
    { cx: 148, cy: 142 }, { cx: 170, cy: 130 }, { cx: 192, cy: 150 },
    { cx: 156, cy: 165 }, { cx: 180, cy: 155 }, { cx: 135, cy: 158 },
    { cx: 162, cy: 192 }, { cx: 185, cy: 175 }, { cx: 208, cy: 160 },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 52% 48% at 46% 50%, ${ACCENT}07 0%, transparent 68%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={172} cy={168} r={125} fill="rgba(255,255,255,0.015)" />
        <circle cx={172} cy={168} r={125} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
        <circle cx={175} cy={162} r={68}  fill={`${ACCENT}04`} />
        <circle cx={175} cy={162} r={40}  fill={`${ACCENT}08`} />
        <circle cx={175} cy={162} r={20}  fill={`${ACCENT}12`} />
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
        <AnalyticsCard label="Visitas hoy" value="24" large />
        <AnalyticsCard label="Permanencia promedio" value="22" unit="min" accent={ACCENT} />
      </div>
    </div>
  )
}
