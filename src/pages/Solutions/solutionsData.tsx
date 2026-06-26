import React from 'react'
import {
  RetailEntryVisual,
  RetailLoyaltyVisual,
  RetailCompetitorVisual,
  RetailAnalyticsVisual,
} from './visuals/RetailVisuals'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string
  answer: string
}

export interface UseCase {
  category: string
  title: string
  description: string
  visual: React.ReactNode
}

export interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
}

export interface IndustryData {
  slug: string
  name: string
  shortDesc: string
  accentColor: string
  meta: {
    title: string
    description: string
  }
  hero: {
    label: string
    title: string
    subtitle: string
  }
  intro: {
    headline: string
    body: string
  }
  useCases: [UseCase, UseCase, UseCase, UseCase]
  benefits: Benefit[]
  faq: FAQItem[]
}

// ─── Visual Panel Components ──────────────────────────────────────────────────

function PushNotificationPanel({
  brand, title, message, time = 'ahora', accentColor = '#0ea5e9', eventLabel,
}: {
  brand: string; title: string; message: string
  time?: string; accentColor?: string; eventLabel?: string
}) {
  return (
    <div className="relative rounded-2xl bg-[#070a12] border border-white/[0.08] p-6">
      <div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accentColor}10 0%, transparent 65%)` }}
      />
      <div className="relative space-y-3">
        <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}35` }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-[11px] font-bold text-white">{brand}</p>
                <p className="text-[10px] text-slate-600">{time}</p>
              </div>
              <p className="text-[11px] font-semibold text-slate-300 mb-0.5">{title}</p>
              <p className="text-[10px] text-slate-500 leading-snug">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: accentColor }} />
          <p className="text-[10px] font-mono text-slate-600">{eventLabel ?? 'entered_place · radius 150m'}</p>
          <p className="ml-auto text-[9px] font-bold" style={{ color: accentColor }}>ACTIVE</p>
        </div>
      </div>
    </div>
  )
}

