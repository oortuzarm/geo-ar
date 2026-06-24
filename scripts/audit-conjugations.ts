import { auditMatch } from '../src/knowledge/solutionMatcher'

const table: { q: string; expected: string }[] = [
  { q: '¿Cómo justifico una inversión en marketing?', expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo mido el retorno de mis campañas?',      expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo demuestro impacto a mi cliente?',       expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo aumento mis ventas?',                   expected: 'goal-increase-sales' },
  { q: '¿Cómo impulso las ventas?',                   expected: 'goal-increase-sales' },
  { q: '¿Cómo capto más clientes?',                   expected: 'goal-attract-customers' },
  { q: '¿Cómo genero más tráfico?',                   expected: 'goal-attract-customers' },
  { q: '¿Cómo premio clientes frecuentes?',           expected: 'goal-improve-loyalty' },
  { q: '¿Cómo incentivo que vuelvan?',                expected: 'goal-improve-loyalty' },
  { q: '¿Cómo controlo mis técnicos?',                expected: 'goal-improve-operations' },
  { q: '¿Cómo hago más eficiente mi operación?',      expected: 'goal-improve-operations' },
  { q: '¿Cómo valido una zona antes de invertir?',    expected: 'goal-choose-location' },
  { q: '¿Cómo personalizo la experiencia?',           expected: 'goal-customer-experience' },
  { q: '¿Cómo sorprendo a mis clientes?',             expected: 'goal-customer-experience' },
]

// Regresión — queries que deben seguir igual
const regression: { q: string; expected: string }[] = [
  { q: '¿Cómo aumento las ventas en mi tienda física?', expected: 'goal-increase-sales' },
  { q: '¿Cómo atraigo más clientes a mi local?',        expected: 'goal-attract-customers' },
  { q: '¿Cómo fidelizo a mis clientes?',                expected: 'goal-improve-loyalty' },
  { q: '¿Cómo mido el impacto de mis campañas?',        expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo controlo equipos en terreno?',            expected: 'goal-improve-operations' },
  { q: '¿Dónde abrir mi próxima tienda?',               expected: 'goal-choose-location' },
  { q: '¿Cómo mejorar la experiencia en tienda?',       expected: 'goal-customer-experience' },
  { q: '¿Necesito hardware?',                           expected: 'faq-no-hardware' },
  { q: '¿Tiene API?',                                   expected: 'faq-api-integration' },
]

console.log('── TABLA DE VALIDACIÓN CONJUGACIONES ──────────────────────────')
let pass = 0
for (const { q, expected } of table) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const score = r.winner?.score ?? 0
  const ok = id === expected
  if (ok) pass++
  const mark = ok ? '✓' : '✗'
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(' | ') ?? '—'
  console.log(`${mark} [${id}] score=${score}`)
  console.log(`   Q: ${q}`)
  console.log(`   keys: ${keys}`)
}
console.log(`\n${pass}/${table.length} pasan`)

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
