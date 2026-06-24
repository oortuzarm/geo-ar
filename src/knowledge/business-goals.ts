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
    'Puedes lanzar campañas que se activan solo cuando el consumidor está físicamente ' +
    'en el punto de venta, la zona o el evento que defines — sin que tenga que hacer ' +
    'nada para recibirlas. Cada activación queda registrada con ubicación, horario y ' +
    'tiempo de permanencia, lo que te permite demostrar el impacto real de cada acción ' +
    'y concentrar el presupuesto en lo que realmente genera desplazamiento físico, no ' +
    'solo clics. El resultado: campañas que se justifican con presencia real, no con ' +
    'estimaciones de alcance.',
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
    // P4 — intención de atracción cuando se combina industria + objetivo comercial
    'que las personas vayan', 'que más personas vayan', 'que mas personas vayan',
    'personas vayan',
    'quiero atraer',
    'quiero atraer más clientes', 'quiero atraer mas clientes',
    'atraer más personas', 'atraer mas personas',
    'atraer más gente', 'atraer mas gente',
    'llevar más personas', 'llevar mas personas',
    'llevar más clientes', 'llevar mas clientes',
    'más gente', 'mas gente',
    'más visitas', 'mas visitas',
    'generar más visitas', 'generar mas visitas',
    'aumentar visitas',
    'más personas al local', 'mas personas al local',
    'más personas a la tienda', 'mas personas a la tienda',
    'más personas al negocio', 'mas personas al negocio',
    'llenar mesas',
  ],
  solution:
    'Puedes activar mensajes, ofertas o contenidos que aparecen automáticamente ' +
    'cuando un potencial cliente está cerca de tu local — sin depender de campañas ' +
    'digitales que no se traducen en visitas físicas. Sabes exactamente qué acciones ' +
    'generaron desplazamiento real: cuántas personas llegaron, en qué horarios hay ' +
    'mayor afluencia espontánea y qué días necesitan más impulso. Con esa información ' +
    'concentras tu inversión en las activaciones que realmente llevan clientes al ' +
    'local y eliminas las que solo generan impresiones. El resultado: más tráfico ' +
    'físico con decisiones basadas en comportamiento observado.',
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
    // P4 — conversión y ventas cuando se combina industria + objetivo comercial
    'que compren', 'hacer que compren',
    'convertir visitas en ventas',
    'quiero aumentar ventas',
    'que la gente compre',
    'compren más', 'compren mas',
    'que compren más', 'que compren mas',
  ],
  solution:
    'Puedes activar ofertas, descuentos o contenido exclusivo en el momento exacto ' +
    'en que el cliente llega a tu tienda — sin cupones impresos ni declaraciones de ' +
    'presencia. Eso convierte el tráfico que ya tienes en más ventas: el estímulo ' +
    'correcto, entregado automáticamente en el punto de venta cuando el cliente está ' +
    'físicamente presente. También puedes identificar los horarios de mayor flujo y ' +
    'los momentos donde la conversión necesita impulso, para actuar con evidencia ' +
    'observada, no con intuición. El resultado: mayor conversión de visitas en ' +
    'compras.',
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
    'Puedes premiar visitas presenciales reales — no correos abiertos ni formularios ' +
    'completados — directamente a través de tu app o sitio web, sin que el cliente ' +
    'tenga que escanear nada ni declarar que estuvo. El programa incentiva ' +
    'exactamente lo que importa al negocio: mayor frecuencia de visita, mayor ' +
    'cobertura entre sucursales, menor tasa de abandono. Los beneficios se activan ' +
    'de forma automática por presencia verificada, lo que hace el programa más ' +
    'confiable para el cliente y más simple de administrar. Para asociar visitas a ' +
    'perfiles individuales y activar recompensas personalizadas, tu sistema de ' +
    'loyalty gestiona la identidad y se conecta via API.',
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
    'Puedes demostrar con evidencia objetiva que una campaña presencial funcionó: ' +
    'cuántas personas estuvieron físicamente en cada punto de activación, en qué ' +
    'horarios y cuánto tiempo permanecieron — sin depender de impresiones ni de ' +
    'estimaciones. Cada registro corresponde a presencia verificada en el servidor, ' +
    'no a una declaración del usuario, lo que hace los datos presentables ante ' +
    'clientes, directivos y patrocinadores. Puedes calcular el costo por interacción ' +
    'real, comparar el rendimiento de distintas activaciones y decidir con evidencia ' +
    'qué escalar y qué detener. El resultado: ROI demostrable con comportamiento ' +
    'real, no con métricas de alcance.',
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
    'Puedes verificar automáticamente que cada técnico, agente o inspector llegó ' +
    'al punto asignado y permaneció el tiempo mínimo requerido — sin depender de ' +
    'reportes que pueden falsificarse ni de trackeo continuo que los equipos ' +
    'perciben como invasivo. Cada visita queda documentada con hora de llegada y ' +
    'tiempo de permanencia; el historial es auditable para cualquier período pasado. ' +
    'Identificas brechas en la cobertura de rutas, tomas decisiones correctivas con ' +
    'evidencia concreta y reduces los puntos ciegos operativos sin aumentar la carga ' +
    'de supervisión. El resultado: equipos en terreno verificados, con evidencia ' +
    'objetiva de cada visita realizada.',
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
    // Siguiente apertura — vocabulario natural de expansión
    'siguiente sucursal', 'nueva sucursal',
    'abrir la siguiente', 'abrir otra sucursal',
    'dónde abrir mi próxima', 'donde abrir mi proxima',
  ],
  solution:
    'Puedes comparar zonas candidatas con datos reales de comportamiento — cuántas ' +
    'personas circulan en los horarios que te importan, cuánto tiempo permanecen y ' +
    'cómo varía el flujo por día — antes de comprometer inversión en una apertura. ' +
    'Eso elimina la dependencia de estudios de mercado que no capturan el ' +
    'comportamiento real y te permite validar la hipótesis con evidencia observada ' +
    'en el terreno, no con estimaciones demográficas. Puedes comparar dos o más ' +
    'ubicaciones en igualdad de condiciones y respaldar la decisión con argumentos ' +
    'concretos frente a socios o directivos. El resultado: expansiones respaldadas ' +
    'por comportamiento real, no por apuestas.',
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
    'Puedes diferenciar la experiencia en cada local de forma automática: una ' +
    'bienvenida personalizada, una oferta exclusiva de esa ubicación, información ' +
    'contextual de la zona o contenido que solo aparece cuando el cliente llega — ' +
    'sin que tenga que buscar nada ni declarar dónde está. El contenido varía por ' +
    'local, por zona o por horario, y se entrega a través de tu app o sitio web ' +
    'existente sin necesidad de hardware adicional. Con eso cada visita se siente ' +
    'distinta dependiendo de dónde está el cliente, lo que convierte la presencia ' +
    'física en una ventaja que el canal online no puede replicar. El resultado: ' +
    'experiencias más memorables, mayor diferenciación entre locales y más razones ' +
    'para volver.',
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
    // Inversión — conjugaciones y vocabulario ejecutivo natural
    'debería invertir', 'deberia invertir',
    'dónde invertir primero', 'donde invertir primero',
    'dónde asignar presupuesto', 'donde asignar presupuesto',
    'dónde destinar recursos', 'donde destinar recursos',
    'dónde concentrar recursos', 'donde concentrar recursos',
    'dónde concentrar', 'donde concentrar',
    // Qué local / sucursal rinde más o merece recursos
    'qué local funciona mejor', 'que local funciona mejor',
    'qué sucursal funciona mejor', 'que sucursal funciona mejor',
    'cuál funciona mejor', 'cual funciona mejor',
    'decidir qué sucursal', 'decidir que sucursal',
    'merece más recursos', 'merece mas recursos',
    'merece más inversión', 'merece mas inversion',
    'merece más atención', 'merece mas atencion',
    'qué ubicación merece', 'que ubicacion merece',
    'qué sucursal merece', 'que sucursal merece',
    'qué local merece', 'que local merece',
    // Priorización — conjugaciones primera persona
    'priorizar inversiones', 'priorizar ubicaciones', 'priorizar mis ubicaciones',
    'priorizo mis ubicaciones', 'priorizo ubicaciones',
    'cómo priorizo', 'como priorizo',
    // Estrategia y validación de hipótesis
    'validar una estrategia', 'validar una hipótesis', 'validar una hipotesis',
    // Expansión y crecimiento
    'dónde expandirse', 'donde expandirse',
    'dónde crecer', 'donde crecer',
    'decidir dónde abrir', 'decidir donde abrir',
    'expandirme', 'cómo expandirme', 'como expandirme',
    'justificar una expansión', 'justificar una expansion',
    'justifico una expansión', 'justifico una expansion',
    'defender una expansión', 'defender una expansion',
    'defender una inversión', 'defender una inversion',
    'oportunidades de crecimiento',
    // Identificar oportunidades
    'identificar oportunidades',
    'dónde están las oportunidades', 'donde estan las oportunidades',
    // Mi mejor ubicación
    'mi mejor ubicación', 'mi mejor ubicacion',
    'cuál es mi mejor', 'cual es mi mejor',
    // Directorio / evidencia ejecutiva
    'frente al directorio', 'ante el directorio',
    'defender una decisión', 'defender una decision',
    'defender ante el directorio', 'justificar ante el directorio',
    'presentar evidencia', 'evidencia para inversión', 'evidencia para inversion',
    'presentar al directorio',
    'tomar decisiones con datos',
    // Comparar y evaluar
    'comparar el desempeño', 'comparar el desempeno',
    'comparar el rendimiento', 'comparar el desempeño de',
    'comparar sucursales', 'comparar locales', 'comparar ubicaciones',
    'evaluar ubicaciones', 'evaluar rendimiento',
    'elegir una ubicación', 'elegir una ubicacion',
  ],
  solution:
    'Puedes comparar el desempeño real de tus ubicaciones — cuánta gente llegó, ' +
    'cuánto tiempo permaneció y cómo evolucionó con el tiempo — y tomar decisiones ' +
    'sobre dónde expandirse, qué sucursales priorizar y dónde concentrar recursos ' +
    'con evidencia observable, no con percepciones. Cuando la pregunta de cuál local ' +
    'funciona mejor se responde con datos, las decisiones se aceleran y se justifican ' +
    'frente a directivos, inversores o socios sin necesidad de estimaciones. También ' +
    'puedes validar una zona antes de invertir y respaldar cada expansión con un ' +
    'análisis de comportamiento real en el terreno. El resultado: menos apuestas ' +
    'ciegas, más decisiones que se defienden con evidencia.',
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
    'Puedes conectar tus locales físicos a tus sistemas digitales sin instalar ' +
    'hardware adicional: cuando alguien llega a un punto definido, tus plataformas ' +
    'lo saben y pueden responder — mostrar contenido relevante, registrar la visita, ' +
    'habilitar un beneficio o disparar un flujo automático. Eso transforma cada ' +
    'sucursal en un punto de contacto activo que genera datos, entrega experiencias ' +
    'contextuales y se integra con tu stack tecnológico a través de API, sin ' +
    'modificar la infraestructura física de ningún local. El comportamiento físico ' +
    'de tus clientes deja de ser invisible para tus sistemas y pasa a ser parte ' +
    'activa de tu estrategia digital.',
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
    // Asistencia de clientes — contexto comercial, no educativo
    'asistencia de clientes', 'medir asistencia de clientes',
    'medir asistencia',
    // Concurrencia — vocabulario de negocio
    'concurrencia', 'medir concurrencia',
  ],
  solution:
    'Puedes tener visibilidad completa sobre lo que ocurre en tus locales — cuántas ' +
    'personas entran, en qué horarios hay más actividad, cuánto tiempo permanecen y ' +
    'cómo varía ese comportamiento entre ubicaciones — con la misma lógica analítica ' +
    'que ya usas para el canal digital, aplicada al mundo físico. Esa información te ' +
    'permite comparar el desempeño real de tus sucursales, detectar cuáles tienen ' +
    'demanda no cubierta y tomar decisiones de personal, horarios y campañas con ' +
    'evidencia concreta, sin depender de reportes manuales. Es el equivalente de ' +
    'Google Analytics para tus espacios físicos: sin hardware, sin fricciones y ' +
    'con datos exportables a tus sistemas.',
  capabilities: ['geopoints', 'presence', 'analytics', 'spatial-intelligence', 'live-visits'],
}

