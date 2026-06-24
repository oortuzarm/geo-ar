import { auditMatch } from '../src/knowledge/solutionMatcher'

const queries = [
  '¿Necesito hardware?',
  '¿Requiere hardware?',
  '¿Necesito instalar algo?',
  '¿Funciona sin sensores?',
  '¿Necesito beacons?',
  '¿Hay que instalar algo en el local?',
  // Variantes adicionales del diagnóstico previo
  '¿Necesito instalar algo físico?',
  '¿Requiere dispositivos especiales?',
  '¿Funciona sin hardware adicional?',
  '¿Necesito dispositivos físicos?',
]

const TARGET = 'faq-no-hardware'
let pass = 0

for (const q of queries) {
  const r = auditMatch(q)
  const id = r.winner?.id ?? 'DEFAULT'
  const score = r.winner?.score ?? 0
  const ok = id === TARGET
  if (ok) pass++
  const mark = ok ? '✓' : '✗'
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(' | ') ?? ''
  console.log(`${mark} [${id}] score=${score}  "${q}"`)
  if (keys) console.log(`   keys: ${keys}`)
}

console.log(`\n${pass}/${queries.length} → faq-no-hardware`)
