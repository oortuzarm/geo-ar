import { auditMatch } from '../src/knowledge/solutionMatcher'

interface Case { q: string; expected: string }

const industryTable: Case[] = [
  // ── Retail ────────────────────────────────────────────────────────────────
  { q: 'Tengo una tienda de muebles',             expected: 'goal-retail-stores' },
  { q: 'Tengo varias tiendas',                    expected: 'goal-retail-stores' },
  { q: 'Tengo un showroom',                       expected: 'goal-retail-stores' },
  { q: 'Cómo atraer más personas a mi tienda',    expected: 'goal-retail-stores' },

  // ── Gimnasios ─────────────────────────────────────────────────────────────
  { q: 'Tengo una cadena de gimnasios',           expected: 'goal-gyms' },
  { q: 'Cómo aumentar la frecuencia de visita',   expected: 'goal-gyms' },
  { q: 'Cómo retener socios',                     expected: 'goal-gyms' },

  // ── Restaurantes ──────────────────────────────────────────────────────────
  { q: 'Tengo restaurantes',                      expected: 'goal-restaurants' },
  { q: 'Cómo saber qué local funciona mejor',     expected: 'goal-restaurants' },
  { q: 'Cómo medir campañas locales',             expected: 'goal-restaurants' },

  // ── Eventos ───────────────────────────────────────────────────────────────
  { q: 'Organizo eventos',                        expected: 'goal-events' },
  { q: 'Cómo demostrar asistencia real',          expected: 'goal-events' },
  { q: 'Cómo justificar patrocinadores',          expected: 'goal-events' },

  // ── Shopping centers ──────────────────────────────────────────────────────
  { q: 'Tengo un centro comercial',               expected: 'goal-shopping-centers' },
  { q: 'Cómo medir tráfico por zona',             expected: 'goal-shopping-centers' },
  { q: 'Cómo comparar sectores del mall',         expected: 'goal-shopping-centers' },

  // ── Franquicias ───────────────────────────────────────────────────────────
  { q: 'Tengo franquicias',                       expected: 'goal-franchises' },
  { q: 'Cómo comparar sucursales',                expected: 'goal-franchises' },
  { q: 'Cómo detectar locales débiles',           expected: 'goal-franchises' },

  // ── Turismo ───────────────────────────────────────────────────────────────
  { q: 'Tengo un atractivo turístico',            expected: 'goal-tourism' },
  { q: 'Cómo entender el recorrido de visitantes', expected: 'goal-tourism' },
  { q: 'Cómo mejorar la experiencia turística',   expected: 'goal-tourism' },

  // ── Inmobiliarias ─────────────────────────────────────────────────────────
  { q: 'Tengo una inmobiliaria',                  expected: 'goal-real-estate' },
  { q: 'Cómo medir visitas a salas de venta',     expected: 'goal-real-estate' },
  { q: 'Cómo saber qué proyecto genera más interés', expected: 'goal-real-estate' },
]

