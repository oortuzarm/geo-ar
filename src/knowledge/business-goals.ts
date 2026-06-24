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
    'Si el objetivo es atraer más personas a una ubicación física, el primer paso ' +
    'es saber qué acciones realmente generan visitas y cuáles no. Sin esa ' +
    'información, las campañas y promociones se diseñan a ciegas. ' +
    'Con datos reales de presencia podés medir qué mensajes o incentivos ' +
    'efectivamente llevaron a alguien al local, en qué horarios hay más afluencia ' +
    'natural y qué días necesitan mayor impulso. El resultado: decisiones de ' +
    'activación basadas en comportamiento real, no en suposiciones sobre ' +
    'cuándo y cómo impactar a tu audiencia.',
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
    'Aumentar ventas en puntos físicos requiere entender qué ocurre realmente dentro ' +
    'del local: quién entra, en qué horarios hay más tráfico, cuánto tiempo ' +
    'permanecen los visitantes y qué acciones los convierten en compradores. ' +
    'Sin esos datos, las decisiones de promoción, disposición y horarios dependen ' +
    'de intuición. Con información real de comportamiento en tienda, podés ' +
    'identificar los momentos de mayor oportunidad, diseñar incentivos precisos ' +
    'y ajustar la estrategia comercial con evidencia observable, no con estimaciones.',
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
    'Un programa de fidelización efectivo premia el comportamiento real: cuántas ' +
    'veces volvió un cliente, qué sucursales visitó, con qué frecuencia. No cuántos ' +
    'correos abrió ni cuántos puntos acumuló en un formulario. Cuando los beneficios ' +
    'se basan en visitas presenciales verificadas, el programa incentiva exactamente ' +
    'lo que importa al negocio — mayor frecuencia de visita, mayor amplitud de ' +
    'cobertura entre sucursales — y el cliente los recibe sin tener que escanear ' +
    'nada ni declarar que estuvo allí.',
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
    'En operaciones con equipos distribuidos en terreno, el punto ciego habitual ' +
    'es no saber si las visitas realmente ocurrieron. Los reportes manuales ' +
    'dependen de la honestidad del equipo y no pueden verificarse a posteriori. ' +
    'Con registros automáticos de presencia, cada visita queda documentada con ' +
    'hora de llegada y tiempo de permanencia, sin que el supervisor deba depender ' +
    'de lo que le informan. Es posible auditar cualquier período histórico, ' +
    'identificar brechas en la cobertura de rutas y tomar decisiones correctivas ' +
    'con evidencia objetiva, no con percepciones.',
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
    'Elegir entre ubicaciones candidatas para abrir o expandirse es una de las ' +
    'decisiones de mayor impacto y menor certeza en un negocio físico. Los estudios ' +
    'de mercado dan una aproximación, pero no dicen cuántas personas circulan ' +
    'realmente por cada zona en los horarios que importan. ' +
    'Con datos reales de comportamiento en las ubicaciones candidatas — tráfico ' +
    'por hora, tiempo de permanencia, distribución semanal — la decisión pasa de ' +
    'ser una apuesta a ser un análisis. Es posible comparar zonas en igualdad de ' +
    'condiciones y respaldar la elección con evidencia observable antes de invertir.',
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
    'Cuando alguien entra a un local, tiene expectativas. Lo que diferencia una ' +
    'visita ordinaria de una experiencia memorable es que el espacio responda a ' +
    'su presencia de forma relevante y oportuna. ' +
    'Podés ofrecer una bienvenida personalizada, una promoción del día, información ' +
    'exclusiva de esa ubicación o contenido contextual — activado automáticamente ' +
    'en el momento en que el cliente llega, sin que tenga que buscar nada ni ' +
    'declarar dónde está. El contenido puede variar por local, por zona o por ' +
    'horario, y se entrega a través de tu sitio web o app existente.',
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
    'Las decisiones más costosas en un negocio con presencia física — dónde ' +
    'expandirse, qué sucursales priorizar, qué campañas escalar, dónde concentrar ' +
    'recursos — suelen tomarse con información incompleta o basada en percepciones. ' +
    'El antídoto es disponer de datos reales de comportamiento en cada ubicación: ' +
    'cuántas personas estuvieron, cuánto tiempo, en qué horarios y cómo evolucionó ' +
    'eso a lo largo del tiempo. Con esa base, comparar el desempeño de locales ' +
    'deja de ser una discusión y se convierte en un dato. Validar una zona antes ' +
    'de invertir deja de ser una apuesta y pasa a ser un análisis fundamentado.',
  capabilities: ['analytics', 'geopoints', 'presence', 'spatial-intelligence'],
}

