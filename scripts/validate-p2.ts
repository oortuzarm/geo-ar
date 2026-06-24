import { matchSolution, auditMatch, normalize } from '../src/knowledge/solutionMatcher'
import { knowledge } from '../src/knowledge/index'

function activatedKeywords(keywords: string[], query: string): string[] {
  const lower = normalize(query)
  return keywords.filter(k => lower.includes(normalize(k)))
}

const allCandidates = [
  ...knowledge.useCases.map(uc => ({ id: uc.id, type: 'UseCase', keywords: uc.matchKeywords })),
  ...knowledge.businessGoals.map(g => ({ id: g.id, type: 'Goal', keywords: g.matchKeywords })),
  ...knowledge.faqs.map(f => ({ id: f.id, type: 'FAQ', keywords: f.questionPatterns })),
]

function run(label: string, questions: Array<{ id: string; q: string; expectedId?: string; shouldNeverBe?: string }>) {
  console.log(`\n═══════════════════════════════════════════════════════════`)
  console.log(`  ${label}`)
  console.log(`═══════════════════════════════════════════════════════════\n`)

  let pass = 0
  let fail = 0

  for (const { id, q, expectedId, shouldNeverBe } of questions) {
    const audit = auditMatch(q)
    const actualId = audit.winner?.id ?? 'FALLBACK'
    const cand = allCandidates.find(c => c.id === actualId)
    const activated = cand ? activatedKeywords(cand.keywords, q) : []

    let verdict = '✅'
    let reason = ''

    if (expectedId && actualId !== expectedId) {
      verdict = '❌'
      reason = ` → esperado: ${expectedId}`
      fail++
    } else if (shouldNeverBe && actualId === shouldNeverBe) {
      verdict = '❌'
      reason = ` → no debe ser: ${shouldNeverBe}`
      fail++
    } else {
      pass++
    }

    console.log(`${verdict} ${id} | match=${actualId} score=${audit.winner?.score ?? 0}${reason}`)
    console.log(`   Q: "${q}"`)
    if (activated.length) console.log(`   Keys: ${activated.map(k => `"${k}"`).join(', ')}`)
    if (audit.top3.length > 1) console.log(`   Top3: ${audit.top3.map(c => `${c.id}(${c.score})`).join(', ')}`)
    console.log()
  }

  console.log(`Resultado: ${pass}/${pass + fail} ✅`)
  return fail
}

// ── VALIDACIONES COMERCIALES (no deben ir a educación) ─────────────────────────
const comercial = [
  { id: 'C1', q: 'Tengo una cadena de gimnasios y quiero medir asistencia',                         expectedId: 'goal-gyms' },
  { id: 'C2', q: '¿Cómo aumenta la asistencia a mis gimnasios?',                                    expectedId: 'goal-gyms' },
  { id: 'C3', q: 'Quiero entender qué sedes reciben más personas',                                   expectedId: 'goal-gyms', shouldNeverBe: 'education-attendance' },
  { id: 'C4', q: '¿Cómo comparo la asistencia entre sucursales?',                                   expectedId: 'goal-franchises' },
  { id: 'C5', q: 'Tengo varios locales y quiero medir concurrencia',                                expectedId: 'goal-retail-stores' },
  { id: 'C6', q: 'Quiero saber qué gimnasio tiene más actividad',                                   expectedId: 'goal-gyms' },
  { id: 'C7', q: '¿Cómo medir asistencia de clientes?',                                             shouldNeverBe: 'education-attendance' },
]

// ── VALIDACIONES EDUCACIÓN (deben seguir llegando a education) ──────────────────
const educacion = [
  { id: 'E1', q: '¿Cómo registrar asistencia de alumnos?',          expectedId: 'education-attendance' },
  { id: 'E2', q: '¿Cómo controlar asistencia en clases?',            expectedId: 'education-attendance' },
  { id: 'E3', q: '¿Cómo validar asistencia en un campus?',           expectedId: 'education-attendance' },
  { id: 'E4', q: '¿Cómo registrar presencia de estudiantes?',        expectedId: 'education-attendance' },
  { id: 'E5', q: '¿Cómo gestionar asistencia escolar?',              expectedId: 'education-attendance' },
]

