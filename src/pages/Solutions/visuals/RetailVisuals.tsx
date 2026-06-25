// ─── Retail use-case visual panels ───────────────────────────────────────────
// Each component tells a story through: map + geofence + person dot + phone.
// No decorative elements — every pixel communicates the interaction.

const ACCENT = '#0ea5e9'

// ─── Shared: Phone mockup ─────────────────────────────────────────────────────

function PhoneMockup({
  brand,
  title,
  message,
  time = 'ahora',
  accentColor,
  badge,
}: {
  brand: string
  title: string
  message: string
  time?: string
  accentColor: string
  badge?: string
}) {
  return (
    <div style={{
      width: 148,
      borderRadius: 26,
      border: '2px solid rgba(255,255,255,0.13)',
      background: '#07090f',
      overflow: 'hidden',
      boxShadow: '0 20px 52px rgba(0,0,0,0.75), 0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
      flexShrink: 0,
    }}>
      {/* Status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px 5px', background: '#07090f',
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.72)', fontFamily: 'system-ui' }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Signal bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 10 }}>
            {[4, 6, 8, 10].map((h, i) => (
              <div key={i} style={{
                width: 2.5, height: h, borderRadius: 1,
                background: `rgba(255,255,255,${0.35 + i * 0.15})`,
              }} />
            ))}
          </div>
          {/* Battery */}
          <div style={{
            width: 20, height: 10, border: '1px solid rgba(255,255,255,0.32)',
            borderRadius: 2.5, position: 'relative', marginLeft: 2,
          }}>
            <div style={{
              position: 'absolute', left: 1.5, top: 1.5,
              width: '65%', height: 'calc(100% - 3px)',
              background: 'rgba(255,255,255,0.65)', borderRadius: 1,
            }} />
            <div style={{
              position: 'absolute', right: -3.5, top: '50%', transform: 'translateY(-50%)',
              width: 2.5, height: 5, background: 'rgba(255,255,255,0.25)', borderRadius: 1,
            }} />
          </div>
        </div>
      </div>

      {/* Lock screen body */}
      <div style={{ background: '#0a0c1a', padding: '5px 8px 10px' }}>
        {/* Notification banner */}
        <div style={{
          background: 'rgba(255,255,255,0.065)',
          borderRadius: 13,
          padding: '8px 10px',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {/* App row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              background: `${accentColor}20`, border: `1px solid ${accentColor}45`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor }} />
            </div>
            <span style={{
              fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.82)',
              flex: 1, fontFamily: 'system-ui',
            }}>
              {brand}
            </span>
            <span style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', fontFamily: 'system-ui' }}>
              {time}
            </span>
          </div>
          {/* Title */}
          <p style={{
            fontSize: 8.5, fontWeight: 600, color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.3, marginBottom: 3, fontFamily: 'system-ui',
          }}>
            {title}
          </p>
          {/* Body */}
          <p style={{
            fontSize: 7.5, color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.4, fontFamily: 'system-ui',
          }}>
            {message}
          </p>
          {/* Optional badge */}
          {badge && (
            <div style={{
              marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4,
              background: `${accentColor}14`, border: `1px solid ${accentColor}30`,
              borderRadius: 6, padding: '2.5px 7px',
            }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: accentColor }} />
              <span style={{ fontSize: 7.5, fontWeight: 700, color: accentColor, fontFamily: 'monospace' }}>
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Ghosted content below — makes it feel like a real screen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, paddingLeft: 2, paddingRight: 2 }}>
          {[0.75, 0.5].map((w, i) => (
            <div key={i} style={{
              height: 6, borderRadius: 3,
              background: 'rgba(255,255,255,0.022)',
              width: `${w * 100}%`,
            }} />
          ))}
        </div>
      </div>

      {/* Home indicator bar */}
      <div style={{
        height: 18, background: '#07090f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 34, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
      </div>
    </div>
  )
}

// ─── Shared: Map street grid ──────────────────────────────────────────────────
// SVG elements — append into the parent <svg>

function StreetGrid() {
  return (
    <g>
      {/* Horizontal — main avenues */}
      <line x1="0" y1="68"  x2="480" y2="82"  stroke="rgba(255,255,255,0.042)" strokeWidth="16" />
      <line x1="0" y1="165" x2="480" y2="172" stroke="rgba(255,255,255,0.028)" strokeWidth="9" />
      <line x1="0" y1="248" x2="480" y2="255" stroke="rgba(255,255,255,0.042)" strokeWidth="16" />
      <line x1="0" y1="308" x2="480" y2="312" stroke="rgba(255,255,255,0.022)" strokeWidth="7" />
      {/* Vertical — main avenues */}
      <line x1="88"  y1="0" x2="83"  y2="340" stroke="rgba(255,255,255,0.028)" strokeWidth="9" />
      <line x1="210" y1="0" x2="215" y2="340" stroke="rgba(255,255,255,0.042)" strokeWidth="16" />
      <line x1="338" y1="0" x2="342" y2="340" stroke="rgba(255,255,255,0.028)" strokeWidth="9" />
      <line x1="428" y1="0" x2="425" y2="340" stroke="rgba(255,255,255,0.020)" strokeWidth="6" />
      {/* Diagonal — adds urban feel */}
      <line x1="0"   y1="340" x2="210" y2="0"  stroke="rgba(255,255,255,0.014)" strokeWidth="6" />
      <line x1="280" y1="0"   x2="480" y2="220" stroke="rgba(255,255,255,0.014)" strokeWidth="6" />
    </g>
  )
}

// ─── Shared: Store pin ────────────────────────────────────────────────────────

function StorePinSVG({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      {/* Building silhouette */}
      <rect x={cx - 9} y={cy - 10} width={18} height={16} rx={2.5}
        fill={`${color}16`} stroke={`${color}55`} strokeWidth={1} />
      {/* Windows */}
      <rect x={cx - 6} y={cy - 7} width={4} height={4} rx={1} fill={`${color}35`} />
      <rect x={cx + 2} y={cy - 7} width={4} height={4} rx={1} fill={`${color}35`} />
      {/* Door */}
      <rect x={cx - 2} y={cy - 1} width={4} height={7} rx={1} fill={`${color}40`} />
    </g>
  )
}

// ─── Shared: Person dot ───────────────────────────────────────────────────────

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

// ─── Visual 1: Entry welcome ──────────────────────────────────────────────────
// Story: person approaches store zone → phone notification fires the moment they cross in

export function RetailEntryVisual() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
      style={{ height: 340, background: '#060910' }}
    >
      {/* Glow behind the geofence */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0d 0%, transparent 65%)`,
      }} />

      {/* Map layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 480 340"
        preserveAspectRatio="xMidYMid slice"
      >
        <StreetGrid />

        {/* Geofence fill */}
        <circle cx={178} cy={175} r={88} fill={`${ACCENT}07`} />

        {/* Geofence dashed ring */}
        <circle
          cx={178} cy={175} r={88}
          fill="none" stroke={ACCENT} strokeWidth={1.5}
          strokeDasharray="6 3" opacity={0.65}
        />

        {/* Store pin — center of zone */}
        <StorePinSVG cx={178} cy={175} color={ACCENT} />

        {/* Person dot — just crossed the boundary (slightly inside) */}
        <PersonDotSVG cx={252} cy={175} color={ACCENT} />

        {/* Movement trail — shows direction of entry */}
        <line
          x1={292} y1={175} x2={260} y2={175}
          stroke={`${ACCENT}45`} strokeWidth={1.5}
          strokeDasharray="4 2.5"
        />
        {/* Arrow head */}
        <path
          d={`M260,171 L252,175 L260,179`}
          fill="none" stroke={`${ACCENT}55`} strokeWidth={1.5}
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>

      {/* Event trigger label */}
      <div
        className="absolute flex items-center gap-2"
        style={{ left: 12, bottom: 12 }}
      >
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
          style={{
            background: `${ACCENT}0c`,
            borderColor: `${ACCENT}28`,
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: ACCENT }}
          />
          <span
            style={{
              fontSize: 9, fontFamily: 'monospace', fontWeight: 600,
              color: `${ACCENT}cc`, letterSpacing: '0.04em',
            }}
          >
            entered_place · Radio 150m
          </span>
        </div>
      </div>

      {/* Phone overlay */}
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneMockup
          accentColor={ACCENT}
          brand="Nova Moda"
          title="Hola, qué bueno que volviste"
          message="Tu descuento de cliente frecuente está activo: 20% en la nueva temporada."
          time="ahora"
        />
      </div>
    </div>
  )
}

// ─── Visual 2: Loyalty for visits ─────────────────────────────────────────────
// Story: person is inside the zone (already in store) → points credited automatically

export function RetailLoyaltyVisual() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
      style={{ height: 340, background: '#060910' }}
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 38% 52%, ${ACCENT}0c 0%, transparent 65%)`,
      }} />

      {/* Map layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 480 340"
        preserveAspectRatio="xMidYMid slice"
      >
        <StreetGrid />

        {/* Geofence fill — more visible, person is inside */}
        <circle cx={178} cy={175} r={88} fill={`${ACCENT}09`} />
        <circle
          cx={178} cy={175} r={88}
          fill="none" stroke={ACCENT} strokeWidth={1.5}
          strokeDasharray="6 3" opacity={0.55}
        />

        {/* Store pin */}
        <StorePinSVG cx={178} cy={190} color={ACCENT} />

        {/* Person dot — clearly inside the zone */}
        <PersonDotSVG cx={210} cy={155} color={ACCENT} />

        {/* Dwell time arc — shows time in zone */}
        <path
          d={`M225,155 A20,20 0 0,1 210,135`}
          fill="none" stroke={`${ACCENT}50`} strokeWidth={1.5}
          strokeLinecap="round"
        />
        <circle cx={210} cy={134} r={2.5} fill={`${ACCENT}80`} />
      </svg>

      {/* Dwell time indicator */}
      <div
        className="absolute flex items-center gap-2"
        style={{ left: 12, bottom: 12 }}
      >
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
          style={{ background: `${ACCENT}0c`, borderColor: `${ACCENT}28` }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span style={{
            fontSize: 9, fontFamily: 'monospace', fontWeight: 600,
            color: `${ACCENT}cc`, letterSpacing: '0.04em',
          }}>
            dwell_time · 12 min · validado
          </span>
        </div>
      </div>

      {/* Phone overlay */}
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneMockup
          accentColor={ACCENT}
          brand="Nova Moda · Fidelización"
          title="Sumaste puntos por tu visita"
          message="350 puntos acreditados automáticamente. Seguís acumulando."
          time="ahora"
          badge="+350 puntos"
        />
      </div>
    </div>
  )
}