// Regresión: los 50 queries del audit final deben seguir rutando igual
const regression: Case[] = [
  // CEO
  { q: '¿Por qué debería implementar Ubyca?',                     expected: 'faq-why-ubyca' },
  { q: '¿Qué gano con Ubyca?',                                    expected: 'faq-why-ubyca' },
  { q: '¿Cómo puedo tomar mejores decisiones para mi negocio?',   expected: 'goal-decision-making' },
  { q: '¿Qué problema resuelve Ubyca?',                           expected: 'faq-why-ubyca' },
  { q: '¿Cuál es la diferencia entre Ubyca y Google Analytics?',  expected: 'faq-vs-google-analytics' },
  { q: '¿Necesito hardware?',                                     expected: 'faq-no-hardware' },
  { q: '¿Cómo saber qué sucursal funciona mejor?',               expected: 'goal-decision-making' },
  { q: '¿Cómo identificar oportunidades de crecimiento?',        expected: 'goal-decision-making' },
  { q: '¿Cómo digitalizo mis sucursales?',                       expected: 'goal-digital-transformation' },
  { q: '¿Para qué sirve Ubyca?',                                 expected: 'faq-what-is-ubyca' },
  // Marketing
  { q: '¿Cómo mido el retorno de mis campañas?',                 expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo justifico una inversión en marketing?',            expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo demuestro impacto a mi cliente?',                  expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo genero más tráfico al local?',                     expected: 'goal-attract-customers' },
  { q: '¿Cómo sorprendo a mis clientes?',                        expected: 'goal-customer-experience' },
  { q: '¿Por qué usar Ubyca si ya tengo Google Analytics?',      expected: 'faq-vs-google-analytics' },
  { q: '¿Cómo personalizo la experiencia?',                      expected: 'goal-customer-experience' },
  { q: '¿Cómo premio clientes frecuentes?',                      expected: 'goal-improve-loyalty' },
  { q: '¿Cómo aumento mis ventas?',                              expected: 'goal-increase-sales' },
  { q: '¿Cómo hacer marketing geolocalizado?',                   expected: 'goal-marketing' },
  // Operaciones
  { q: '¿Cómo controlo mis técnicos?',                           expected: 'goal-improve-operations' },
  { q: '¿Cómo hago más eficiente mi operación?',                 expected: 'goal-improve-operations' },
  { q: '¿Cómo saber qué pasa en mis locales?',                   expected: 'goal-measure-physical' },
  { q: '¿Cómo medir lo que ocurre físicamente?',                 expected: 'goal-measure-physical' },
  { q: '¿Cómo reduzco errores en terreno?',                      expected: 'goal-improve-operations' },
  { q: '¿Necesito instalar algo en el local?',                   expected: 'faq-no-hardware' },
  { q: '¿Cómo auditar personal de campo?',                       expected: 'goal-improve-operations' },
  { q: '¿Cómo controlo mis rutas?',                              expected: 'goal-improve-operations' },
  { q: '¿Cómo medir permanencia en mis locales?',                expected: 'goal-measure-physical' },
  { q: '¿Cómo verifico el cumplimiento operativo?',              expected: 'goal-improve-operations' },
  // Comercial (sin "¿Cómo comparar sucursales?" — se actualizó a goal-franchises)
  { q: '¿Cómo impulso las ventas?',                              expected: 'goal-increase-sales' },
  { q: '¿Cómo capto más clientes?',                              expected: 'goal-attract-customers' },
  { q: '¿Cómo fidelizo a mis clientes?',                        expected: 'goal-improve-loyalty' },
  { q: '¿Cómo incentivo que vuelvan?',                          expected: 'goal-improve-loyalty' },
  { q: '¿Cómo valido una zona antes de invertir?',              expected: 'goal-choose-location' },
  { q: '¿Cómo comparar el desempeño de mis ubicaciones?',       expected: 'goal-decision-making' },
  { q: '¿Cómo decidir dónde abrir una nueva sucursal?',         expected: 'goal-decision-making' },
  { q: '¿Cómo validar una estrategia antes de invertir?',       expected: 'goal-decision-making' },
  { q: '¿Cómo comparar sucursales?',                            expected: 'goal-franchises' },
  { q: '¿Cuál es la mejor zona para abrir?',                    expected: 'goal-choose-location' },
  // Tecnología
  { q: '¿Tiene API?',                                            expected: 'faq-api-integration' },
  { q: '¿Cómo se integra con mi sistema?',                      expected: 'faq-api-integration' },
  { q: '¿Necesito un SDK?',                                     expected: 'faq-api-integration' },
  { q: '¿Cuánto tarda implementarlo?',                          expected: 'faq-api-integration' },
  { q: '¿Necesito desarrollador?',                              expected: 'faq-api-integration' },
  { q: '¿Cómo digitalizar puntos físicos?',                    expected: 'goal-digital-transformation' },
  { q: '¿Cómo conectar el mundo físico con el digital?',       expected: 'goal-digital-transformation' },
  { q: '¿Funciona con mi app?',                                 expected: 'faq-api-integration' },
  { q: '¿Cómo obtener datos del comportamiento presencial?',   expected: 'goal-measure-physical' },
  { q: '¿Funciona sin hardware?',                               expected: 'faq-no-hardware' },
]

// ── Validación industrias ─────────────────────────────────────────────────

console.log('══════════════════════════════════════════════════════════════')
console.log('INDUSTRY & SCENARIO LAYER — VALIDACIÓN (25 QUERIES)')
console.log('══════════════════════════════════════════════════════════════')

let pass = 0
const industryFails: { q: string; expected: string; got: string; score: number }[] = []

for (const { q, expected } of industryTable) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const score = r.winner?.score ?? 0
  const ok = id === expected
  if (ok) pass++
  else industryFails.push({ q, expected, got: id, score })
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(' | ') ?? '—'
  console.log(`${ok ? '✓' : '✗'} [${id}] score=${score}  "${q}"`)
  if (!ok) console.log(`   expected: ${expected}  keys: ${keys}`)
}

console.log(`\n${pass}/${industryTable.length} pasan`)

// ── Regresión ─────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════════')
console.log('REGRESIÓN — 50 QUERIES PREVIOS')
console.log('══════════════════════════════════════════════════════════════')

let regPass = 0
const regFails: { q: string; expected: string; got: string }[] = []

for (const { q, expected } of regression) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const ok = id === expected
  if (ok) regPass++
  else regFails.push({ q, expected, got: id })
  const keys = r.winner?.matchedKeywords?.slice(0, 1).join(' | ') ?? '—'
  console.log(`${ok ? '✓' : '✗'} [${id}]  "${q}"`)
  if (!ok) console.log(`   expected: ${expected}  keys: ${keys}`)
}

console.log(`\n${regPass}/${regression.length} regresiones OK`)

// ── Resumen ───────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════════')
console.log('RESUMEN')
console.log('══════════════════════════════════════════════════════════════')
console.log(`Industrias : ${pass}/${industryTable.length}`)
console.log(`Regresión  : ${regPass}/${regression.length}`)

if (industryFails.length > 0) {
  console.log('\n── FALLOS INDUSTRIA ─────────────────────────────────────────')
  for (const f of industryFails)
    console.log(`  ✗ expected=${f.expected}  got=${f.got}  score=${f.score}\n    Q: ${f.q}`)
}
if (regFails.length > 0) {
  console.log('\n── FALLOS REGRESIÓN ─────────────────────────────────────────')
  for (const f of regFails)
    console.log(`  ✗ expected=${f.expected}  got=${f.got}\n    Q: ${f.q}`)
}
