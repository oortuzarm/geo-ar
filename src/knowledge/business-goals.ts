import type { BusinessGoal } from './types'

export const goalMarketing: BusinessGoal = {
  id: 'goal-marketing',
  title: 'Marketing geolocalizado y campañas físico-digitales',
  matchKeywords: [
    'hacer marketing', 'quiero hacer marketing',
    'estrategia de marketing', 'acciones de marketing',
    'marketing digital', 'marketing para mi negocio',
    'marketing territorial', 'marketing con ubicación',
    'campaña de marketing', 'campaña de publicidad',
    'hacer una campaña', 'lanzar una campaña',
    'promocionar mi negocio', 'promocionar negocio',
    'publicidad para mi negocio', 'dar a conocer mi negocio',
    'llegar a mis clientes', 'comunicarme con clientes',
    'promoción geolocalizada', 'campañas de proximidad',
  ],
  solution:
    'Marketing sin datos de presencia real es publicidad a ciegas. Puedes vincular ' +
    'tus campañas directamente a quién estuvo físicamente en el punto de venta, ' +
    'evento o zona que definas: el contenido, cupón o mensaje se activa solo cuando ' +
    'el consumidor está presente. Mides cuántas personas interactuaron con la campaña ' +
    'desde cada punto, cuánto tiempo permanecieron y en qué horarios. El resultado: ' +
    'marketing medible en términos de presencia real, no de clics o impresiones.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
}

export const goalAttractCustomers: BusinessGoal = {
  id: 'goal-attract-customers',
  title: 'Atraer clientes y generar tráfico al local',
  matchKeywords: [
    'atraer más clientes', 'atraer nuevos clientes',
    'captar nuevos clientes', 'conseguir más clientes',
    'generar más tráfico', 'aumentar visitas al local',
    'más clientes al local', 'aumentar afluencia',
    'que vengan más clientes', 'que entren más personas',
    'cómo conseguir más clientes', 'cómo atraer personas',
    'convertir tráfico en clientes', 'más personas que entren',
    'atraer personas al local', 'captar personas cercanas',
    // Formas conjugadas y variantes
    'atraigo más clientes', 'atraigo mas clientes',
    'cómo atraigo más', 'como atraigo mas',
    'cómo atraigo clientes', 'como atraigo clientes',
    'llevo más gente', 'llevo mas gente',
    'llevar más gente a mis tiendas', 'llevar mas gente a mis tiendas',
    'llevar gente a mis sucursales', 'más gente en mis locales',
    'mas gente en mis locales', 'incremento el tráfico',
    'incremento el trafico', 'incrementar el tráfico en mis locales',
    'incrementar el trafico en mis locales', 'incrementar afluencia',
    // Conjugaciones primera persona
    'capto clientes', 'capto más clientes', 'capto mas clientes',
    'capto personas', 'capto más personas', 'capto mas personas',
    'genero tráfico', 'genero trafico', 'genero más tráfico', 'genero mas trafico',
    'llevo personas al local', 'llevo más personas', 'llevo mas personas',
  ],
  solution:
    'La gente ya está pasando cerca de tu local. El reto es convertir ese tráfico ' +
    'en visitas reales. Puedes activar una promoción, mensaje o beneficio exclusivo ' +
    'en tu sitio web o app cuando alguien entra al radio del local — visible en ese ' +
    'momento, no después. Mides cuántas personas entraron, en qué horarios hay más ' +
    'afluencia y cuánto tiempo permanecieron, para optimizar cuándo y cómo impactar. ' +
    'La activación ocurre cuando el usuario ya está cerca e interactúa con la ' +
    'experiencia — no es notificación push.',
  capabilities: ['geopoints', 'presence', 'analytics', 'smart-proxies'],
}

