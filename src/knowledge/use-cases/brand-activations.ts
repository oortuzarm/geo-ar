import type { UseCase } from '../types'

export const brandActivationCampaign: UseCase = {
  id: 'brand-activation-campaign',
  vertical: 'brand-activations',
  title: 'Campaña físico-digital activada por presencia',
  problem:
    'Una marca quiere lanzar una campaña donde el contenido — video de lanzamiento, ' +
    'landing con beneficio, formulario de registro — solo se activa cuando el ' +
    'consumidor está físicamente en un punto de venta, evento o espacio específico. ' +
    'Sin esto, el contenido digital se distribuye sin control y pierde el vínculo ' +
    'con la experiencia física.',
  solution:
    'Ubyca define zonas sobre los puntos de la campaña. El contenido digital ' +
    '(video, landing, cupón) se activa solo cuando el usuario está físicamente ' +
    'en el área. Puede usarse Smart Proxy sobre una URL existente o validación ' +
    'vía API. Ubyca registra cuántas personas activaron el contenido desde cada ' +
    'punto, cuánto tiempo permanecieron y desde qué horarios. Eso convierte la ' +
    'campaña en datos medibles, no en un flyer que circula sin control.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
  matchKeywords: [
    'campaña de marca', 'activación de marca', 'brand activation',
    'marketing geolocalizado', 'campaña física', 'campaña físico-digital',
    'contenido de campaña por ubicación', 'activar campaña en punto',
  ],
}

export const brandActivationLaunch: UseCase = {
  id: 'brand-activation-launch',
  vertical: 'brand-activations',
  title: 'Lanzamiento de producto geoactivado en punto de venta',
  problem:
    'Una marca lanza un nuevo producto y quiere que el material exclusivo — ' +
    'unboxing, video del producto, descuento de lanzamiento — solo sea accesible ' +
    'para clientes que estén físicamente en el punto de venta durante la ' +
    'ventana de lanzamiento.',
  solution:
    'Ubyca activa el acceso al material de lanzamiento solo cuando el cliente ' +
    'está en el radio del punto de venta. Puedes definir la ventana horaria ' +
    'del lanzamiento directamente en el GeoPoint. El link de contenido no ' +
    'funciona fuera del área ni fuera del horario configurado, lo que mantiene ' +
    'la exclusividad. Los datos de activación permiten medir el alcance real ' +
    'del lanzamiento punto por punto.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
  matchKeywords: [
    'lanzamiento de producto', 'material de lanzamiento', 'exclusivo en punto de venta',
    'launch presencial', 'descuento de lanzamiento', 'experiencia de lanzamiento',
    'nuevo producto en tienda', 'activar contenido en PDV',
  ],
}

export const brandActivationExperience: UseCase = {
  id: 'brand-activation-experience',
  vertical: 'brand-activations',
  title: 'Experiencia experiencial geolocalizada',
  problem:
    'Una agencia o marca organiza una experiencia inmersiva donde el contenido ' +
    'cambia según en qué zona física se encuentre el participante: diferentes ' +
    'mensajes, videos o dinámicas por punto del recorrido.',
  solution:
    'Ubyca define un GeoPoint por estación de la experiencia. Al llegar a cada ' +
    'punto, el contenido correspondiente se activa automáticamente en el teléfono ' +
    'del participante — sin QR, sin código, sin personal en el punto. Desde ' +
    'Studio puedes ver en tiempo real cuántos participantes están en cada ' +
    'estación y cuál tiene más permanencia.',
  capabilities: ['geopoints', 'presence', 'analytics', 'live-visits'],
  matchKeywords: [
    'experiencia inmersiva', 'experiencia de marca', 'experiencia interactiva',
    'activación experiencial', 'recorrido de marca', 'instalación de marca',
    'dinámica geolocalizada', 'pop-up geolocalizado', 'experiencia en punto',
  ],
}
