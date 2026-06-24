import { auditMatch } from '../src/knowledge/solutionMatcher'

const TARGET = 'goal-decision-making'

const required: string[] = [
  '¿Cómo puedo tomar mejores decisiones para mi negocio?',
  '¿Cómo saber dónde invertir?',
  '¿Cómo decidir qué sucursal merece más inversión?',
  '¿Cómo identificar oportunidades de crecimiento?',
  '¿Cómo saber qué local funciona mejor?',
  '¿Cómo decidir dónde abrir una nueva sucursal?',
  '¿Cómo comparar el desempeño de mis ubicaciones?',
  '¿Cómo validar una estrategia antes de invertir?',
]

// Regresiones — los goals existentes no deben cambiar
const regression: { q: string; expected: string }[] = [
  { q: '¿Cómo aumento mis ventas?',                   expected: 'goal-increase-sales' },
  { q: '¿Cómo capto más clientes?',                   expected: 'goal-attract-customers' },
  { q: '¿Cómo mido el retorno de mis campañas?',      expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo controlo mis técnicos?',                expected: 'goal-improve-operations' },
  { q: '¿Cómo valido una zona antes de invertir?',    expected: 'goal-choose-location' },
  { q: '¿Cómo personalizo la experiencia?',           expected: 'goal-customer-experience' },
  // Regresiones adicionales sobre goals adyacentes
  { q: '¿Cómo elegir dónde expandirme?',              expected: 'goal-choose-location' },
  { q: '¿Dónde abrir mi próxima tienda?',             expected: 'goal-choose-location' },
  { q: '¿Cómo demuestro impacto a mi cliente?',       expected: 'goal-measure-marketing-roi' },
  { q: '¿Necesito hardware?',                         expected: 'faq-no-hardware' },
  { q: '¿Tiene API?',                                 expected: 'faq-api-integration' },
]

console.log('── TABLA DE VALIDACIÓN REQUERIDA ───────────────────────────────')
let pass = 0
for (const q of required) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const score = r.winner?.score ?? 0
  const ok = id === TARGET
  if (ok) pass++
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(' | ') ?? '—'
  console.log(`${ok ? '✓' : '✗'} [${id}] score=${score}`)
  console.log(`   Q: ${q}`)
  console.log(`   keys: ${keys}`)
}
console.log(`\n${pass}/${required.length} pasan → ${TARGET}`)

console.log('\n── REGRESIÓN ───────────────────────────────────────────────────')
let regPass = 0
for (const { q, expected } of regression) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const ok = id === expected
  if (ok) regPass++
  const keys = r.winner?.matchedKeywords?.slice(0, 1).join(' | ') ?? '—'
  console.log(`${ok ? '✓' : '✗'} [${id}]  "${q}"`)
  if (!ok) console.log(`   expected: ${expected}  keys: ${keys}`)
}
console.log(`\n${regPass}/${regression.length} regresiones OK`)