export const goalRetailStores: BusinessGoal = {
  id: 'goal-retail-stores',
  title: 'Retail y tiendas físicas',
  matchKeywords: [
    // Tipo de establecimiento
    'tienda', 'tiendas', 'mi tienda', 'mis tiendas',
    'tienda física', 'tienda fisica',
    'tienda de muebles', 'tienda de ropa', 'tienda de electrónica',
    'tienda de electronica', 'tienda de moda',
    'varias tiendas', 'cadena de tiendas',
    'showroom', 'sala de exhibición', 'sala de exhibicion',
    'retail', 'punto de venta físico', 'punto de venta fisico',
    'local comercial', 'locales comerciales',
    // Rubros
    'muebles', 'electrónica', 'electronica', 'moda', 'indumentaria',
    'electrodomésticos', 'electrodomesticos', 'decoración', 'decoracion',
    // Objetivos en tienda
    'a mi tienda', 'personas a mi tienda', 'clientes a mi tienda',
    'mas personas a mi tienda', 'más personas a mi tienda',
    'atraer a mi tienda', 'tráfico a mi tienda', 'trafico a mi tienda',
    'visitas a mi tienda', 'visitas a mis tiendas',
    'comparar mis tiendas', 'comparar tiendas',
    'tráfico en tienda', 'trafico en tienda',
    'rendimiento de mis tiendas', 'desempeño de mis tiendas',
    // Múltiples locales / concurrencia
    'varios locales', 'concurrencia', 'medir concurrencia',
  ],
  solution:
    'Puedes saber cuántas personas entran a cada una de tus tiendas, en qué horarios ' +
    'hay más movimiento y cómo varía el rendimiento entre locales — y actuar sobre ' +
    'esa información para mejorar operaciones, diseñar campañas locales efectivas y ' +
    'comparar el desempeño de tu cadena con datos reales, no con estimaciones. ' +
    'Identificas qué tiendas necesitan intervención antes de que el problema se ' +
    'agrave, optimizas los horarios de atención según la demanda observada y mides ' +
    'si una campaña generó visitas físicas reales o solo impresiones digitales. ' +
    'El resultado: una cadena de tiendas gestionada con inteligencia operativa real.',
  capabilities: ['geopoints', 'presence', 'analytics', 'smart-proxies'],
}

