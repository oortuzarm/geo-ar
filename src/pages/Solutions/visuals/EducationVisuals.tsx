import {
  PhoneWebShell,
  UbycaExperienceCard,
  AnalyticsCard,
  StreetGrid,
  PersonDotSVG,
} from './_shared'

const ACCENT = '#f59e0b'

// ─── Historical site pin ───────────────────────────────────────────────────────

function SitePin({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={`${color}16`} stroke={`${color}55`} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={5}  fill={`${color}55`} />
      <circle cx={cx} cy={cy} r={2.2} fill="white" />
    </g>
  )
}

// ─── Visual 1: Content at historical site — entry trigger → audio ─────────────

export function EducationAudioVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Site geofence */}
        <circle cx={178} cy={175} r={88} fill={`${ACCENT}07`} />
        <circle cx={178} cy={175} r={88} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        <SitePin cx={178} cy={175} color={ACCENT} />
        {/* Person approaching */}
        <PersonDotSVG cx={252} cy={175} color={ACCENT} />
        <line x1={292} y1={175} x2={260} y2={175} stroke={`${ACCENT}45`} strokeWidth={1.5} strokeDasharray="4 2.5" />
        <path d="M260,171 L252,175 L260,179" fill="none" stroke={`${ACCENT}55`} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/ruta-historica" width={152}>
          <UbycaExperienceCard
            brand="Ruta Histórica"
            accent={ACCENT}
            message="Este lugar tiene contenido educativo disponible."
            buttons={[{ label: 'Reproducir audio', icon: 'audio' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 2: Sequential educational route — 3-stop vertical layout ──────────

export function EducationRouteVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 60% at 35% 50%, ${ACCENT}0a 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />

        {/* Vertical connectors */}
        <line x1={162} y1={114} x2={162} y2={135} stroke={`${ACCENT}40`} strokeWidth={2} strokeDasharray="4 3" />
        <line x1={162} y1={215} x2={162} y2={236} stroke="rgba(255,255,255,0.12)" strokeWidth={2} strokeDasharray="4 3" />

        {/* Stop 1 — completed */}
        <circle cx={162} cy={82} r={32} fill={`${ACCENT}06`} />
        <circle cx={162} cy={82} r={32} fill="none" stroke={`${ACCENT}35`} strokeWidth={1.5} />
        <path d="M150,82 L159,91 L175,72" fill="none" stroke={`${ACCENT}70`} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Stop 2 — current (person inside) */}
        <circle cx={162} cy={175} r={40} fill={`${ACCENT}09`} />
        <circle cx={162} cy={175} r={40} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.7} />
        <PersonDotSVG cx={162} cy={175} color={ACCENT} />

        {/* Stop 3 — upcoming */}
        <circle cx={162} cy={268} r={32} fill="rgba(255,255,255,0.015)" />
        <circle cx={162} cy={268} r={32} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} strokeDasharray="4 4" />

        {/* Labels */}
        <text x={202} y={86}  fill={`${ACCENT}55`}         fontSize={7.5} fontWeight={700} fontFamily="monospace">PARADA 1</text>
        <text x={210} y={179} fill={ACCENT}                 fontSize={7.5} fontWeight={700} fontFamily="monospace" opacity={0.9}>PARADA 2</text>
        <text x={202} y={272} fill="rgba(255,255,255,0.22)" fontSize={7.5} fontWeight={700} fontFamily="monospace">PARADA 3</text>
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/recorrido-edu" width={152}>
          <UbycaExperienceCard
            brand="Recorrido Educativo"
            accent={ACCENT}
            message="Hay contenido disponible en esta parada del recorrido."
            buttons={[{ label: 'Ver módulo 2', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 3: Dwell at exhibit — minimum time → download material ────────────

export function EducationDwellVisual() {
  const pX = 210
  const pY = 160
  const ringR = 24
  const circ = 2 * Math.PI * ringR
  const filled = 0.70 * circ

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={178} cy={175} r={88} fill={`${ACCENT}07`} />
        <circle cx={178} cy={175} r={88} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        <SitePin cx={178} cy={175} color={ACCENT} />
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
        <PhoneWebShell url="exp.ubyca.com/museo-ciencias" width={152}>
          <UbycaExperienceCard
            brand="Museo de Ciencias"
            accent={ACCENT}
            message="Este espacio tiene material educativo disponible ahora."
            buttons={[{ label: 'Descargar material', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 4: Route analytics — participants and time per stop ───────────────

export function EducationAnalyticsVisual() {
  const dots = [
    { cx: 142, cy: 148 }, { cx: 166, cy: 136 }, { cx: 186, cy: 158 },
    { cx: 152, cy: 172 }, { cx: 176, cy: 162 }, { cx: 198, cy: 148 },
    { cx: 132, cy: 188 }, { cx: 159, cy: 198 }, { cx: 182, cy: 180 },
    { cx: 208, cy: 164 }, { cx: 122, cy: 162 }, { cx: 172, cy: 146 },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 52% 48% at 40% 52%, ${ACCENT}07 0%, transparent 68%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={168} cy={170} r={120} fill="rgba(255,255,255,0.015)" />
        <circle cx={168} cy={170} r={120} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
        <circle cx={170} cy={160} r={64}  fill={`${ACCENT}04`} />
        <circle cx={170} cy={160} r={40}  fill={`${ACCENT}07`} />
        <circle cx={170} cy={160} r={20}  fill={`${ACCENT}12`} />
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
        <AnalyticsCard label="Participantes activos" value="28" />
        <AnalyticsCard label="Tiempo por parada" value="12" unit="min" accent={ACCENT} />
      </div>
    </div>
  )
}