// ── REGRESIÓN 50 preguntas originales ──────────────────────────────────────────
const original50: Array<{ id: string; q: string; expectedId?: string }> = [
  { id: 'Q01', q: 'Quiero saber cuáles de mis sucursales están rindiendo mejor antes de decidir dónde abrir la próxima', expectedId: 'goal-decision-making' },
  { id: 'Q02', q: 'Necesito evidencia real para justificar una inversión en una nueva zona' },
  { id: 'Q03', q: 'Tenemos 12 locales y no sé cuáles generan más valor' },
  { id: 'Q04', q: 'Cómo decido si expandirme a una ciudad nueva sin tomar un riesgo ciego' },
  { id: 'Q05', q: 'Mi directorio me pide datos concretos sobre el rendimiento de cada punto de venta' },
  { id: 'Q06', q: 'Quiero saber si mis vendedores realmente visitan los clientes o solo reportan que lo hacen', expectedId: 'field-sales-visits' },
  { id: 'Q07', q: 'Necesito comparar el rendimiento de mis locales para saber cuáles necesitan intervención', expectedId: 'goal-decision-making' },
  { id: 'Q08', q: 'Cómo mido si una campaña de descuentos generó tráfico real a la tienda', expectedId: 'goal-attract-customers' },
  { id: 'Q09', q: 'Quiero saber en qué horarios hay más personas en mis tiendas para ajustar al equipo de ventas', expectedId: 'goal-retail-stores' },
  { id: 'Q10', q: 'Necesito demostrarle al dueño que nuestras acciones comerciales realmente generan visitas' },
  { id: 'Q11', q: 'Lancé una activación en tres puntos de venta y no sé cuánta gente realmente participó' },
  { id: 'Q12', q: 'Quiero mostrarle una promoción especial solo a los clientes que están en el local en ese momento', expectedId: 'retail-promotion' },
  { id: 'Q13', q: 'Cómo demuestro el ROI de una campaña presencial a mi directorio', expectedId: 'brand-activation-campaign' },
  { id: 'Q14', q: 'Quiero que cuando alguien llegue a mi tienda le aparezca automáticamente una oferta del día', expectedId: 'local-business-proximity-promo' },
  { id: 'Q15', q: 'Necesito saber cuánto tiempo pasan las personas en cada zona de mis eventos para mejorarlos', expectedId: 'goal-events' },
  { id: 'Q16', q: 'Mis técnicos deben hacer rondas de mantenimiento y necesito saber si realmente fueron a cada punto', expectedId: 'field-sales-supervision' },
  { id: 'Q17', q: 'Tengo personal distribuido en distintas zonas y no tengo forma de verificar que cumplieron su ruta' },
  { id: 'Q18', q: 'Necesito auditar si los agentes sanitarios cubrieron todas las zonas asignadas esta semana' },
  { id: 'Q19', q: 'Quiero saber si mis repartidores pasaron por todos los puntos de entrega con la hora exacta', expectedId: 'field-sales-delivery' },
  { id: 'Q20', q: 'Cómo registro de forma confiable que un inspector municipal hizo su recorrido completo', expectedId: 'municipalities-inspection' },
  { id: 'Q21', q: 'Quiero saber cuánta gente entra a mi tienda y en qué horas hay más movimiento', expectedId: 'goal-retail-stores' },
  { id: 'Q22', q: 'Cómo hago para que una promoción especial solo funcione dentro del local', expectedId: 'retail-promotion' },
  { id: 'Q23', q: 'Quiero entender cuánto tiempo pasan mis clientes en la tienda', expectedId: 'goal-retail-stores' },
  { id: 'Q24', q: 'Tengo una tienda física y también un sitio web, quiero saber si los que visitan el sitio también vinieron al local', expectedId: 'goal-retail-stores' },
  { id: 'Q25', q: 'Cómo atraigo a las personas que pasan por la puerta de mi local', expectedId: 'local-business-proximity-promo' },
  { id: 'Q26', q: 'Quiero saber en qué horarios se concentra más la asistencia en cada sede', shouldNeverBe: 'education-attendance' },
  { id: 'Q27', q: 'Necesito comparar la frecuencia de asistencia entre mis diferentes gimnasios', expectedId: 'goal-gyms' },
  { id: 'Q28', q: 'Cómo detecto qué sedes tienen baja asistencia para tomar acción antes de que sea un problema', shouldNeverBe: 'education-attendance' },
  { id: 'Q29', q: 'Quiero dar beneficios a los socios según cuántas veces vinieron al gimnasio este mes', expectedId: 'goal-gyms' },
  { id: 'Q30', q: 'Necesito saber si mis campañas de retención están generando más visitas presenciales' },
  { id: 'Q31', q: 'Quiero saber cuál de mis locales recibe más tráfico en la hora del almuerzo', expectedId: 'spatial-concentration' },
  { id: 'Q32', q: 'Necesito comparar el flujo de personas entre mis diferentes restaurantes', expectedId: 'goal-restaurants' },
  { id: 'Q33', q: 'Cómo sé si mi campaña de descuentos de lunes generó más visitas que el lunes anterior' },
  { id: 'Q34', q: 'Quiero mostrar una oferta especial solo cuando el cliente esté cerca del restaurante' },
  { id: 'Q35', q: 'Necesito demostrar a mis inversores que la nueva sucursal está generando el tráfico proyectado' },
  { id: 'Q36', q: 'Quiero saber qué zonas del mall tienen más tráfico y en qué horarios', expectedId: 'goal-shopping-centers' },
  { id: 'Q37', q: 'Necesito comparar el flujo de personas entre el sector A y el sector B para negociar rentas' },
  { id: 'Q38', q: 'Cómo sé cuáles son los pasillos y sectores más y menos visitados de mi centro comercial', expectedId: 'goal-shopping-centers' },
  { id: 'Q39', q: 'Quiero ver en tiempo real cuánta gente hay en cada piso o zona del mall', expectedId: 'faq-indoor' },
  { id: 'Q40', q: 'Necesito generar un reporte de afluencia por zona para presentar a los locatarios', expectedId: 'goal-shopping-centers' },
  { id: 'Q41', q: 'Quiero saber cuántas personas visitaron mi sala de ventas esta semana y cuánto tiempo estuvieron', expectedId: 'goal-real-estate' },
  { id: 'Q42', q: 'Cómo mido el interés real en cada uno de mis proyectos inmobiliarios', expectedId: 'goal-real-estate' },
  { id: 'Q43', q: 'Quiero que los planos y precios se activen automáticamente cuando un interesado llega al proyecto', expectedId: 'real-estate-open-house' },
  { id: 'Q44', q: 'Necesito comparar cuántas visitas recibió cada sala de ventas sin depender del reporte del ejecutivo', expectedId: 'goal-real-estate' },
  { id: 'Q45', q: 'Cómo evito que el material exclusivo de mi open house circule fuera del proyecto' },
  { id: 'Q46', q: 'Cómo se integra esto con nuestro sistema existente, tenemos un backend propio', expectedId: 'faq-api-integration' },
  { id: 'Q47', q: 'Necesito entender qué datos entrega el sistema y en qué formato' },
  { id: 'Q48', q: 'Tenemos una app mobile propia en iOS y Android, cómo incorporamos la validación de ubicación' },
  { id: 'Q49', q: 'Necesito integrar los datos de visitas con nuestro Salesforce' },
  { id: 'Q50', q: 'Qué diferencia hay entre esto y simplemente leer la geolocalización del dispositivo nosotros mismos' },
]

