import type { FAQ } from './types'

export const faqWhatIsUbyca: FAQ = {
  id: 'faq-what-is-ubyca',
  title: 'Qué es Ubyca y para qué sirve',
  questionPatterns: [
    'qué es ubyca', 'que es ubyca',
    'cómo funciona ubyca', 'como funciona ubyca',
    'para qué sirve ubyca', 'para que sirve ubyca',
    'qué hace ubyca', 'que hace ubyca',
    'qué problemas resuelve', 'que problemas resuelve',
    'cuéntame sobre ubyca', 'cuentame sobre ubyca',
    'explícame ubyca', 'explicame ubyca',
    'presentación de ubyca', 'cómo funciona esto', 'como funciona esto',
  ],
  answer:
    'Ubyca responde una pregunta que muchos sistemas no pueden contestar: ¿esta ' +
    'persona realmente estuvo en ese lugar? Verifica la presencia física en el ' +
    'servidor — con hora exacta, duración y sin posibilidad de auto-declaración ' +
    'ni falsificación — y actúa en consecuencia: activa contenido, registra la ' +
    'visita, habilita acceso o genera un dato de analítica. Sin hardware, sin ' +
    'apps nativas que instalar. El acceso es desde Studio (interfaz visual sin ' +
    'código) o vía API REST. Funciona para equipos en terreno, campañas de marca, ' +
    'control de acceso, fidelización presencial, análisis de tráfico y experiencias ' +
    'geolocalizadas.',
  tags: ['Studio', 'API', 'GeoPoints', 'Presencia física'],
}

export const faqWhyUbyca: FAQ = {
  id: 'faq-why-ubyca',
  title: 'Por qué implementar Ubyca: valor, beneficios y diferenciador',
  questionPatterns: [
    // Por qué usar / implementar
    'por qué debería usar ubyca', 'por que deberia usar ubyca',
    'por qué debería implementar ubyca', 'por que deberia implementar ubyca',
    'por qué implementar ubyca', 'por que implementar ubyca',
    'por qué contratar ubyca', 'por que contratar ubyca',
    'por qué ubyca', 'por que ubyca',
    // Qué gano / beneficio
    'qué gano con ubyca', 'que gano con ubyca',
    'qué gano implementándolo', 'que gano implementandolo',
    'qué beneficio tiene para mi negocio', 'que beneficio tiene para mi negocio',
    'beneficios de ubyca', 'beneficio de ubyca',
    'ventajas de ubyca', 'ventaja de ubyca',
    // Por qué cambiar
    'por qué no seguir haciendo lo mismo', 'por que no seguir haciendo lo mismo',
    'por qué cambiar lo que hago', 'por que cambiar lo que hago',
    'qué cambia realmente con ubyca', 'que cambia realmente con ubyca',
    'qué cambia con ubyca', 'que cambia con ubyca',
    // Qué problema / valor / propuesta
    'qué problema resuelve', 'que problema resuelve',
    'qué valor aporta ubyca', 'que valor aporta ubyca',
    'valor de ubyca', 'propuesta de valor de ubyca',
    'qué aporta ubyca', 'que aporta ubyca',
    // Justificación y ROI
    'justificar la inversión en ubyca', 'justificar la inversion en ubyca',
    'justificar implementar ubyca', 'justificar ubyca',
    'vale la pena ubyca', 'vale la pena implementar',
    'me conviene ubyca', 'conviene usar ubyca',
    'retorno de ubyca', 'roi de ubyca',
  ],
  answer:
    'La mayoría de las herramientas te dicen qué hizo alguien en tu sitio web. ' +
    'Ubyca te dice qué hizo alguien en el mundo físico: si estuvo realmente en ' +
    'tu local, cuánto tiempo permaneció, en qué horarios hay más actividad y qué ' +
    'ubicaciones generan más valor. El resultado es visibilidad completa sobre lo ' +
    'que ocurre en tus puntos físicos — sin depender de reportes manuales, ' +
    'declaraciones del personal ni estimaciones. ' +
    'Con esos datos puedes tomar mejores decisiones de inversión, demostrar el ' +
    'impacto real de tus campañas presenciales, controlar equipos en terreno y ' +
    'optimizar la experiencia de quien visita tus espacios. ' +
    'Lo que cambia con Ubyca es que el mundo físico deja de ser una caja negra.',
  tags: ['Presencia física', 'Analytics', 'GeoPoints', 'Studio'],
}

