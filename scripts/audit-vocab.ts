import { auditMatch } from '../src/knowledge/solutionMatcher.ts'

const queries = [
  // 1. Performance de sucursales
  'Tengo 20 sucursales. ¿Cómo sé cuáles realmente están aportando valor al negocio?',
  'Quiero saber cuáles de mis tiendas generan más interés entre los clientes.',
  '¿Qué sucursal funciona mejor?',
  '¿Qué local genera mejores resultados?',
  '¿Cuál aporta más valor?',
  // 2. Campañas
  'Mi jefe me pidió demostrar si una campaña presencial tuvo impacto.',
  '¿Cómo demuestro que una activación funcionó?',
  '¿Cómo justifico una campaña en terreno?',
  '¿Cómo sé si tuvo resultados?',
  // 3. Operaciones
  '¿Cómo puedo verificar que mis contratistas visitaron los puntos asignados?',
  '¿Cómo controlo a proveedores en terreno?',
  '¿Cómo verifico cuadrillas?',
  '¿Cómo sé si personal externo fue al lugar?',
  // 4. Turismo
  'Quiero que las personas descubran distintos lugares de una ciudad mientras avanzan por una ruta.',
  'Quiero que exploren distintos puntos.',
  'Quiero crear una experiencia de exploración urbana.',
  'Quiero un recorrido guiado.',
  // 5. Apps existentes
  'Si yo ya tengo una app y una base de clientes, ¿para qué necesitaría Ubyca?',
  'Ya tengo usuarios y una aplicación móvil.',
  '¿Qué agrega Ubyca a mi app?',
  '¿Por qué integrarlo?',
  // 6. Comparación con QR
  '¿Por qué usar Ubyca en lugar de una landing con QR?',
  '¿Qué diferencia hay con un QR?',
  '¿Por qué no usar simplemente QR?',
  '¿Por qué no una página con QR?',
]

for (let i = 0; i < queries.length; i++) {
  const a = auditMatch(queries[i])
  const winner = a.winner
    ? `[${a.winner.type}] ${a.winner.id}  score=${a.winner.score}  keys=[${a.winner.matchedKeywords.join(' | ')}]`
    : '⚠ FALLBACK'
  console.log(`\nQ${String(i + 1).padStart(2, '0')}: ${a.query}`)
  console.log(`  → ${winner}`)
  if (a.top3.length > 1) {
    for (let j = 1; j < a.top3.length; j++) {
      const c = a.top3[j]
      console.log(`     #${j + 1} [${c.type}] ${c.id}  score=${c.score}  keys=[${c.matchedKeywords.join(' | ')}]`)
    }
  }
}
