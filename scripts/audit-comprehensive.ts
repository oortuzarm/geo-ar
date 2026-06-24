import { auditMatch, normalize } from '../src/knowledge/solutionMatcher'
import { knowledge } from '../src/knowledge/index'

// ── Queries problemáticas mencionadas por el usuario ──────────────────────────
const problemQueries = [
  '¿Cómo justifico una inversión en marketing?',
  '¿Cómo llevo más personas al local?',
  '¿Cómo premio visitas presenciales?',
  '¿Cómo activo promociones por ubicación?',
  '¿Cómo se integra?',
  '¿Tiene API?',
  '¿Necesito hardware?',
  '¿Cómo aumento ventas en mi tienda física?',
  '¿Cómo mejorar la experiencia de clientes?',
  '¿Cómo hacer más eficiente mi operación?',
]

// ── Top 20 preguntas ejecutivas por perfil ────────────────────────────────────
const executiveQueries = [
  // Gerente General
  '¿Cómo me ayuda Ubyca a tomar mejores decisiones de negocio?',
  '¿Cuánto cuesta implementar Ubyca?',
  '¿Qué diferencia a Ubyca de Google Analytics?',
  '¿Cuánto tiempo tarda en implementarse?',
  '¿Necesito un desarrollador para usar Ubyca?',
  // Gerente de Marketing
  '¿Cómo mido el retorno de mis campañas presenciales?',
  '¿Cómo activo contenido por cercanía al local?',
  '¿Puedo hacer marketing basado en ubicación?',
  '¿Cómo sé cuánta gente responde a mis promociones?',
  '¿Cómo demuestro el impacto de una activación de marca?',
  // Gerente de Operaciones
  '¿Cómo verifico que mi equipo visitó los puntos asignados?',
  '¿Cómo reduzco el fraude de asistencia en terreno?',
  '¿Cómo controlo mis rutas de distribución?',
  '¿Cómo gestiono personal externo en campo?',
  '¿Puedo auditar la presencia de terceros?',
  // Gerente Comercial
  '¿Cómo aumento el ticket promedio en tienda física?',
  '¿Cómo identifico mis sucursales con mejor rendimiento?',
  '¿Cómo bajo la tasa de abandono en el local?',
  '¿Cómo genero más visitas recurrentes?',
  '¿Cómo elijo dónde abrir mi próxima sucursal?',
]

// ── Cobertura comercial — áreas a evaluar ─────────────────────────────────────
const coverageProbe: { area: string; queries: string[] }[] = [
  { area: 'AUMENTAR VENTAS', queries: [
    '¿Cómo aumento las ventas?',
    '¿Cómo vendo más en mi tienda?',
    '¿Cómo impulso las ventas en el local?',
    '¿Cómo incremento mis ingresos?',
  ]},
  { area: 'ATRAER CLIENTES', queries: [
    '¿Cómo llevo más gente a mi tienda?',
    '¿Cómo capto más clientes?',
    '¿Cómo genero más tráfico?',
    '¿Cómo atraigo personas al local?',
  ]},
  { area: 'FIDELIZACIÓN', queries: [
    '¿Cómo premio a mis clientes frecuentes?',
    '¿Cómo fidelizo a los clientes de mi local?',
    '¿Cómo armo un programa de puntos por visita?',
    '¿Cómo incentivo que vuelvan?',
  ]},
  { area: 'EXPERIENCIA DE CLIENTE', queries: [
    '¿Cómo mejoro la experiencia en tienda?',
    '¿Cómo personalizo la experiencia según dónde está el cliente?',
    '¿Cómo activo contenido cuando el cliente llega al local?',
    '¿Cómo sorprendo al cliente en el punto de venta?',
  ]},
  { area: 'ROI MARKETING', queries: [
    '¿Cómo justifico el gasto en marketing presencial?',
    '¿Cómo mido si una campaña funcionó?',
    '¿Cómo demuestro impacto a mi cliente?',
    '¿Cuánto retorno me da una activación de marca?',
  ]},
  { area: 'EQUIPOS EN TERRENO', queries: [
    '¿Cómo sé que mis vendedores visitaron los clientes?',
    '¿Cómo registro asistencia de campo?',
    '¿Cómo controlo mis rutas de ventas?',
    '¿Cómo audito a mis promotores?',
  ]},
  { area: 'CONTROL OPERACIONAL', queries: [
    '¿Cómo hago más eficiente mi operación?',
    '¿Cómo reduzco errores en terreno?',
    '¿Cómo verifico el cumplimiento operativo?',
    '¿Cómo controlo a mis técnicos?',
  ]},
  { area: 'SELECCIÓN DE UBICACIONES', queries: [
    '¿Cómo elijo dónde abrir?',
    '¿Dónde debería abrir mi próxima tienda?',
    '¿Cómo valido una zona antes de invertir?',
    '¿Qué zona tiene más potencial?',
  ]},
  { area: 'INTEGRACIÓN / API / TECNOLOGÍA', queries: [
    '¿Tiene API?',
    '¿Cómo se integra con mi sistema?',
    '¿Necesito un SDK?',
    '¿Funciona con mi app actual?',
  ]},
  { area: 'HARDWARE / INFRAESTRUCTURA', queries: [
    '¿Necesito hardware?',
    '¿Necesito instalar algo físico?',
    '¿Requiere dispositivos especiales?',
    '¿Funciona sin hardware adicional?',
  ]},
  { area: 'SEGURIDAD / ACCESO', queries: [
    '¿Cómo controlo el acceso a zonas restringidas?',
    '¿Cómo evito que personas no autorizadas accedan?',
    '¿Puedo controlar quién entra a mi instalación?',
  ]},
]