export const faqCapabilities: FAQ = {
  id: 'faq-capabilities',
  title: 'Capacidades y componentes de Ubyca',
  questionPatterns: [
    'diferencia entre studio y api', 'diferencia studio api',
    'qué es studio', 'que es studio',
    'qué es un geopoint', 'que es un geopoint',
    'componentes de ubyca', 'partes de ubyca', 'módulos de ubyca',
    'cómo se usa ubyca', 'como se usa ubyca',
    'qué puedo hacer con ubyca', 'que puedo hacer con ubyca',
    'capacidades de ubyca', 'funcionalidades de ubyca',
    'qué incluye ubyca', 'que incluye ubyca',
  ],
  answer:
    'Ubyca tiene cinco componentes principales. GeoPoints: zonas geográficas ' +
    'definidas sobre un mapa que determinan dónde se activa una regla o se ' +
    'registra presencia. Presencia física: validación server-side de que el ' +
    'usuario está dentro de un GeoPoint. Studio: interfaz visual para crear ' +
    'proyectos, definir zonas, ver analítica en tiempo real y gestionar Smart ' +
    'Proxies sin escribir código. API REST: acceso programático a todas las ' +
    'capacidades para integrar con sistemas del cliente. Analytics: historial ' +
    'de eventos de presencia, dwell time, flujo y distribución espacial.',
  tags: ['Studio', 'API', 'GeoPoints', 'Presencia física', 'Analytics'],
}

export const faqAppIntegration: FAQ = {
  id: 'faq-app-integration',
  title: 'Integrar Ubyca con una aplicación móvil o web propia',
  questionPatterns: [
    // Integración con app
    'integrar ubyca', 'integrar con mi app', 'integrar en mi app',
    'integrar ubyca con app', 'puedo integrar ubyca',
    'funciona con aplicaciones móviles', 'funciona con aplicacion movil',
    'api en mi app', 'api desde mi aplicacion', 'api dentro de mi app',
    'uso la api desde una app', 'integrar con una app existente',
    // SDK
    'sdk para app', 'sdk para ios', 'sdk para android', 'sdk movil',
    'sdk de ubyca', 'tienen sdk',
    // App propia
    'mi aplicacion movil', 'mi app propia', 'app propia',
    'app de ios', 'app de android', 'app nativa',
  ],
  answer:
    'Sí. Ubyca se integra con aplicaciones móviles y web mediante su API REST. ' +
    'Tu app llama a los endpoints de Ubyca enviando las coordenadas GPS del ' +
    'usuario y recibe la validación de presencia en menos de 80 ms. No existe ' +
    'un SDK nativo oficial para iOS ni Android: la integración se hace ' +
    'directamente contra la API usando cualquier cliente HTTP estándar ' +
    '(URLSession, Retrofit, fetch, Axios). Desde tu app puedes verificar ' +
    'presencia, consultar datos de GeoPoints y acceder a analytics. Para ' +
    'validación en segundo plano (background location), tu app nativa debe ' +
    'gestionar el permiso de ubicación continua.',
  tags: ['API', 'GeoPoints', 'Presencia física'],
}

export const faqStadium: FAQ = {
  id: 'faq-stadium',
  title: 'Uso de Ubyca en estadios, arenas y grandes recintos',
  questionPatterns: [
    'estadio', 'arena deportiva', 'recinto deportivo', 'recinto masivo',
    'cancha', 'coliseo', 'hipódromo', 'velódromo',
    'ubyca en estadio', 'usar ubyca en estadio',
    'gran recinto', 'recinto de gran capacidad',
    'evento masivo', 'experiencia en estadio',
  ],
  answer:
    'Sí. Un estadio o arena puede cubrirse con GeoPoints sobre sus zonas: ' +
    'tribunas, sectores VIP, área de campo, pasillos de ingreso. Puedes ' +
    'activar experiencias digitales según la zona donde esté el asistente, ' +
    'verificar presencia para habilitar beneficios o acceso a contenido, y ' +
    'obtener analytics de distribución de visitantes por sector. Consideración ' +
    'importante: en recintos cerrados la precisión GPS varía entre 10 y 50 ' +
    'metros, lo que funciona bien para sectores amplios como tribunas o ' +
    'pabellones, pero no para distinguir asientos o filas adyacentes.',
  tags: ['GeoPoints', 'Presencia física', 'Analytics', 'Studio'],
}

