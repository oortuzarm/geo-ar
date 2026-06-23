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

export const productFaqs: FAQ[] = [
  faqWhatIsUbyca,
  faqCapabilities,
  faqAppIntegration,
  faqStadium,
  faqIndoor,
  faqMonitoring,
  faqVsQR,
]
