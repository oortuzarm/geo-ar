import type { UseCase } from '../types'

export const localBusinessProximityPromo: UseCase = {
  id: 'local-business-proximity-promo',
  vertical: 'local-business',
  title: 'Promociones y experiencias por proximidad para negocios locales',
  problem:
    'Un negocio local — taller, restaurante, cafetería, peluquería, farmacia, ' +
    'gimnasio, tienda — quiere activar una promoción, cupón o mensaje especial ' +
    'cuando una persona entra en el radio del local. El objetivo es convertir ' +
    'el tráfico que pasa cerca en interacción real con el negocio.',
  solution:
    'Cuando una persona entra al radio de tu local, puedes mostrarle automáticamente ' +
    'una promoción, cupón o mensaje contextual dentro de tu sitio web o app. ' +
    'Puedes configurarlo con o sin verificación de presencia: con verificación, ' +
    'el beneficio se habilita solo dentro del radio; sin verificación, funciona como ' +
    'capa informativa geolocalizada disponible para cualquiera que la abra cerca. ' +
    'Ubyca no envía notificaciones push automáticas: la activación ocurre cuando ' +
    'el usuario ya está cerca e interactúa con la experiencia. Sin app nativa ' +
    'para el cliente final.',
  capabilities: ['geopoints', 'presence', 'analytics', 'studio'],
  matchKeywords: [
    // Tipos de negocio (señal débil, suman en combinación)
    'taller', 'taller de autos', 'taller mecánico',
    'restaurante', 'cafetería', 'peluquería', 'farmacia', 'gimnasio',
    'negocio local', 'local comercial', 'comercio local', 'tienda local',
    'pequeño comercio', 'mi negocio', 'mi local',
    // Patrones de proximidad (señal fuerte, multi-palabra)
    'pasen cerca', 'pasan cerca', 'pasar cerca',
    'cerca del local', 'cerca de mi local', 'cerca del negocio', 'cerca de mi negocio',
    'al pasar por', 'al pasar cerca', 'cuando pasen', 'cuando pasan',
    'personas que pasan', 'gente que pasa', 'clientes que pasan',
    'tráfico cerca', 'gente cerca', 'clientes cerca', 'gente alrededor',
    // Patrones de promoción/captación (señal fuerte)
    'enviar promociones', 'mostrar oferta', 'mostrar promoción', 'mostrar ofertas',
    'ofertas cerca', 'oferta al pasar', 'oferta por cercanía', 'oferta por proximidad',
    'promoción por proximidad', 'activar cupón', 'cupón por cercanía', 'cupón al pasar',
    'captar clientes', 'atraer clientes', 'captar clientes cerca',
    'mensaje al pasar', 'contenido al pasar', 'promoción al pasar',
    'campaña de proximidad', 'marketing de proximidad', 'promociones cuando pasen',
  ],
}

export const localBusinessFootfall: UseCase = {
  id: 'local-business-footfall',
  vertical: 'local-business',
  title: 'Medición de tráfico peatonal alrededor del local',
  problem:
    'Un negocio quiere entender cuánta gente pasa cerca del local, cuánta ' +
    'entra efectivamente y en qué horarios hay más afluencia — para optimizar ' +
    'su estrategia comercial, horarios de atención o decisiones de apertura ' +
    'de sucursales.',
  solution:
    'Puedes medir cuánta gente entra al radio de tu local, en qué horarios hay ' +
    'más afluencia y cuánto tiempo permanecen en promedio — datos que los sistemas ' +
    'de caja no capturan. Ves las visitas en tiempo real desde Studio y comparas ' +
    'el comportamiento entre períodos. Los datos son exportables vía API a tu ' +
    'sistema de gestión.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
  matchKeywords: [
    'tráfico peatonal', 'afluencia', 'cuánta gente pasa', 'cuántos entran',
    'gente que pasa por fuera', 'personas afuera del local',
    'atraer personas cercanas', 'análisis de tráfico local',
    'medir gente cerca', 'comportamiento peatonal',
    'horarios de mayor tráfico', 'pico de tráfico',
    'flujo externo', 'tráfico alrededor', 'tráfico exterior',
    'cuántos entran al local', 'cuántos pasan por el frente',
  ],
}

export const localBusinessContextualMessage: UseCase = {
  id: 'local-business-contextual-message',
  vertical: 'local-business',
  title: 'Mensajes y contenido contextual según la ubicación del usuario',
  problem:
    'Una organización quiere mostrar información, mensajes o experiencias ' +
    'diferentes según dónde está físicamente el usuario: un mensaje distinto ' +
    'al llegar a la sucursal, al barrio, al punto de servicio o a la zona ' +
    'comercial correspondiente.',
  solution:
    'Puedes mostrar información, mensajes o experiencias diferentes según en qué ' +
    'zona o sucursal esté el usuario — automáticamente, sin que tenga que ' +
    'seleccionar su ubicación. Configúralo con o sin verificación de presencia: ' +
    'con verificación, el contenido aparece solo dentro del área; sin verificación, ' +
    'funciona como capa informativa geolocalizada disponible sin exigir presencia ' +
    'física. Funciona sin app nativa, desde cualquier navegador web.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
  matchKeywords: [
    'contenido contextual', 'mensaje contextual', 'información contextual',
    'cambiar mensaje según zona', 'cambiar contenido por zona',
    'contenido según ubicación', 'mensaje según ubicación',
    'mostrar información al llegar', 'contenido al llegar',
    'experiencia por proximidad', 'mensaje por proximidad',
    'información según donde estoy', 'contenido por zona',
    'experiencia contextual', 'personalizar por ubicación',
    'activar contenido por zona', 'información al acercarme',
    'mensaje al acercarse', 'contenido al acercarse',
  ],
}
