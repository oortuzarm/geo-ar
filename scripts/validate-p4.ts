import { auditMatch, normalize } from '../src/knowledge/solutionMatcher'
import { knowledge } from '../src/knowledge/index'

const allCandidates = [
  ...knowledge.useCases.map(uc => ({ id: uc.id, keywords: uc.matchKeywords })),
  ...knowledge.businessGoals.map(g => ({ id: g.id, keywords: g.matchKeywords })),
  ...knowledge.faqs.map(f => ({ id: f.id, keywords: f.questionPatterns })),
]

function activatedKeywords(keywords: string[], query: string): string[] {
  const lower = normalize(query)
  return keywords.filter(k => lower.includes(normalize(k)))
}

function run(
  label: string,
  questions: Array<{ id: string; q: string; expectedId?: string; shouldNeverBe?: string }>,
  silent = false
) {
  if (!silent) {
    console.log(`\n═══════════════════════════════════════════════════════════`)
    console.log(`  ${label}`)
    console.log(`═══════════════════════════════════════════════════════════\n`)
  }

  let pass = 0; let fail = 0
  const issues: string[] = []

  for (const { id, q, expectedId, shouldNeverBe } of questions) {
    const audit = auditMatch(q)
    const actualId = audit.winner?.id ?? 'FALLBACK'
    const cand = allCandidates.find(c => c.id === actualId)
    const activated = cand ? activatedKeywords(cand.keywords, q) : []

    let ok = true
    let reason = ''
    if (expectedId && actualId !== expectedId) { ok = false; reason = ` → esperado: ${expectedId}` }
    else if (shouldNeverBe && actualId === shouldNeverBe) { ok = false; reason = ` → no debe ser: ${shouldNeverBe}` }

    if (ok) {
      pass++
      if (!silent) {
        console.log(`✅ ${id} | match=${actualId} score=${audit.winner?.score ?? 0}`)
        console.log(`   Q: "${q}"`)
        if (activated.length) console.log(`   Keys: ${activated.slice(0, 4).map(k => `"${k}"`).join(', ')}`)
        if (audit.top3.length > 1) console.log(`   Top3: ${audit.top3.map(c => `${c.id}(${c.score})`).join(', ')}`)
        console.log()
      }
    } else {
      fail++
      issues.push(`  ❌ ${id} | got=${actualId} score=${audit.winner?.score ?? 0}${reason}\n     Q: "${q}"\n     Top3: ${audit.top3.map(c => `${c.id}(${c.score})`).join(', ')}`)
    }
  }

  if (issues.length) issues.forEach(l => console.log(l))
  if (!silent) console.log(`Resultado: ${pass}/${pass + fail} ✅`)
  return fail
}

// ── P4 VALIDACIONES ───────────────────────────────────────────────────────────
const p4: Array<{ id: string; q: string; expectedId?: string; shouldNeverBe?: string }> = [
  { id: 'P4-V1', q: 'Tengo una tienda de muebles en Santiago, ¿cómo hago que las personas vayan a la tienda y compren?',  shouldNeverBe: 'goal-retail-stores' },
  { id: 'P4-V2', q: 'Tengo una tienda física y quiero atraer más clientes',                                               shouldNeverBe: 'goal-retail-stores' },
  { id: 'P4-V3', q: '¿Cómo puedo llevar más personas a mi local?',                                                        shouldNeverBe: 'goal-retail-stores' },
  { id: 'P4-V4', q: '¿Cómo generar más visitas a mi tienda?',                                                             shouldNeverBe: 'goal-retail-stores' },
  { id: 'P4-V5', q: '¿Cómo convertir más visitas en ventas?',                                                             shouldNeverBe: 'goal-retail-stores' },
  { id: 'P4-V6', q: 'Tengo un restaurante y quiero llenar mesas',                                                         shouldNeverBe: 'goal-retail-stores' },
  { id: 'P4-V7', q: 'Tengo una cadena de tiendas y quiero aumentar ventas',                                               shouldNeverBe: 'goal-retail-stores' },
  { id: 'P4-V8', q: 'Tengo un negocio físico y quiero atraer más gente',                                                  shouldNeverBe: 'goal-retail-stores' },
]

let totalFail = 0
totalFail += run('VALIDACIONES P4 — INDUSTRIA + OBJETIVO COMERCIAL', p4)

