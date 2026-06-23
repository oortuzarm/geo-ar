import { auditMatch } from '../src/knowledge/solutionMatcher.ts'
import { matchSolution } from '../src/knowledge/solutionMatcher.ts'

const queries = [
  'Tengo una cadena de restaurantes y quiero saber cuál de mis locales recibe más visitas.',
  'Necesito saber cuáles de mis sucursales funcionan mejor.',
  '¿Puedo saber cuál de mis puntos genera más interacción?',
  '¿Cómo puedo demostrar que una campaña generó resultados?',
  '¿Cómo puedo medir si una activación de marca realmente funcionó?',
  '¿Sirve para controlar acceso usando ubicación?',
  '¿Se puede usar para registrar visitas en terreno?',
  '¿Puedo validar que una persona llegó físicamente a un lugar?',
  'Quiero medir qué tan concurrido es un sector.',
  'Quiero saber dónde hay más movimiento de personas.',
]

for (let i = 0; i < queries.length; i++) {
  const audit = auditMatch(queries[i])
  const solution = matchSolution(queries[i])
  console.log(`\n${'='.repeat(70)}`)
  console.log(`Q${i + 1}: ${audit.query}`)
  console.log(`Norm: ${audit.normalized}`)
  console.log(`\nTop 3 matches:`)
  if (audit.top3.length === 0) {
    console.log('  [sin match — FALLBACK]')
  } else {
    audit.top3.forEach((c, idx) => {
      console.log(`  #${idx + 1} [${c.type}] ${c.id}  score=${c.score}`)
      console.log(`       keywords: ${c.matchedKeywords.join(' | ')}`)
    })
  }
  console.log(`\nGANADOR: ${audit.winner ? `${audit.winner.id} (${audit.winner.type}, score=${audit.winner.score})` : 'FALLBACK'}`)
  console.log(`\nRESPUESTA (primeros 200 chars): ${solution.body.slice(0, 200)}...`)
}