export const goalGyms: BusinessGoal = {
  id: 'goal-gyms',
  title: 'Gimnasios y centros deportivos',
  matchKeywords: [
    // Tipo de establecimiento
    'gimnasio', 'gimnasios', 'mi gimnasio', 'cadena de gimnasios',
    'centro deportivo', 'centros deportivos', 'centro de fitness',
    'centros de fitness', 'club deportivo', 'fitness center', 'gym',
    // Socios y retención
    'socios', 'mis socios', 'retener socios', 'retención de socios',
    'retencion de socios', 'socios activos', 'socios inactivos',
    'socios frecuentes', 'comportamiento de socios',
    // Frecuencia — más cobertura que goalImproveLoyalty para ganar en score
    'frecuencia de visita', 'la frecuencia de visita',
    'aumentar la frecuencia de visita', 'mayor frecuencia de visita',
    'frecuencia de asistencia', 'asistencia al gimnasio',
    // Horarios
    'horarios punta', 'horas pico', 'horarios de alta demanda', 'hora pico',
    // Sedes — vocabulario propio de cadenas de gimnasios
    'sedes', 'mis sedes', 'en cada sede',
    // Asistencia en contexto de gimnasio / sin la palabra "gimnasio"
    'asistencia en cada sede', 'asistencia entre sedes',
    'asistencia por sede', 'asistencia en mis sedes',
    'asistencia a mis gimnasios', 'aumentar la asistencia',
    'baja asistencia',
  ],
  solution:
    'Puedes detectar caídas en la frecuencia de asistencia antes de que se ' +
    'conviertan en bajas, ajustar el staffing según la demanda observada en cada ' +
    'sede y diseñar beneficios que incentiven exactamente lo que más importa — ' +
    'mayor frecuencia de visita, mayor fidelidad, menor tasa de abandono — con ' +
    'datos reales de comportamiento. Identificas qué horarios concentran la demanda ' +
    'en cada local, qué sedes tienen baja asistencia y en qué momentos necesitas ' +
    'accionar para retener socios antes de perderlos. Para vincular esos datos a ' +
    'socios individuales y activar recompensas personalizadas, tu sistema de ' +
    'gestión conecta su base de socios via API.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
}