export const faqIndoor: FAQ = {
  id: 'faq-indoor',
  title: 'Precisión GPS en recintos cerrados e interiores',
  questionPatterns: [
    // Recintos cerrados
    'recintos cerrados', 'recinto cerrado', 'interior', 'indoor',
    'funciona en interiores', 'funciona indoor', 'funciona en interior',
    'usar ubyca en interiores', 'uso en interiores', 'uso indoor',
    'dentro de un edificio', 'adentro de un edificio',
    // Lugares específicos
    'mall', 'centro comercial', 'shopping',
    'galería comercial', 'recinto cubierto',
    // Precisión GPS
    'precisión indoor', 'gps indoor', 'gps en interior',
    'precisión en interiores', 'error gps interior',
    'funciona sin señal gps', 'señal gps en interior',
  ],
  answer:
    'Ubyca funciona en recintos cerrados, pero con limitaciones que es ' +
    'importante conocer. El GPS en entornos indoor tiene una precisión de 10 ' +
    'a 50 metros según el tipo de construcción y la señal disponible. Esto ' +
    'significa que Ubyca puede delimitar zonas amplias — pisos, pabellones, ' +
    'sectores separados al menos 30-50 metros — pero no puede distinguir con ' +
    'fiabilidad entre zonas más cercanas entre sí. En exteriores, la precisión ' +
    'es de 3-10 metros y el rendimiento es significativamente mejor. Para ' +
    'casos indoor que requieren alta densidad de zonas pequeñas, se recomienda ' +
    'evaluar el caso concreto antes de implementar.',
  tags: ['GeoPoints', 'Presencia física'],
}

export const faqMonitoring: FAQ = {
  id: 'faq-monitoring',
  title: 'Ubyca y el monitoreo o seguimiento de personas',
  questionPatterns: [
    // Monitoreo
    'monitorear personas', 'monitorear a personas', 'monitorear a las personas',
    'monitoreo de personas', 'monitoreo de usuarios',
    // Seguimiento / rastreo
    'seguimiento de personas', 'seguimiento de usuarios', 'seguir personas',
    'rastrear personas', 'rastreo de personas', 'rastrear usuarios',
    'tracking de personas', 'tracking de usuarios',
    // Vigilancia
    'vigilar personas', 'vigilancia', 'controlar personas',
    // Localización
    'localizar personas', 'saber dónde están las personas',
    'saber donde estan las personas', 'ubicación de personas',
    // Privacidad
    'es legal', 'cumple gdpr', 'cumple con privacidad',
    'datos personales', 'privacidad de usuarios',
  ],
  answer:
    'Ubyca no realiza seguimiento oculto ni tracking continuo de personas. ' +
    'La validación de presencia ocurre cuando el usuario genera activamente ' +
    'una solicitud al sistema — abre un link, usa la app del cliente o ' +
    'interactúa con la experiencia configurada. Ubyca no lee la ubicación ' +
    'del dispositivo en segundo plano sin acción del usuario. ' +
    'En escenarios de monitoreo de equipos de trabajo (agentes de campo, ' +
    'vendedores, técnicos), la solución requiere que los propios trabajadores ' +
    'participen activamente en cada validación. El cumplimiento normativo ' +
    'corresponde al cliente que implementa la solución, de acuerdo con la ' +
    'legislación aplicable en su jurisdicción — Ubyca provee infraestructura ' +
    'técnica, no asesoramiento legal.',
  tags: ['Presencia física', 'API'],
}

export const faqVsQR: FAQ = {
  id: 'faq-vs-qr',
  title: 'Diferencia entre Ubyca y usar un QR en cada ubicación',
  questionPatterns: [
    'diferencia entre ubyca y qr', 'diferencia con qr',
    'ventaja sobre qr', 'comparado con qr',
    'ubyca vs qr', 'qr tradicional',
    'poner un qr', 'usar qr', 'simplemente poner un qr',
    'diferencia entre usar ubyca y qr',
    'por qué no usar qr', 'para que sirve si tengo qr',
    'ya tengo qr', 'en vez de qr',
    // Vocabulario adicional — comparación con landing/página QR
    'landing con qr', 'landing con un qr',
    'página con qr', 'pagina con qr',
    'simplemente qr',
    'que diferencia hay con',
  ],
  answer:
    'Un QR es suficiente cuando solo necesitas distribuir un enlace o facilitar ' +
    'acceso a contenido. El problema es que un QR puede compartirse, fotografiarse ' +
    'y usarse desde cualquier lugar y momento — no hay forma de saber si quien lo ' +
    'escaneó estaba físicamente donde debía estar. ' +
    'Ubyca resuelve casos donde eso importa: valida en el servidor que el usuario ' +
    'está dentro de un GeoPoint antes de activar el contenido, registrar la visita ' +
    'o habilitar el beneficio. No puede falsificarse compartiendo un link ni ' +
    'escaneando desde casa. Además, Ubyca registra datos reales de presencia, ' +
    'cuánto tiempo estuvo el usuario y desde qué ubicación — datos que un QR no ' +
    'genera. Si tu caso solo requiere "dar acceso a un link", un QR puede ser ' +
    'suficiente. Si necesitas verificar que alguien estuvo físicamente en el lugar, ' +
    'medir esa presencia o activar reglas basadas en ubicación real, Ubyca es la ' +
    'herramienta correcta.',
  tags: ['GeoPoints', 'Presencia física', 'Analytics'],
}

