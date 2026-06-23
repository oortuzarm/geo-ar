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
    'Ubyca define un GeoPoint para cada punto de ingreso o acceso. Cuando la ' +
    'persona llega al área, la presencia se valida en el servidor con su ' +
    'ubicación GPS — no es auto-declarada. El evento de ingreso queda ' +
    'registrado con timestamp y duración de permanencia. Los datos son ' +
    'consultables en Studio y exportables vía API para auditorías, control ' +
    'de asistencia o reportes de acceso. No requiere hardware adicional, ' +
    'lectores de tarjetas ni biometría.',
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
  ],
}
