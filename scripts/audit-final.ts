import { auditMatch } from '../src/knowledge/solutionMatcher'

type Profile = 'CEO' | 'Marketing' | 'Operaciones' | 'Comercial' | 'Tecnología'
type Result = 'CORRECT' | 'FALSE_POSITIVE' | 'DEFAULT'

interface Query {
  profile: Profile
  q: string
  expected: string
}

const queries: Query[] = [
  // ── CEO (10) ──────────────────────────────────────────────────────────────
  { profile: 'CEO',        q: '¿Por qué debería implementar Ubyca?',                      expected: 'faq-why-ubyca' },
  { profile: 'CEO',        q: '¿Qué gano con Ubyca?',                                     expected: 'faq-why-ubyca' },
  { profile: 'CEO',        q: '¿Cómo puedo tomar mejores decisiones para mi negocio?',    expected: 'goal-decision-making' },
  { profile: 'CEO',        q: '¿Qué problema resuelve Ubyca?',                            expected: 'faq-why-ubyca' },
  { profile: 'CEO',        q: '¿Cuál es la diferencia entre Ubyca y Google Analytics?',  expected: 'faq-vs-google-analytics' },
  { profile: 'CEO',        q: '¿Necesito hardware?',                                      expected: 'faq-no-hardware' },
  { profile: 'CEO',        q: '¿Cómo saber qué sucursal funciona mejor?',                expected: 'goal-decision-making' },
  { profile: 'CEO',        q: '¿Cómo identificar oportunidades de crecimiento?',         expected: 'goal-decision-making' },
  { profile: 'CEO',        q: '¿Cómo digitalizo mis sucursales?',                        expected: 'goal-digital-transformation' },
  { profile: 'CEO',        q: '¿Para qué sirve Ubyca?',                                  expected: 'faq-what-is-ubyca' },

  // ── Marketing (10) ───────────────────────────────────────────────────────
  { profile: 'Marketing',  q: '¿Cómo mido el retorno de mis campañas?',                  expected: 'goal-measure-marketing-roi' },
  { profile: 'Marketing',  q: '¿Cómo justifico una inversión en marketing?',             expected: 'goal-measure-marketing-roi' },
  { profile: 'Marketing',  q: '¿Cómo demuestro impacto a mi cliente?',                  expected: 'goal-measure-marketing-roi' },
  { profile: 'Marketing',  q: '¿Cómo genero más tráfico al local?',                     expected: 'goal-attract-customers' },
  { profile: 'Marketing',  q: '¿Cómo sorprendo a mis clientes?',                        expected: 'goal-customer-experience' },
  { profile: 'Marketing',  q: '¿Por qué usar Ubyca si ya tengo Google Analytics?',      expected: 'faq-vs-google-analytics' },
  { profile: 'Marketing',  q: '¿Cómo personalizo la experiencia?',                      expected: 'goal-customer-experience' },
  { profile: 'Marketing',  q: '¿Cómo premio clientes frecuentes?',                      expected: 'goal-improve-loyalty' },
  { profile: 'Marketing',  q: '¿Cómo aumento mis ventas?',                              expected: 'goal-increase-sales' },
  { profile: 'Marketing',  q: '¿Cómo hacer marketing geolocalizado?',                   expected: 'goal-marketing' },

  // ── Operaciones (10) ─────────────────────────────────────────────────────
  { profile: 'Operaciones', q: '¿Cómo controlo mis técnicos?',                           expected: 'goal-improve-operations' },
  { profile: 'Operaciones', q: '¿Cómo hago más eficiente mi operación?',                expected: 'goal-improve-operations' },
  { profile: 'Operaciones', q: '¿Cómo saber qué pasa en mis locales?',                  expected: 'goal-measure-physical' },
  { profile: 'Operaciones', q: '¿Cómo medir lo que ocurre físicamente?',                expected: 'goal-measure-physical' },
  { profile: 'Operaciones', q: '¿Cómo reduzco errores en terreno?',                     expected: 'goal-improve-operations' },
  { profile: 'Operaciones', q: '¿Necesito instalar algo en el local?',                  expected: 'faq-no-hardware' },
  { profile: 'Operaciones', q: '¿Cómo auditar personal de campo?',                      expected: 'goal-improve-operations' },
  { profile: 'Operaciones', q: '¿Cómo controlo mis rutas?',                             expected: 'goal-improve-operations' },
  { profile: 'Operaciones', q: '¿Cómo medir permanencia en mis locales?',               expected: 'goal-measure-physical' },
  { profile: 'Operaciones', q: '¿Cómo verifico el cumplimiento operativo?',             expected: 'goal-improve-operations' },

  // ── Comercial (10) ───────────────────────────────────────────────────────
  { profile: 'Comercial',  q: '¿Cómo impulso las ventas?',                              expected: 'goal-increase-sales' },
  { profile: 'Comercial',  q: '¿Cómo capto más clientes?',                              expected: 'goal-attract-customers' },
  { profile: 'Comercial',  q: '¿Cómo fidelizo a mis clientes?',                        expected: 'goal-improve-loyalty' },
  { profile: 'Comercial',  q: '¿Cómo incentivo que vuelvan?',                          expected: 'goal-improve-loyalty' },
  { profile: 'Comercial',  q: '¿Cómo valido una zona antes de invertir?',              expected: 'goal-choose-location' },
  { profile: 'Comercial',  q: '¿Cómo comparar el desempeño de mis ubicaciones?',       expected: 'goal-decision-making' },
  { profile: 'Comercial',  q: '¿Cómo decidir dónde abrir una nueva sucursal?',         expected: 'goal-decision-making' },
  { profile: 'Comercial',  q: '¿Cómo validar una estrategia antes de invertir?',       expected: 'goal-decision-making' },
  { profile: 'Comercial',  q: '¿Cómo comparar sucursales?',                            expected: 'goal-decision-making' },
  { profile: 'Comercial',  q: '¿Cuál es la mejor zona para abrir?',                   expected: 'goal-choose-location' },

  // ── Tecnología (10) ──────────────────────────────────────────────────────
  { profile: 'Tecnología', q: '¿Tiene API?',                                            expected: 'faq-api-integration' },
  { profile: 'Tecnología', q: '¿Cómo se integra con mi sistema?',                      expected: 'faq-api-integration' },
  { profile: 'Tecnología', q: '¿Necesito un SDK?',                                     expected: 'faq-api-integration' },
  { profile: 'Tecnología', q: '¿Cuánto tarda implementarlo?',                          expected: 'faq-api-integration' },
  { profile: 'Tecnología', q: '¿Necesito desarrollador?',                              expected: 'faq-api-integration' },
  { profile: 'Tecnología', q: '¿Cómo digitalizar puntos físicos?',                    expected: 'goal-digital-transformation' },
  { profile: 'Tecnología', q: '¿Cómo conectar el mundo físico con el digital?',       expected: 'goal-digital-transformation' },
  { profile: 'Tecnología', q: '¿Funciona con mi app?',                                 expected: 'faq-api-integration' },
  { profile: 'Tecnología', q: '¿Cómo obtener datos del comportamiento presencial?',   expected: 'goal-measure-physical' },
  { profile: 'Tecnología', q: '¿Funciona sin hardware?',                               expected: 'faq-no-hardware' },
]

