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
    'Sí. Puedes saber exactamente cuántas personas interactuaron con tu campaña, ' +
    'desde qué ubicaciones, cuánto tiempo permanecieron y en qué horarios — con ' +
    'datos reales, no estimaciones. El contenido (video, landing, cupón) se activa ' +
    'solo cuando el usuario está físicamente en el punto de campaña. Puede ' +
    'implementarse con Smart Proxy sobre una URL existente o validación vía API. ' +
    'El resultado: no un flyer que circula sin control, sino datos reales de alcance físico.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
  matchKeywords: [
    'campaña de marca', 'activación de marca', 'brand activation',
    'marketing geolocalizado', 'campaña física', 'campaña físico-digital',
    'contenido de campaña por ubicación', 'activar campaña en punto',
    // Medición y evaluación de campañas en terreno
    'campaña en terreno', 'si la campaña funcionó', 'resultados de campaña',
    'evaluar campaña', 'medir campaña', 'rendimiento de campaña',
    'si funcionó la campaña', 'medir activación', 'evaluar activación',
    // Demostrar que una activación presencial generó interacción
    'activación presencial', 'activacion presencial',
    'generó interacción', 'genero interaccion',
    'si generó interacción', 'si genero interaccion',
    'demostrar que funcionó', 'demostrar que funciono',
    'demostrar interacción', 'demostrar interaccion',
    'campaña generó interacción', 'campana genero interaccion',
    // Efectividad y resultados de campañas — lenguaje comercial (Tarea 3)
    'campaña generó resultados', 'campana genero resultados',
    'demostrar resultados', 'demostrar impacto',
    'medir impacto', 'medir efectividad',
    'campaña funcionó', 'campana funciono',
    'campaña exitosa', 'campana exitosa',
    'activación exitosa', 'activacion exitosa',
    // Vocabulario adicional — campañas presenciales con impacto
    'campaña presencial', 'campana presencial',
    'tuvo impacto', 'si tuvo impacto',
    'activación funcionó', 'activacion funciono',
    'si tuvo resultados',
  ],
  subIntentions: [
    {
      id: 'medir-resultados-campana',
      patterns: [
        'medir impacto', 'medir efectividad', 'medir campaña', 'medir campana',
        'medir activación', 'medir activacion',
        'evaluar campaña', 'evaluar campana',
        'evaluar activación', 'evaluar activacion',
        'si la campaña funcionó', 'si la campana funciono',
        'campaña funcionó', 'campana funciono',
        'rendimiento de campaña', 'rendimiento de campana',
        'activación de marca', 'activacion de marca',
      ],
      solution:
        'Sí. Puedes medir exactamente cuántas personas interactuaron con la campaña, desde ' +
        'qué ubicaciones físicas, cuánto tiempo permanecieron y en qué horarios — con datos ' +
        'reales de presencia, no estimaciones de alcance ni impresiones. Los datos son ' +
        'exportables y permiten calcular el costo por interacción real.',
    },
    {
      id: 'demostrar-resultados-campana',
      patterns: [
        'demostrar resultados', 'demostrar impacto',
        'demostrar que funcionó', 'demostrar que funciono',
        'demostrar interacción', 'demostrar interaccion',
        'campaña generó resultados', 'campana genero resultados',
        'campaña generó interacción', 'campana genero interaccion',
        'generó interacción', 'genero interaccion',
        'activación presencial', 'activacion presencial',
      ],
      solution:
        'Sí. Puedes demostrar con datos auditables cuántas personas participaron en la ' +
        'activación: desde qué puntos físicos, en qué horarios y cuánto tiempo estuvieron ' +
        'presentes. No son estimaciones — son registros de presencia real, exportables vía ' +
        'API y presentables a clientes o stakeholders como evidencia concreta.',
    },
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
    'Puedes garantizar que el material exclusivo de tu lanzamiento solo sea ' +
    'accesible dentro del punto de venta, durante el horario configurado — ' +
    'no antes, no fuera del área, no compartido fuera del local. El contenido ' +
    'simplemente no funciona si el usuario no está físicamente donde corresponde. ' +
    'Los datos de activación te muestran el alcance real del lanzamiento punto por punto.',
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
    'Puedes crear una experiencia donde el contenido cambia automáticamente según ' +
    'en qué estación se encuentre el participante — sin QR, sin código, sin nadie ' +
    'en el punto. Al llegar a cada área, el contenido correspondiente aparece ' +
    'directamente en el teléfono. Desde Studio puedes ver en tiempo real cuántos ' +
    'participantes están en cada estación y cuál genera más permanencia.',
  capabilities: ['geopoints', 'presence', 'analytics', 'live-visits'],
  matchKeywords: [
    'experiencia inmersiva', 'experiencia de marca', 'experiencia interactiva',
    'activación experiencial', 'recorrido de marca', 'instalación de marca',
    'dinámica geolocalizada', 'pop-up geolocalizado', 'experiencia en punto',
  ],
}
