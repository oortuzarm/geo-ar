import type { BusinessGoal } from './types'

export const goalMarketing: BusinessGoal = {
  id: 'goal-marketing',
  title: 'Marketing geolocalizado y campañas físico-digitales',
  matchKeywords: [
    'hacer marketing', 'quiero hacer marketing',
    'estrategia de marketing', 'acciones de marketing',
    'marketing digital', 'marketing para mi negocio',
    'marketing territorial', 'marketing con ubicación',
    'campaña de marketing', 'campaña de publicidad',
    'hacer una campaña', 'lanzar una campaña',
    'promocionar mi negocio', 'promocionar negocio',
    'publicidad para mi negocio', 'dar a conocer mi negocio',
    'llegar a mis clientes', 'comunicarme con clientes',
    'promoción geolocalizada', 'campañas de proximidad',
  ],
  solution:
    'Ubyca convierte la ubicación física en el disparador de una campaña. ' +
    'Puedes activar contenido, cupones, videos o mensajes solo cuando el consumidor ' +
    'está físicamente en un punto definido — punto de venta, evento, zona comercial. ' +
    'GeoPoints delimita las zonas de la campaña. Smart Proxies activa el contenido ' +
    'digital al detectar presencia. Analytics mide cuántas personas activaron ' +
    'la campaña desde cada punto, cuánto tiempo permanecieron y desde qué horarios. ' +
    'El resultado es marketing medible, vinculado a presencia física real, ' +
    'no a clics o impresiones.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
}

export const goalAttractCustomers: BusinessGoal = {
  id: 'goal-attract-customers',
  title: 'Atraer clientes y generar tráfico al local',
  matchKeywords: [
    'atraer más clientes', 'atraer nuevos clientes',
    'captar nuevos clientes', 'conseguir más clientes',
    'generar más tráfico', 'aumentar visitas al local',
    'más clientes al local', 'aumentar afluencia',
    'que vengan más clientes', 'que entren más personas',
    'cómo conseguir más clientes', 'cómo atraer personas',
    'convertir tráfico en clientes', 'más personas que entren',
    'atraer personas al local', 'captar personas cercanas',
  ],
  solution:
    'Ubyca activa experiencias y contenido cuando una persona entra en el radio ' +
    'de tu local o punto de interés. Puedes mostrar una promoción, un mensaje ' +
    'de bienvenida o un beneficio exclusivo que motive la interacción. ' +
    'Ubyca no envía notificaciones push automáticas: la activación ocurre cuando ' +
    'el usuario ya está cerca e interactúa con la experiencia web o la app del negocio. ' +
    'Los datos de tráfico — cuántas personas entraron, en qué horarios y cuánto ' +
    'permanecieron — quedan disponibles en Analytics para entender el comportamiento ' +
    'real y optimizar la estrategia de captación.',
  capabilities: ['geopoints', 'presence', 'analytics', 'smart-proxies'],
}

export const goalIncreaseSales: BusinessGoal = {
  id: 'goal-increase-sales',
  title: 'Aumentar ventas con presencia física y experiencias geolocalizadas',
  matchKeywords: [
    'vender más', 'aumentar ventas', 'incrementar ventas',
    'más ventas', 'impulsar ventas', 'mejorar ventas',
    'quiero vender más', 'cómo vendo más',
    'aumentar mis ventas', 'subir las ventas',
    'incrementar conversión', 'aumentar conversión',
    'mejorar mis resultados comerciales',
    'más ingresos', 'generar más ingresos',
    'mejorar el rendimiento comercial',
  ],
  solution:
    'Ubyca contribuye a las ventas conectando la presencia física del cliente con ' +
    'acciones comerciales en el momento adecuado. Cuando alguien está físicamente ' +
    'en tu punto de venta o zona de influencia, puedes activar una promoción ' +
    'exclusiva, contenido de producto o un cupón de descuento. ' +
    'La combinación de GeoPoints, Smart Proxies y Analytics permite medir qué ' +
    'zonas y horarios generan más activaciones, y ajustar la estrategia con ' +
    'datos reales de comportamiento en el local. ' +
    'Ubyca proporciona la infraestructura para vincular presencia física con ' +
    'incentivos de compra — los resultados dependen de la estrategia comercial de cada negocio.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
}

export const goalInteractiveGame: BusinessGoal = {
  id: 'goal-interactive-game',
  title: 'Juegos geolocalizados y experiencias interactivas en terreno',
  matchKeywords: [
    'juego', 'hacer un juego', 'quiero hacer un juego',
    'crear un juego', 'puedo hacer un juego',
    'juego geolocalizado', 'juego en terreno', 'juego en el mapa',
    'juego al aire libre', 'juego urbano', 'juego interactivo',
    'gymkhana', 'yincana', 'gimkana',
    'caza del tesoro', 'cazatesoros', 'búsqueda del tesoro',
    'juego de pistas', 'pistas geolocalizadas',
    'trivial geolocalizado', 'quiz en terreno',
    'dinámica al aire libre', 'dinámica en terreno',
    'actividad interactiva', 'actividad en terreno',
    'desafío geolocalizado', 'desafío en terreno',
    'competencia geolocalizada', 'competencia en terreno',
    'experiencia interactiva en terreno',
    'recorrido con desafíos', 'recorrido gamificado',
    // Analogía Pokémon GO
    'pokémon go', 'pokemon go', 'parecido a pokémon', 'tipo pokémon go',
    'similar a pokemon', 'juego tipo pokemon', 'como pokemon',
  ],
  solution:
    'Ubyca proporciona la capa de validación y activación geolocalizada que ' +
    'necesita cualquier juego o dinámica en terreno. Define GeoPoints en los ' +
    'puntos del mapa que forman parte del juego: estaciones, desafíos, pistas o ' +
    'coleccionables. Cuando un participante llega a cada punto, tu aplicación ' +
    'puede desbloquear el siguiente desafío, revelar una pista, acumular puntos ' +
    'o verificar que completó la etapa — todo validado en el servidor, sin que ' +
    'el participante pueda simular su ubicación desde casa. ' +
    'Funciona para gymkhanas, cazatesoros, juegos urbanos, dinámicas de grupo, ' +
    'circuitos gamificados y cualquier experiencia donde llegar físicamente ' +
    'a un punto específico sea la condición para avanzar.',
  capabilities: ['geopoints', 'presence', 'api', 'analytics'],
}

export const businessGoals: BusinessGoal[] = [
  goalMarketing,
  goalAttractCustomers,
  goalIncreaseSales,
  goalInteractiveGame,
]