export const goalRestaurants: BusinessGoal = {
  id: 'goal-restaurants',
  title: 'Restaurantes y gastronomía',
  matchKeywords: [
    // Tipo de establecimiento
    'restaurante', 'restaurantes', 'mi restaurante', 'cadena de restaurantes',
    'cafetería', 'cafeterias', 'café', 'cafe', 'bar', 'bares',
    'food court', 'patio de comidas', 'local gastronómico',
    'local gastronomico', 'negocio gastronómico', 'negocio gastronomico',
    // Comparar locales — dos frases para ganarle score a goalDecisionMaking
    'saber que local', 'saber qué local',
    'que local funciona mejor', 'qué local funciona mejor',
    // Campañas y tráfico
    'campañas locales', 'campanas locales',
    'horarios del restaurante', 'flujo del restaurante',
    'tráfico del restaurante', 'trafico del restaurante',
    'comparar restaurantes', 'comparar mis restaurantes',
    'cuál restaurante funciona mejor', 'cual restaurante funciona mejor',
  ],
  solution:
    'Puedes saber cuál de tus locales concentra más tráfico real en cada franja ' +
    'horaria, qué campañas de proximidad efectivamente llevaron clientes al ' +
    'restaurante versus las que solo generaron impresiones y cómo varía el flujo ' +
    'entre locales a lo largo de la semana. Con esa información comparas el ' +
    'rendimiento real de tu cadena, detectas cuáles tienen capacidad no aprovechada ' +
    'y tomas decisiones de operación — personal, horarios, activaciones locales — ' +
    'con comportamiento observado. El resultado: una cadena gastronómica que actúa ' +
    'sobre datos reales, no sobre la percepción del equipo de sala.',
  capabilities: ['geopoints', 'presence', 'analytics', 'smart-proxies'],
}

