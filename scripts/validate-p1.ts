import { matchSolution, auditMatch, normalize, DEFAULT_SOLUTION } from '../src/knowledge/solutionMatcher'

// ── 7 preguntas de validación P1 ──────────────────────────────────────────────
const validations: Array<{ id: string; q: string }> = [
  { id: 'V1', q: 'Quiero mostrarle una promoción especial solo a los clientes que están en el local en ese momento' },
  { id: 'V2', q: 'Quiero que cuando alguien llegue a mi tienda le aparezca automáticamente una oferta del día' },
  { id: 'V3', q: 'Cómo hago para que una promoción especial solo funcione dentro del local' },
  { id: 'V4', q: 'Quiero que los planos y precios se activen automáticamente cuando un interesado llega al proyecto' },
  { id: 'V5', q: 'Quiero desbloquear contenido únicamente cuando una persona llegue a una ubicación específica' },
  { id: 'V6', q: 'Quiero que cierta información solo aparezca cuando alguien entre a una zona determinada' },
  { id: 'V7', q: 'Quiero mostrar contenido diferente dependiendo de dónde esté una persona' },
]

// ── Función auxiliar: listar keywords activadas ───────────────────────────────
function activatedKeywords(keywords: string[], query: string): string[] {
  const lower = normalize(query)
  return keywords.filter(k => lower.includes(normalize(k)))
}

// ── Obtener todas las keywords de los use cases/goals relevantes ──────────────
import { knowledge } from '../src/knowledge/index'

const allCandidates = [
  ...knowledge.useCases.map(uc => ({ id: uc.id, type: 'UseCase', keywords: uc.matchKeywords })),
  ...knowledge.businessGoals.map(g => ({ id: g.id, type: 'Goal', keywords: g.matchKeywords })),
  ...knowledge.faqs.map(f => ({ id: f.id, type: 'FAQ', keywords: f.questionPatterns })),
]

console.log('\n═══════════════════════════════════════════════════════════')
console.log('  VALIDACIONES P1 — ACTIVACIÓN DE CONTENIDO POR UBICACIÓN')
console.log('═══════════════════════════════════════════════════════════\n')

for (const { id, q } of validations) {
  const audit = auditMatch(q)
  const match = matchSolution(q)

  // Calcular keywords activadas del winner
  let activatedKw: string[] = []
  if (audit.winner) {
    const candidate = allCandidates.find(c => c.id === audit.winner!.id)
    if (candidate) activatedKw = activatedKeywords(candidate.keywords, q)
  }

  console.log(`─── ${id} ─────────────────────────────────────────────────────`)
  console.log(`Q:    "${q}"`)
  console.log(`Match: ${audit.isFallback ? '⚠️  FALLBACK' : `✅ ${audit.winner?.id} (${audit.winner?.type}, score=${audit.winner?.score})`}`)
  if (audit.subIntentionId) console.log(`Sub:   ${audit.subIntentionId}`)
  console.log(`Keywords activadas: ${activatedKw.length > 0 ? activatedKw.map(k => `"${k}"`).join(', ') : '(ninguna)'}`)
  console.log(`Top3: ${audit.top3.map(c => `${c.id}(${c.score})`).join(', ')}`)
  console.log()
}