// ─── Visual 3: Competitor conquesting ─────────────────────────────────────────
// Story: two zones on the map — person is inside the COMPETITOR zone (left) →
//        YOUR brand fires the offer (phone shows YOUR notification)

export function RetailCompetitorVisual() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
      style={{ height: 340, background: '#060910' }}
    >
      {/* Two ambient glows — one per zone */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 35% 45% at 28% 52%, rgba(148,163,184,0.06) 0%, transparent 60%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 30% 40% at 68% 52%, ${ACCENT}0a 0%, transparent 60%)`,
      }} />

      {/* Map layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 480 340"
        preserveAspectRatio="xMidYMid slice"
      >
        <StreetGrid />

        {/* ── Competitor zone (left) — person is here */}
        <circle cx={142} cy={175} r={74} fill="rgba(148,163,184,0.055)" />
        <circle
          cx={142} cy={175} r={74}
          fill="none" stroke="rgba(148,163,184,0.45)" strokeWidth={1.5}
          strokeDasharray="5 2.5"
        />
        {/* Competitor store pin — greyed out */}
        <rect x={133} y={165} width={18} height={16} rx={2.5}
          fill="rgba(148,163,184,0.12)" stroke="rgba(148,163,184,0.35)" strokeWidth={1} />
        <rect x={136} y={168} width={4} height={4} rx={1} fill="rgba(148,163,184,0.25)" />
        <rect x={142} y={168} width={4} height={4} rx={1} fill="rgba(148,163,184,0.25)" />
        {/* Competitor label */}
        <rect x={88} y={106} width={108} height={14} rx={3}
          fill="rgba(148,163,184,0.06)" stroke="rgba(148,163,184,0.15)" strokeWidth={0.8} />
        <text x={142} y={117} textAnchor="middle"
          fill="rgba(148,163,184,0.45)" fontSize={7} fontWeight={700}
          letterSpacing={1} fontFamily="monospace">
          COMPETENCIA
        </text>

        {/* ── Your store zone (right) */}
        <circle cx={336} cy={175} r={68} fill={`${ACCENT}07`} />
        <circle
          cx={336} cy={175} r={68}
          fill="none" stroke={ACCENT} strokeWidth={1.5}
          strokeDasharray="6 3" opacity={0.65}
        />
        <StorePinSVG cx={336} cy={175} color={ACCENT} />
        {/* Your store label */}
        <rect x={285} y={104} width={102} height={14} rx={3}
          fill={`${ACCENT}09`} stroke={`${ACCENT}25`} strokeWidth={0.8} />
        <text x={336} y={115} textAnchor="middle"
          fill={`${ACCENT}99`} fontSize={7} fontWeight={700}
          letterSpacing={1} fontFamily="monospace">
          TU TIENDA
        </text>

        {/* Person dot — inside competitor zone */}
        <PersonDotSVG cx={162} cy={175} color="rgba(148,163,184,0.9)" />

        {/* Trigger connection line: from person to phone notification direction */}
        <line
          x1={172} y1={175} x2={220} y2={175}
          stroke={`${ACCENT}35`} strokeWidth={1}
          strokeDasharray="3 2"
        />
      </svg>

      {/* Event trigger label */}
      <div className="absolute" style={{ left: 12, bottom: 12 }}>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
          style={{ background: `${ACCENT}0c`, borderColor: `${ACCENT}28` }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span style={{
            fontSize: 9, fontFamily: 'monospace', fontWeight: 600,
            color: `${ACCENT}cc`, letterSpacing: '0.04em',
          }}>
            entered_competitor_zone · disparado
          </span>
        </div>
      </div>

      {/* Phone overlay — YOUR brand, even though person is at competitor */}
      <div className="absolute" style={{ bottom: 14, right: 14 }}>
        <PhoneMockup
          accentColor={ACCENT}
          brand="Nova Moda"
          title="Estás cerca. Te esperamos hoy."
          message="Envío gratis y 15% OFF en tu próxima compra si venís hoy al local."
          time="ahora"
        />
      </div>
    </div>
  )
}

// ─── Visual 4: Store analytics ────────────────────────────────────────────────
// Story: bird's-eye view of active customers inside the store zone
//        with live analytics overlaid — no phone, data tells the story

export function RetailAnalyticsVisual() {
  // Person dot positions scattered inside the store geofence
  const dots = [
    { cx: 188, cy: 155 },
    { cx: 220, cy: 170 },
    { cx: 198, cy: 188 },
    { cx: 170, cy: 168 },
    { cx: 210, cy: 148 },
    { cx: 240, cy: 185 },
    { cx: 178, cy: 200 },
    { cx: 230, cy: 160 },
  ]

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
      style={{ height: 340, background: '#060910' }}
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 50% at 46% 52%, ${ACCENT}0b 0%, transparent 65%)`,
      }} />

      {/* Map layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 480 340"
        preserveAspectRatio="xMidYMid slice"
      >
        <StreetGrid />

        {/* Store boundary (geofence) */}
        <circle cx={205} cy={175} r={88} fill={`${ACCENT}06`} />
        <circle
          cx={205} cy={175} r={88}
          fill="none" stroke={ACCENT} strokeWidth={1.5}
          strokeDasharray="6 3" opacity={0.5}
        />

        {/* Heat zones — sub-areas with different density/color */}
        {/* Entrance zone: hottest */}
        <circle cx={235} cy={158} r={34} fill="rgba(251,146,60,0.10)" />
        {/* Mid zone: warm */}
        <circle cx={195} cy={180} r={26} fill="rgba(14,165,233,0.09)" />
        {/* Back zone: cool */}
        <circle cx={168} cy={200} r={20} fill="rgba(139,92,246,0.07)" />

        {/* Store pin */}
        <StorePinSVG cx={205} cy={175} color={ACCENT} />

        {/* Multiple person dots — scattered traffic */}
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.cx} cy={d.cy} r={6} fill={`${ACCENT}12`} />
            <circle cx={d.cx} cy={d.cy} r={3.5} fill={ACCENT} opacity={0.7 + i * 0.03} />
            <circle cx={d.cx} cy={d.cy} r={1.4} fill="white" />
          </g>
        ))}
      </svg>

      {/* Floating analytics cards — overlaid directly on the visual */}

      {/* Total clients — top left */}
      <div
        className="absolute rounded-xl border"
        style={{
          top: 16, left: 16,
          padding: '8px 12px',
          background: 'rgba(6,9,16,0.88)',
          borderColor: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.35)', marginBottom: 2, fontFamily: 'system-ui', fontWeight: 500 }}>
          Clientes activos ahora
        </p>
        <p style={{ fontSize: 22, fontWeight: 900, color: ACCENT, lineHeight: 1, fontFamily: 'system-ui' }}>
          18
        </p>
      </div>

      {/* Entrance zone label */}
      <div
        className="absolute rounded-lg border flex items-center gap-1.5"
        style={{
          top: 100, right: 20,
          padding: '5px 9px',
          background: 'rgba(6,9,16,0.82)',
          borderColor: 'rgba(251,146,60,0.25)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgb(251,146,60)', flexShrink: 0 }} />
        <span style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(251,146,60,0.85)', letterSpacing: '0.03em' }}>
          ENTRADA · 21 min avg
        </span>
      </div>

      {/* Seasonal section label */}
      <div
        className="absolute rounded-lg border flex items-center gap-1.5"
        style={{
          top: 145, right: 20,
          padding: '5px 9px',
          background: 'rgba(6,9,16,0.82)',
          borderColor: `${ACCENT}28`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
        <span style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, color: `${ACCENT}cc`, letterSpacing: '0.03em' }}>
          TEMPORADA · 14 min avg
        </span>
      </div>

      {/* Bottom summary bar */}
      <div
        className="absolute flex items-center gap-3"
        style={{
          bottom: 14, left: 14, right: 14,
          padding: '8px 12px',
          borderRadius: 10,
          background: 'rgba(6,9,16,0.88)',
          border: 'rgba(255,255,255,0.06) 1px solid',
          backdropFilter: 'blur(12px)',
        }}
      >
        {[
          { label: 'Visitas hoy', value: '247' },
          { label: 'Tiempo promedio', value: '19 min' },
          { label: 'Retorno (30 días)', value: '64%' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center' }}>
            <p style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.3)', fontFamily: 'system-ui', marginBottom: 2 }}>
              {s.label}
            </p>
            <p style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.85)', fontFamily: 'system-ui', lineHeight: 1 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
