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
    'Una universidad o colegio quiere ofrecer información contextual ' +
    'según en qué sector del campus se encuentre el alumno: qué edificio ' +
    'visitó, qué facultad o cuál es el área de servicios más cercana.',
  solution:
    'Ubyca define un GeoPoint por edificio o sector del campus. Al llegar ' +
    'al edificio de ciencias puede mostrar el horario de laboratorios; en ' +
    'la biblioteca, los recursos y catálogos disponibles; en administración, ' +
    'los trámites online. Cada zona es un edificio o área exterior de al ' +
    'menos 30-50 metros: el GPS outdoor sobre un campus abierto funciona con ' +
    'buena precisión. La activación de contenido por sala o piso dentro de ' +
    'un mismo edificio no es fiable con GPS.',
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