export const faqVsGoogleAnalytics: FAQ = {
  id: 'faq-vs-google-analytics',
  title: 'Diferencia entre Ubyca y Google Analytics (GA4)',
  questionPatterns: [
    // Catch-all — cualquier mención de Google Analytics o GA4
    'google analytics', 'google analitycs', 'ga4', 'google analytics 4',
    // Diferencia / comparación directa
    'diferencia entre ubyca y google analytics',
    'diferencia con google analytics',
    'cual es la diferencia entre ubyca y google analytics',
    'comparado con google analytics',
    'versus google analytics', 'vs google analytics',
    'ubyca vs google analytics', 'ubyca versus google analytics',
    // Por qué usar Ubyca si ya tengo GA
    'por qué usar ubyca si ya tengo google analytics',
    'por que usar ubyca si ya tengo google analytics',
    'para qué sirve si tengo google analytics',
    'para que sirve si tengo google analytics',
    'ya tengo google analytics', 'si ya tengo google analytics',
    'tengo google analytics', 'uso google analytics',
    'ya uso google analytics', 'con google analytics basta',
    // Google Analytics hace lo mismo
    'google analytics no hace lo mismo',
    'google analytics hace lo mismo',
    'no hace lo mismo que google analytics',
    // ¿Es parecido / similar?
    'es parecido a google analytics', 'parecido a google analytics',
    'similar a google analytics', 'es lo mismo que google analytics',
    'funciona como google analytics',
    // ¿Qué aporta Ubyca que no tenga GA?
    'qué aporta ubyca que no tenga google analytics',
    'que aporta ubyca que no tenga google analytics',
    'qué aporta ubyca que no tenga ga4',
    'que aporta ubyca que no tenga ga4',
    // ¿Reemplaza / sustituye / compite?
    'reemplaza google analytics', 'sustituye google analytics',
    'reemplazar google analytics', 'sustituir google analytics',
    'ubyca compite con google analytics',
    'compite con google analytics',
  ],
  answer:
    'Google Analytics y Ubyca no compiten directamente: miden cosas distintas. ' +
    'Google Analytics analiza el comportamiento digital dentro de un sitio web ' +
    'o aplicación — páginas vistas, clics, sesiones y conversiones dentro de ' +
    'una experiencia digital. Ubyca responde una pregunta diferente: ¿esta ' +
    'persona estuvo físicamente en este lugar? Valida presencia en el mundo real, ' +
    'registra cuándo ocurrió, cuánto tiempo permaneció el visitante y si una ' +
    'activación presencial generó presencia verificada — independientemente de ' +
    'si el usuario interactuó con un sitio web o no. ' +
    'Muchas organizaciones usan ambas herramientas de forma complementaria: ' +
    'Google Analytics para entender el comportamiento online y Ubyca para ' +
    'entender lo que ocurre en sus puntos físicos. Si tu pregunta es "¿cuántas ' +
    'personas visitaron mi sitio?", Google Analytics la responde. Si tu pregunta ' +
    'es "¿cuántas personas estuvieron físicamente en mi local?", Ubyca la responde.',
  tags: ['Analytics', 'Presencia física', 'GeoPoints'],
}