export const goalEvents: BusinessGoal = {
  id: 'goal-events',
  title: 'Eventos, ferias y activaciones',
  matchKeywords: [
    // Tipo de evento
    'evento', 'eventos', 'organizar eventos', 'organizo eventos',
    'feria', 'ferias', 'congreso', 'congresos',
    'exposición', 'exposicion', 'exposiciones',
    'activación de marca', 'activacion de marca', 'activaciones de marca',
    'evento corporativo', 'eventos corporativos',
    'conferencia', 'conferencias', 'jornada', 'jornadas',
    // Patrocinadores
    'patrocinadores', 'patrocinador', 'sponsor', 'sponsors',
    'justificar patrocinadores', 'justificar sponsors',
    'demostrar a patrocinadores', 'roi del evento', 'roi de eventos',
    // Asistencia y evidencia
    'asistencia real', 'asistentes reales', 'aforo real', 'aforo',
    'demostrar asistencia', 'evidencia de asistencia',
    'asistencia verificada', 'cuántas personas asistieron',
    'cuantas personas asistieron', 'impacto del evento',
  ],
  solution:
    'Puedes demostrar con evidencia objetiva lo que ocurrió en tu evento: cuántas ' +
    'personas estuvieron físicamente presentes, cuánto tiempo permanecieron en cada ' +
    'zona y cuál fue el alcance real — sin depender de aforos estimados ni de ' +
    'declaraciones de asistentes. Con esos datos presentas el retorno real ante ' +
    'patrocinadores y clientes, calculas el costo por interacción verificada y ' +
    'mejoras el diseño de futuros eventos con base en el comportamiento observado. ' +
    'El resultado: eventos con resultados demostrables y un diseño que mejora con ' +
    'cada edición.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
}

