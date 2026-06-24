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
    'Puedes registrar la asistencia automáticamente cuando el alumno llega al ' +
    'campus o aula — sin pasar lista y sin que el alumno pueda declarar una ' +
    'presencia que no ocurrió. La verificación es en el servidor, no es ' +
    'auto-declarada. Puedes definir ventanas horarias por materia o turno y ' +
    'exportar el historial al sistema académico existente.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    // Patrones inequívocos de educación (multi-palabra = 2pts)
    'registro de asistencia', 'control de asistencia',
    'registrar asistencia', 'controlar asistencia',
    'gestionar asistencia', 'validar asistencia',
    'asistencia de alumnos', 'asistencia escolar',
    'asistencia universitaria', 'asistencia estudiantil',
    'asistencia en clases', 'asistencia en clase',
    'asistencia en campus', 'asistencia de estudiantes',
    'presencia de estudiantes', 'presencia de alumnos',
    'alumno presente', 'pasar lista',
    // Entidades educativas (single-palabra, señal fuerte)
    'campus universitario',
    'escuela', 'universidad', 'colegio',
    'estudiante', 'alumno',
    // NOTA: 'asistencia' bare fue eliminado — era demasiado amplio y
    // causaba colisiones con gimnasios, sucursales y contextos comerciales.
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
    'Puedes mostrar información contextual distinta según en qué edificio o sector ' +
    'del campus se encuentre el alumno: horario de laboratorios al llegar a ciencias, ' +
    'recursos al llegar a biblioteca, trámites al llegar a administración. Cada zona ' +
    'debe ser un edificio o área exterior de al menos 30-50 metros — en campus ' +
    'abiertos el GPS funciona con buena precisión. La distinción entre salas o pisos ' +
    'dentro de un mismo edificio no es fiable con GPS.',
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
    'Puedes verificar que cada estudiante llegó a los puntos del recorrido y ' +
    'permaneció el tiempo mínimo requerido — sin fotos ni informes que pueden ' +
    'falsificarse. La verificación es en el servidor, no auto-declarada. El ' +
    'docente ve el historial completo en Studio o lo consulta vía API.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'salida pedagógica', 'trabajo de campo', 'excursión escolar',
    'visita educativa', 'recorrido de campo', 'actividad fuera del aula',
  ],
}