// ── Función auxiliar ──────────────────────────────────────────────────────────
function runQuery(q: string) {
  const r = auditMatch(q)
  const winner = r.winner
  const type = winner?.type ?? 'DEFAULT'
  const id = winner?.id ?? '—'
  const score = winner?.score ?? 0
  const fallback = r.isFallback
  const keys = winner?.matchedKeywords?.slice(0, 3).join(' | ') ?? ''
  return { q, type, id, score, fallback, keys, top3: r.top3 }
}

// ── PARTE A — Queries problemáticas ──────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════')
console.log('PARTE A — DIAGNÓSTICO DE QUERIES PROBLEMÁTICAS')
console.log('═══════════════════════════════════════════════════════════')
for (const q of problemQueries) {
  const { type, id, score, fallback, keys, top3 } = runQuery(q)
  const mark = fallback ? '✗ FALLBACK' : `✓ ${type}`
  console.log(`\n${mark} [${id}] score=${score}`)
  console.log(`  Q: ${q}`)
  if (keys) console.log(`  keys: ${keys}`)
  if (!fallback && top3.length > 1) {
    const others = top3.slice(1).map(c => `${c.id}(${c.score})`).join(', ')
    console.log(`  alternativas: ${others}`)
  }
  if (fallback && top3.length > 0) {
    console.log(`  mejores candidatos: ${top3.map(c => `${c.id}(${c.score})`).join(', ')}`)
  }
}

// ── PARTE B — Cobertura comercial ─────────────────────────────────────────────
console.log('\n\n═══════════════════════════════════════════════════════════')
console.log('PARTE B — COBERTURA POR ÁREA COMERCIAL')
console.log('═══════════════════════════════════════════════════════════')
for (const { area, queries } of coverageProbe) {
  const results = queries.map(runQuery)
  const fallbacks = results.filter(r => r.fallback).length
  const status = fallbacks === 0 ? '✓ CUBIERTA' : fallbacks < results.length ? `⚠ PARCIAL (${fallbacks}/${results.length} caen en DEFAULT)` : '✗ SIN COBERTURA'
  console.log(`\n${area}: ${status}`)
  for (const r of results) {
    const mark = r.fallback ? '  ✗' : '  ✓'
    console.log(`${mark} [${r.id}] ${r.q}`)
  }
}

// ── PARTE C — Top 20 ejecutivas ───────────────────────────────────────────────
console.log('\n\n═══════════════════════════════════════════════════════════')
console.log('PARTE C — TOP 20 PREGUNTAS EJECUTIVAS')
console.log('═══════════════════════════════════════════════════════════')
const profiles = ['GM', 'GM', 'GM', 'GM', 'GM', 'Mktg', 'Mktg', 'Mktg', 'Mktg', 'Mktg', 'Ops', 'Ops', 'Ops', 'Ops', 'Ops', 'Comercial', 'Comercial', 'Comercial', 'Comercial', 'Comercial']
for (let i = 0; i < executiveQueries.length; i++) {
  const q = executiveQueries[i]
  const { type, id, score, fallback, keys } = runQuery(q)
  const mark = fallback ? '✗' : '✓'
  const profile = profiles[i]
  console.log(`\n${mark} [${profile}] [${id}] score=${score}`)
  console.log(`  Q: ${q}`)
  if (keys) console.log(`  keys: ${keys}`)
}

// ── PARTE D — Índice completo de keywords por entidad ─────────────────────────
console.log('\n\n═══════════════════════════════════════════════════════════')
console.log('PARTE D — RESUMEN DE KEYWORD COUNT')
console.log('═══════════════════════════════════════════════════════════')
console.log('\nFAQs:')
for (const faq of knowledge.faqs) {
  console.log(`  [${faq.id}] ${faq.questionPatterns.length} patterns`)
}
console.log('\nBusiness Goals:')
for (const goal of knowledge.businessGoals) {
  console.log(`  [${goal.id}] ${goal.matchKeywords.length} keywords`)
}
console.log('\nUse Cases (matchKeywords count):')
for (const uc of knowledge.useCases) {
  const kw = uc.matchKeywords.length
  const flag = kw < 5 ? ' ⚠ MUY POCOS' : ''
  console.log(`  [${uc.id}] ${kw}${flag}`)
}