export const goalShoppingCenters: BusinessGoal = {
  id: 'goal-shopping-centers',
  title: 'Centros comerciales y malls',
  matchKeywords: [
    // Tipo de establecimiento
    'mall', 'centro comercial', 'centros comerciales', 'un centro comercial',
    'shopping', 'shopping center', 'plaza comercial', 'galería comercial',
    'galeria comercial', 'mi mall', 'mi centro comercial',
    // Tráfico y zonas
    'tráfico por zona', 'trafico por zona',
    'tráfico por sector', 'trafico por sector',
    'zonas del mall', 'zonas del centro comercial',
    'sectores del mall', 'sector del mall',
    'comparar sectores', 'comparar zonas del mall',
    'comparar sectores del mall',
    // Locatarios
    'locatarios', 'locales del mall', 'locales del centro comercial',
    'campañas del mall', 'rendimiento por zona',
  ],
  solution:
    'Puedes saber en qué zonas, pasillos y niveles de tu centro comercial se ' +
    'concentra el tráfico real — en qué horarios, en qué días y cómo varía entre ' +
    'sectores — y usar esa información para asignar espacios con criterios ' +
    'objetivos, negociar rentas con datos concretos y diseñar campañas que ' +
    'desplacen visitantes hacia las áreas de menor actividad. Locatarios que ' +
    'cuestionan su ubicación o rendimiento reciben datos reales de tráfico por ' +
    'zona, lo que hace más transparente y defendible cada decisión comercial. ' +
    'El resultado: un centro comercial gestionado con inteligencia espacial, ' +
    'no con percepciones de flujo.',
  capabilities: ['geopoints', 'analytics', 'spatial-intelligence', 'live-visits'],
}

export const goalFranchises: BusinessGoal = {
  id: 'goal-franchises',
  title: 'Franquicias y cadenas de locales',
  matchKeywords: [
    // Tipo de negocio
    'franquicia', 'franquicias', 'mi franquicia', 'mis franquicias',
    'franquiciado', 'franquiciados', 'franquiciador',
    'cadena de locales', 'red de locales',
    'red de sucursales', 'multisucursal', 'multi-sucursal',
    // Comparar y evaluar — "sucursales" sola + "comparar sucursales" superan a goalDecisionMaking
    'sucursales', 'comparar sucursales', 'comparar mis sucursales',
    'comparar franquicias', 'comparar mis franquicias',
    'desempeño de sucursales', 'rendimiento de sucursales',
    'desempeño de franquicias', 'rendimiento de franquicias',
    // Identificar problemas
    'locales débiles', 'locales debiles',
    'detectar locales débiles', 'detectar locales debiles',
    'sucursales débiles', 'sucursales debiles',
    'sucursales con bajo rendimiento',
    // Expansión
    'expansión de franquicia', 'expansion de franquicia',
    'estandarizar operaciones', 'estandarización', 'estandarizacion',
  ],
  solution:
    'Puedes identificar cuáles de tus franquicias o sucursales están rindiendo ' +
    'por debajo de su potencial con datos reales de presencia — no con ventas ' +
    'declaradas ni visitas estimadas — y tomar decisiones de expansión, ' +
    'intervención o cierre con evidencia observable. Los patrones que distinguen ' +
    'a las sucursales más exitosas se vuelven visibles, lo que los hace ' +
    'reproducibles en otros locales. El resultado: una red gestionada con ' +
    'criterios objetivos, donde cada decisión se respalda con comportamiento ' +
    'real observado en terreno, no con percepciones del franquiciado.',
  capabilities: ['geopoints', 'analytics', 'presence', 'api'],
}

