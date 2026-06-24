import { auditMatch } from '../src/knowledge/solutionMatcher'

const TARGET = 'faq-vs-google-analytics'

const required: { q: string }[] = [
  { q: '¿Cuál es la diferencia entre Ubyca y Google Analytics?' },
  { q: '¿Por qué usar Ubyca si ya tengo Google Analytics?' },
  { q: '¿Google Analytics no hace lo mismo?' },
  { q: '¿Qué aporta Ubyca que no tenga GA4?' },
  { q: '¿Es parecido a Google Analytics?' },
  { q: '¿Reemplaza Google Analytics?' },
  { q: '¿Ubyca compite con Google Analytics?' },
]

// Cobertura adicional (no obligatoria pero deseable)
const extra: string[] = [
  '¿Para qué sirve si ya tengo Google Analytics?',
  '¿Es lo mismo que Google Analytics?',
  '¿Qué aporta Ubyca que no tenga Google Analytics?',
  '¿Sustituye Google Analytics?',
]

// Regresión — queries previas que no deben cambiar
const regression: { q: string; expected: string }[] = [
  { q: '¿Ubyca vs QR?',                        expected: 'faq-vs-qr' },
  { q: '¿Cómo mido el retorno de mis campañas?', expected: 'goal-measure-marketing-roi' },
  { q: '¿Tiene API?',                           expected: 'faq-api-integration' },
  { q: '¿Necesito hardware?',                   expected: 'faq-no-hardware' },
  { q: '¿Cómo fidelizo a mis clientes?',        expected: 'goal-improve-loyalty' },
  { q: '¿Cómo mido el impacto de mis campañas?', expected: 'goal-measure-marketing-roi' },
]

console.log('── TABLA DE VALIDACIÓN REQUERIDA ───────────────────────────────')
let pass = 0
for (const { q } of required) {
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

console.log('\n── COBERTURA ADICIONAL ─────────────────────────────────────────')
for (const q of extra) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const score = r.winner?.score ?? 0
  const ok = id === TARGET
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(' | ') ?? '—'
  console.log(`${ok ? '✓' : '—'} [${id}] score=${score}  "${q}"`)
  if (keys !== '—') console.log(`   keys: ${keys}`)
}

console.log('\n── REGRESIÓN ───────────────────────────────────────────────────')
let regPass = 0
for (const { q, expected } of regression) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const ok = id === expected
  if (ok) regPass++
  console.log(`${ok ? '✓' : '✗'} [${id}]  "${q}"`)
  if (!ok) console.log(`   expected: ${expected}`)
}
console.log(`\n${regPass}/${regression.length} regresiones OK`)
