import type { UseCase } from '../types'

export const presenceRegistration: UseCase = {
  id: 'presence-registration',
  vertical: 'access-control',
  title: 'Registro de ingreso y validación de presencia en una ubicación',
  problem:
    'Una organización necesita registrar que una persona llegó a un lugar ' +
    'específico — con la hora exacta de llegada y el tiempo de permanencia — ' +
    'sin depender de partes manuales, sin hardware de acceso y sin posibilidad ' +
    'de que el usuario falsifique su presencia.',
  solution:
    'Sí. Puedes saber con certeza si una persona llegó a un lugar, cuándo llegó ' +
    'y cuánto tiempo permaneció — sin que esa persona pueda declararlo por sí sola ' +
    'ni falsificarlo. La validación ocurre en el servidor. Ese dato habilita tres ' +
    'casos: verificar que alguien cumplió una visita o ronda asignada, registrar ' +
    'asistencia automáticamente sin pasar lista, o usar la presencia física como ' +
    'condición para habilitar acceso a algo. Los datos son exportables vía API ' +
    'para auditorías o integración con sistemas existentes.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    // Registro de ingreso (señal fuerte)
    'registro de ingreso', 'registro de acceso', 'registro de llegada',
    'registro de presencia', 'registro de personas', 'registrar ingreso',
    'registrar ingreso de personas', 'ingreso de personas', 'ingreso a un lugar',
    'quién ingresó', 'quiénes ingresaron', 'hora de ingreso', 'hora de llegada',
    // Validación y control (señal fuerte)
    'validación de asistencia', 'validar llegada', 'validar asistencia',
    'comprobar asistencia', 'confirmar llegada', 'confirmar asistencia',
    'control de ingreso', 'control de acceso por ubicación',
    'auditoría de accesos', 'auditoría de ingresos',
    // Check-in
    'check-in geolocalizado', 'check-in por GPS', 'check-in sin hardware',
    'registro sin hardware', 'acceso sin hardware',
    // Personas llegando
    'personas que ingresan', 'cuando llega la persona', 'validar que llegó',
    // Verificar que alguien realmente estuvo en un lugar
    'estuvo en un lugar', 'alguien estuvo en',
    'comprobar que estuvo', 'realmente estuvo',
    'verificar que estuvo', 'validar que estuvo',
    'confirmar que estuvo', 'comprobar presencia',
    // Presencia física, control de acceso y registro de visitas (Tarea 4)
    'llegó físicamente', 'llego fisicamente',
    'presencia física', 'presencia fisica',
    'registrar visitas', 'registro de visitas',
    'registrar visitas en terreno',
    'control de acceso', 'acceso por ubicación', 'acceso por ubicacion',
    'controlar acceso', 'acceso usando ubicación', 'acceso usando ubicacion',
    'llegó al lugar', 'llego al lugar',
  ],
  subIntentions: [
    {
      id: 'validar-llegada',
      patterns: [
        'llegó físicamente', 'llego fisicamente',
        'llegó al lugar', 'llego al lugar',
        'estuvo en un lugar', 'alguien estuvo en',
        'comprobar que estuvo', 'realmente estuvo',
        'verificar que estuvo', 'validar que estuvo',
        'confirmar que estuvo', 'validar llegada',
        'confirmar llegada', 'validar asistencia',
      ],
      solution:
        'Sí. Puedes verificar si una persona llegó físicamente a una ubicación determinada ' +
        '— con la hora exacta de llegada y el tiempo que permaneció. La validación ocurre en ' +
        'el servidor con GPS; no es auto-declarada ni puede falsificarse. Los datos son ' +
        'exportables vía API para auditorías o reportes de asistencia.',
    },
    {
      id: 'registrar-visitas',
      patterns: [
        'registrar visitas', 'registrar visitas en terreno',
        'registro de visitas', 'registro de ingreso',
        'registrar ingreso', 'registro de llegada',
        'quién ingresó', 'hora de ingreso',
      ],
      solution:
        'Sí. Puedes registrar visitas en terreno automáticamente — con fecha, hora exacta y ' +
        'duración de permanencia — sin partes manuales ni declaraciones del equipo. Cada ' +
        'visita queda registrada cuando la persona llega al punto asignado. Los datos son ' +
        'exportables para control de gestión o auditorías.',
    },
    {
      id: 'controlar-acceso',
      patterns: [
        'controlar acceso', 'control de acceso',
        'acceso usando ubicación', 'acceso usando ubicacion',
        'acceso por ubicación', 'acceso por ubicacion',
        'comprobar presencia', 'presencia física', 'presencia fisica',
      ],
      solution:
        'Sí. Puedes usar la ubicación como condición para habilitar o restringir acceso a ' +
        'contenido, recursos o zonas. Tu sistema consulta la API de Ubyca para verificar si ' +
        'la persona está físicamente dentro del área autorizada antes de conceder el acceso ' +
        '— sin hardware adicional, sin QR, sin tarjetas de proximidad.',
    },
  ],
}