// ── INDUSTRIA 25 ──────────────────────────────────────────────────────────────
const industry25: Array<{ id: string; q: string; expectedId: string }> = [
  { id: 'I01', q: 'Tengo una tienda de muebles',             expectedId: 'goal-retail-stores' },
  { id: 'I02', q: 'Tengo varias tiendas',                    expectedId: 'goal-retail-stores' },
  { id: 'I03', q: 'Tengo un showroom',                       expectedId: 'goal-retail-stores' },
  { id: 'I04', q: 'Cómo atraer más personas a mi tienda',    expectedId: 'goal-retail-stores' },
  { id: 'I05', q: 'Tengo una cadena de gimnasios',           expectedId: 'goal-gyms' },
  { id: 'I06', q: 'Cómo aumentar la frecuencia de visita',   expectedId: 'goal-gyms' },
  { id: 'I07', q: 'Cómo retener socios',                     expectedId: 'goal-gyms' },
  { id: 'I08', q: 'Tengo restaurantes',                      expectedId: 'goal-restaurants' },
  { id: 'I09', q: 'Cómo saber qué local funciona mejor',     expectedId: 'goal-restaurants' },
  { id: 'I10', q: 'Cómo medir campañas locales',             expectedId: 'goal-restaurants' },
  { id: 'I11', q: 'Organizo eventos',                        expectedId: 'goal-events' },
  { id: 'I12', q: 'Cómo demostrar asistencia real',          expectedId: 'goal-events' },
  { id: 'I13', q: 'Cómo justificar patrocinadores',          expectedId: 'goal-events' },
  { id: 'I14', q: 'Tengo un centro comercial',               expectedId: 'goal-shopping-centers' },
  { id: 'I15', q: 'Cómo medir tráfico por zona',             expectedId: 'goal-shopping-centers' },
  { id: 'I16', q: 'Cómo comparar sectores del mall',         expectedId: 'goal-shopping-centers' },
  { id: 'I17', q: 'Tengo franquicias',                       expectedId: 'goal-franchises' },
  { id: 'I18', q: 'Cómo comparar sucursales',                expectedId: 'goal-franchises' },
  { id: 'I19', q: 'Cómo detectar locales débiles',           expectedId: 'goal-franchises' },
  { id: 'I20', q: 'Tengo un atractivo turístico',            expectedId: 'goal-tourism' },
  { id: 'I21', q: 'Cómo entender el recorrido de visitantes',expectedId: 'goal-tourism' },
  { id: 'I22', q: 'Cómo mejorar la experiencia turística',   expectedId: 'goal-tourism' },
  { id: 'I23', q: 'Tengo una inmobiliaria',                  expectedId: 'goal-real-estate' },
  { id: 'I24', q: 'Cómo medir visitas a salas de venta',     expectedId: 'goal-real-estate' },
  { id: 'I25', q: 'Cómo saber qué proyecto genera más interés', expectedId: 'goal-real-estate' },
]

console.log('\n═══════════════════════════════════════════════════════════')
console.log('  REGRESIÓN — INDUSTRIA 25')
console.log('═══════════════════════════════════════════════════════════\n')
{
  let p = 0; let f = 0
  for (const { id, q, expectedId } of industry25) {
    const audit = auditMatch(q)
    const actualId = audit.winner?.id ?? 'FALLBACK'
    if (actualId === expectedId) { p++; console.log(`✅ ${id} | ${actualId}`) }
    else { f++; console.log(`❌ ${id} | got=${actualId} esperado=${expectedId}\n   Q: "${q}"\n   Top3: ${audit.top3.map(c => `${c.id}(${c.score})`).join(', ')}`) }
  }
  console.log(`\nResultado: ${p}/${p + f} ✅`)
  totalFail += f
}