export const goalIncreaseSales: BusinessGoal = {
  id: 'goal-increase-sales',
  title: 'Aumentar ventas con presencia física y experiencias geolocalizadas',
  matchKeywords: [
    'vender más', 'aumentar ventas', 'incrementar ventas',
    'más ventas', 'impulsar ventas', 'mejorar ventas',
    'quiero vender más', 'cómo vendo más',
    'aumentar mis ventas', 'subir las ventas',
    'incrementar conversión', 'aumentar conversión',
    'mejorar mis resultados comerciales',
    'más ingresos', 'generar más ingresos',
    'mejorar el rendimiento comercial',
    // Variantes con artículo y formas conjugadas
    'aumentar las ventas', 'aumentar las ventas en mi tienda',
    'cómo aumento las ventas', 'como aumento las ventas',
    'cómo aumento mis ventas', 'como aumento mis ventas',
    'mejorar los resultados', 'mejorar resultados de mi local',
    'mejorar resultados del local', 'mejorar los resultados de mi local',
    'generar mas ingresos', 'más ventas en mi tienda',
    'mas ventas en mi tienda',
    // Conjugaciones primera persona
    'aumento ventas', 'impulso ventas', 'impulso mis ventas', 'impulso las ventas',
    'incremento ingresos', 'incremento mis ingresos',
    'genero más ventas', 'genero mas ventas',
  ],
  solution:
    'Vender más en tu local físico pasa por dos cosas: saber qué clientes tienes ' +
    'de verdad y aprovechar el momento en que están presentes. Puedes activar ' +
    'promociones exclusivas justo cuando el cliente llega al punto de venta, medir ' +
    'cuántas personas entran y en qué horarios hay más tráfico, y diseñar incentivos ' +
    'que conviertan visitas en compras. Con datos reales de comportamiento en tu ' +
    'local — quién entra, cuánto permanece, en qué horarios — ajustas tu estrategia ' +
    'con evidencia, no con intuición.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
}

export const goalInteractiveGame: BusinessGoal = {
  id: 'goal-interactive-game',
  title: 'Juegos geolocalizados y experiencias interactivas en terreno',
  matchKeywords: [
    'juego', 'hacer un juego', 'quiero hacer un juego',
    'crear un juego', 'puedo hacer un juego',
    'juego geolocalizado', 'juego en terreno', 'juego en el mapa',
    'juego al aire libre', 'juego urbano', 'juego interactivo',
    'gymkhana', 'yincana', 'gimkana',
    'caza del tesoro', 'cazatesoros', 'búsqueda del tesoro',
    'juego de pistas', 'pistas geolocalizadas',
    'trivial geolocalizado', 'quiz en terreno',
    'dinámica al aire libre', 'dinámica en terreno',
    'actividad interactiva', 'actividad en terreno',
    'desafío geolocalizado', 'desafío en terreno',
    'competencia geolocalizada', 'competencia en terreno',
    'experiencia interactiva en terreno',
    'recorrido con desafíos', 'recorrido gamificado',
    // Analogía Pokémon GO
    'pokémon go', 'pokemon go', 'parecido a pokémon', 'tipo pokémon go',
    'similar a pokemon', 'juego tipo pokemon', 'como pokemon',
  ],
  solution:
    'Sí. Puedes construir juegos, gymkhanas, cazatesoros o dinámicas donde los ' +
    'participantes deben estar físicamente en cada punto para avanzar — sin que ' +
    'puedan simular la ubicación desde casa. Tu aplicación desbloquea el siguiente ' +
    'desafío, revela la pista o acumula los puntos solo cuando el usuario llega al ' +
    'área real. Funciona para juegos urbanos, circuitos gamificados, recorridos con ' +
    'desafíos y cualquier dinámica donde la presencia física sea la condición para avanzar.',
  capabilities: ['geopoints', 'presence', 'api', 'analytics'],
}