// ── REGRESIÓN P1 ───────────────────────────────────────────────────────────────
const p1 = [
  { id: 'V1', q: 'Quiero mostrarle una promoción especial solo a los clientes que están en el local en ese momento', expectedId: 'retail-promotion' },
  { id: 'V2', q: 'Quiero que cuando alguien llegue a mi tienda le aparezca automáticamente una oferta del día', expectedId: 'local-business-proximity-promo' },
  { id: 'V3', q: 'Cómo hago para que una promoción especial solo funcione dentro del local', expectedId: 'retail-promotion' },
  { id: 'V4', q: 'Quiero que los planos y precios se activen automáticamente cuando un interesado llega al proyecto', expectedId: 'real-estate-open-house' },
  { id: 'V5', q: 'Quiero desbloquear contenido únicamente cuando una persona llegue a una ubicación específica', expectedId: 'geolocated-ar-experience' },
  { id: 'V6', q: 'Quiero que cierta información solo aparezca cuando alguien entre a una zona determinada', expectedId: 'local-business-contextual-message' },
  { id: 'V7', q: 'Quiero mostrar contenido diferente dependiendo de dónde esté una persona', expectedId: 'local-business-contextual-message' },
]

let totalFail = 0
totalFail += run('VALIDACIONES P2 — COMERCIAL (no deben ir a educación)', comercial)
totalFail += run('VALIDACIONES P2 — EDUCACIÓN (deben seguir llegando a educación)', educacion)

