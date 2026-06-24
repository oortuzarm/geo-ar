import { auditMatch } from '../src/knowledge/solutionMatcher'

const TARGET = 'faq-api-integration'

const queries: { q: string; label: string }[] = [
  { q: '¿Tiene API?',                              label: 'tiene api' },
  { q: '¿Tienen API?',                             label: 'tienen api' },
  { q: '¿Cómo se integra?',                        label: 'se integra' },
  { q: '¿Cómo se integra con mi sistema?',         label: 'se integra con mi sistema' },
  { q: '¿Funciona con mi app?',                    label: 'funciona con mi app' },
  { q: '¿Necesito un desarrollador?',              label: 'necesito un desarrollador' },
  { q: '¿Hace falta programar?',                   label: 'hace falta programar' },
  { q: '¿Necesito un SDK?',                        label: 'necesito un sdk' },
  { q: '¿Cuánto tarda implementarlo?',             label: 'cuanto tarda implementarlo' },
  { q: '¿Cómo conecto Ubyca con mi plataforma?',  label: 'conecto ubyca' },
  // Variantes adicionales
  { q: '¿Necesito programar para usarlo?',         label: 'sin programar' },
  { q: '¿Cuánto tiempo tarda la integración?',     label: 'cuanto tiempo tarda' },
  { q: '¿Se puede integrar con mi web?',           label: 'se puede integrar' },
  { q: '¿Funciona con mi plataforma?',             label: 'funciona con mi plataforma' },
]

// Regresión: verificar que faqAppIntegration sigue cubriendo sus queries originales
const regressionQueries: { q: string; expected: string }[] = [
  { q: 'Quiero integrar Ubyca con mi app',         expected: 'faq-app-integration' },
  { q: '¿Tienen SDK para Android?',                expected: 'faq-app-integration' },
  { q: '¿Necesito hardware?',                      expected: 'faq-no-hardware' },
]

let pass = 0
console.log('── TABLA DE VALIDACIÓN PRINCIPAL ──────────────────────────────')
for (const { q, label } of queries) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const score = r.winner?.score ?? 0
  const ok = id === TARGET
  if (ok) pass++
  const mark = ok ? '✓' : '✗'
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(' | ') ?? '—'
  console.log(`${mark} [${id}] score=${score}`)
  console.log(`   Q: ${q}`)
  console.log(`   keys: ${keys}`)
}
console.log(`\n${pass}/${queries.length} → ${TARGET}\n`)

console.log('── REGRESIÓN ───────────────────────────────────────────────────')
let regPass = 0
for (const { q, expected } of regressionQueries) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const ok = id === expected
  if (ok) regPass++
  console.log(`${ok ? '✓' : '✗'} [${id}]  "${q}"`)
}
console.log(`\n${regPass}/${regressionQueries.length} regresiones OK`)