export const goalDigitalTransformation: BusinessGoal = {
  id: 'goal-digital-transformation',
  title: 'Digitalización de espacios físicos y puente físico-digital',
  matchKeywords: [
    // Digitalizar sucursales / puntos físicos
    'digitalizar sucursales', 'digitalizo mis sucursales',
    'digitalizar mis sucursales', 'digitalización de sucursales',
    'digitalizacion de sucursales',
    'digitalizar puntos físicos', 'digitalizar puntos fisicos',
    'digitalizar puntos de venta', 'digitalizar mis locales',
    'digitalizar la experiencia física', 'digitalizar la experiencia fisica',
    'digitalizar la experiencia presencial',
    // Conectar mundo físico y digital
    'conectar mundo físico y digital', 'conectar mundo fisico y digital',
    'conectar lo físico con lo digital', 'conectar lo fisico con lo digital',
    'conectar el mundo físico con el digital',
    'conectar el mundo fisico con el digital',
    'conectar fisico con digital',
    'mundo físico y digital', 'mundo fisico y digital',
    'físico y digital', 'fisico y digital',
    'puente entre físico y digital', 'puente fisico digital',
    // Modernizar / transformar
    'modernizar experiencia presencial',
    'modernizar mis sucursales', 'modernizar mis locales',
    'transformación digital', 'transformacion digital',
    'transformación digital de mis locales',
    'transformacion digital de mis locales',
    'digitalización física', 'digitalizacion fisica',
    // Datos del mundo físico
    'datos del mundo físico', 'datos del mundo fisico',
    'llevar analítica al mundo real', 'llevar analitica al mundo real',
    'inteligencia del mundo físico', 'inteligencia del mundo fisico',
    'convertir presencia en datos',
    'llevar lo físico a lo digital', 'llevar lo fisico a lo digital',
  ],
  solution:
    'Tus sucursales, locales y puntos de venta generan actividad todos los días, ' +
    'pero esa actividad suele quedar fuera de tus sistemas digitales: no hay datos, ' +
    'no hay trazabilidad, no hay forma de actuar sobre ella en tiempo real. ' +
    'Integrar el mundo físico con tus plataformas digitales significa que cuando ' +
    'alguien llega a un punto específico, tus sistemas pueden saberlo y responder: ' +
    'mostrar contenido relevante, registrar la visita, habilitar un beneficio o ' +
    'disparar un flujo automático. Sin instalar hardware adicional ni modificar ' +
    'la infraestructura física de ningún local.',
  capabilities: ['geopoints', 'presence', 'smart-proxies', 'api', 'analytics'],
}

export const goalMeasurePhysical: BusinessGoal = {
  id: 'goal-measure-physical',
  title: 'Medir el comportamiento físico en ubicaciones reales',
  matchKeywords: [
    // Medir lo que ocurre físicamente
    'medir lo que ocurre físicamente', 'medir lo que ocurre fisicamente',
    'medir lo que pasa en mis locales', 'medir lo que ocurre en mis locales',
    // Saber qué pasa en locales
    'saber qué pasa en mis locales', 'saber que pasa en mis locales',
    'qué pasa en mis locales', 'que pasa en mis locales',
    'qué ocurre en mis locales', 'que ocurre en mis locales',
    'qué pasa en mis sucursales', 'que pasa en mis sucursales',
    'qué ocurre en mis puntos', 'que ocurre en mis puntos',
    // Comportamiento presencial
    'datos del comportamiento presencial', 'comportamiento presencial',
    'comportamiento en tienda', 'comportamiento en el local',
    'entender el comportamiento en el mundo real',
    // Medir actividad / presencia
    'medir actividad física en ubicaciones', 'medir actividad fisica',
    'medir actividad en mis locales',
    'medir presencia', 'medir visitas presenciales', 'medir visitas',
    'medir tráfico físico', 'medir trafico fisico',
    // Medir permanencia
    'medir permanencia', 'tiempo de permanencia', 'dwell time',
    'cuánto tiempo permanecen', 'cuanto tiempo permanecen',
    // Métricas de ubicaciones
    'métricas de ubicaciones físicas', 'metricas de ubicaciones fisicas',
    'métricas de mis locales', 'metricas de mis locales',
    'analítica de presencia', 'analitica de presencia',
    'analítica del mundo físico', 'analitica del mundo fisico',
    'datos de visita', 'datos de visitas',
    // Cuántas personas
    'cuántas personas entran', 'cuantas personas entran',
    'cuánta gente entra', 'cuanta gente entra',
    'cuántas personas visitan', 'cuantas personas visitan',
  ],
  solution:
    'Lo que ocurre físicamente en tus locales — cuántas personas entran, cuánto ' +
    'tiempo permanecen, en qué horarios hay más actividad, cómo se distribuyen ' +
    'entre zonas — es información crítica de negocio que la mayoría de las ' +
    'organizaciones sencillamente no tiene. ' +
    'Disponer de esos datos cambia la forma en que se toman decisiones: podés ' +
    'comparar el rendimiento real de sucursales, detectar patrones de comportamiento, ' +
    'validar si una campaña generó visitas físicas reales y asignar recursos donde ' +
    'los números lo justifican. Es analítica de comportamiento físico — el ' +
    'equivalente de lo que una herramienta digital hace en el mundo online, ' +
    'aplicado al mundo real.',
  capabilities: ['geopoints', 'presence', 'analytics', 'spatial-intelligence', 'live-visits'],
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
  goalDigitalTransformation,
  goalMeasurePhysical,
]