// ── Ejecución ─────────────────────────────────────────────────────────────

type ProfileStats = { correct: number; falsePos: number; def: number; total: number }
const profileStats: Record<Profile, ProfileStats> = {
  'CEO':         { correct: 0, falsePos: 0, def: 0, total: 0 },
  'Marketing':   { correct: 0, falsePos: 0, def: 0, total: 0 },
  'Operaciones': { correct: 0, falsePos: 0, def: 0, total: 0 },
  'Comercial':   { correct: 0, falsePos: 0, def: 0, total: 0 },
  'Tecnología':  { correct: 0, falsePos: 0, def: 0, total: 0 },
}

const globalStats = { correct: 0, falsePos: 0, def: 0 }
const failures: { profile: Profile; q: string; expected: string; got: string; type: Result }[] = []

let currentProfile: Profile | null = null

for (const { profile, q, expected } of queries) {
  if (profile !== currentProfile) {
    console.log(`\n── ${profile.toUpperCase()} ──────────────────────────────────────────`)
    currentProfile = profile
  }

  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const score = r.winner?.score ?? 0
  const isFallback = r.isFallback

  let result: Result
  if (isFallback) result = 'DEFAULT'
  else if (id === expected) result = 'CORRECT'
  else result = 'FALSE_POSITIVE'

  profileStats[profile].total++
  if (result === 'CORRECT')       { profileStats[profile].correct++;  globalStats.correct++ }
  else if (result === 'DEFAULT')  { profileStats[profile].def++;      globalStats.def++ }
  else                            { profileStats[profile].falsePos++; globalStats.falsePos++; failures.push({ profile, q, expected, got: id, type: result }) }

  const mark = result === 'CORRECT' ? '✓' : result === 'DEFAULT' ? '-' : '✗'
  const keys = r.winner?.matchedKeywords?.slice(0, 1).join('') ?? '—'
  console.log(`${mark} [${id}] score=${score}  "${q}"`)
  if (result !== 'CORRECT') console.log(`   expected: ${expected}  got: ${id}  keys: ${keys}`)
}

// ── Resumen por perfil ─────────────────────────────────────────────────────
console.log('\n\n═══════════════════════════════════════════════════════════')
console.log('RESUMEN POR PERFIL')
console.log('═══════════════════════════════════════════════════════════')
console.log(`${'Perfil'.padEnd(14)} ${'Correcto'.padEnd(10)} ${'Falso+'.padEnd(8)} ${'Default'.padEnd(8)} Total`)
console.log('─'.repeat(52))
for (const [p, s] of Object.entries(profileStats)) {
  const pct = Math.round((s.correct / s.total) * 100)
  console.log(`${p.padEnd(14)} ${String(s.correct).padEnd(10)} ${String(s.falsePos).padEnd(8)} ${String(s.def).padEnd(8)} ${s.total} (${pct}%)`)
}

// ── Resumen global ─────────────────────────────────────────────────────────
const total = 50
const pct = Math.round((globalStats.correct / total) * 100)
console.log('\n═══════════════════════════════════════════════════════════')
console.log('RESULTADO GLOBAL')
console.log('═══════════════════════════════════════════════════════════')
console.log(`Correct Match   : ${globalStats.correct}/${total} (${pct}%)`)
console.log(`False Positives : ${globalStats.falsePos}/${total}`)
console.log(`Default         : ${globalStats.def}/${total}`)
console.log(`\nUmbral >90% correcto : ${pct >= 90 ? '✓ PASA' : '✗ NO PASA'} (objetivo: ≥45/50)`)
console.log(`Umbral <5% default   : ${globalStats.def <= 2 ? '✓ PASA' : '✗ NO PASA'} (objetivo: ≤2/50)`)

if (failures.length > 0) {
  console.log('\n── FALLOS DETALLADOS ────────────────────────────────────────')
  for (const f of failures) {
    console.log(`[${f.profile}] ${f.type}`)
    console.log(`  Q: ${f.q}`)
    console.log(`  expected: ${f.expected}  got: ${f.got}`)
  }
}
