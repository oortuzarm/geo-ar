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
    'Ubyca crea un GeoPoint alrededor del local con el radio que definas. ' +
    'Cuando una persona entra en esa zona, la experiencia del negocio puede ' +
    'mostrar una promoción, habilitar un cupón o activar un mensaje contextual. ' +
    'Puedes configurarlo con o sin desbloqueo por presencia: con desbloqueo activo, ' +
    'el beneficio se activa solo al estar dentro del radio; sin desbloqueo, el ' +
    'contenido funciona como capa informativa geolocalizada sin exigir presencia. ' +
    'Ubyca no envía notificaciones push automáticas: la activación ocurre dentro ' +
    'de la experiencia web o de app del negocio, no como mensaje enviado al ' +
    'dispositivo. Funciona sin app nativa para el cliente final.',
  capabilities: ['geopoints', 'presence', 'analytics', 'studio'],
  matchKeywords: [
    // Tipos de negocio (señal débil, suman en combinación)
    'taller', 'taller de autos', 'taller mecánico',
    'restaurante', 'cafetería', 'peluquería', 'farmacia', 'gimnasio', 'tienda',
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
    'Ubyca define un GeoPoint que abarca el área del local y su entorno. ' +
    'Registra cuántas personas entran al radio definido, cuánto tiempo permanecen ' +
    'y cómo se distribuye el tráfico por horario y día de la semana. Puedes ver ' +
    'visitas en tiempo real desde Studio y comparar el comportamiento entre ' +
    'períodos. Los datos son exportables vía API al sistema de gestión del negocio.',
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
    'Ubyca define zonas distintas con contenido o mensajes asociados a cada una. ' +
    'Al entrar en una zona, el mensaje o información relevante para esa ubicación ' +
    'se activa en el dispositivo del usuario sin que tenga que seleccionarlo ' +
    'manualmente. La experiencia puede configurarse con o sin desbloqueo: con ' +
    'desbloqueo, el contenido aparece solo dentro del área; sin desbloqueo, ' +
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