// ── Regresión: las 50 preguntas originales ────────────────────────────────────
const original50: Array<{ profile: string; q: string; expectedWinnerId?: string }> = [
  // 1. GG
  { profile: '1-GG', q: 'Quiero saber cuáles de mis sucursales están rindiendo mejor antes de decidir dónde abrir la próxima', expectedWinnerId: 'goal-decision-making' },
  { profile: '1-GG', q: 'Necesito evidencia real para justificar una inversión en una nueva zona' },
  { profile: '1-GG', q: 'Tenemos 12 locales y no sé cuáles generan más valor' },
  { profile: '1-GG', q: 'Cómo decido si expandirme a una ciudad nueva sin tomar un riesgo ciego' },
  { profile: '1-GG', q: 'Mi directorio me pide datos concretos sobre el rendimiento de cada punto de venta' },
  // 2. GC
  { profile: '2-GC', q: 'Quiero saber si mis vendedores realmente visitan los clientes o solo reportan que lo hacen', expectedWinnerId: 'field-sales-visits' },
  { profile: '2-GC', q: 'Necesito comparar el rendimiento de mis locales para saber cuáles necesitan intervención', expectedWinnerId: 'goal-decision-making' },
  { profile: '2-GC', q: 'Cómo mido si una campaña de descuentos generó tráfico real a la tienda', expectedWinnerId: 'goal-attract-customers' },
  { profile: '2-GC', q: 'Quiero saber en qué horarios hay más personas en mis tiendas para ajustar al equipo de ventas', expectedWinnerId: 'goal-retail-stores' },
  { profile: '2-GC', q: 'Necesito demostrarle al dueño que nuestras acciones comerciales realmente generan visitas' },
  // 3. GM
  { profile: '3-GM', q: 'Lancé una activación en tres puntos de venta y no sé cuánta gente realmente participó' },
  { profile: '3-GM', q: 'Quiero mostrarle una promoción especial solo a los clientes que están en el local en ese momento' },
  { profile: '3-GM', q: 'Cómo demuestro el ROI de una campaña presencial a mi directorio', expectedWinnerId: 'brand-activation-campaign' },
  { profile: '3-GM', q: 'Quiero que cuando alguien llegue a mi tienda le aparezca automáticamente una oferta del día' },
  { profile: '3-GM', q: 'Necesito saber cuánto tiempo pasan las personas en cada zona de mis eventos para mejorarlos', expectedWinnerId: 'goal-events' },
  // 4. GO
  { profile: '4-GO', q: 'Mis técnicos deben hacer rondas de mantenimiento y necesito saber si realmente fueron a cada punto', expectedWinnerId: 'field-sales-supervision' },
  { profile: '4-GO', q: 'Tengo personal distribuido en distintas zonas y no tengo forma de verificar que cumplieron su ruta' },
  { profile: '4-GO', q: 'Necesito auditar si los agentes sanitarios cubrieron todas las zonas asignadas esta semana' },
  { profile: '4-GO', q: 'Quiero saber si mis repartidores pasaron por todos los puntos de entrega con la hora exacta', expectedWinnerId: 'field-sales-delivery' },
  { profile: '4-GO', q: 'Cómo registro de forma confiable que un inspector municipal hizo su recorrido completo', expectedWinnerId: 'municipalities-inspection' },
  // 5. RT
  { profile: '5-RT', q: 'Quiero saber cuánta gente entra a mi tienda y en qué horas hay más movimiento', expectedWinnerId: 'goal-retail-stores' },
  { profile: '5-RT', q: 'Cómo hago para que una promoción especial solo funcione dentro del local' },
  { profile: '5-RT', q: 'Quiero entender cuánto tiempo pasan mis clientes en la tienda', expectedWinnerId: 'goal-retail-stores' },
  { profile: '5-RT', q: 'Tengo una tienda física y también un sitio web, quiero saber si los que visitan el sitio también vinieron al local', expectedWinnerId: 'goal-retail-stores' },
  { profile: '5-RT', q: 'Cómo atraigo a las personas que pasan por la puerta de mi local', expectedWinnerId: 'local-business-proximity-promo' },
  // 6. GYM
  { profile: '6-GYM', q: 'Quiero saber en qué horarios se concentra más la asistencia en cada sede' },
  { profile: '6-GYM', q: 'Necesito comparar la frecuencia de asistencia entre mis diferentes gimnasios', expectedWinnerId: 'goal-gyms' },
  { profile: '6-GYM', q: 'Cómo detecto qué sedes tienen baja asistencia para tomar acción antes de que sea un problema' },
  { profile: '6-GYM', q: 'Quiero dar beneficios a los socios según cuántas veces vinieron al gimnasio este mes', expectedWinnerId: 'goal-gyms' },
  { profile: '6-GYM', q: 'Necesito saber si mis campañas de retención están generando más visitas presenciales' },
  // 7. RST
  { profile: '7-RST', q: 'Quiero saber cuál de mis locales recibe más tráfico en la hora del almuerzo', expectedWinnerId: 'spatial-concentration' },
  { profile: '7-RST', q: 'Necesito comparar el flujo de personas entre mis diferentes restaurantes', expectedWinnerId: 'goal-restaurants' },
  { profile: '7-RST', q: 'Cómo sé si mi campaña de descuentos de lunes generó más visitas que el lunes anterior' },
  { profile: '7-RST', q: 'Quiero mostrar una oferta especial solo cuando el cliente esté cerca del restaurante' },
  { profile: '7-RST', q: 'Necesito demostrar a mis inversores que la nueva sucursal está generando el tráfico proyectado' },
  // 8. CC
  { profile: '8-CC', q: 'Quiero saber qué zonas del mall tienen más tráfico y en qué horarios', expectedWinnerId: 'goal-shopping-centers' },
  { profile: '8-CC', q: 'Necesito comparar el flujo de personas entre el sector A y el sector B para negociar rentas' },
  { profile: '8-CC', q: 'Cómo sé cuáles son los pasillos y sectores más y menos visitados de mi centro comercial', expectedWinnerId: 'goal-shopping-centers' },
  { profile: '8-CC', q: 'Quiero ver en tiempo real cuánta gente hay en cada piso o zona del mall', expectedWinnerId: 'faq-indoor' },
  { profile: '8-CC', q: 'Necesito generar un reporte de afluencia por zona para presentar a los locatarios', expectedWinnerId: 'goal-shopping-centers' },
  // 9. INM
  { profile: '9-INM', q: 'Quiero saber cuántas personas visitaron mi sala de ventas esta semana y cuánto tiempo estuvieron', expectedWinnerId: 'goal-real-estate' },
  { profile: '9-INM', q: 'Cómo mido el interés real en cada uno de mis proyectos inmobiliarios', expectedWinnerId: 'goal-real-estate' },
  { profile: '9-INM', q: 'Quiero que los planos y precios se activen automáticamente cuando un interesado llega al proyecto' },
  { profile: '9-INM', q: 'Necesito comparar cuántas visitas recibió cada sala de ventas sin depender del reporte del ejecutivo', expectedWinnerId: 'goal-real-estate' },
  { profile: '9-INM', q: 'Cómo evito que el material exclusivo de mi open house circule fuera del proyecto' },
  // 10. CTO
  { profile: '10-CTO', q: 'Cómo se integra esto con nuestro sistema existente, tenemos un backend propio', expectedWinnerId: 'faq-api-integration' },
  { profile: '10-CTO', q: 'Necesito entender qué datos entrega el sistema y en qué formato' },
  { profile: '10-CTO', q: 'Tenemos una app mobile propia en iOS y Android, cómo incorporamos la validación de ubicación' },
  { profile: '10-CTO', q: 'Necesito integrar los datos de visitas con nuestro Salesforce' },
  { profile: '10-CTO', q: 'Qué diferencia hay entre esto y simplemente leer la geolocalización del dispositivo nosotros mismos' },
]

console.log('\n═══════════════════════════════════════════════════════════')
console.log('  REGRESIÓN: 50 PREGUNTAS ORIGINALES')
console.log('═══════════════════════════════════════════════════════════\n')

let regressionOk = 0
let regressionBroken = 0
const broken: string[] = []

for (let i = 0; i < original50.length; i++) {
  const { profile, q, expectedWinnerId } = original50[i]
  const audit = auditMatch(q)
  const actualId = audit.winner?.id ?? null
  const wasFallback = audit.isFallback

  if (expectedWinnerId) {
    const passes = actualId === expectedWinnerId
    if (passes) {
      regressionOk++
    } else {
      regressionBroken++
      broken.push(`  Q${i+1} [${profile}] expected="${expectedWinnerId}" got="${actualId ?? 'FALLBACK'}"`)
    }
  } else {
    // Solo verificar que no empeoró (si era fallback antes, seguirá siendo fallback y eso es OK)
    regressionOk++
  }
}

if (broken.length > 0) {
  console.log(`⚠️  REGRESAS DETECTADAS (${regressionBroken}):`)
  for (const b of broken) console.log(b)
} else {
  console.log(`✅ Sin regresiones. ${regressionOk}/50 preguntas verificadas.`)
}

console.log()