// ── INDUSTRIA REGRESIÓN 50 ────────────────────────────────────────────────────
const industryReg50: Array<{ id: string; q: string; expectedId: string }> = [
  { id: 'IR01', q: '¿Por qué debería implementar Ubyca?',                     expectedId: 'faq-why-ubyca' },
  { id: 'IR02', q: '¿Qué gano con Ubyca?',                                    expectedId: 'faq-why-ubyca' },
  { id: 'IR03', q: '¿Cómo puedo tomar mejores decisiones para mi negocio?',   expectedId: 'goal-decision-making' },
  { id: 'IR04', q: '¿Qué problema resuelve Ubyca?',                           expectedId: 'faq-why-ubyca' },
  { id: 'IR05', q: '¿Cuál es la diferencia entre Ubyca y Google Analytics?',  expectedId: 'faq-vs-google-analytics' },
  { id: 'IR06', q: '¿Necesito hardware?',                                     expectedId: 'faq-no-hardware' },
  { id: 'IR07', q: '¿Cómo saber qué sucursal funciona mejor?',                expectedId: 'goal-decision-making' },
  { id: 'IR08', q: '¿Cómo identificar oportunidades de crecimiento?',         expectedId: 'goal-decision-making' },
  { id: 'IR09', q: '¿Cómo digitalizo mis sucursales?',                        expectedId: 'goal-digital-transformation' },
  { id: 'IR10', q: '¿Para qué sirve Ubyca?',                                  expectedId: 'faq-what-is-ubyca' },
  { id: 'IR11', q: '¿Cómo mido el retorno de mis campañas?',                  expectedId: 'goal-measure-marketing-roi' },
  { id: 'IR12', q: '¿Cómo justifico una inversión en marketing?',             expectedId: 'goal-measure-marketing-roi' },
  { id: 'IR13', q: '¿Cómo demuestro impacto a mi cliente?',                   expectedId: 'goal-measure-marketing-roi' },
  { id: 'IR14', q: '¿Cómo genero más tráfico al local?',                      expectedId: 'goal-attract-customers' },
  { id: 'IR15', q: '¿Cómo sorprendo a mis clientes?',                         expectedId: 'goal-customer-experience' },
  { id: 'IR16', q: '¿Por qué usar Ubyca si ya tengo Google Analytics?',       expectedId: 'faq-vs-google-analytics' },
  { id: 'IR17', q: '¿Cómo personalizo la experiencia?',                       expectedId: 'goal-customer-experience' },
  { id: 'IR18', q: '¿Cómo premio clientes frecuentes?',                       expectedId: 'goal-improve-loyalty' },
  { id: 'IR19', q: '¿Cómo aumento mis ventas?',                               expectedId: 'goal-increase-sales' },
  { id: 'IR20', q: '¿Cómo hacer marketing geolocalizado?',                    expectedId: 'goal-marketing' },
  { id: 'IR21', q: '¿Cómo controlo mis técnicos?',                            expectedId: 'goal-improve-operations' },
  { id: 'IR22', q: '¿Cómo hago más eficiente mi operación?',                  expectedId: 'goal-improve-operations' },
  { id: 'IR23', q: '¿Cómo saber qué pasa en mis locales?',                    expectedId: 'goal-measure-physical' },
  { id: 'IR24', q: '¿Cómo medir lo que ocurre físicamente?',                  expectedId: 'goal-measure-physical' },
  { id: 'IR25', q: '¿Cómo reduzco errores en terreno?',                       expectedId: 'goal-improve-operations' },
  { id: 'IR26', q: '¿Necesito instalar algo en el local?',                    expectedId: 'faq-no-hardware' },
  { id: 'IR27', q: '¿Cómo auditar personal de campo?',                        expectedId: 'goal-improve-operations' },
  { id: 'IR28', q: '¿Cómo controlo mis rutas?',                               expectedId: 'goal-improve-operations' },
  { id: 'IR29', q: '¿Cómo medir permanencia en mis locales?',                 expectedId: 'goal-measure-physical' },
  { id: 'IR30', q: '¿Cómo verifico el cumplimiento operativo?',               expectedId: 'goal-improve-operations' },
  { id: 'IR31', q: '¿Cómo impulso las ventas?',                               expectedId: 'goal-increase-sales' },
  { id: 'IR32', q: '¿Cómo capto más clientes?',                               expectedId: 'goal-attract-customers' },
  { id: 'IR33', q: '¿Cómo fidelizo a mis clientes?',                          expectedId: 'goal-improve-loyalty' },
  { id: 'IR34', q: '¿Cómo incentivo que vuelvan?',                            expectedId: 'goal-improve-loyalty' },
  { id: 'IR35', q: '¿Cómo valido una zona antes de invertir?',                expectedId: 'goal-choose-location' },
  { id: 'IR36', q: '¿Cómo comparar el desempeño de mis ubicaciones?',         expectedId: 'goal-decision-making' },
  { id: 'IR37', q: '¿Cómo decidir dónde abrir una nueva sucursal?',           expectedId: 'goal-decision-making' },
  { id: 'IR38', q: '¿Cómo validar una estrategia antes de invertir?',         expectedId: 'goal-decision-making' },
  { id: 'IR39', q: '¿Cómo comparar sucursales?',                              expectedId: 'goal-franchises' },
  { id: 'IR40', q: '¿Cuál es la mejor zona para abrir?',                      expectedId: 'goal-choose-location' },
  { id: 'IR41', q: '¿Tiene API?',                                              expectedId: 'faq-api-integration' },
  { id: 'IR42', q: '¿Cómo se integra con mi sistema?',                        expectedId: 'faq-api-integration' },
  { id: 'IR43', q: '¿Necesito un SDK?',                                        expectedId: 'faq-api-integration' },
  { id: 'IR44', q: '¿Cuánto tarda implementarlo?',                             expectedId: 'faq-api-integration' },
  { id: 'IR45', q: '¿Necesito desarrollador?',                                 expectedId: 'faq-api-integration' },
  { id: 'IR46', q: '¿Cómo digitalizar puntos físicos?',                       expectedId: 'goal-digital-transformation' },
  { id: 'IR47', q: '¿Cómo conectar el mundo físico con el digital?',          expectedId: 'goal-digital-transformation' },
  { id: 'IR48', q: '¿Funciona con mi app?',                                    expectedId: 'faq-api-integration' },
  { id: 'IR49', q: '¿Cómo obtener datos del comportamiento presencial?',      expectedId: 'goal-measure-physical' },
  { id: 'IR50', q: '¿Funciona sin hardware?',                                  expectedId: 'faq-no-hardware' },
]

