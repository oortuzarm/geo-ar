import { matchSolution, auditMatch } from '../src/knowledge/solutionMatcher'

const questions: Array<{ profile: string; label: string; q: string }> = [
  // 1. Gerente General
  { profile: '1-GG', label: 'Gerente General', q: 'Quiero saber cuáles de mis sucursales están rindiendo mejor antes de decidir dónde abrir la próxima' },
  { profile: '1-GG', label: 'Gerente General', q: 'Necesito evidencia real para justificar una inversión en una nueva zona' },
  { profile: '1-GG', label: 'Gerente General', q: 'Tenemos 12 locales y no sé cuáles generan más valor' },
  { profile: '1-GG', label: 'Gerente General', q: 'Cómo decido si expandirme a una ciudad nueva sin tomar un riesgo ciego' },
  { profile: '1-GG', label: 'Gerente General', q: 'Mi directorio me pide datos concretos sobre el rendimiento de cada punto de venta' },
  // 2. Gerente Comercial
  { profile: '2-GC', label: 'Gerente Comercial', q: 'Quiero saber si mis vendedores realmente visitan los clientes o solo reportan que lo hacen' },
  { profile: '2-GC', label: 'Gerente Comercial', q: 'Necesito comparar el rendimiento de mis locales para saber cuáles necesitan intervención' },
  { profile: '2-GC', label: 'Gerente Comercial', q: 'Cómo mido si una campaña de descuentos generó tráfico real a la tienda' },
  { profile: '2-GC', label: 'Gerente Comercial', q: 'Quiero saber en qué horarios hay más personas en mis tiendas para ajustar al equipo de ventas' },
  { profile: '2-GC', label: 'Gerente Comercial', q: 'Necesito demostrarle al dueño que nuestras acciones comerciales realmente generan visitas' },
  // 3. Gerente de Marketing
  { profile: '3-GM', label: 'Gerente de Marketing', q: 'Lancé una activación en tres puntos de venta y no sé cuánta gente realmente participó' },
  { profile: '3-GM', label: 'Gerente de Marketing', q: 'Quiero mostrarle una promoción especial solo a los clientes que están en el local en ese momento' },
  { profile: '3-GM', label: 'Gerente de Marketing', q: 'Cómo demuestro el ROI de una campaña presencial a mi directorio' },
  { profile: '3-GM', label: 'Gerente de Marketing', q: 'Quiero que cuando alguien llegue a mi tienda le aparezca automáticamente una oferta del día' },
  { profile: '3-GM', label: 'Gerente de Marketing', q: 'Necesito saber cuánto tiempo pasan las personas en cada zona de mis eventos para mejorarlos' },
  // 4. Gerente de Operaciones
  { profile: '4-GO', label: 'Gerente de Operaciones', q: 'Mis técnicos deben hacer rondas de mantenimiento y necesito saber si realmente fueron a cada punto' },
  { profile: '4-GO', label: 'Gerente de Operaciones', q: 'Tengo personal distribuido en distintas zonas y no tengo forma de verificar que cumplieron su ruta' },
  { profile: '4-GO', label: 'Gerente de Operaciones', q: 'Necesito auditar si los agentes sanitarios cubrieron todas las zonas asignadas esta semana' },
  { profile: '4-GO', label: 'Gerente de Operaciones', q: 'Quiero saber si mis repartidores pasaron por todos los puntos de entrega con la hora exacta' },
  { profile: '4-GO', label: 'Gerente de Operaciones', q: 'Cómo registro de forma confiable que un inspector municipal hizo su recorrido completo' },
  // 5. Dueño de Tienda Retail
  { profile: '5-RT', label: 'Dueño Retail', q: 'Quiero saber cuánta gente entra a mi tienda y en qué horas hay más movimiento' },
  { profile: '5-RT', label: 'Dueño Retail', q: 'Cómo hago para que una promoción especial solo funcione dentro del local' },
  { profile: '5-RT', label: 'Dueño Retail', q: 'Quiero entender cuánto tiempo pasan mis clientes en la tienda' },
  { profile: '5-RT', label: 'Dueño Retail', q: 'Tengo una tienda física y también un sitio web, quiero saber si los que visitan el sitio también vinieron al local' },
  { profile: '5-RT', label: 'Dueño Retail', q: 'Cómo atraigo a las personas que pasan por la puerta de mi local' },
  // 6. Cadena de Gimnasios
  { profile: '6-GYM', label: 'Cadena de Gimnasios', q: 'Quiero saber en qué horarios se concentra más la asistencia en cada sede' },
  { profile: '6-GYM', label: 'Cadena de Gimnasios', q: 'Necesito comparar la frecuencia de asistencia entre mis diferentes gimnasios' },
  { profile: '6-GYM', label: 'Cadena de Gimnasios', q: 'Cómo detecto qué sedes tienen baja asistencia para tomar acción antes de que sea un problema' },
  { profile: '6-GYM', label: 'Cadena de Gimnasios', q: 'Quiero dar beneficios a los socios según cuántas veces vinieron al gimnasio este mes' },
  { profile: '6-GYM', label: 'Cadena de Gimnasios', q: 'Necesito saber si mis campañas de retención están generando más visitas presenciales' },
  // 7. Cadena de Restaurantes
  { profile: '7-RST', label: 'Cadena de Restaurantes', q: 'Quiero saber cuál de mis locales recibe más tráfico en la hora del almuerzo' },
  { profile: '7-RST', label: 'Cadena de Restaurantes', q: 'Necesito comparar el flujo de personas entre mis diferentes restaurantes' },
  { profile: '7-RST', label: 'Cadena de Restaurantes', q: 'Cómo sé si mi campaña de descuentos de lunes generó más visitas que el lunes anterior' },
  { profile: '7-RST', label: 'Cadena de Restaurantes', q: 'Quiero mostrar una oferta especial solo cuando el cliente esté cerca del restaurante' },
  { profile: '7-RST', label: 'Cadena de Restaurantes', q: 'Necesito demostrar a mis inversores que la nueva sucursal está generando el tráfico proyectado' },
  // 8. Centro Comercial
  { profile: '8-CC', label: 'Centro Comercial', q: 'Quiero saber qué zonas del mall tienen más tráfico y en qué horarios' },
  { profile: '8-CC', label: 'Centro Comercial', q: 'Necesito comparar el flujo de personas entre el sector A y el sector B para negociar rentas' },
  { profile: '8-CC', label: 'Centro Comercial', q: 'Cómo sé cuáles son los pasillos y sectores más y menos visitados de mi centro comercial' },
  { profile: '8-CC', label: 'Centro Comercial', q: 'Quiero ver en tiempo real cuánta gente hay en cada piso o zona del mall' },
  { profile: '8-CC', label: 'Centro Comercial', q: 'Necesito generar un reporte de afluencia por zona para presentar a los locatarios' },
  // 9. Inmobiliaria
  { profile: '9-INM', label: 'Inmobiliaria', q: 'Quiero saber cuántas personas visitaron mi sala de ventas esta semana y cuánto tiempo estuvieron' },
  { profile: '9-INM', label: 'Inmobiliaria', q: 'Cómo mido el interés real en cada uno de mis proyectos inmobiliarios' },
  { profile: '9-INM', label: 'Inmobiliaria', q: 'Quiero que los planos y precios se activen automáticamente cuando un interesado llega al proyecto' },
  { profile: '9-INM', label: 'Inmobiliaria', q: 'Necesito comparar cuántas visitas recibió cada sala de ventas sin depender del reporte del ejecutivo' },
  { profile: '9-INM', label: 'Inmobiliaria', q: 'Cómo evito que el material exclusivo de mi open house circule fuera del proyecto' },
  // 10. CTO / Tecnología
  { profile: '10-CTO', label: 'CTO / Tecnología', q: 'Cómo se integra esto con nuestro sistema existente, tenemos un backend propio' },
  { profile: '10-CTO', label: 'CTO / Tecnología', q: 'Necesito entender qué datos entrega el sistema y en qué formato' },
  { profile: '10-CTO', label: 'CTO / Tecnología', q: 'Tenemos una app mobile propia en iOS y Android, cómo incorporamos la validación de ubicación' },
  { profile: '10-CTO', label: 'CTO / Tecnología', q: 'Necesito integrar los datos de visitas con nuestro Salesforce' },
  { profile: '10-CTO', label: 'CTO / Tecnología', q: 'Qué diferencia hay entre esto y simplemente leer la geolocalización del dispositivo nosotros mismos' },
]

const results = questions.map(({ profile, label, q }) => {
  const audit = auditMatch(q)
  const match = matchSolution(q)
  return {
    profile,
    label,
    q,
    winner: audit.winner ? { id: audit.winner.id, type: audit.winner.type, title: audit.winner.title, score: audit.winner.score } : null,
    isFallback: audit.isFallback,
    subIntentionId: audit.subIntentionId ?? null,
    top3: audit.top3.map(c => ({ id: c.id, type: c.type, score: c.score })),
    responseBody: match.body,
    tags: match.tags,
  }
})

console.log(JSON.stringify(results, null, 2))