function MetricsPanelVisual({
  stats, accentColor = '#0ea5e9',
}: {
  stats: Array<{ label: string; value: string; sub?: string }>
  accentColor?: string
}) {
  return (
    <div className="relative rounded-2xl bg-[#070a12] border border-white/[0.08] p-5">
      <div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% 10%, ${accentColor}09 0%, transparent 65%)` }}
      />
      <div className="relative space-y-2.5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
          >
            <p className="text-[11px] text-slate-500">{s.label}</p>
            <div className="text-right">
              <p className="text-xl font-black leading-none" style={{ color: accentColor }}>{s.value}</p>
              {s.sub && <p className="text-[9px] text-slate-600 mt-0.5">{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GeoMapVisual({
  zones, accentColor = '#0ea5e9',
}: {
  zones: Array<{ name: string; status: string }>
  accentColor?: string
}) {
  return (
    <div className="relative rounded-2xl bg-[#070a12] border border-white/[0.08] overflow-hidden">
      <div className="relative" style={{ height: 150 }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 150" preserveAspectRatio="xMidYMid slice">
          <rect width="340" height="150" fill="#070a12" />
          <line x1="0" y1="38" x2="340" y2="52" stroke="rgba(255,255,255,0.025)" strokeWidth="9" />
          <line x1="0" y1="100" x2="340" y2="108" stroke="rgba(255,255,255,0.025)" strokeWidth="9" />
          <line x1="78" y1="0" x2="72" y2="150" stroke="rgba(255,255,255,0.025)" strokeWidth="9" />
          <line x1="218" y1="0" x2="225" y2="150" stroke="rgba(255,255,255,0.025)" strokeWidth="9" />
          <circle cx="148" cy="78" r="46"
            fill={`${accentColor}08`} stroke={accentColor} strokeWidth="1.5" strokeDasharray="5 2.5" />
          <circle cx="258" cy="44" r="26"
            fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.35)" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="148" cy="78" r="10" fill={`${accentColor}20`} />
          <circle cx="148" cy="78" r="5" fill={accentColor} />
          <circle cx="148" cy="78" r="2" fill="white" />
          <circle cx="258" cy="44" r="5" fill="rgba(139,92,246,0.9)" />
          <circle cx="258" cy="44" r="2" fill="white" />
        </svg>
      </div>
      <div className="border-t border-white/[0.06] px-4 py-3 space-y-1.5">
        {zones.map((z, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: i === 0 ? accentColor : 'rgba(139,92,246,0.9)' }}
              />
              <p className="text-[10px] font-mono text-slate-500">{z.name}</p>
            </div>
            <p className="text-[9px] font-bold text-slate-600">{z.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FlowVisual({
  steps, accentColor = '#0ea5e9',
}: {
  steps: Array<{ label: string; value?: string; highlight?: boolean }>
  accentColor?: string
}) {
  return (
    <div className="relative rounded-2xl bg-[#070a12] border border-white/[0.08] p-5">
      <div className="space-y-1.5">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-colors"
              style={step.highlight ? {
                backgroundColor: `${accentColor}08`,
                borderColor: `${accentColor}30`,
              } : {
                backgroundColor: 'rgba(255,255,255,0.015)',
                borderColor: 'rgba(255,255,255,0.05)',
              }}
            >
              <p className="text-[11px]" style={step.highlight ? { color: 'rgba(255,255,255,0.8)' } : { color: 'rgb(100,116,139)' }}>
                {step.label}
              </p>
              {step.value && (
                <p className="text-[11px] font-mono font-bold" style={{ color: accentColor }}>
                  {step.value}
                </p>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-0.5">
                <svg className="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ─── Benefit Icons ────────────────────────────────────────────────────────────

const BenefitIcon = {
  NoApp: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Link: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Expand: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  Map: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
}

// ─── Industry Data ────────────────────────────────────────────────────────────

const retail: IndustryData = {
  slug: 'retail',
  name: 'Retail',
  shortDesc: 'Activa experiencias cuando el cliente entra a la tienda',
  accentColor: '#0ea5e9',
  meta: {
    title: 'Ubyca para Retail — Activa experiencias cuando tus clientes están en tienda',
    description: 'Detecta la presencia de tus clientes en el punto de venta y activa mensajes, beneficios y experiencias en el momento de mayor intención de compra. Sin hardware. Sin apps.',
  },
  hero: {
    label: 'RETAIL',
    title: 'El cliente ya tomó la decisión de venir. ¿Estás aprovechando ese momento?',
    subtitle: 'Ubyca detecta la presencia de cada cliente en tus puntos de venta y activa mensajes, beneficios o experiencias exactamente cuando están dentro de la tienda y listos para comprar.',
  },
  intro: {
    headline: 'El canal más efectivo para el retail no es digital. Es físico.',
    body: 'Cuando un cliente entra a tu tienda, su intención de compra ya está activa. Es el momento más valioso de su recorrido, y hoy pasa sin que tu marca haga nada. Ubyca convierte ese instante físico en una interacción medible: un mensaje, un beneficio, un motivo para comprar más o para volver.',
  },
  useCases: [
    {
      category: 'ACTIVACIÓN DE ENTRADA',
      title: 'Activa una experiencia en el momento exacto de la visita',
      description: 'Define el radio de cobertura de tu tienda en Studio. Cada vez que un dispositivo entra en esa área, Ubyca activa automáticamente la experiencia que configuraste: un mensaje de bienvenida, un botón para ver la promoción del día, un acceso directo al menú o un enlace a WhatsApp. Sin hardware. Sin apps. Sin fricciones.',
      visual: <RetailEntryVisual />,
    },
    {
      category: 'PERMANENCIA MÍNIMA',
      title: 'Activa la experiencia solo cuando el cliente realmente está en tienda',
      description: 'Agrega una condición de permanencia mínima —por ejemplo, 5 minutos— y Ubyca solo dispara la experiencia si el cliente se queda el tiempo suficiente. Ideal para activar un beneficio cuando alguien está explorando, no al pasar de largo. Configura el botón de acción para abrir WhatsApp, un formulario o cualquier URL que elijas.',
      visual: <RetailLoyaltyVisual />,
    },
    {
      category: 'ZONAS DE CONQUISTA',
      title: 'Activa tu oferta cuando alguien está cerca de la competencia',
      description: 'Define las áreas de tus principales competidores directamente en Studio. Cuando un dispositivo entra en esa zona, Ubyca dispara tu experiencia de forma automática: un mensaje con tu propuesta y un botón directo a tu tienda, tu oferta o tu WhatsApp. El momento de influir es antes de que decidan.',
      visual: <RetailCompetitorVisual />,
    },
    {
      category: 'INTELIGENCIA DE VISITANTES',
      title: 'Visualiza en tiempo real quién está en cada zona de tu tienda',
      description: 'Studio muestra cuántos dispositivos están activos en cada zona, el tiempo de permanencia promedio y los horarios de mayor afluencia. Datos reales, actualizados en vivo, sin encuestas ni estimaciones. Información que hoy no tienes y que cambia cómo planificas el espacio, el equipo y las campañas.',
      visual: <RetailAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Chart />,
      title: 'Más conversión en el momento que más importa',
      description: 'Un mensaje relevante en el instante de mayor intención. Ningún canal digital puede competir con la precisión del momento físico.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Mayor frecuencia de visitas',
      description: 'Cuando una visita activa una experiencia, la tienda se vuelve memorable. El cliente vuelve porque sabe que hay algo esperándolo. Sin necesidad de apps ni tarjetas de fidelización.',
    },
    {
      icon: <BenefitIcon.Link />,
      title: 'Campañas con resultados medibles',
      description: 'Cada activación entrega métricas reales: cuántos clientes activaron la experiencia, cuánto tiempo permanecieron, cuántos convirtieron. Resultados concretos, no estimaciones.',
    },
    {
      icon: <BenefitIcon.Clock />,
      title: 'Decisiones operacionales con datos reales',
      description: 'Flujos de visita por tienda, zonas de mayor permanencia, comportamiento por horario. Información que hoy no tienes y que cambia cómo planificas el espacio y el equipo.',
    },
  ],
  faq: [
    {
      question: '¿Necesito instalar algo en la tienda?',
      answer: 'No. No hay hardware, balizas ni dispositivos que instalar. Ubyca trabaja con el GPS del smartphone del cliente. Solo necesitas crear las zonas en Studio, lo cual toma minutos.',
    },
    {
      question: '¿Tengo que cambiar mi app actual?',
      answer: 'No necesariamente. Ubyca puede integrarse en tu app existente a través de la API REST, o funcionar de forma independiente desde el navegador del cliente sin ninguna descarga adicional.',
    },
    {
      question: '¿El cliente necesita hacer algo para recibir la experiencia?',
      answer: 'Solo necesita haber autorizado el acceso a su ubicación una vez. A partir de ahí, la experiencia se activa automáticamente cada vez que entra a la tienda. Sin fricciones, sin escaneos.',
    },
    {
      question: '¿Cómo mido si las activaciones están funcionando?',
      answer: 'Studio entrega métricas por activación y por tienda: clientes alcanzados, tiempo de permanencia en tienda y frecuencia de visita. Si integras tu sistema de ventas vía API, también puedes medir la conversión directa de cada campaña.',
    },
    {
      question: '¿Funciona con múltiples sucursales?',
      answer: 'Sí. Cada tienda tiene su propia configuración —radio, horario, reglas de activación— pero todas se gestionan desde un único proyecto en Studio. Puedes ver el desempeño global o desglosado por tienda.',
    },
    {
      question: '¿Cuánto tarda en estar operativo?',
      answer: 'El primer GeoPoint puede estar activo en menos de 10 minutos. Defines la zona, configuras la experiencia y comienzas a medir desde el mismo día. Sin semanas de integración ni equipos técnicos dedicados.',
    },
  ],
}

const tourism: IndustryData = {
  slug: 'tourism',
  name: 'Turismo',
  shortDesc: 'Activa contenido cuando el visitante llega al punto de interés',
  accentColor: '#8b5cf6',
  meta: {
    title: 'Ubyca para Turismo — Experiencias geolocalizadas para destinos y rutas',
    description: 'Crea rutas turísticas interactivas donde el contenido se activa al llegar a cada punto. Ideal para destinos, museos, hoteles y patrimonio cultural.',
  },
  hero: {
    label: 'TURISMO',
    title: 'Activa experiencias cuando el visitante llega',
    subtitle: 'Crea rutas interactivas donde el contenido —audio, video, información o experiencias AR— se desbloquea automáticamente en cada punto del recorrido.',
  },
  intro: {
    headline: 'El lugar tiene la historia. Ubyca activa el momento.',
    body: 'Los destinos turísticos invierten en contenido que el visitante nunca llega a ver porque no sabe que existe o porque el contexto ya pasó. Ubyca sincroniza el contenido con la ubicación física del visitante, activando exactamente lo correcto en el momento en que está parado frente al lugar.',
  },
  useCases: [
    {
      category: 'RUTAS INTERACTIVAS',
      title: 'El contenido se activa en cada parada',
      description: 'Define una ruta con múltiples puntos de interés y asocia contenido a cada uno: audio, video, texto, enlaces o experiencias AR. El visitante recibe lo que corresponde a medida que avanza por el recorrido.',
      visual: (
        <GeoMapVisual
          zones={[
            { name: 'Plaza Mayor · Radio 80m', status: 'Parada 1 · Activa' },
            { name: 'Catedral · Radio 60m', status: 'Parada 2 · Siguiente' },
          ]}
          accentColor="#8b5cf6"
        />
      ),
    },
    {
      category: 'BIENVENIDA EN DESTINO',
      title: 'Recibe al visitante al llegar al hotel o destino',
      description: 'Detecta la llegada al hotel, al aeropuerto o al punto de inicio del tour y activa un mensaje de bienvenida personalizado con información del lugar, actividades disponibles y contacto con el equipo local.',
      visual: (
        <PushNotificationPanel
          brand="Hotel Posada del Sol"
          title="Bienvenido, nos alegra tenerte aquí"
          message="Tu habitación está lista. Descarga el mapa del destino y explora las actividades disponibles para hoy."
          accentColor="#8b5cf6"
          eventLabel="arrived · Hotel Posada del Sol"
        />
      ),
    },
    {
      category: 'PATRIMONIO CULTURAL',
      title: 'Información contextual en museos y sitios históricos',
      description: 'En cada sala de museo o punto del sitio histórico, el visitante accede a la información, el audio-guía o el contenido audiovisual sin necesidad de escanear ningún código. La ubicación es el activador.',
      visual: (
        <FlowVisual
          steps={[
            { label: 'Visitante entra a sala de exhibición', value: 'entered_zone' },
            { label: 'Contenido de la sala se activa', value: '< 80ms', highlight: true },
            { label: 'Audio guía disponible', value: 'unlocked' },
            { label: 'Tiempo en sala registrado', value: '8.5 min', highlight: true },
          ]}
          accentColor="#8b5cf6"
        />
      ),
    },
    {
      category: 'ANALÍTICA DE DESTINO',
      title: 'Entiende cómo se mueve el visitante',
      description: 'Conoce qué puntos de interés concentran más tiempo, qué rutas se completan y dónde se produce el abandono. Datos para mejorar la señalización, redistribuir recursos y optimizar la experiencia.',
      visual: (
        <MetricsPanelVisual
          stats={[
            { label: 'Visitantes activos en ruta', value: '47', sub: 'en este momento' },
            { label: 'Parada más visitada', value: 'Plaza Mayor', sub: 'avg. 14 min de permanencia' },
            { label: 'Rutas completadas hoy', value: '83%', sub: 'tasa de finalización' },
          ]}
          accentColor="#8b5cf6"
        />
      ),
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Map />,
      title: 'Rutas ilimitadas',
      description: 'Crea tantas rutas como necesites, con cualquier número de puntos de interés, cada uno con su propio contenido y configuración.',
    },
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin apps que instalar',
      description: 'El visitante accede desde el navegador de su teléfono. Sin fricciones de descarga, compatible con cualquier dispositivo.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Analytics de flujo turístico',
      description: 'Dwell time por punto de interés, rutas completadas, horarios de mayor afluencia y patrones de visita.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Experiencias memorables',
      description: 'El contenido contextual aumenta la retención del visitante y la probabilidad de recomendación del destino.',
    },
  ],
  faq: [
    {
      question: '¿Funciona en zonas sin cobertura de datos?',
      answer: 'La validación de presencia requiere conexión a internet para contrastar las coordenadas con el servidor. Sin embargo, puedes pre-cargar el contenido de la ruta cuando el visitante tiene cobertura para que esté disponible offline en los puntos sin señal.',
    },
    {
      question: '¿Se puede configurar una ruta con paradas en orden?',
      answer: 'Sí. Puedes definir un orden específico para las paradas y el contenido de cada una solo se activa cuando el visitante llega a ese punto. También puedes permitir recorrido libre sin orden forzado.',
    },
    {
      question: '¿Es posible usar esto para audio guías?',
      answer: 'Absolutamente. Cada GeoPoint puede tener asociado contenido de tipo audio. Cuando el visitante entra en el radio del punto, el audio se activa automáticamente.',
    },
    {
      question: '¿Cuántos puntos puede tener una ruta?',
      answer: 'No hay un límite técnico en la cantidad de GeoPoints por proyecto. Puedes crear recorridos cortos de 5 paradas o rutas completas de ciudad con decenas de puntos de interés.',
    },
    {
      question: '¿Se pueden personalizar las experiencias por idioma?',
      answer: 'Cada GeoPoint puede apuntar a una URL de contenido diferente. Puedes crear versiones del contenido en múltiples idiomas y entregar la URL correcta basándote en el perfil del visitante.',
    },
  ],
}

const events: IndustryData = {
  slug: 'events',
  name: 'Eventos',
  shortDesc: 'Conecta con los asistentes durante el evento',
  accentColor: '#10b981',
  meta: {
    title: 'Ubyca para Eventos — Experiencias geolocalizadas para asistentes',
    description: 'Activa contenido, valida acceso y crea dinámicas interactivas basadas en la ubicación de los asistentes durante festivales, conferencias y eventos.',
  },
  hero: {
    label: 'EVENTOS',
    title: 'Conecta con tus asistentes durante el evento',
    subtitle: 'Activa contenido, valida acceso a zonas, crea dinámicas de gamificación y mide el comportamiento espacial de tu audiencia en tiempo real.',
  },
  intro: {
    headline: 'El evento ocurre en el espacio. Las herramientas deben saberlo.',
    body: 'Los eventos concentran a miles de personas en un espacio delimitado durante un tiempo definido. Es la mayor densidad posible de oportunidades de engagement. Ubyca te permite capitalizar cada movimiento, cada zona y cada momento del evento con interacciones activadas por la ubicación real del asistente.',
  },
  useCases: [
    {
      category: 'CONTROL DE ACCESO',
      title: 'Valida la presencia en zonas sin usar QR',
      description: 'Verifica si un asistente está físicamente dentro de una zona —escenario, área VIP, sala de conferencia— sin necesidad de escanear tickets ni hacer fila en torniquetes. La presencia GPS es el ticket.',
      visual: (
        <FlowVisual
          steps={[
            { label: 'Asistente llega a Zona VIP', value: 'entered_zone' },
            { label: 'Validación de presencia', value: '< 80ms', highlight: true },
            { label: 'Acceso confirmado', value: '✓ valid', highlight: true },
            { label: 'Registro en analytics', value: 'logged' },
          ]}
          accentColor="#10b981"
        />
      ),
    },
    {
      category: 'ACTIVACIONES DE MARCA',
      title: 'Activa experiencias en los stands de sponsors',
      description: 'Los sponsors tienen acceso a analytics de presencia en sus zonas. Los asistentes que ingresan al stand reciben una oferta, contenido exclusivo o entran a un sorteo automáticamente. ROI medible para cada sponsor.',
      visual: (
        <PushNotificationPanel
          brand="Sponsor Principal"
          title="Estás en el stand de TechCorp"
          message="Completa el desafío en el stand y gana acceso al networking exclusivo de esta tarde."
          accentColor="#10b981"
          eventLabel="entered_place · Stand TechCorp"
        />
      ),
    },
    {
      category: 'GAMIFICACIÓN',
      title: 'Crea dinámicas basadas en recorrer el evento',
      description: 'Diseña una gymkhana, un rally de sellos o una dinámica de descubrimiento donde los asistentes acumulan puntos por visitar zonas específicas del evento. Más recorrido, más engagement, más tiempo en el espacio.',
      visual: (
        <MetricsPanelVisual
          stats={[
            { label: 'Zonas visitadas', value: '4/7', sub: 'Progreso del asistente' },
            { label: 'Puntos acumulados', value: '840', sub: 'en 3 horas de evento' },
            { label: 'Ranking actual', value: '#12', sub: 'de 347 participantes' },
          ]}
          accentColor="#10b981"
        />
      ),
    },
    {
      category: 'INTELIGENCIA DE EVENTO',
      title: 'Optimiza el evento con datos de flujo en tiempo real',
      description: 'Visualiza la distribución de asistentes por zona en tiempo real, identifica cuellos de botella, mide el tiempo de permanencia en cada escenario y toma decisiones operacionales basadas en datos, no en intuición.',
      visual: (
        <GeoMapVisual
          zones={[
            { name: 'Escenario Principal · 200m', status: '312 asistentes' },
            { name: 'Zona Food & Drinks · 100m', status: '89 asistentes' },
          ]}
          accentColor="#10b981"
        />
      ),
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Shield />,
      title: 'Acceso sin fricciones',
      description: 'Sin QR, sin beacons, sin torniquetes. La presencia GPS es el mecanismo de validación.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'ROI medible para sponsors',
      description: 'Entrega a cada sponsor analytics de visitas, dwell time y conversiones en su zona del evento.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Mayor engagement del asistente',
      description: 'La gamificación basada en ubicación aumenta el recorrido del espacio y el tiempo total en el evento.',
    },
    {
      icon: <BenefitIcon.Clock />,
      title: 'Tiempo real durante el evento',
      description: 'El equipo de producción ve el flujo de asistentes en vivo y puede reaccionar antes de que los problemas escalen.',
    },
  ],
  faq: [
    {
      question: '¿Funciona en espacios cerrados como salas de conferencia?',
      answer: 'Sí, con algunos matices. El GPS tiene precisión variable en interiores dependiendo de la estructura del edificio. Para espacios cerrados de alta precisión, Ubyca puede complementarse con referencias de ubicación manual por el asistente.',
    },
    {
      question: '¿Cuántos asistentes simultáneos puede gestionar?',
      answer: 'Ubyca está diseñado para escalar. El motor de presencia puede procesar validaciones concurrentes para miles de usuarios simultáneos. Para eventos de gran escala, conversemos sobre la arquitectura específica.',
    },
    {
      question: '¿Los sponsors tienen acceso a los datos de sus zonas?',
      answer: 'Puedes entregar a cada sponsor un reporte con las métricas de su zona: visitas únicas, tiempo promedio de permanencia y distribución horaria. Los datos son agregados y no incluyen información personal de los asistentes.',
    },
    {
      question: '¿Cómo funcionan los puntos de la gamificación?',
      answer: 'Ubyca valida la presencia en cada zona y puede emitir un evento via webhook a tu sistema de gamificación cuando un asistente llega a un punto específico. La lógica de puntos y rankings vive en tu sistema; Ubyca provee la capa de detección de presencia.',
    },
  ],
}

const marketing: IndustryData = {
  slug: 'marketing',
  name: 'Marketing',
  shortDesc: 'Activa campañas en el lugar y momento exactos',
  accentColor: '#f97316',
  meta: {
    title: 'Ubyca para Marketing — Campañas activadas por ubicación física',
    description: 'Alcanza a tu audiencia en el momento en que están físicamente en el lugar correcto. Campañas basadas en presencia real, con métricas de impacto medibles.',
  },
  hero: {
    label: 'MARKETING',
    title: 'Activa tu campaña en el lugar y momento exactos',
    subtitle: 'El canal de mayor conversión no es el digital ni el físico. Es el momento en que ambos coinciden. Ubyca te da acceso a ese instante.',
  },
  intro: {
    headline: 'La ubicación es el segmento más preciso que existe',
    body: 'Ningún criterio de segmentación digital supera la precisión de saber que alguien está físicamente en un lugar en este momento. Ubyca te permite construir campañas que se activan basándose en presencia real, no en inferencias demográficas o de comportamiento digital.',
  },
  useCases: [
    {
      category: 'MENSAJES BASADOS EN UBICACIÓN',
      title: 'Alcanza a tu audiencia cuando está en el lugar correcto',
      description: 'Define zonas geográficas relevantes para tu marca —cerca de un punto de venta, en un evento, en una zona de alta afluencia— y activa mensajes personalizados para cada persona que entra en ellas.',
      visual: (
        <PushNotificationPanel
          brand="Marca XYZ"
          title="Estás a 200m de nuestra tienda"
          message="Nueva colección disponible. Los primeros 50 visitantes de hoy tienen envío gratis en su próxima compra online."
          accentColor="#f97316"
          eventLabel="proximity · 200m del punto de venta"
        />
      ),
    },
    {
      category: 'CONQUISTA DE COMPETENCIA',
      title: 'Convierte cada visita al competidor en una oportunidad',
      description: 'Detecta cuando tu audiencia entra a la zona de un competidor y activa una oferta comparativa en el momento más crítico del proceso de decisión. Máxima relevancia, mínimo desperdicio de impresión.',
      visual: (
        <FlowVisual
          steps={[
            { label: 'Usuario entra a zona competidor', value: 'entered_place' },
            { label: 'Segmento activado', value: 'competitor_zone', highlight: true },
            { label: 'Campaña comparativa enviada', value: '→ message' },
            { label: 'Clic a oferta propia', value: '+34% CTR', highlight: true },
          ]}
          accentColor="#f97316"
        />
      ),
    },
    {
      category: 'ACTIVACIONES EN CAMPO',
      title: 'Activa la experiencia de marca en el punto exacto',
      description: 'Lanzamientos de producto, degustaciones, pop-ups temporales. Cada activación física tiene ahora una capa digital que se activa automáticamente cuando alguien llega al espacio, sin necesidad de personal de activación.',
      visual: (
        <MetricsPanelVisual
          stats={[
            { label: 'Personas alcanzadas en zona', value: '1.847', sub: 'en la activación de hoy' },
            { label: 'Tasa de engagement', value: '31%', sub: 'vs 2% del banner digital' },
            { label: 'Costo por contacto', value: '$0.08', sub: 'con contexto físico verificado' },
          ]}
          accentColor="#f97316"
        />
      ),
    },
    {
      category: 'RETARGETING FÍSICO',
      title: 'Retargetea basándote en visitas reales, no en inferencias',
      description: 'Los usuarios que visitaron tu local, tu stand o tu punto de activación forman automáticamente una audiencia verificada. Úsala para campañas de retargeting con la certeza de que estuvieron físicamente presentes.',
      visual: (
        <GeoMapVisual
          zones={[
            { name: 'Pop-up Centro · 100m', status: '234 visitas esta semana' },
            { name: 'Stand Expo · 80m', status: '97 visitas esta semana' },
          ]}
          accentColor="#f97316"
        />
      ),
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Chart />,
      title: 'Conversión más alta',
      description: 'El contexto físico verificado multiplica la relevancia del mensaje y la probabilidad de conversión respecto a la publicidad digital convencional.',
    },
    {
      icon: <BenefitIcon.Shield />,
      title: 'Audiencias de primera calidad',
      description: 'Basadas en presencia real verificada por GPS, no en inferencias de comportamiento digital ni datos de terceros.',
    },
    {
      icon: <BenefitIcon.Link />,
      title: 'Integra con tu stack de marketing',
      description: 'Conecta los eventos de presencia con tu CRM, tu plataforma de email marketing o tu herramienta de automatización vía API.',
    },
    {
      icon: <BenefitIcon.Expand />,
      title: 'Escala con tu campaña',
      description: 'Desde una activación puntual hasta una campaña nacional con cientos de puntos activos simultáneamente.',
    },
  ],
  faq: [
    {
      question: '¿Es necesario tener una app propia para usar Ubyca en campañas?',
      answer: 'No. Ubyca puede integrarse con el navegador del dispositivo del usuario. Si ya tienes una app, también puedes integrar la API directamente en ella.',
    },
    {
      question: '¿Cómo se gestiona la privacidad del usuario?',
      answer: 'El usuario autoriza explícitamente el acceso a su ubicación. Ubyca solo valida si la ubicación está dentro de una zona definida y no almacena trayectorias ni historial de movimiento personal.',
    },
    {
      question: '¿Puedo segmentar por tiempo de permanencia?',
      answer: 'Sí. Puedes configurar reglas que exijan un tiempo mínimo de permanencia antes de activar una campaña, asegurando que el usuario realmente estuvo en el lugar y no simplemente lo atravesó.',
    },
    {
      question: '¿Cuál es la diferencia con geofencing tradicional?',
      answer: 'El geofencing tradicional funciona en el dispositivo (client-side), lo que lo hace fácilmente evasible e impreciso. Ubyca valida la presencia en el servidor, con mayor precisión y sin depender del sistema operativo del dispositivo.',
    },
  ],
}

const education: IndustryData = {
  slug: 'education',
  name: 'Educación',
  shortDesc: 'Transforma espacios en experiencias de aprendizaje',
  accentColor: '#f59e0b',
  meta: {
    title: 'Ubyca para Educación — Aprendizaje contextual geolocalizado',
    description: 'Convierte museos, campus, parques y sitios históricos en entornos de aprendizaje interactivo donde el contenido se activa en cada punto del recorrido.',
  },
  hero: {
    label: 'EDUCACIÓN',
    title: 'Transforma espacios reales en experiencias de aprendizaje',
    subtitle: 'Museos, campus, sitios históricos y parques naturales convertidos en entornos educativos donde el contenido se activa automáticamente en cada punto del recorrido.',
  },
  intro: {
    headline: 'El aprendizaje más potente ocurre en el lugar exacto donde el contenido tiene sentido',
    body: 'Hay una diferencia entre leer sobre la Revolución de Mayo en un libro y estar parado en la Plaza de Mayo mientras escuchas una narración que ubica los eventos exactamente donde ocurrieron. Ubyca sincroniza el contenido educativo con el espacio físico, convirtiendo cada visita en una experiencia de aprendizaje inmersiva.',
  },
  useCases: [
    {
      category: 'MUSEOS INTERACTIVOS',
      title: 'El audio guía que se activa al llegar a cada pieza',
      description: 'Sin pantallas táctiles, sin mapas de sala, sin QR. El visitante simplemente se acerca a una obra o exhibición y el contenido —audio, video, texto enriquecido— se activa automáticamente. La atención se queda en la pieza, no en el dispositivo.',
      visual: (
        <PushNotificationPanel
          brand="Museo Nacional de Historia"
          title="Sala de Arte Colonial — Siglo XVII"
          message="Accede al audio guía de esta sala. Duración: 4 minutos. También disponible en inglés."
          accentColor="#f59e0b"
          eventLabel="entered_zone · Sala 3 · Arte Colonial"
        />
      ),
    },
    {
      category: 'CAMPUS UNIVERSITARIO',
      title: 'Orientación interactiva para nuevos estudiantes',
      description: 'Los nuevos estudiantes descubren el campus de forma autónoma. Al llegar a la biblioteca, al laboratorio o al centro de alumnos, reciben información relevante sobre los servicios, horarios y cómo usar ese espacio.',
      visual: (
        <GeoMapVisual
          zones={[
            { name: 'Biblioteca Central · 60m', status: 'Contenido disponible' },
            { name: 'Laboratorios · 80m', status: 'Próxima parada' },
          ]}
          accentColor="#f59e0b"
        />
      ),
    },
    {
      category: 'RUTAS HISTÓRICAS',
      title: 'La ciudad como aula abierta',
      description: 'Diseña recorridos históricos por el centro de la ciudad donde cada edificio, cada plaza o cada monumento activa el contexto de lo que ocurrió en ese lugar. Historia viva, no historia de manual.',
      visual: (
        <FlowVisual
          steps={[
            { label: 'Alumno llega a monumento histórico', value: 'arrived' },
            { label: 'Módulo de aprendizaje se activa', value: 'unlocked', highlight: true },
            { label: 'Progreso en ruta actualizado', value: '3/8 paradas' },
            { label: 'Evaluación contextual disponible', value: 'ready', highlight: true },
          ]}
          accentColor="#f59e0b"
        />
      ),
    },
    {
      category: 'SEGUIMIENTO DE APRENDIZAJE',
      title: 'Mide el recorrido y el tiempo en cada módulo',
      description: 'Sabe qué partes del recorrido generaron mayor interés (mayor dwell time), qué porcentaje de los alumnos completó la ruta y dónde se produce el abandono. Datos para mejorar el diseño educativo del espacio.',
      visual: (
        <MetricsPanelVisual
          stats={[
            { label: 'Alumnos en ruta ahora', value: '28', sub: 'Clase 3B — Turno mañana' },
            { label: 'Parada con mayor engagement', value: 'Casa Rosada', sub: 'avg. 11 min' },
            { label: 'Rutas completadas esta semana', value: '94%', sub: 'tasa de finalización' },
          ]}
          accentColor="#f59e0b"
        />
      ),
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Star />,
      title: 'Mayor retención del aprendizaje',
      description: 'El aprendizaje contextual —en el lugar donde el contenido tiene sentido— aumenta significativamente la retención respecto al aula convencional.',
    },
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin hardware especializado',
      description: 'No se requieren dispositivos especiales, balizas ni infraestructura adicional. Solo el smartphone que cada alumno o visitante ya lleva consigo.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Métricas de aprendizaje espacial',
      description: 'Tiempo por módulo, zonas de mayor interés, tasas de finalización y patrones de recorrido para optimizar el diseño educativo.',
    },
    {
      icon: <BenefitIcon.Expand />,
      title: 'Escalable a cualquier espacio',
      description: 'Desde un museo pequeño hasta una ruta por toda una ciudad. Agrega o modifica puntos sin tocar infraestructura física.',
    },
  ],
  faq: [
    {
      question: '¿Pueden usar Ubyca alumnos de nivel primario y secundario?',
      answer: 'Sí. La experiencia del usuario es simplemente un enlace o un botón en el navegador del teléfono. No requiere conocimientos técnicos. El docente puede preparar la ruta en Studio y los alumnos la recorren desde sus dispositivos.',
    },
    {
      question: '¿Cómo se comparte la ruta con los alumnos?',
      answer: 'El docente genera un enlace único para el recorrido desde Studio. Ese enlace puede compartirse por WhatsApp, email, QR impreso o cualquier canal. Al abrirlo, el alumno activa el acceso a su ubicación y comienza la experiencia.',
    },
    {
      question: '¿Puede usarse sin conexión a internet?',
      answer: 'La validación de presencia requiere conexión. Sin embargo, el contenido de cada parada puede pre-cargarse cuando hay WiFi disponible para funcionar offline en zonas sin señal.',
    },
    {
      question: '¿Se puede evaluar a los alumnos basándose en el recorrido?',
      answer: 'Ubyca verifica y registra la presencia en cada punto. Puedes usar esos datos para confirmar que el alumno completó el recorrido físico. La evaluación en sí puede integrarse con tu plataforma educativa a través de la API.',
    },
    {
      question: '¿Tiene costo para instituciones educativas?',
      answer: 'Contacta con nuestro equipo para conocer las condiciones para instituciones educativas. Tenemos planes adaptados a museos, universidades y programas de educación pública.',
    },
  ],
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const INDUSTRIES: IndustryData[] = [retail, tourism, events, marketing, education]

export function getIndustry(slug: string): IndustryData | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}
