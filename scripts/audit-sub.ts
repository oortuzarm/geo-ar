import { auditMatch, matchSolution } from '../src/knowledge/solutionMatcher.ts'

const queries = [
  'Tengo una cadena de restaurantes y quiero saber cuál de mis locales recibe más visitas.',
  'Necesito saber cuáles de mis sucursales funcionan mejor.',
  'Quiero medir qué tan concurrido es un sector.',
  'Quiero saber dónde hay más movimiento de personas.',
  'Estoy evaluando abrir una nueva sucursal. ¿Cómo podría ayudarme Ubyca?',
  '¿Puedo validar que una persona llegó físicamente a un lugar?',
  '¿Se puede usar para registrar visitas en terreno?',
  '¿Sirve para controlar acceso usando ubicación?',
  '¿Cómo puedo demostrar que una campaña generó resultados?',
  'Tengo una app y quiero que ciertas cosas aparezcan solo cuando alguien llegue a un lugar específico.',
]

for (let i = 0; i < queries.length; i++) {
  const audit = auditMatch(queries[i])
  const solution = matchSolution(queries[i])
  console.log(`\n${'='.repeat(70)}`)
  console.log(`Q${i + 1}: ${audit.query}`)
  console.log(`\nMatch ganador: ${audit.winner ? `[${audit.winner.type}] ${audit.winner.id}  score=${audit.winner.score}` : 'FALLBACK'}`)
  console.log(`Sub-intención: ${audit.subIntentionId ?? '(ninguna — usa respuesta genérica)'}`)
  console.log(`\nRESPUESTA:\n${solution.body}`)
}
