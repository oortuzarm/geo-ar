import React from 'react'
import {
  RetailEntryVisual,
  RetailLoyaltyVisual,
  RetailCompetitorVisual,
  RetailAnalyticsVisual,
} from './visuals/RetailVisuals'
import {
  TourismContentVisual,
  TourismRouteVisual,
  TourismDwellVisual,
  TourismAnalyticsVisual,
} from './visuals/TourismVisuals'
import {
  EventsEntryVisual,
  EventsZoneVisual,
  EventsDwellVisual,
  EventsAnalyticsVisual,
} from './visuals/EventsVisuals'
import {
  MarketingActivationVisual,
  MarketingDwellVisual,
  MarketingCompetitorVisual,
  MarketingAnalyticsVisual,
} from './visuals/MarketingVisuals'
import {
  EducationAudioVisual,
  EducationRouteVisual,
  EducationDwellVisual,
  EducationAnalyticsVisual,
} from './visuals/EducationVisuals'

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
  hero?: {
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
    description: 'Crea rutas turísticas interactivas donde el contenido se activa al llegar a cada punto. Ideal para destinos, museos, parques naturales y patrimonio cultural.',
  },
  intro: {
    headline: 'El lugar tiene la historia. Ubyca activa el momento.',
    body: 'Los destinos turísticos invierten en contenido que el visitante nunca llega a ver porque no sabe que existe o porque el contexto ya pasó. Ubyca sincroniza el contenido con la ubicación del visitante: el audio que corresponde, el video correcto, la información exacta. Todo en el momento en que está parado frente al lugar.',
  },
  useCases: [
    {
      category: 'ACTIVACIÓN EN PUNTO DE INTERÉS',
      title: 'El contenido se activa al llegar al lugar',
      description: 'Define el radio de cada punto de interés en Studio. Cuando el visitante llega al área, Ubyca activa automáticamente el contenido asignado: audio, video, información o un botón de acción. Sin escanear códigos. Sin buscar en mapas. El lugar es el activador.',
      visual: <TourismContentVisual />,
    },
    {
      category: 'RUTAS CON PARADAS DESBLOQUEABLES',
      title: 'Cada parada del recorrido tiene su propio contenido',
      description: 'Crea un recorrido con múltiples puntos de interés y asocia contenido diferente a cada uno. El visitante avanza por la ruta y recibe lo que corresponde exactamente al llegar a cada lugar. Sin instrucciones previas. Sin abrir mapas adicionales.',
      visual: <TourismRouteVisual />,
    },
    {
      category: 'PERMANENCIA MÍNIMA',
      title: 'Contenido que se desbloquea después de estar en el lugar',
      description: 'Algunos contenidos tienen más valor cuando el visitante ya lleva un rato en el lugar. Configura una permanencia mínima —por ejemplo, 3 minutos— y Ubyca solo activa el video o el audio si el visitante realmente se detuvo. No al pasar. No de camino.',
      visual: <TourismDwellVisual />,
    },
    {
      category: 'INTELIGENCIA DE VISITA',
      title: 'Entiende cómo se mueve el visitante por el recorrido',
      description: 'Studio muestra cuántos dispositivos están activos en cada punto del recorrido y cuánto tiempo permanecen en cada parada. Datos para mejorar la señalización, redistribuir recursos y optimizar la experiencia sin encuestas ni estimaciones.',
      visual: <TourismAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin apps que instalar',
      description: 'El visitante accede desde el navegador de su teléfono. Sin fricciones de descarga, compatible con cualquier dispositivo móvil.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Cualquier tipo de contenido',
      description: 'Audio, video, PDF, sitio web o WhatsApp. Configura la acción que mejor se adapta a cada punto del recorrido.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Datos del flujo turístico',
      description: 'Permanencia por punto de interés, horarios de mayor afluencia y tasas de recorrido completado para optimizar la experiencia.',
    },
    {
      icon: <BenefitIcon.Expand />,
      title: 'Escala sin infraestructura',
      description: 'Agrega o modifica puntos de interés sin instalar nada en el espacio. Todo se configura desde Studio en minutos.',
    },
  ],
  faq: [
    {
      question: '¿Funciona en zonas sin cobertura de datos?',
      answer: 'La validación de presencia requiere conexión a internet. En zonas sin señal, el contenido puede pre-cargarse cuando el visitante tiene cobertura y estar disponible de forma local durante el recorrido.',
    },
    {
      question: '¿Se puede configurar una ruta con paradas en un orden específico?',
      answer: 'Sí. Puedes definir que cada parada solo se desbloquea al llegar al área correspondiente, o permitir que el visitante recorra libremente y reciba el contenido de cada punto cuando llegue.',
    },
    {
      question: '¿Cómo accede el visitante a la ruta?',
      answer: 'El organizador genera un enlace desde Studio. El visitante lo abre en su navegador, autoriza la ubicación y comienza. Sin descargas adicionales.',
    },
    {
      question: '¿Funciona para audio guías en museos?',
      answer: 'Sí. Cada punto puede tener asociado un archivo de audio. Cuando el visitante entra en el radio del punto, el audio se activa automáticamente desde el navegador.',
    },
    {
      question: '¿Cuántos puntos puede tener una ruta?',
      answer: 'No hay un límite técnico en la cantidad de GeoPoints por proyecto. Puedes crear recorridos cortos de 3 paradas o rutas extensas con decenas de puntos de interés.',
    },
  ],
}