export const goalImproveLoyalty: BusinessGoal = {
  id: 'goal-improve-loyalty',
  title: 'Fidelización y retención de clientes presenciales',
  matchKeywords: [
    'fidelizar clientes', 'fidelizar a mis clientes', 'fidelizar a los clientes',
    'cómo fidelizo', 'como fidelizo', 'quiero fidelizar',
    'lograr que vuelvan', 'que vuelvan mis clientes', 'que regresen',
    'aumentar la frecuencia de visita', 'la frecuencia de visita',
    'frecuencia de visitas', 'incentivar visitas repetidas',
    'visitas repetidas', 'que vuelvan a comprar', 'que vuelvan a visitarme',
    'clientes recurrentes', 'retención de clientes', 'retener clientes',
    'fidelidad de clientes', 'más recurrencia', 'mas recurrencia',
    'mayor frecuencia de visita',
    // Conjugaciones primera persona
    'premio clientes', 'premio a mis clientes', 'premio clientes frecuentes', 'premio visitas',
    'clientes frecuentes', 'incentivo que vuelvan', 'incentivo visitas',
    'hago que vuelvan', 'hago que regresen',
  ],
  solution:
    'La fidelización real parte de saber qué clientes vuelven, con qué frecuencia ' +
    'y a qué sucursales. Puedes reconocer automáticamente cada visita de un cliente ' +
    '— sin que tenga que declarar dónde está ni escanear nada — y premiarlo según ' +
    'su comportamiento real: cuántas veces volvió, qué sucursales distintas visitó ' +
    'o cuánto tiempo permaneció. Eso te permite diseñar beneficios que incentiven ' +
    'exactamente lo que quieres lograr — mayor frecuencia, mayor amplitud de visitas ' +
    '— con datos de comportamiento real, no estimaciones.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api', 'integrations'],
}

export const goalMeasureMarketingROI: BusinessGoal = {
  id: 'goal-measure-marketing-roi',
  title: 'Medir y demostrar el retorno real de campañas y activaciones',
  matchKeywords: [
    'justificar campaña', 'justificar una campaña', 'justifico la campaña',
    'cómo mido el impacto', 'como mido el impacto',
    'medir el impacto', 'medir el retorno',
    'el impacto de mi campaña', 'el impacto de mi campana',
    'el impacto de mis campañas', 'el impacto de mis campanas',
    'retorno de campaña', 'roi de campaña', 'roi de la campaña',
    'retorno de una campaña', 'retorno de una campana',
    'saber si la activación funcionó', 'saber si la activacion funciono',
    'si la campaña tuvo impacto', 'si la campana tuvo impacto',
    'medir mis campañas', 'medir mis campanas',
    'si funcionó la campaña', 'si funciono la campana',
    'probar que la campaña funcionó', 'probar que funciono',
    'evidencia de campaña', 'evidencia de la activacion',
    // Conjugaciones primera persona
    'justifico una inversión', 'justifico una inversion', 'justifico el gasto',
    'justifico inversión', 'justifico inversion', 'justifico marketing',
    'mido el retorno', 'mido el impacto', 'mido campañas', 'mido campanas',
    'mido mis campañas', 'mido mis campanas',
    'demuestro resultados', 'demuestro impacto', 'demuestro el impacto',
  ],
  solution:
    'Para justificar una campaña presencial o demostrar que una activación funcionó, ' +
    'necesitas datos de presencia real — no alcance ni impresiones. Puedes saber ' +
    'exactamente cuántas personas estuvieron físicamente en cada punto de campaña, ' +
    'en qué horarios y cuánto tiempo permanecieron. Esos registros son exportables ' +
    'y presentables como evidencia objetiva: costo por interacción real, no costo ' +
    'por clic. El contenido se activa solo cuando alguien está en el lugar — lo que ' +
    'garantiza que cada registro corresponde a presencia verificada.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
}

export const goalImproveOperations: BusinessGoal = {
  id: 'goal-improve-operations',
  title: 'Control y auditoría de equipos y operaciones en terreno',
  matchKeywords: [
    'controlar equipos en terreno', 'controlar equipos',
    'controlar a mi equipo', 'controlar mi equipo en terreno',
    'equipos en terreno', 'equipos en campo', 'personal en campo',
    'verificar visitas de mi equipo', 'verificar que se realizaron',
    'saber si cumplieron la ruta', 'saber si cumplieron',
    'cumplieron la ruta', 'cumplimiento de ruta', 'cumplimiento operativo',
    'auditar personal', 'auditoría de personal', 'auditoria de personal',
    'auditar operaciones', 'auditar a mi equipo',
    'supervisar equipos en terreno', 'control de equipos en terreno',
    'verificar rondas', 'verificar recorridos',
    'saber si el equipo fue', 'saber si fueron al lugar',
    // Conjugaciones primera persona
    'controlo mis técnicos', 'controlo técnicos', 'controlo a mis técnicos',
    'controlo tecnicos', 'controlo mis tecnicos', 'controlo a mis tecnicos',
    'hago más eficiente', 'hago mas eficiente',
    'hago más eficiente mi operación', 'hago mas eficiente mi operacion',
    'reduzco errores', 'reduzco errores en terreno',
    'controlo rutas', 'controlo mis rutas', 'audito personal',
  ],
  solution:
    'Saber si tu equipo realmente estuvo donde debía es difícil sin depender de ' +
    'reportes manuales que pueden falsificarse. Puedes confirmar automáticamente ' +
    'que técnicos, vendedores, contratistas o cuadrillas llegaron a los puntos ' +
    'asignados — con hora exacta y tiempo de permanencia — sin partes de papel ni ' +
    'declaraciones del propio equipo. El supervisor ve la cobertura real y puede ' +
    'auditar cualquier período histórico. Los datos son exportables para integración ' +
    'con sistemas de gestión existentes.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
}

