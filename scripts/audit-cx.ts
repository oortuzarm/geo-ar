import { auditMatch } from '../src/knowledge/solutionMatcher'

const TARGET = 'goal-customer-experience'

const required: string[] = [
  '¿Cómo mejorar la experiencia de clientes?',
  '¿Cómo mejorar la experiencia en tienda?',
  '¿Cómo personalizar la experiencia del cliente?',
  '¿Puedo mostrar contenido cuando alguien llega?',
  '¿Puedo dar una bienvenida automática?',
  '¿Cómo sorprender a mis clientes?',
  '¿Cómo crear una experiencia diferente en mis sucursales?',
  '¿Cómo generar una experiencia contextual?',
]

const extra: string[] = [
  '¿Cómo hacer la visita más atractiva?',
  '¿Puedo activar contenido cuando el cliente llega al local?',
  '¿Cómo mejorar la experiencia presencial?',
  '¿Cómo mostrar algo al llegar a mi sucursal?',
]

// Regresión — queries que no deben cambiar de winner
const regression: { q: string; expected: string }[] = [
  { q: '¿Cómo mejorar la experiencia en tienda con un QR?', expected: 'faq-vs-qr' },
  { q: '¿Cómo atraigo más clientes a mi local?',           expected: 'goal-attract-customers' },
  { q: '¿Cómo fidelizo a mis clientes?',                   expected: 'goal-improve-loyalty' },
  { q: '¿Cómo muestro contenido contextual por zona?',     expected: TARGET }, // OK si va a CX goal
]

let pass = 0
console.log('── TABLA DE VALIDACIÓN REQUERIDA ───────────────────────────────')
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

console.log('\n── COBERTURA ADICIONAL ─────────────────────────────────────────')
for (const q of extra) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const score = r.winner?.score ?? 0
  const ok = id === TARGET
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(' | ') ?? '—'
  console.log(`${ok ? '✓' : '—'} [${id}] score=${score}  "${q}"`)
  if (keys) console.log(`   keys: ${keys}`)
}

console.log('\n── REGRESIÓN ───────────────────────────────────────────────────')
let regPass = 0
for (const { q, expected } of regression) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const ok = id === expected
  if (ok) regPass++
  console.log(`${ok ? '✓' : '✗'} [${id}]  "${q}"`)
}
console.log(`\n${regPass}/${regression.length} regresiones OK`)
