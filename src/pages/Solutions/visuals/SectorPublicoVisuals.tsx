import {
  PhoneWebShell,
  UbycaExperienceCard,
  AnalyticsCard,
  StreetGrid,
  StorePinSVG,
  PersonDotSVG,
} from './_shared'

const ACCENT = '#06b6d4'

// ─── Visual 1: Public space info — arrive at park/plaza → see guide ───────────

export function SectorPublicoInfoVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 55% at 36% 52%, ${ACCENT}0b 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Plaza / park zone */}
        <circle cx={165} cy={175} r={108} fill={`${ACCENT}06`} />
        <circle cx={165} cy={175} r={108} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.60} />
        <StorePinSVG cx={165} cy={175} color={ACCENT} />
        {/* Zone label */}
        <rect x={109} y={224} width={112} height={13} rx={3} fill={`${ACCENT}09`} stroke={`${ACCENT}22`} strokeWidth={0.8} />
        <text x={165} y={234} textAnchor="middle" fill={`${ACCENT}88`} fontSize={6.5} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          PARQUE MUNICIPAL
        </text>
        {/* Person inside zone */}
        <PersonDotSVG cx={200} cy={152} color={ACCENT} />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/parque-central" width={152}>
          <UbycaExperienceCard
            brand="Parque Central"
            accent={ACCENT}
            message="Estás en el parque. Accede a la guía del espacio y actividades disponibles."
            buttons={[{ label: 'Ver guía del parque', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 2: Heritage route — 3 stops (completed, active, upcoming) ─────────

export function SectorPublicoRouteVisual() {
  const stops: Array<{ cx: number; cy: number; label: string; done?: boolean; active?: boolean }> = [
    { cx: 90,  cy: 122, label: 'Plaza de Armas', done: true },
    { cx: 158, cy: 182, label: 'Centro Cultural', active: true },
    { cx: 228, cy: 138, label: 'Museo Regional' },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 42% 52%, ${ACCENT}0a 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Full path (faint) */}
        <path
          d={`M${stops[0].cx},${stops[0].cy} L${stops[1].cx},${stops[1].cy} L${stops[2].cx},${stops[2].cy}`}
          fill="none" stroke={`${ACCENT}28`} strokeWidth={2} strokeDasharray="5 3"
        />
        {/* Completed segment */}
        <path
          d={`M${stops[0].cx},${stops[0].cy} L${stops[1].cx},${stops[1].cy}`}
          fill="none" stroke={`${ACCENT}70`} strokeWidth={2}
        />
        {stops.map((s, i) => (
          <g key={i}>
            {s.active ? (
              <>
                <circle cx={s.cx} cy={s.cy} r={16} fill={`${ACCENT}12`} />
                <circle cx={s.cx} cy={s.cy} r={9}  fill={`${ACCENT}22`} />
                <circle cx={s.cx} cy={s.cy} r={5}  fill={ACCENT} />
                <circle cx={s.cx} cy={s.cy} r={2}  fill="white" />
              </>
            ) : s.done ? (
              <>
                <circle cx={s.cx} cy={s.cy} r={7} fill={`${ACCENT}28`} />
                <circle cx={s.cx} cy={s.cy} r={4} fill={`${ACCENT}60`} />
                <circle cx={s.cx} cy={s.cy} r={1.5} fill="white" />
              </>
            ) : (
              <>
                <circle cx={s.cx} cy={s.cy} r={7} fill="rgba(255,255,255,0.04)" />
                <circle cx={s.cx} cy={s.cy} r={4} fill="rgba(255,255,255,0.12)" />
              </>
            )}
            <rect x={s.cx - 38} y={s.cy + 13} width={76} height={11} rx={2.5} fill="rgba(0,0,0,0.50)" />
            <text x={s.cx} y={s.cy + 21} textAnchor="middle" fontFamily="monospace" fontSize={6.5} fontWeight={700} letterSpacing={0.5}
              fill={s.active ? ACCENT : s.done ? `${ACCENT}80` : 'rgba(255,255,255,0.28)'}>
              {s.label.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/ruta-patrimonial" width={152}>
          <UbycaExperienceCard
            brand="Ruta Patrimonial"
            accent={ACCENT}
            message="Estás en el Centro Cultural. Audio guía de esta parada disponible."
            buttons={[{ label: 'Escuchar audio guía', icon: 'audio' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 3: Dwell at heritage point → extended content unlocks ─────────────

export function SectorPublicoDwellVisual() {
  const pX = 208
  const pY = 158
  const ringR = 24
  const circ = 2 * Math.PI * ringR
  const filled = 0.78 * circ

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={175} cy={175} r={84} fill={`${ACCENT}07`} />
        <circle cx={175} cy={175} r={84} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        {/* Dwell trail */}
        <circle cx={190} cy={188} r={2.5} fill={`${ACCENT}22`} />
        <circle cx={200} cy={174} r={3}   fill={`${ACCENT}38`} />
        <circle cx={205} cy={165} r={3}   fill={`${ACCENT}52`} />
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
        <PhoneWebShell url="exp.ubyca.com/centro-historico" width={152}>
          <UbycaExperienceCard
            brand="Centro Histórico"
            accent={ACCENT}
            message="Ya llevas el tiempo suficiente aquí. Contenido completo desbloqueado."
            buttons={[{ label: 'Ver documental', icon: 'video' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 4: Citizen/visitor flow analytics ─────────────────────────────────

export function SectorPublicoAnalyticsVisual() {
  const dots = [
    { cx: 148, cy: 142 }, { cx: 172, cy: 130 }, { cx: 194, cy: 152 },
    { cx: 158, cy: 168 }, { cx: 182, cy: 158 }, { cx: 204, cy: 144 },
    { cx: 138, cy: 184 }, { cx: 165, cy: 195 }, { cx: 188, cy: 178 },
    { cx: 215, cy: 162 }, { cx: 125, cy: 160 }, { cx: 178, cy: 145 },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 52% 48% at 46% 50%, ${ACCENT}07 0%, transparent 68%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={172} cy={168} r={128} fill="rgba(255,255,255,0.015)" />
        <circle cx={172} cy={168} r={128} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
        <circle cx={175} cy={162} r={70}  fill={`${ACCENT}04`} />
        <circle cx={175} cy={162} r={42}  fill={`${ACCENT}08`} />
        <circle cx={175} cy={162} r={21}  fill={`${ACCENT}12`} />
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
        <AnalyticsCard label="Visitantes activos" value="312" large />
        <AnalyticsCard label="Permanencia promedio" value="18" unit="min" accent={ACCENT} />
      </div>
    </div>
  )
}