export const goalTourism: BusinessGoal = {
  id: 'goal-tourism',
  title: 'Turismo y destinos',
  matchKeywords: [
    // Tipo de destino
    'turismo', 'turista', 'turistas', 'sector turístico', 'sector turistico',
    'atractivo turístico', 'atractivo turistico',
    'atractivos turísticos', 'atractivos turisticos',
    'destino turístico', 'destino turistico',
    'parque temático', 'parque tematico', 'parque de atracciones',
    'museo', 'museos', 'monumento', 'monumentos',
    'parque natural', 'reserva natural',
    'ruta turística', 'ruta turistica', 'circuito turístico', 'circuito turistico',
    // Visitantes y recorridos
    'visitantes', 'flujo de visitantes', 'recorrido de visitantes',
    'comportamiento de visitantes', 'recorrido turístico', 'recorrido turistico',
    // Experiencia turística — supera a goalCustomerExperience con dos frases
    'experiencia turística', 'experiencia turistica',
    'mejorar la experiencia turística', 'mejorar la experiencia turistica',
    'tour', 'tours', 'excursión', 'excursion',
  ],
  solution:
    'Puedes comparar el interés real que genera cada atractivo — cuántas personas ' +
    'llegaron, cuánto tiempo permanecieron, qué recorridos siguieron y qué zonas ' +
    'concentraron más atención — y redistribuir recursos hacia las experiencias ' +
    'que más retienen visitantes. La gestión del destino pasa de basarse en ' +
    'percepciones y conteos manuales a funcionar con datos reales de ' +
    'comportamiento en cada punto. También puedes activar contenido contextual ' +
    'según la ubicación del visitante: información del lugar, guías de recorrido ' +
    'o experiencias que se despliegan automáticamente al llegar a cada punto. ' +
    'El resultado: un destino más atractivo, más fácil de gestionar y más capaz ' +
    'de demostrar su impacto.',
  capabilities: ['geopoints', 'presence', 'analytics', 'smart-proxies'],
}

export const goalRealEstate: BusinessGoal = {
  id: 'goal-real-estate',
  title: 'Inmobiliarias y desarrolladoras',
  matchKeywords: [
    // Tipo de negocio
    'inmobiliaria', 'inmobiliarias', 'sector inmobiliario',
    'desarrolladora', 'desarrolladora inmobiliaria',
    'proyecto inmobiliario', 'proyectos inmobiliarios',
    'desarrollo inmobiliario', 'emprendimiento inmobiliario',
    // Salas de venta y pilotos
    'sala de venta', 'salas de venta', 'sala de ventas', 'salas de ventas',
    'piloto', 'pilotos', 'departamento piloto', 'casa piloto', 'sala piloto',
    // Medición específica
    'visitas a salas de venta', 'visitas a la sala de venta',
    'medir visitas a salas de venta', 'medir visitas al piloto',
    'visitas al proyecto', 'interés por proyecto', 'interes por proyecto',
    'qué proyecto genera más interés', 'que proyecto genera mas interes',
    'qué proyecto genera más visitas', 'que proyecto genera mas visitas',
    'comparar proyectos', 'desempeño de proyectos',
  ],
  solution:
    'Puedes saber cuántas personas llegaron físicamente a cada sala de ventas o ' +
    'proyecto, cuánto tiempo permanecieron y cómo varía el interés entre ' +
    'propiedades — sin depender de los registros del ejecutivo de venta ni de ' +
    'métricas de pauta digital. Con esa información comparas el desempeño real ' +
    'de tus proyectos, identificas qué campañas efectivamente llevan visitas al ' +
    'terreno y presentas evidencia objetiva del interés generado ante socios, ' +
    'inversores o la organización. También puedes proteger tu material exclusivo ' +
    '— planos, precios, fichas técnicas — activándolo solo cuando el interesado ' +
    'está físicamente en el proyecto. El resultado: decisiones comerciales más ' +
    'fundamentadas y materiales mejor controlados.',
  capabilities: ['geopoints', 'presence', 'analytics', 'api'],
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
  goalRetailStores,
  goalGyms,
  goalRestaurants,
  goalEvents,
  goalShoppingCenters,
  goalFranchises,
  goalTourism,
  goalRealEstate,
]
