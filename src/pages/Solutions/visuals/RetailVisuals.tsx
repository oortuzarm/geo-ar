// ─── Retail use-case visual panels — v3 ──────────────────────────────────────
// Four distinct visual identities. No chips, badges, or technical labels.
// Case 1: map + geofence + phone  (entry trigger)
// Case 2: phone dominant + map faint  (loyalty reward, in-app)
// Case 3: two territories + phone  (competitor conquesting)
// Case 4: analytics dashboard, no phone  (operational intelligence)

const ACCENT = '#0ea5e9'

// ─── Shared: Lock-screen phone (Cases 1 & 3) ─────────────────────────────────

function PhoneMockup({
  brand, title, message, time = 'ahora', accentColor,
}: {
  brand: string; title: string; message: string; time?: string; accentColor: string
}) {
  return (
    <div style={{
      width: 152, borderRadius: 26,
      border: '2px solid rgba(255,255,255,0.13)', background: '#07090f',
      overflow: 'hidden',
      boxShadow: '0 24px 56px rgba(0,0,0,0.80), 0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
      flexShrink: 0,
    }}>
      {/* Status bar */}
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
      {/* Lock screen */}
      <div style={{ background: '#0a0c1a', padding: '5px 8px 10px' }}>
        <div style={{ background: 'rgba(255,255,255,0.065)', borderRadius: 13, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, background: `${accentColor}20`, border: `1px solid ${accentColor}45`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor }} />
            </div>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.82)', flex: 1, fontFamily: 'system-ui' }}>{brand}</span>
            <span style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', fontFamily: 'system-ui' }}>{time}</span>
          </div>
          <p style={{ fontSize: 8.5, fontWeight: 600, color: 'rgba(255,255,255,0.82)', lineHeight: 1.3, marginBottom: 3, fontFamily: 'system-ui' }}>{title}</p>
          <p style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4, fontFamily: 'system-ui' }}>{message}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, paddingLeft: 2, paddingRight: 2 }}>
          {[0.75, 0.5].map((w, i) => (
            <div key={i} style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.022)', width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
      <div style={{ height: 18, background: '#07090f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 34, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
      </div>
    </div>
  )
}

// ─── Shared: App-screen phone shell (Case 2) ──────────────────────────────────

function PhoneAppShell({ children, width = 164 }: { children: React.ReactNode; width?: number }) {
  return (
    <div style={{
      width, borderRadius: 28,
      border: '2px solid rgba(255,255,255,0.14)', background: '#07090f',
      overflow: 'hidden',
      boxShadow: '0 28px 64px rgba(0,0,0,0.85), 0 4px 16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 6px', background: '#07090f' }}>
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
      {children}
      <div style={{ height: 18, background: '#07090f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 38, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
      </div>
    </div>
  )
}

// ─── App screen: Loyalty rewards (Case 2) ────────────────────────────────────

function LoyaltyAppScreen() {
  return (
    <div style={{ background: '#07090f' }}>
      {/* Brand header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px',
        background: `${ACCENT}09`, borderBottom: `1px solid ${ACCENT}16`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4.5, background: `${ACCENT}1a`, border: `1px solid ${ACCENT}38`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
          </div>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontFamily: 'system-ui' }}>Nova Moda</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, color: ACCENT, fontFamily: 'monospace' }}>1.850</span>
          <span style={{ fontSize: 7, color: `${ACCENT}70`, fontFamily: 'system-ui' }}>pts</span>
        </div>
      </div>

      {/* Hero: points earned */}
      <div style={{ padding: '16px 12px 10px', textAlign: 'center' }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: `${ACCENT}0f`, border: `1.5px solid ${ACCENT}30`,
          margin: '0 auto 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style={{ fontSize: 34, fontWeight: 900, color: ACCENT, lineHeight: 1, fontFamily: 'system-ui', letterSpacing: '-0.02em' }}>
          +350
        </div>
        <div style={{ fontSize: 7.5, fontWeight: 700, color: `${ACCENT}70`, marginTop: 3, fontFamily: 'system-ui', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          puntos acreditados
        </div>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', marginTop: 6, fontFamily: 'system-ui', lineHeight: 1.4 }}>
          Por tu visita de hoy · 12 min en tienda
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 12px' }} />

      {/* Visit streak */}
      <div style={{ padding: '10px 12px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.28)', fontFamily: 'system-ui' }}>Racha de visitas</span>
          <span style={{ fontSize: 7.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui' }}>7 / 8</span>
        </div>
        <div style={{ display: 'flex', gap: 2.5 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ flex: 1, height: 5.5, borderRadius: 2.5, background: i < 7 ? ACCENT : `${ACCENT}18`, opacity: i < 7 ? 0.55 + i * 0.07 : 1 }} />
          ))}
        </div>
      </div>

      {/* Progress to next benefit */}
      <div style={{ margin: '0 12px 12px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.055)', borderRadius: 8, padding: '6px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.22)', fontFamily: 'system-ui' }}>Próximo beneficio</span>
          <span style={{ fontSize: 7, fontWeight: 700, color: `${ACCENT}65`, fontFamily: 'system-ui' }}>1 visita más</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: '87.5%', background: `linear-gradient(90deg, ${ACCENT}60, ${ACCENT})`, borderRadius: 2 }} />
        </div>
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
// Story: person crosses the boundary → notification fires

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

// ─── Visual 2: Loyalty — Phone dominant ──────────────────────────────────────
// Story: detected presence in store → in-app reward credited instantly

export function RetailLoyaltyVisual() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>
      {/* Glow centered on the phone */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 80% 80% at 50% 48%, ${ACCENT}0a 0%, transparent 65%)`,
      }} />

      {/* Map — ultra-faint, provides spatial context only */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.28 }}>
        <StreetGrid />
        <circle cx={240} cy={175} r={105} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="5 3" opacity={0.18} />
        <circle cx={240} cy={175} r={5} fill={`${ACCENT}20`} />
        <circle cx={240} cy={175} r={2.5} fill={`${ACCENT}40`} />
      </svg>

      {/* Phone — protagonist, centered */}
      <div className="absolute" style={{ top: 8, left: '50%', transform: 'translateX(-50%)' }}>
        <PhoneAppShell width={164}>
          <LoyaltyAppScreen />
        </PhoneAppShell>
      </div>
    </div>
  )
}

// ─── Visual 3: Competitor conquesting ─────────────────────────────────────────
// Story: customer inside rival zone → your brand fires before they decide

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

        {/* Competitor zone (left) */}
        <circle cx={142} cy={175} r={74} fill="rgba(148,163,184,0.055)" />
        <circle cx={142} cy={175} r={74} fill="none" stroke="rgba(148,163,184,0.45)" strokeWidth={1.5} strokeDasharray="5 2.5" />
        <rect x={133} y={165} width={18} height={16} rx={2.5} fill="rgba(148,163,184,0.12)" stroke="rgba(148,163,184,0.35)" strokeWidth={1} />
        <rect x={136} y={168} width={4} height={4} rx={1} fill="rgba(148,163,184,0.25)" />
        <rect x={142} y={168} width={4} height={4} rx={1} fill="rgba(148,163,184,0.25)" />
        <rect x={88} y={106} width={108} height={14} rx={3} fill="rgba(148,163,184,0.06)" stroke="rgba(148,163,184,0.15)" strokeWidth={0.8} />
        <text x={142} y={117} textAnchor="middle" fill="rgba(148,163,184,0.45)" fontSize={7} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          COMPETENCIA
        </text>

        {/* Your store zone (right) */}
        <circle cx={336} cy={175} r={68} fill={`${ACCENT}07`} />
        <circle cx={336} cy={175} r={68} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.65} />
        <StorePinSVG cx={336} cy={175} color={ACCENT} />
        <rect x={285} y={104} width={102} height={14} rx={3} fill={`${ACCENT}09`} stroke={`${ACCENT}25`} strokeWidth={0.8} />
        <text x={336} y={115} textAnchor="middle" fill={`${ACCENT}99`} fontSize={7} fontWeight={700} letterSpacing={1} fontFamily="monospace">
          TU TIENDA
        </text>

        {/* Person inside competitor zone */}
        <PersonDotSVG cx={162} cy={175} color="rgba(148,163,184,0.9)" />
        <line x1={172} y1={175} x2={220} y2={175} stroke={`${ACCENT}35`} strokeWidth={1} strokeDasharray="3 2" />
      </svg>

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

// ─── Visual 4: Analytics dashboard ───────────────────────────────────────────
// Story: what's happening inside the store right now — for the manager, not the customer

export function RetailAnalyticsVisual() {
  const hotDots  = [{ cx: 278, cy: 126 }, { cx: 295, cy: 138 }, { cx: 308, cy: 128 }, { cx: 284, cy: 150 }, { cx: 318, cy: 142 }, { cx: 298, cy: 155 }, { cx: 274, cy: 144 }]
  const midDots  = [{ cx: 182, cy: 198 }, { cx: 200, cy: 212 }, { cx: 172, cy: 208 }, { cx: 193, cy: 222 }]
  const coolDots = [{ cx: 122, cy: 142 }, { cx: 140, cy: 152 }]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 340, background: '#060910' }}>

      {/* Map — the primary canvas */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid slice">
        <StreetGrid />

        {/* Store perimeter */}
        <circle cx={215} cy={178} r={135} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="4 4" />

        {/* Heat zone 1 — Entrance (orange / hot) */}
        <ellipse cx={292} cy={138} rx={88} ry={66} fill="rgba(251,146,60,0.05)" />
        <ellipse cx={292} cy={138} rx={62} ry={46} fill="rgba(251,146,60,0.09)" />
        <ellipse cx={292} cy={138} rx={38} ry={28} fill="rgba(251,146,60,0.15)" />
        <ellipse cx={292} cy={138} rx={18} ry={13} fill="rgba(251,146,60,0.25)" />

        {/* Heat zone 2 — Seasonal section (blue / medium) */}
        <ellipse cx={185} cy={208} rx={72} ry={52} fill={`${ACCENT}06`} transform="rotate(-10 185 208)" />
        <ellipse cx={185} cy={208} rx={48} ry={34} fill={`${ACCENT}10`} transform="rotate(-10 185 208)" />
        <ellipse cx={185} cy={208} rx={26} ry={18} fill={`${ACCENT}17`} transform="rotate(-10 185 208)" />

        {/* Heat zone 3 — Back area (purple / cool) */}
        <ellipse cx={124} cy={145} rx={50} ry={38} fill="rgba(139,92,246,0.06)" />
        <ellipse cx={124} cy={145} rx={30} ry={22} fill="rgba(139,92,246,0.11)" />

        {/* Store pin */}
        <StorePinSVG cx={215} cy={178} color={ACCENT} />

        {/* Person clusters — color-coded per zone */}
        {hotDots.map((d, i) => (
          <g key={`h${i}`}>
            <circle cx={d.cx} cy={d.cy} r={5.5} fill="rgba(251,146,60,0.16)" />
            <circle cx={d.cx} cy={d.cy} r={3.2} fill="rgba(251,146,60,0.82)" />
            <circle cx={d.cx} cy={d.cy} r={1.3} fill="white" />
          </g>
        ))}
        {midDots.map((d, i) => (
          <g key={`m${i}`}>
            <circle cx={d.cx} cy={d.cy} r={5.5} fill={`${ACCENT}15`} />
            <circle cx={d.cx} cy={d.cy} r={3.2} fill={`${ACCENT}cc`} />
            <circle cx={d.cx} cy={d.cy} r={1.3} fill="white" />
          </g>
        ))}
        {coolDots.map((d, i) => (
          <g key={`c${i}`}>
            <circle cx={d.cx} cy={d.cy} r={5.5} fill="rgba(139,92,246,0.15)" />
            <circle cx={d.cx} cy={d.cy} r={3.2} fill="rgba(139,92,246,0.80)" />
            <circle cx={d.cx} cy={d.cy} r={1.3} fill="white" />
          </g>
        ))}
      </svg>

      {/* Live indicator */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between"
        style={{ padding: '11px 14px', background: 'linear-gradient(to bottom, #060910e8 55%, transparent)' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
            EN VIVO
          </span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>· 14:32</span>
        </div>
        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', fontFamily: 'system-ui' }}>Nova Moda · Av. Corrientes</span>
      </div>

      {/* Metric cards — the data story */}
      {[
        { label: 'Visitantes hoy',   value: '1.248', delta: '+18% vs ayer', valueColor: 'rgba(251,146,60,0.95)', deltaColor: 'rgba(251,146,60,0.55)' },
        { label: 'Tiempo promedio',  value: '24 min', delta: '+6% vs ayer',  valueColor: ACCENT,                 deltaColor: `${ACCENT}55` },
        { label: 'Zonas calientes',  value: '3',      delta: '+1 vs ayer',   valueColor: 'rgba(139,92,246,0.90)', deltaColor: 'rgba(139,92,246,0.48)' },
      ].map((card, i) => (
        <div key={i} className="absolute rounded-xl border" style={{
          top: 38 + i * 82, right: 14,
          padding: '8px 12px', minWidth: 108,
          background: 'rgba(6,9,16,0.92)', borderColor: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(14px)',
        }}>
          <p style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.30)', marginBottom: 3, fontFamily: 'system-ui' }}>{card.label}</p>
          <p style={{ fontSize: 22, fontWeight: 900, color: card.valueColor, lineHeight: 1, fontFamily: 'system-ui', letterSpacing: '-0.01em' }}>{card.value}</p>
          <p style={{ fontSize: 7, color: card.deltaColor, marginTop: 3, fontFamily: 'system-ui' }}>{card.delta}</p>
        </div>
      ))}
    </div>
  )
}
