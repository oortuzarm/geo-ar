import type { UseCase } from '../types'

export const geolocationARExperience: UseCase = {
  id: 'geolocated-ar-experience',
  vertical: 'geolocated-experiences',
  title: 'Experiencias geolocalizadas: realidad aumentada, mapas interactivos y contenido por puntos',
  problem:
    'Un desarrollador, agencia o creativo quiere construir una experiencia — ' +
    'realidad aumentada, mapa interactivo, contenido enriquecido — que funcione ' +
    'solo en ubicaciones específicas del mapa. El contenido o la experiencia ' +
    'no debe activarse desde cualquier lugar, sino únicamente donde el creador ' +
    'lo defina.',
  solution:
    'Sí. Puedes habilitar o bloquear funciones de tu aplicación según si el usuario ' +
    'está físicamente en una ubicación específica. Tu app consulta la API de Ubyca ' +
    'antes de mostrar el contenido, y el servidor valida la presencia real — no el ' +
    'GPS autogestionado del dispositivo. Funciona para cualquier tipo de funcionalidad ' +
    'que deba estar disponible solo en un lugar: contenido geolocalizado, acceso a zonas, ' +
    'experiencias interactivas o realidad aumentada. El resultado es una experiencia ' +
    'que literalmente funciona solo donde tú lo definas.',
  capabilities: ['geopoints', 'presence', 'api', 'smart-proxies'],
  matchKeywords: [
    'realidad aumentada', 'realidad aumentada geolocalizada',
    'RA geolocalizada', 'AR geolocalizado',
    'mapa interactivo', 'mapa enriquecido', 'contenido en mapa',
    'experiencia geolocalizada', 'experiencia por puntos',
    'activar experiencia', 'experiencia en territorio',
    'solo en los lugares', 'funcione solo en', 'solo donde yo quiera',
    'contenido por mapa', 'app de mapa', 'experiencia de mapa',
    'WebXR', 'A-Frame', 'capa AR', 'activar AR',
    'puntos en el mapa', 'definir puntos en mapa',
    'experiencia que funcione en ubicaciones',
    // Lenguaje natural — juegos y dinámicas
    'gymkhana', 'yincana', 'gimkana',
    'caza del tesoro', 'cazatesoros', 'búsqueda del tesoro',
    'juego de pistas', 'pistas geolocalizadas',
    'trivial geolocalizado', 'quiz geolocalizado',
    'contenido desbloqueado por ubicación',
    'app que funcione en puntos del mapa',
    // Funciones de app disponibles solo por ubicación (Q11)
    'aplicación móvil', 'usuario esté físicamente',
    'funciones geolocalizadas', 'habilitar funciones por ubicación',
    'solo cuando el usuario esté', 'funciones por ubicación',
    'app con geolocalización', 'funciones disponibles en un lugar',
    // App que activa contenido solo al llegar a un lugar (Q8)
    'solo cuando alguien llegue', 'aparezcan solo cuando',
    'ciertas cosas aparezcan', 'llegue a un lugar específico',
    'llegue a un lugar especifico', 'alguien llegue a un lugar',
    'cosas aparezcan por ubicación', 'cosas aparezcan por ubicacion',
    'tengo una app y quiero', 'app y quiero que',
    // Vocabulario adicional — apps existentes integrando Ubyca
    'ya tengo una app',
    'qué agrega ubyca', 'que agrega ubyca',
    // Desbloquear contenido por ubicación
    'desbloquear contenido', 'desbloquear por ubicación',
    'desbloquear por ubicacion', 'desbloquear al llegar',
    'únicamente cuando llegue', 'unicamente cuando llegue',
    'persona llegue a una ubicación', 'persona llegue a una ubicacion',
    'contenido desbloqueado', 'acceso desbloqueado por ubicación',
  ],
  subIntentions: [
    {
      id: 'app-trigger-ubicacion',
      patterns: [
        'solo cuando alguien llegue', 'aparezcan solo cuando',
        'ciertas cosas aparezcan', 'llegue a un lugar específico',
        'llegue a un lugar especifico', 'alguien llegue a un lugar',
        'tengo una app y quiero', 'app y quiero que',
        'solo cuando el usuario esté', 'funciones por ubicación',
        'funciones por ubicacion', 'habilitar funciones por ubicación',
        'funciones disponibles en un lugar',
        // Desbloquear contenido por ubicación
        'desbloquear contenido', 'desbloquear al llegar',
        'únicamente cuando llegue', 'unicamente cuando llegue',
        'persona llegue a una ubicación', 'persona llegue a una ubicacion',
      ],
      solution:
        'La diferencia clave con usar el GPS del dispositivo directamente: Ubyca valida en ' +
        'el servidor, no en el teléfono. El usuario no puede manipular la coordenada ni simular ' +
        'estar en un lugar. Además, cada validación queda registrada con timestamp y duración — ' +
        'historial auditable que el GPS del dispositivo no genera. Si lo que necesitas es ' +
        'confirmar que alguien realmente estuvo en un lugar y durante cuánto tiempo, eso no ' +
        'se puede resolver solo con el GPS del dispositivo.',
    },
    {
      id: 'experiencia-geolocalizada',
      patterns: [
        'realidad aumentada', 'mapa interactivo', 'contenido en mapa',
        'experiencia geolocalizada', 'experiencia por puntos',
        'activar experiencia', 'gymkhana', 'yincana',
        'caza del tesoro', 'juego de pistas',
        'WebXR', 'capa AR', 'experiencia que funcione en ubicaciones',
      ],
      solution:
        'Sí. Puedes construir experiencias — realidad aumentada, mapas interactivos, ' +
        'dinámicas por puntos — que funcionan únicamente en las ubicaciones que definas. ' +
        'El contenido no aparece fuera del área, no puede compartirse ni accederse desde ' +
        'otro lugar. Funciona sin app nativa instalada: cualquier navegador puede validar ' +
        'la presencia a través de la API.',
    },
  ],
}