export const goalChooseLocation: BusinessGoal = {
  id: 'goal-choose-location',
  title: 'Elegir la mejor ubicación para abrir o expandir un negocio',
  matchKeywords: [
    'dónde abrir mi negocio', 'donde abrir mi negocio',
    'dónde abrir una tienda', 'donde abrir una tienda',
    'cómo elegir una ubicación', 'como elegir una ubicacion',
    'cómo elijo dónde abrir', 'como elijo donde abrir',
    'la mejor ubicación para', 'la mejor ubicacion para',
    'la mejor ubicación', 'la mejor ubicacion',
    'validar una zona antes de invertir', 'validar una zona',
    'validar zona antes de abrir', 'elegir dónde expandirme',
    'elegir donde expandirme', 'dónde me conviene abrir',
    'donde me conviene abrir', 'qué zona elegir', 'que zona elegir',
    'mejor zona para abrir', 'cuál es la mejor zona',
    'cual es la mejor zona',
    // Conjugaciones primera persona y términos de expansión
    'valido una zona', 'valido la zona',
    'próxima sucursal', 'proxima sucursal',
    'próxima tienda', 'proxima tienda',
    'zona con potencial', 'zona rentable',
    'zona más rentable', 'zona mas rentable',
  ],
  solution:
    'Elegir dónde abrir o expandirse suele basarse en intuición o en datos de ' +
    'mercado indirectos. Puedes medir cuántas personas circulan realmente por las ' +
    'zonas candidatas, en qué horarios se concentra el tráfico y cuánto tiempo ' +
    'permanecen — y comparar varias ubicaciones entre sí con datos observacionales ' +
    'concretos. Eso convierte una decisión de inversión en algo respaldado por ' +
    'evidencia real de comportamiento, no en una apuesta.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
}

export const goalCustomerExperience: BusinessGoal = {
  id: 'goal-customer-experience',
  title: 'Personalización y experiencia presencial del cliente',
  matchKeywords: [
    // Mejorar la experiencia
    'mejorar la experiencia', 'mejorar experiencia en tienda',
    'mejorar la experiencia en tienda', 'mejorar la experiencia en el local',
    'experiencia de cliente', 'experiencia del cliente',
    'la experiencia de clientes', 'experiencia en tienda',
    'experiencia en el local', 'experiencia presencial',
    // Personalización
    'personalizar la experiencia', 'experiencia personalizada',
    'personalización por ubicación', 'personalizacion por ubicacion',
    'experiencia diferente', 'experiencia diferente en mis sucursales',
    // Sorprender / Bienvenida
    'sorprender al cliente', 'sorprender a mis clientes',
    'sorprender a los clientes',
    'bienvenida automática', 'bienvenida automatica',
    'mensaje de bienvenida', 'dar una bienvenida',
    // Contenido contextual y activaciones al llegar
    'contenido al llegar', 'contenido contextual',
    'cuando alguien llega', 'mostrar contenido cuando',
    'mostrar contenido al llegar', 'mostrar algo al llegar',
    'activar contenido al llegar', 'activar contenido cuando',
    'activar al llegar',
    'experiencia contextual', 'experiencia geolocalizada',
    'experiencia según ubicación', 'experiencia segun ubicacion',
    // Hacer la visita más atractiva
    'mejorar la visita', 'visita más atractiva', 'visita mas atractiva',
    'hacer la visita más atractiva', 'hacer la visita mas atractiva',
    'hacer más atractiva la visita', 'hacer mas atractiva la visita',
    // Conjugaciones primera persona
    'personalizo la experiencia', 'personalizo mi experiencia',
    'sorprendo a mis clientes', 'sorprendo al cliente',
    'doy la bienvenida', 'doy una bienvenida',
    'muestro contenido al llegar', 'muestro algo al llegar',
    'mejoro la experiencia', 'mejoro la visita',
    'hago más atractiva la visita', 'hago mas atractiva la visita',
  ],
  solution:
    'Puedes transformar la llegada de un cliente a tu local en un momento ' +
    'memorable: cuando alguien entra al radio del local, puedes activar ' +
    'automáticamente un mensaje de bienvenida, contenido exclusivo de esa ' +
    'ubicación, una promoción del día o información contextual relevante — ' +
    'sin que el cliente tenga que buscar nada ni declarar dónde está. ' +
    'El contenido puede ser diferente por local, por zona o por horario. ' +
    'La activación ocurre directamente en tu sitio web o app, sin instalar ' +
    'nada en el espacio físico.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'analytics'],
}

