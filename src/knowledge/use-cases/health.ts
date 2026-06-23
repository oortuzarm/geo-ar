import type { UseCase } from '../types'

export const healthHomeVisits: UseCase = {
  id: 'health-home-visits',
  vertical: 'health',
  title: 'Verificación de visitas domiciliarias de salud',
  problem:
    'Un prestador de salud (clínica, mutual, seguro médico) envía enfermeros, ' +
    'kinesiólogos o asistentes sociales a domicilios. No hay forma de verificar ' +
    'que el profesional llegó al domicilio correcto, a qué hora llegó y cuánto ' +
    'tiempo estuvo — sin depender de reportes manuales que pueden falsificarse.',
  solution:
    'Puedes verificar objetivamente que el profesional llegó al domicilio correcto, ' +
    'a qué hora y cuánto tiempo estuvo — sin depender de partes manuales. El ' +
    'historial de cada visita (hora de llegada, tiempo de permanencia) queda ' +
    'disponible para auditoría y facturación, y es exportable vía API al sistema ' +
    'de gestión de turnos o historia clínica.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'visita domiciliaria', 'enfermero a domicilio', 'kinesiología domiciliaria',
    'asistente social', 'técnico en domicilio', 'profesional en terreno',
    'atención domiciliaria', 'servicio a domicilio', 'prestación en domicilio',
  ],
}

export const healthFieldWorkers: UseCase = {
  id: 'health-field-workers',
  vertical: 'health',
  title: 'Control de personal de salud en terreno',
  problem:
    'Un organismo de salud pública o una red de atención primaria tiene ' +
    'agentes sanitarios, promotores de salud o vacunadores que recorren ' +
    'comunidades o zonas asignadas. No hay forma de verificar la cobertura ' +
    'real sin depender de registros en papel.',
  solution:
    'Puedes verificar la cobertura real de tus agentes sanitarios en terreno — ' +
    'cuándo estuvieron en cada zona, con qué frecuencia y cuánto tiempo — sin ' +
    'depender de registros en papel. El coordinador ve la cobertura real desde ' +
    'Studio y exporta los datos a los sistemas de reporte del organismo.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'agente sanitario', 'promotor de salud', 'vacunador', 'agente comunitario',
    'salud pública en terreno', 'cobertura sanitaria', 'ronda sanitaria',
    'personal de salud en campo', 'atención primaria en terreno',
  ],
}

export const healthOutpatient: UseCase = {
  id: 'health-outpatient',
  vertical: 'health',
  title: 'Verificación de presencia en centros de atención ambulatoria',
  problem:
    'Una clínica u hospital quiere verificar que los pacientes o profesionales ' +
    'que acceden a ciertos servicios (rehabilitación, diálisis, quimioterapia) ' +
    'estuvieron físicamente presentes en la sesión, para cumplimiento y ' +
    'facturación a aseguradoras.',
  solution:
    'Puedes acreditar que el paciente o profesional estuvo físicamente presente ' +
    'en la sesión de atención, con hora exacta y duración — respaldo confiable ' +
    'para auditorías y facturación a aseguradoras. El historial de sesiones es ' +
    'exportable vía API al sistema de gestión clínica existente.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'centro de salud', 'clínica', 'hospital', 'rehabilitación',
    'sesión presencial médica', 'verificar asistencia médica',
    'paciente presente', 'auditoría de prestaciones', 'facturación médica',
  ],
}
