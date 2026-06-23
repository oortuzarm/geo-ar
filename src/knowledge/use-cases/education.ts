import type { UseCase } from '../types'

export const educationAttendance: UseCase = {
  id: 'education-attendance',
  vertical: 'education',
  title: 'Registro de asistencia sin pasar lista',
  problem:
    'Una institución educativa necesita registrar que los alumnos están ' +
    'físicamente en el aula o campus. El proceso manual de pasar lista ' +
    'consume tiempo de clase y es fácilmente manipulable. Las soluciones ' +
    'con lectores de tarjetas o biometría son costosas.',
  solution:
    'Ubyca registra automáticamente la asistencia cuando el alumno llega ' +
    'al área del campus o aula. La presencia se verifica en el servidor ' +
    'con la ubicación GPS del dispositivo — no es auto-declarada. Puedes ' +
    'definir ventanas horarias por materia o turno y exportar el historial ' +
    'de asistencia vía API a tu sistema académico.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'asistencia', 'registro de asistencia', 'control de asistencia',
    'alumno presente', 'pasar lista', 'campus universitario',
    'escuela', 'universidad', 'colegio', 'estudiante',
  ],
}

export const educationCampusExperience: UseCase = {
  id: 'education-campus-experience',
  vertical: 'education',
  title: 'Experiencias de campus activadas por ubicación',
  problem:
    'Una universidad o colegio quiere ofrecer información contextual o ' +
    'actividades según dónde se encuentre el alumno en el campus: ' +
    'biblioteca, laboratorio, cafetería o aula específica.',
  solution:
    'Ubyca activa contenido diferente por zona del campus. En la biblioteca ' +
    'puede mostrar los recursos disponibles; en el laboratorio, el manual ' +
    'de seguridad; en la cafetería, el menú del día. Cada zona tiene su ' +
    'GeoPoint con contenido asociado que se activa al llegar, sin app ' +
    'nativa requerida.',
  capabilities: ['geopoints', 'presence', 'smart-proxies'],
  matchKeywords: [
    'campus digital', 'experiencia universitaria', 'contenido en aula',
    'orientación en campus', 'información contextual universidad',
    'biblioteca digital por ubicación',
  ],
}

export const educationFieldTrips: UseCase = {
  id: 'education-field-trips',
  vertical: 'education',
  title: 'Verificación de presencia en salidas pedagógicas',
  problem:
    'Un docente organiza una salida pedagógica o trabajo de campo y ' +
    'necesita verificar que los estudiantes visitaron los puntos del ' +
    'recorrido, sin depender de fotos o informes que pueden falsificarse.',
  solution:
    'Ubyca registra cuándo cada estudiante llegó a cada punto del recorrido ' +
    'y cuánto tiempo permaneció. La verificación es en el servidor, no ' +
    'auto-declarada. El docente puede ver el historial completo en Studio ' +
    'o consultarlo vía API. Se puede requerir una permanencia mínima antes ' +
    'de marcar el punto como visitado.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'salida pedagógica', 'trabajo de campo', 'excursión escolar',
    'visita educativa', 'recorrido de campo', 'actividad fuera del aula',
  ],
}
