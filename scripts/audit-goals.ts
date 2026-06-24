import { matchSolution, auditMatch } from '../src/knowledge/solutionMatcher'

const queries: { q: string; expected: string }[] = [
  // goal-increase-sales
  { q: '¿Cómo puedo aumentar las ventas en mi tienda física?', expected: 'goal-increase-sales' },
  { q: '¿Cómo vendo más?', expected: 'goal-increase-sales' },
  { q: '¿Cómo mejorar los resultados de mi local?', expected: 'goal-increase-sales' },
  // goal-attract-customers
  { q: '¿Cómo atraigo más clientes a mi local?', expected: 'goal-attract-customers' },
  { q: '¿Cómo llevo más gente a mis sucursales?', expected: 'goal-attract-customers' },
  { q: '¿Cómo incremento el tráfico en mis locales?', expected: 'goal-attract-customers' },
  // goal-improve-loyalty
  { q: '¿Cómo fidelizo a mis clientes?', expected: 'goal-improve-loyalty' },
  { q: '¿Cómo logro que vuelvan mis clientes?', expected: 'goal-improve-loyalty' },
  { q: '¿Cómo aumento la frecuencia de visita?', expected: 'goal-improve-loyalty' },
  // goal-measure-marketing-roi
  { q: '¿Cómo mido el impacto de mis campañas?', expected: 'goal-measure-marketing-roi' },
  { q: '¿Cómo demuestro el retorno de una campaña?', expected: 'goal-measure-marketing-roi' },
  // goal-improve-operations
  { q: '¿Cómo controlo a mis equipos en terreno?', expected: 'goal-improve-operations' },
  { q: '¿Cómo sé si mis vendedores cumplieron la ruta?', expected: 'goal-improve-operations' },
  // goal-choose-location
  { q: '¿Dónde me conviene abrir mi nueva tienda?', expected: 'goal-choose-location' },
  { q: '¿Cómo elijo la mejor ubicación para expandirme?', expected: 'goal-choose-location' },
  // Regresión — queries previas deben mantener su winner
  { q: 'Tengo una cadena de restaurantes y quiero saber cuál de mis locales recibe más visitas.', expected: 'spatial-concentration' },
  { q: 'Estoy evaluando abrir una nueva sucursal. ¿Cómo podría ayudarme Ubyca?', expected: 'urban-mobility-study' },
  { q: '¿Por qué usar Ubyca en lugar de una landing con QR?', expected: 'faq-vs-qr' },
]

let pass = 0
let fail = 0

for (const { q, expected } of queries) {
  const audit = auditMatch(q)
  const winner = audit.winner?.id ?? 'DEFAULT'
  const ok = winner === expected
  if (ok) pass++
  else fail++
  const mark = ok ? '✓' : '✗'
  console.log(`${mark} [${winner}] ${q}`)
  if (!ok) {
    console.log(`  → expected: ${expected}`)
    if (audit.top3.length > 0) {
      console.log(`  → top3: ${audit.top3.map(c => `${c.id}(${c.score})`).join(', ')}`)
    }
  }
}

console.log(`\n${pass}/${queries.length} passed`)
