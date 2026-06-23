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
    'Sí. Puedes vincular tus campañas de marketing a la presencia física real ' +
    'de tus clientes: el contenido, cupón o mensaje solo se activa cuando el consumidor ' +
    'está físicamente en el punto de venta, evento o zona comercial que definas. ' +
    'Mides cuántas personas activaron la campaña desde cada punto, cuánto tiempo ' +
    'permanecieron y en qué horarios. El resultado es marketing medible en términos ' +
    'de presencia real, no de clics o impresiones.',
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
    'Cuando alguien entra al radio de tu local o punto de interés, puedes mostrarle ' +
    'automáticamente una promoción, mensaje de bienvenida o beneficio exclusivo ' +
    'que motive la interacción. La activación ocurre dentro de tu sitio web o app ' +
    'cuando el usuario ya está cerca — Ubyca no envía notificaciones push automáticas. ' +
    'Los datos de tráfico — cuántas personas entraron, en qué horarios y cuánto ' +
    'permanecieron — quedan disponibles para optimizar tu estrategia de captación.',
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
    'Cuando un cliente está físicamente en tu punto de venta, puedes activar ' +
    'una promoción exclusiva, contenido de producto o un cupón de descuento ' +
    'en ese momento. Puedes medir qué zonas y horarios generan más activaciones ' +
    'y ajustar la estrategia con datos reales de comportamiento en el local. ' +
    'Ubyca vincula la presencia física con el incentivo de compra — los resultados ' +
    'dependen de la estrategia comercial de cada negocio.',
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
    'Sí. Puedes construir juegos, gymkhanas, cazatesoros o dinámicas donde los ' +
    'participantes deben estar físicamente en cada punto para avanzar — sin que ' +
    'puedan simular la ubicación desde casa. Tu aplicación desbloquea el siguiente ' +
    'desafío, revela la pista o acumula los puntos solo cuando el usuario llega al ' +
    'área real. Funciona para juegos urbanos, circuitos gamificados, recorridos con ' +
    'desafíos y cualquier dinámica donde la presencia física sea la condición para avanzar.',
  capabilities: ['geopoints', 'presence', 'api', 'analytics'],
}

export const businessGoals: BusinessGoal[] = [
  goalMarketing,
  goalAttractCustomers,
  goalIncreaseSales,
  goalInteractiveGame,
]
