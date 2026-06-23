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
    'Puedes registrar automáticamente quién ingresó a una ubicación, a qué hora ' +
    'y cuánto tiempo permaneció — sin hardware adicional, sin lectores de tarjetas ' +
    'ni biometría. La presencia se valida en el servidor con GPS, no es auto-declarada ' +
    'ni puede falsificarse. Los datos son exportables vía API para auditorías, ' +
    'control de asistencia o reportes de acceso.',
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
    // Verificar que alguien realmente estuvo en un lugar (Q6)
    'estuvo en un lugar', 'alguien estuvo en',
    'comprobar que estuvo', 'realmente estuvo',
    'verificar que estuvo', 'validar que estuvo',
    'confirmar que estuvo', 'comprobar presencia',
  ],
}
