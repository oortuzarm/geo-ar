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
    'Ubyca crea un GeoPoint para cada domicilio de atención. Cuando el profesional ' +
    'llega al domicilio, el sistema verifica su presencia GPS en el servidor. ' +
    'El historial registra hora exacta de llegada y tiempo de permanencia por visita. ' +
    'Los datos son exportables vía API al sistema de gestión de turnos o historia ' +
    'clínica del prestador para auditoría y facturación.',
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
    'Ubyca define zonas geográficas o puntos de cobertura asignados a cada ' +
    'agente. El sistema registra cuándo cada agente estuvo en su zona, con ' +
    'qué frecuencia y cuánto tiempo. El coordinador puede ver la cobertura ' +
    'real desde Studio y exportar los datos a los sistemas de reporte del organismo.',
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
    'Ubyca define un GeoPoint para cada sala o área de atención. La presencia ' +
    'se verifica cuando el paciente o profesional llega al área. El historial ' +
    'de sesiones con timestamp y dwell time es exportable vía API al sistema ' +
    'de gestión clínica para respaldo de auditorías de prestaciones.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
  matchKeywords: [
    'centro de salud', 'clínica', 'hospital', 'rehabilitación',
    'sesión presencial médica', 'verificar asistencia médica',
    'paciente presente', 'auditoría de prestaciones', 'facturación médica',
  ],
}