console.log('\n═══════════════════════════════════════════════════════════')
console.log('  REGRESIÓN — INDUSTRIA 50')
console.log('═══════════════════════════════════════════════════════════\n')
{
  let p = 0; let f = 0
  const issues: string[] = []
  for (const { id, q, expectedId } of industryReg50) {
    const audit = auditMatch(q)
    const actualId = audit.winner?.id ?? 'FALLBACK'
    if (actualId === expectedId) p++
    else { f++; issues.push(`  ❌ ${id} | got=${actualId} esperado=${expectedId}\n     Q: "${q}"`) }
  }
  if (issues.length) issues.forEach(l => console.log(l))
  console.log(`Resultado: ${p}/${p + f}${f > 0 ? ' ❌ REGRESIONES' : ' ✅'}`)
  totalFail += f
}

// ── HISTÓRICAS 50 ────────────────────────────────────────────────────────────
const hist50: Array<{ id: string; q: string; expectedId?: string; shouldNeverBe?: string }> = [
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

console.log('\n═══════════════════════════════════════════════════════════')
console.log('  REGRESIÓN — 50 HISTÓRICAS')
console.log('═══════════════════════════════════════════════════════════\n')
{
  let p = 0; let f = 0
  const issues: string[] = []
  for (const { id, q, expectedId, shouldNeverBe } of hist50) {
    const audit = auditMatch(q)
    const actualId = audit.winner?.id ?? 'FALLBACK'
    let ok = true
    if (expectedId && actualId !== expectedId) ok = false
    else if (shouldNeverBe && actualId === shouldNeverBe) ok = false
    if (ok) p++
    else { f++; issues.push(`  ❌ ${id} | got=${actualId}${expectedId ? ` esperado=${expectedId}` : ` no debe ser=${shouldNeverBe}`}\n     Q: "${q}"`) }
  }
  if (issues.length) issues.forEach(l => console.log(l))
  console.log(`Resultado: ${p}/${p + f}${f > 0 ? ' ❌ REGRESIONES' : ' ✅'}`)
  totalFail += f
}

// ── P1 (7) ────────────────────────────────────────────────────────────────────
const p1 = [
  { id: 'V1', q: 'Quiero mostrarle una promoción especial solo a los clientes que están en el local en ese momento', expectedId: 'retail-promotion' },
  { id: 'V2', q: 'Quiero que cuando alguien llegue a mi tienda le aparezca automáticamente una oferta del día', expectedId: 'local-business-proximity-promo' },
  { id: 'V3', q: 'Cómo hago para que una promoción especial solo funcione dentro del local', expectedId: 'retail-promotion' },
  { id: 'V4', q: 'Quiero que los planos y precios se activen automáticamente cuando un interesado llega al proyecto', expectedId: 'real-estate-open-house' },
  { id: 'V5', q: 'Quiero desbloquear contenido únicamente cuando una persona llegue a una ubicación específica', expectedId: 'geolocated-ar-experience' },
  { id: 'V6', q: 'Quiero que cierta información solo aparezca cuando alguien entre a una zona determinada', expectedId: 'local-business-contextual-message' },
  { id: 'V7', q: 'Quiero mostrar contenido diferente dependiendo de dónde esté una persona', expectedId: 'local-business-contextual-message' },
]
totalFail += run('REGRESIÓN — P1 (7)', p1)

// ── P2 comercial (7) + educación (5) ─────────────────────────────────────────
const p2comercial = [
  { id: 'C1', q: 'Tengo una cadena de gimnasios y quiero medir asistencia',                        expectedId: 'goal-gyms' },
  { id: 'C2', q: '¿Cómo aumenta la asistencia a mis gimnasios?',                                   expectedId: 'goal-gyms' },
  { id: 'C3', q: 'Quiero entender qué sedes reciben más personas',                                  expectedId: 'goal-gyms', shouldNeverBe: 'education-attendance' },
  { id: 'C4', q: '¿Cómo comparo la asistencia entre sucursales?',                                  expectedId: 'goal-franchises' },
  { id: 'C5', q: 'Tengo varios locales y quiero medir concurrencia',                               expectedId: 'goal-retail-stores' },
  { id: 'C6', q: 'Quiero saber qué gimnasio tiene más actividad',                                  expectedId: 'goal-gyms' },
  { id: 'C7', q: '¿Cómo medir asistencia de clientes?',                                            shouldNeverBe: 'education-attendance' },
]
const p2educacion = [
  { id: 'E1', q: '¿Cómo registrar asistencia de alumnos?',      expectedId: 'education-attendance' },
  { id: 'E2', q: '¿Cómo controlar asistencia en clases?',       expectedId: 'education-attendance' },
  { id: 'E3', q: '¿Cómo validar asistencia en un campus?',      expectedId: 'education-attendance' },
  { id: 'E4', q: '¿Cómo registrar presencia de estudiantes?',   expectedId: 'education-attendance' },
  { id: 'E5', q: '¿Cómo gestionar asistencia escolar?',         expectedId: 'education-attendance' },
]
totalFail += run('REGRESIÓN — P2 COMERCIAL (7)', p2comercial)
totalFail += run('REGRESIÓN — P2 EDUCACIÓN (5)', p2educacion)

// ── P3 ejecutivo (10) ─────────────────────────────────────────────────────────
const p3 = [
  { id: 'EX1',  q: 'No sé en cuál de mis sucursales debería invertir primero',       expectedId: 'goal-decision-making' },
  { id: 'EX2',  q: '¿Cómo priorizo mis ubicaciones para asignar presupuesto?',       expectedId: 'goal-decision-making' },
  { id: 'EX3',  q: 'Quiero saber cuál es mi mejor ubicación antes de expandirme',    expectedId: 'goal-decision-making' },
  { id: 'EX4',  q: 'Tengo que justificar ante el directorio por qué expandirme',     expectedId: 'goal-decision-making' },
  { id: 'EX5',  q: '¿Qué local merece más recursos según los datos?',                expectedId: 'goal-decision-making' },
  { id: 'EX6',  q: 'Necesito presentar evidencia para defender una inversión',       expectedId: 'goal-decision-making' },
  { id: 'EX7',  q: '¿Cómo decido qué sucursal merece más inversión?',               expectedId: 'goal-decision-making' },
  { id: 'EX8',  q: 'Quiero defender ante el directorio la apertura de una nueva sucursal', expectedId: 'goal-decision-making' },
  { id: 'EX9',  q: 'Me cuesta justificar dónde concentrar los recursos',             expectedId: 'goal-decision-making' },
  { id: 'EX10', q: '¿Cómo identificar oportunidades de crecimiento con datos?',      expectedId: 'goal-decision-making' },
]
totalFail += run('REGRESIÓN — P3 EJECUTIVO (10)', p3)

// ── RESUMEN FINAL ─────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(57))
console.log(`  TOTAL FALLAS: ${totalFail}`)
console.log('═'.repeat(57) + '\n')
