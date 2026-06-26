import {
  PhoneWebShell,
  UbycaExperienceCard,
  AnalyticsCard,
  StreetGrid,
  StorePinSVG,
  PersonDotSVG,
} from './_shared'

const ACCENT = '#f97316'

// ─── Visual 1: Brand activation at location — entry trigger → campaign ────────

export function MarketingActivationVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        {/* Activation zone */}
        <circle cx={178} cy={175} r={88} fill={`${ACCENT}07`} />
        <circle cx={178} cy={175} r={88} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        <StorePinSVG cx={178} cy={175} color={ACCENT} />
        {/* Person approaching */}
        <PersonDotSVG cx={252} cy={175} color={ACCENT} />
        <line x1={292} y1={175} x2={260} y2={175} stroke={`${ACCENT}45`} strokeWidth={1.5} strokeDasharray="4 2.5" />
        <path d="M260,171 L252,175 L260,179" fill="none" stroke={`${ACCENT}55`} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/marca-activacion" width={152}>
          <UbycaExperienceCard
            brand="Activación de Marca"
            accent={ACCENT}
            message="Esta zona tiene una campaña activa disponible ahora."
            buttons={[{ label: 'Ver campaña', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 2: Dwell condition — minimum time → exclusive content ─────────────

export function MarketingDwellVisual() {
  const pX = 210
  const pY = 160
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
        <circle cx={178} cy={175} r={88} fill={`${ACCENT}07`} />
        <circle cx={178} cy={175} r={88} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        <StorePinSVG cx={178} cy={175} color={ACCENT} />
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
        <PhoneWebShell url="exp.ubyca.com/marca-activacion" width={152}>
          <UbycaExperienceCard
            brand="Activación de Marca"
            accent={ACCENT}
            message="Esta activación tiene contenido exclusivo disponible."
            buttons={[{ label: 'Ver contenido exclusivo', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 3: Competitor zone conquesting — two territories ──────────────────

export function MarketingCompetitorVisual() {
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
        {/* Competitor territory */}
        <circle cx={142} cy={175} r={74} fill="rgba(148,163,184,0.055)" />
        <circle cx={142} cy={175} r={74} fill="none" stroke="rgba(148,163,184,0.45)" strokeWidth={1.5} strokeDasharray="5 2.5" />
        <rect x={133} y={165} width={18} height={16} rx={2.5} fill="rgba(148,163,184,0.12)" stroke="rgba(148,163,184,0.35)" strokeWidth={1} />
        <rect x={136} y={168} width={4} height={4} rx={1} fill="rgba(148,163,184,0.25)" />
        <rect x={142} y={168} width={4} height={4} rx={1} fill="rgba(148,163,184,0.25)" />
        <rect x={88} y={106} width={108} height={14} rx={3} fill="rgba(148,163,184,0.06)" stroke="rgba(148,163,184,0.15)" strokeWidth={0.8} />
        <text x={142} y={117} textAnchor="middle" fill="rgba(148,163,184,0.45)" fontSize={7} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          COMPETENCIA
        </text>
        {/* Your brand territory */}
        <circle cx={336} cy={175} r={68} fill={`${ACCENT}07`} />
        <circle cx={336} cy={175} r={68} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        <StorePinSVG cx={336} cy={175} color={ACCENT} />
        <rect x={285} y={104} width={102} height={14} rx={3} fill={`${ACCENT}09`} stroke={`${ACCENT}25`} strokeWidth={0.8} />
        <text x={336} y={115} textAnchor="middle" fill={`${ACCENT}99`} fontSize={7} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          TU MARCA
        </text>
        {/* Person in competitor zone */}
        <PersonDotSVG cx={162} cy={175} color="rgba(148,163,184,0.9)" />
        <line x1={172} y1={175} x2={220} y2={175} stroke={`${ACCENT}35`} strokeWidth={1} strokeDasharray="3 2" />
      </svg>
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneWebShell url="exp.ubyca.com/marca-activacion" width={152}>
          <UbycaExperienceCard
            brand="Activación de Marca"
            accent={ACCENT}
            message="Hay una oferta de tu marca disponible a metros de aquí."
            buttons={[{ label: 'Ver nuestra oferta', icon: 'link' }]}
          />
        </PhoneWebShell>
      </div>
    </div>
  )
}

// ─── Visual 4: Campaign reach analytics ──────────────────────────────────────

export function MarketingAnalyticsVisual() {
  const dots = [
    { cx: 150, cy: 148 }, { cx: 174, cy: 136 }, { cx: 196, cy: 158 },
    { cx: 160, cy: 174 }, { cx: 184, cy: 164 }, { cx: 206, cy: 150 },
    { cx: 140, cy: 190 }, { cx: 167, cy: 200 }, { cx: 190, cy: 184 },
    { cx: 218, cy: 168 }, { cx: 130, cy: 166 }, { cx: 180, cy: 152 },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 52% 48% at 46% 50%, rgba(251,146,60,0.07) 0%, transparent 68%)',
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />
        <circle cx={175} cy={170} r={122} fill="rgba(255,255,255,0.015)" />
        <circle cx={175} cy={170} r={122} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
        <circle cx={178} cy={164} r={68}  fill="rgba(251,146,60,0.04)" />
        <circle cx={178} cy={164} r={42}  fill="rgba(251,146,60,0.07)" />
        <circle cx={178} cy={164} r={20}  fill="rgba(251,146,60,0.12)" />
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
        <AnalyticsCard label="Alcance en zona" value="1.248" large />
        <AnalyticsCard label="Permanencia promedio" value="9" unit="min" accent={ACCENT} />
      </div>
    </div>
  )
}
