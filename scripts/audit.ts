import { auditMatch } from '../src/knowledge/solutionMatcher.ts'

const queries = [
  'Tengo 12 sucursales y quiero saber cuál aporta más valor al negocio.',
  '¿Cómo puedo demostrarle a un cliente que una activación presencial sí generó interacción?',
  '¿Sirve para verificar que mis trabajadores realmente estuvieron donde debían estar?',
  'Tengo tres sucursales y quiero saber cuál me genera mejores resultados.',
  'Quiero premiar a los clientes que visiten más de una tienda.',
  '¿Me sirve para comprobar que alguien realmente estuvo en un lugar?',
  'Quiero saber dónde se junta más gente dentro de una zona.',
  'Tengo una app y quiero que ciertas cosas aparezcan solo cuando alguien llegue a un lugar específico.',
  'Estoy evaluando abrir una nueva sucursal. ¿Cómo podría ayudarme Ubyca?',
  '¿Cuál es la diferencia entre usar Ubyca y simplemente poner un QR en cada ubicación?',
]

for (let i = 0; i < queries.length; i++) {
  const result = auditMatch(queries[i])
  console.log(`\n${'='.repeat(70)}`)
  console.log(`Q${i + 1}: ${result.query}`)
  console.log(`Norm: ${result.normalized}`)
  console.log(`\nTop 3 matches:`)
  if (result.top3.length === 0) {
    console.log('  [sin match — FALLBACK]')
  } else {
    result.top3.forEach((c, idx) => {
      console.log(`  #${idx + 1} [${c.type}] ${c.id}  score=${c.score}`)
      console.log(`       keywords: ${c.matchedKeywords.join(' | ')}`)
    })
  }
  console.log(`\nRESULTADO: ${result.winner ? `${result.winner.id} (${result.winner.type}, score=${result.winner.score})` : 'FALLBACK'}`)
}