export const goalDecisionMaking: BusinessGoal = {
  id: 'goal-decision-making',
  title: 'Toma de decisiones ejecutivas basadas en datos de presencia',
  matchKeywords: [
    // Decisiones generales
    'tomar mejores decisiones', 'tomar decisiones',
    'decisiones basadas en datos', 'decision basada en datos',
    'tomar decisiones comerciales', 'tomar decisiones de negocio',
    'decidir una estrategia', 'validar una decisión', 'validar una decision',
    // Inversión y asignación de recursos
    'decidir dónde invertir', 'decidir donde invertir',
    'saber dónde invertir', 'saber donde invertir',
    'dónde invertir', 'donde invertir',
    'asignar recursos', 'asignación de recursos', 'asignacion de recursos',
    'priorizar inversiones', 'justificar inversiones',
    // Qué local / sucursal rinde más
    'qué local funciona mejor', 'que local funciona mejor',
    'qué sucursal funciona mejor', 'que sucursal funciona mejor',
    'cuál funciona mejor', 'cual funciona mejor',
    'decidir qué sucursal', 'decidir que sucursal',
    // Estrategia y validación de hipótesis
    'validar una estrategia', 'validar una hipótesis', 'validar una hipotesis',
    // Expansión y crecimiento
    'dónde expandirse', 'donde expandirse',
    'dónde crecer', 'donde crecer',
    'decidir dónde abrir', 'decidir donde abrir',
    // Identificar oportunidades
    'identificar oportunidades',
    'dónde están las oportunidades', 'donde estan las oportunidades',
    // Comparar y evaluar
    'comparar el desempeño', 'comparar el desempeno',
    'comparar el rendimiento', 'comparar el desempeño de',
    'comparar sucursales', 'comparar locales', 'comparar ubicaciones',
    'evaluar ubicaciones', 'evaluar rendimiento',
    'elegir una ubicación', 'elegir una ubicacion',
  ],
  solution:
    'Puedes reemplazar opiniones, intuiciones o percepciones por datos reales de ' +
    'comportamiento físico. Ubyca te ayuda a entender qué ubicaciones funcionan ' +
    'mejor, dónde existe mayor oportunidad, qué campañas generan resultados y dónde ' +
    'conviene concentrar recursos. El objetivo no es producir más métricas: es ' +
    'ayudarte a tomar decisiones con evidencia. ' +
    'Los datos provienen de presencia física verificada: cuántas personas estuvieron ' +
    'en cada punto, cuánto tiempo permanecieron, en qué horarios y cómo se ' +
    'distribuyeron entre ubicaciones. Puedes comparar el desempeño de sucursales, ' +
    'validar una zona antes de expandirte, medir si una campaña generó visitas ' +
    'reales y priorizar inversiones donde los datos indican mayor retorno.',
  capabilities: ['analytics', 'geopoints', 'presence', 'spatial-intelligence'],
}

export const businessGoals: BusinessGoal[] = [
  goalMarketing,
  goalAttractCustomers,
  goalIncreaseSales,
  goalInteractiveGame,
  goalImproveLoyalty,
  goalMeasureMarketingROI,
  goalImproveOperations,
  goalChooseLocation,
  goalCustomerExperience,
  goalDecisionMaking,
]