// Regressions — solo mostrar fallas
console.log('\n═══════════════════════════════════════════════════════════')
console.log('  REGRESIÓN — 50 PREGUNTAS ORIGINALES')
console.log('═══════════════════════════════════════════════════════════\n')

let reg50Pass = 0, reg50Fail = 0
const reg50Issues: string[] = []
for (const { id, q, expectedId, shouldNeverBe } of original50 as any[]) {
  const audit = auditMatch(q)
  const actualId = audit.winner?.id ?? 'FALLBACK'
  if (expectedId && actualId !== expectedId) {
    reg50Fail++
    reg50Issues.push(`  ❌ ${id}: esperado="${expectedId}" got="${actualId}"`)
  } else if (shouldNeverBe && actualId === shouldNeverBe) {
    reg50Fail++
    reg50Issues.push(`  ❌ ${id}: no debe ser "${shouldNeverBe}" — got="${actualId}"`)
  } else {
    reg50Pass++
  }
}
if (reg50Issues.length) { reg50Issues.forEach(l => console.log(l)); console.log() }
console.log(`Resultado: ${reg50Pass}/${reg50Pass + reg50Fail}${reg50Fail > 0 ? ' ❌ REGRESIONES' : ' ✅'}`)

console.log('\n═══════════════════════════════════════════════════════════')
console.log('  REGRESIÓN — P1 (7 PREGUNTAS)')
console.log('═══════════════════════════════════════════════════════════\n')

let regP1Pass = 0, regP1Fail = 0
const regP1Issues: string[] = []
for (const { id, q, expectedId } of p1) {
  const audit = auditMatch(q)
  const actualId = audit.winner?.id ?? 'FALLBACK'
  if (actualId !== expectedId) {
    regP1Fail++
    regP1Issues.push(`  ❌ ${id}: esperado="${expectedId}" got="${actualId}"`)
  } else {
    regP1Pass++
  }
}
if (regP1Issues.length) { regP1Issues.forEach(l => console.log(l)); console.log() }
console.log(`Resultado: ${regP1Pass}/${regP1Pass + regP1Fail}${regP1Fail > 0 ? ' ❌ REGRESIONES' : ' ✅'}`)

console.log('\n' + '═'.repeat(57))
console.log(`  TOTAL FALLAS: ${totalFail + reg50Fail + regP1Fail}`)
console.log('═'.repeat(57) + '\n')