export const faqNoHardware: FAQ = {
  id: 'faq-no-hardware',
  title: 'Ubyca no requiere hardware, sensores ni dispositivos físicos',
  questionPatterns: [
    // Pregunta directa sobre hardware
    'necesito hardware', 'requiere hardware', 'necesitan hardware',
    'necesita hardware', 'hay hardware', 'tiene hardware',
    // Instalar algo
    'necesito instalar algo', 'instalar algo en el local',
    'instalar algo físico', 'hay que instalar algo',
    'instalar algo', 'necesito instalar', 'hay que instalar',
    'qué hay que instalar', 'que hay que instalar',
    // Dispositivos y sensores
    'necesito beacons', 'requiere beacons', 'necesito sensores',
    'requiere sensores', 'dispositivos físicos', 'dispositivos especiales',
    'necesito dispositivos', 'requiere dispositivos',
    'equipos físicos', 'equipos especiales',
    // Sin hardware — confirmaciones positivas
    'sin hardware', 'sin sensores', 'sin beacons',
    'sin torniquetes', 'sin lectores', 'sin infraestructura',
    'sin dispositivos', 'sin equipos físicos',
    'sin infraestructura adicional', 'sin nada físico',
    // Funcionamiento sin hardware
    'funciona sin hardware', 'funciona sin instalar',
    'funciona sin sensores', 'funciona sin beacons',
    'funciona sin dispositivos',
    // Algo físico (formulación genérica)
    'algo físico', 'algo fisico', 'necesito algo físico',
    'necesito algo fisico',
  ],
  answer:
    'No. Ubyca no requiere hardware, sensores, beacons ni dispositivos físicos ' +
    'instalados en ningún punto. La validación de presencia se realiza a partir ' +
    'de la ubicación GPS del teléfono del usuario y se procesa en los servidores ' +
    'de Ubyca — sin equipos que instalar, calibrar ni mantener. ' +
    'Puedes comenzar con tu sitio web, app o una integración vía API sin modificar ' +
    'la infraestructura física de ningún local.',
  tags: ['GeoPoints', 'Presencia física', 'API'],
}

export const faqApiIntegration: FAQ = {
  id: 'faq-api-integration',
  title: 'API, integración e implementación técnica de Ubyca',
  questionPatterns: [
    // ¿Tiene API?
    'tiene api', 'tienen api', 'tiene una api', 'tiene api rest',
    'api disponible', 'expone api',
    // Cómo se integra
    'se integra', 'como se integra', 'cómo se integra',
    'se integra con mi sistema', 'integra con mi sistema',
    'se puede integrar', 'puedo integrarlo', 'puedo integrarla',
    'cómo integro ubyca', 'como integro ubyca',
    // Conectar
    'conecto ubyca', 'conectar ubyca con',
    'cómo conecto ubyca', 'como conecto ubyca',
    'conectar con mi sistema', 'conectar con mi plataforma',
    // Funciona con mi app / web / sistema
    'funciona con mi app', 'funciona con mi aplicación',
    'funciona con mi aplicacion', 'funciona con mi web',
    'funciona con mi sistema', 'funciona con mi plataforma',
    'compatible con mi sistema', 'compatible con mi plataforma',
    // SDK
    'necesito un sdk', 'necesito sdk', 'hay sdk', 'tiene sdk',
    'requiere sdk', 'sin sdk',
    // Desarrollador y programación
    'necesito un desarrollador', 'necesito desarrollador',
    'hace falta un desarrollador', 'hace falta desarrollador',
    'hace falta programar', 'falta programar',
    'hace falta desarrollo', 'requiere desarrollo',
    'sin desarrollador', 'sin programador', 'sin programar',
    'sin código', 'sin codigo',
    'necesito programar', 'necesito saber programar',
    // Tiempo de implementación
    'cuánto tarda implementarlo', 'cuanto tarda implementarlo',
    'tarda implementarlo', 'cuánto tarda la integración',
    'cuanto tarda la integracion', 'tiempo de implementación',
    'tiempo de implementacion', 'cuánto tiempo tarda',
    'cuanto tiempo tarda', 'cuánto lleva implementarlo',
    'cuanto lleva implementarlo',
    // Smart Proxy
    'smart proxy', 'smart proxies',
  ],
  answer:
    'Sí. Ubyca dispone de una API REST que permite validar presencia física desde ' +
    'cualquier aplicación, backend o plataforma web — sin SDK propietario ni ' +
    'infraestructura especial. Tu sistema llama a un endpoint HTTP, recibe la ' +
    'validación en menos de 80 ms y decide qué hacer con ella. ' +
    'Para casos sin código: Smart Proxies envuelven una URL existente con ' +
    'validación de presencia geográfica sin modificar tu plataforma — ' +
    'configurables desde Studio sin escribir una línea. ' +
    'Para integración personalizada: tu equipo técnico conecta la API con cualquier ' +
    'backend, app iOS o Android, o sistema web mediante llamadas HTTP estándar. ' +
    'No existe SDK nativo oficial — se usa cualquier cliente HTTP. ' +
    'El esfuerzo depende del caso: un Smart Proxy puede activarse en horas; ' +
    'una integración backend completa, de un día a una semana.',
  tags: ['API', 'Studio', 'Smart Proxies'],
}

export const productFaqs: FAQ[] = [
  faqWhatIsUbyca,
  faqWhyUbyca,
  faqCapabilities,
  faqAppIntegration,
  faqStadium,
  faqIndoor,
  faqMonitoring,
  faqVsQR,
  faqVsGoogleAnalytics,
  faqNoHardware,
  faqApiIntegration,
]