const events: IndustryData = {
  slug: 'events',
  name: 'Eventos',
  shortDesc: 'Activa contenido en cada zona del recinto sin hardware adicional',
  accentColor: '#10b981',
  meta: {
    title: 'Ubyca para Eventos — Experiencias geolocalizadas por zona del recinto',
    description: 'Activa contenido diferente en cada zona del evento, valida presencia en sesiones y mide el comportamiento espacial de los asistentes en tiempo real. Sin beacons ni infraestructura.',
  },
  intro: {
    headline: 'El evento ocurre en un espacio físico. La experiencia también puede serlo.',
    body: 'Los eventos reúnen personas en un lugar durante un tiempo definido. Cada zona del recinto, cada stand y cada sesión es una oportunidad de activar contenido relevante en el momento exacto. Ubyca conecta el espacio con la experiencia, sin hardware adicional y sin que el asistente instale nada.',
  },
  useCases: [
    {
      category: 'ACTIVACIÓN AL INGRESAR AL RECINTO',
      title: 'Activa la bienvenida cuando el asistente llega al evento',
      description: 'Define el perímetro del recinto en Studio. Cuando un dispositivo entra en esa área, Ubyca activa automáticamente la experiencia: el programa del día, un botón para abrir el mapa del recinto o un acceso directo al WhatsApp del equipo de producción. Sin registro en puerta. Sin QR.',
      visual: <EventsEntryVisual />,
    },
    {
      category: 'CONTENIDO POR ZONA',
      title: 'Cada zona del evento activa su propio contenido',
      description: 'Define áreas específicas dentro del recinto —un escenario, un stand, una sala— y configura qué experiencia se activa en cada una. El contenido del patrocinador aparece solo en su zona. El material de la sesión aparece solo en esa sala. Sin fricciones para el asistente.',
      visual: <EventsZoneVisual />,
    },
    {
      category: 'PERMANENCIA EN SESIÓN',
      title: 'Desbloquea el material solo si el asistente estuvo presente',
      description: 'Configura una permanencia mínima para cada sesión. Si el asistente estuvo el tiempo suficiente, Ubyca activa automáticamente el acceso al material: la presentación, un archivo descargable o un enlace. La presencia es el requisito, no un formulario.',
      visual: <EventsDwellVisual />,
    },
    {
      category: 'INTELIGENCIA DE RECINTO',
      title: 'Visualiza en tiempo real cómo se distribuye el recinto',
      description: 'Studio muestra cuántos dispositivos están activos en cada zona del evento, el tiempo de permanencia promedio y los horarios de mayor concentración. Datos para el equipo de producción sin instalar sensores ni infraestructura adicional.',
      visual: <EventsAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin hardware',
      description: 'No se necesitan balizas, torniquetes ni lectores. La presencia GPS del dispositivo es suficiente para activar contenido en cada zona.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Métricas por zona',
      description: 'Cada área del evento entrega datos reales de visitantes, permanencia y comportamiento para el equipo de producción y los patrocinadores.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Contenido contextual',
      description: 'El asistente recibe lo que corresponde a su zona actual, en el momento en que está ahí. No una notificación genérica enviada a todos.',
    },
    {
      icon: <BenefitIcon.Link />,
      title: 'Integración con tus sistemas',
      description: 'Conecta los eventos de presencia con tu plataforma de gestión de eventos vía API o webhook.',
    },
  ],
  faq: [
    {
      question: '¿Funciona en espacios cerrados como salas de conferencia?',
      answer: 'Sí, con precisión variable según la estructura del edificio. El GPS funciona en la mayoría de recintos. Para espacios muy cerrados o con paredes de gran espesor, Ubyca puede combinarse con mecanismos de activación complementarios.',
    },
    {
      question: '¿Los patrocinadores tienen acceso a los datos de sus zonas?',
      answer: 'Puedes generar reportes por zona con métricas agregadas: dispositivos únicos, tiempo promedio de permanencia y distribución horaria. Los datos son agregados y no incluyen información personal de los asistentes.',
    },
    {
      question: '¿Cuántos asistentes simultáneos puede gestionar?',
      answer: 'El motor de presencia está diseñado para escalar. Para eventos de gran magnitud, conversemos sobre la arquitectura específica y los volúmenes esperados.',
    },
    {
      question: '¿Cómo acceden los asistentes a la experiencia?',
      answer: 'El organizador comparte un enlace previo al evento —por email, en la app o mediante QR en la entrada. El asistente lo abre en su navegador, autoriza la ubicación y la experiencia comienza de forma automática.',
    },
    {
      question: '¿Se puede limitar la activación por horario?',
      answer: 'Sí. Cada GeoPoint puede configurarse con días y horarios específicos de activación. Una sala solo activa contenido durante la sesión correspondiente, por ejemplo.',
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
    description: 'Alcanza a tu audiencia en el momento en que están físicamente en el lugar correcto. Campañas basadas en presencia real, con métricas de impacto verificables.',
  },
  intro: {
    headline: 'La ubicación es el momento de mayor intención.',
    body: 'No hay segmentación más precisa que saber que alguien está físicamente en un lugar en este momento. Ubyca te permite activar campañas cuando las personas están exactamente donde corresponde: en una activación de marca, cerca de un punto de venta o en la zona de un competidor.',
  },
  useCases: [
    {
      category: 'ACTIVACIONES DE MARCA',
      title: 'Activa tu campaña cuando las personas están en el lugar',
      description: 'Define la zona de tu activación —un pop-up, un lanzamiento, un punto de venta— y Ubyca activa automáticamente tu campaña cuando un dispositivo entra en esa área. Un mensaje, un botón con tu oferta o un enlace directo a WhatsApp. Sin personal de activación en campo.',
      visual: <MarketingActivationVisual />,
    },
    {
      category: 'PERMANENCIA MÍNIMA',
      title: 'Activa contenido exclusivo solo si el tiempo justifica el mensaje',
      description: 'Configura una condición de permanencia mínima para separar quienes pasan de largo de quienes realmente se detienen. Solo cuando el dispositivo está el tiempo suficiente dentro de la zona, Ubyca activa el contenido exclusivo. Mayor relevancia, menor desperdicio de impacto.',
      visual: <MarketingDwellVisual />,
    },
    {
      category: 'ZONAS DE CONQUISTA',
      title: 'Activa tu propuesta cuando alguien está en la zona de un competidor',
      description: 'Define las áreas de tus principales competidores en Studio. Cuando un dispositivo entra en esa zona, Ubyca activa automáticamente tu experiencia: un mensaje con tu propuesta diferencial y un botón directo. El momento de influir es antes de que se tome la decisión.',
      visual: <MarketingCompetitorVisual />,
    },
    {
      category: 'MEDICIÓN DE PRESENCIA',
      title: 'Mide el alcance real de cada activación en campo',
      description: 'Studio muestra cuántos dispositivos estuvieron dentro de cada zona, durante cuánto tiempo y en qué horarios. Datos reales de presencia física para reportes de campaña sin depender de impresiones estimadas ni fuentes de terceros.',
      visual: <MarketingAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.Shield />,
      title: 'Alcance verificado',
      description: 'Cada contacto registrado corresponde a una presencia física real en la zona, no a una estimación de audiencia basada en comportamiento digital.',
    },
    {
      icon: <BenefitIcon.Map />,
      title: 'Sin segmentación demográfica',
      description: 'La ubicación es el criterio de activación. No se requieren cookies, datos de comportamiento digital ni información de terceros.',
    },
    {
      icon: <BenefitIcon.Link />,
      title: 'Integración con tu stack',
      description: 'Conecta los eventos de presencia con tu CRM, plataforma de automatización o herramienta de reporting vía API.',
    },
    {
      icon: <BenefitIcon.Clock />,
      title: 'Activaciones con horario y cupo',
      description: 'Configura ventanas de tiempo, permanencia mínima y cupos de activación para cada campaña desde Studio.',
    },
  ],
  faq: [
    {
      question: '¿Es necesario tener una app propia para activar campañas?',
      answer: 'No. Ubyca puede funcionar desde el navegador del dispositivo. Si ya tienes una app, también puedes integrar la API directamente en ella.',
    },
    {
      question: '¿Cómo se gestiona el consentimiento del usuario?',
      answer: 'El usuario autoriza explícitamente el acceso a su ubicación en el momento de activar la experiencia. Ubyca solo valida si el dispositivo está dentro de una zona definida y no almacena trayectorias ni historial de movimiento individual.',
    },
    {
      question: '¿Puedo configurar una activación temporal, por ejemplo solo durante tres días?',
      answer: 'Sí. Cada GeoPoint puede tener una fecha de inicio y término, días de la semana y horarios específicos de activación. Una campaña puede estar activa únicamente durante el período que defines.',
    },
    {
      question: '¿Cuál es la diferencia con geofencing convencional?',
      answer: 'El geofencing convencional valida en el dispositivo, lo que lo hace impreciso y evasible. Ubyca valida en el servidor, con mayor precisión y consistencia entre dispositivos y sistemas operativos.',
    },
    {
      question: '¿Puedo medir conversiones de una campaña de presencia?',
      answer: 'Si integras tu sistema de ventas o tu plataforma de marketing vía API, puedes cruzar los eventos de presencia con conversiones. Ubyca entrega los datos de presencia; la lógica de conversión vive en tu sistema.',
    },
  ],
}

const education: IndustryData = {
  slug: 'education',
  name: 'Educación',
  shortDesc: 'Activa contenido educativo cuando el participante llega al lugar',
  accentColor: '#f59e0b',
  meta: {
    title: 'Ubyca para Educación — Aprendizaje contextual geolocalizado',
    description: 'Convierte museos, campus y sitios históricos en recorridos donde el contenido educativo se activa automáticamente en cada punto. Sin apps. Sin QR.',
  },
  intro: {
    headline: 'El contenido educativo más efectivo ocurre donde tiene sentido.',
    body: 'Hay una diferencia entre leer sobre un sitio histórico en un libro y estar parado frente a él mientras escuchas el contexto de lo que ocurrió ahí. Ubyca sincroniza el contenido educativo con el espacio físico, convirtiendo cada recorrido en una experiencia de aprendizaje contextual.',
  },
  useCases: [
    {
      category: 'CONTENIDO POR UBICACIÓN',
      title: 'El contenido educativo se activa al llegar al lugar',
      description: 'Define el radio de cada punto del recorrido en Studio. Cuando el dispositivo llega al área, Ubyca activa automáticamente el contenido asignado: audio, video, documento o un enlace. Sin escanear códigos. Sin buscar en el teléfono. El lugar es el activador.',
      visual: <EducationAudioVisual />,
    },
    {
      category: 'RECORRIDOS POR PARADAS',
      title: 'Cada parada del recorrido tiene su propio módulo de contenido',
      description: 'Crea un recorrido con múltiples puntos y asocia contenido educativo diferente a cada parada. Museos, campus, sitios históricos o barrios convertidos en rutas de aprendizaje donde el contenido llega en el momento y el lugar exactos.',
      visual: <EducationRouteVisual />,
    },
    {
      category: 'PERMANENCIA EN EL LUGAR',
      title: 'El material se desbloquea después de estar el tiempo suficiente',
      description: 'Configura una permanencia mínima para asegurar que la persona realmente estuvo en el espacio antes de recibir el material. El recurso se activa solo si el dispositivo permaneció el tiempo definido dentro del área. No al pasar.',
      visual: <EducationDwellVisual />,
    },
    {
      category: 'SEGUIMIENTO DEL RECORRIDO',
      title: 'Sabe cuántos participantes están activos y cuánto dedican a cada parada',
      description: 'Studio muestra cuántos dispositivos están activos en el recorrido y el tiempo promedio de permanencia en cada punto. Datos para mejorar el diseño del recorrido, identificar las paradas de mayor interés y optimizar el tiempo total.',
      visual: <EducationAnalyticsVisual />,
    },
  ],
  benefits: [
    {
      icon: <BenefitIcon.NoApp />,
      title: 'Sin apps ni hardware',
      description: 'El participante accede desde el navegador de su teléfono. Sin instalaciones. Sin dispositivos prestados. Sin infraestructura en el espacio.',
    },
    {
      icon: <BenefitIcon.Star />,
      title: 'Cualquier tipo de contenido',
      description: 'Audio, video, PDF, sitio web. Asocia el formato que mejor se adapta a cada punto del recorrido.',
    },
    {
      icon: <BenefitIcon.Chart />,
      title: 'Datos del recorrido',
      description: 'Permanencia por parada, dispositivos activos y distribución horaria para optimizar el diseño educativo del espacio.',
    },
    {
      icon: <BenefitIcon.Expand />,
      title: 'Sin infraestructura física',
      description: 'Agrega o modifica puntos del recorrido sin instalar balizas ni pantallas en el espacio. Todo desde Studio.',
    },
  ],
  faq: [
    {
      question: '¿Cómo accede el participante al recorrido?',
      answer: 'El organizador genera un enlace desde Studio y lo comparte por cualquier canal —WhatsApp, email, código QR impreso. El participante lo abre en su navegador, autoriza la ubicación y comienza el recorrido.',
    },
    {
      question: '¿Funciona para grupos grandes, como grupos escolares?',
      answer: 'Sí. No hay límite de participantes simultáneos en un mismo recorrido. Cada dispositivo es independiente y recibe el contenido de forma individual al llegar a cada punto.',
    },
    {
      question: '¿Puede usarse en espacios cerrados como museos?',
      answer: 'Sí, con precisión variable según la estructura del edificio. Para la mayoría de museos y espacios cubiertos, el GPS ofrece la precisión suficiente para distinguir entre zonas o salas adyacentes.',
    },
    {
      question: '¿Funciona sin conexión a internet?',
      answer: 'La validación de presencia requiere conexión. El contenido puede pre-cargarse cuando hay señal para funcionar en zonas con conectividad limitada.',
    },
    {
      question: '¿Cuántos puntos puede tener un recorrido?',
      answer: 'No hay un límite técnico en la cantidad de GeoPoints por proyecto. Puedes crear recorridos cortos de 3 paradas o rutas extensas con decenas de puntos.',
    },
  ],
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const INDUSTRIES: IndustryData[] = [retail, tourism, events, marketing, education]

export function getIndustry(slug: string): IndustryData | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}
