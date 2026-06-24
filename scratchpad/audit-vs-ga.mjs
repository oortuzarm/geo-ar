// src/knowledge/product.ts
var product = {
  name: "Ubyca",
  tagline: "La plataforma de presencia f\xEDsica en tiempo real.",
  description: "Ubyca es una plataforma que verifica en el servidor si un usuario est\xE1 f\xEDsicamente presente en una ubicaci\xF3n geogr\xE1fica. Env\xEDas coordenadas GPS y recibes en menos de 80ms si el usuario est\xE1 dentro de una zona, la distancia exacta al centro y el tiempo de permanencia acumulado. Los resultados se consumen desde Studio (interfaz visual) o desde la API (REST + JSON + OpenAPI 3.1).",
  positioning: "Ubyca no es un creador de puntos GPS ni una herramienta de mapas. Es una plataforma de presencia f\xEDsica: su n\xFAcleo es la validaci\xF3n server-side de coordenadas contra zonas geogr\xE1ficas configuradas, con reglas de negocio aplicadas en cada validaci\xF3n (horarios, dwell time, capacidad m\xE1xima). Tiene dos interfaces hacia el mismo motor: Studio para equipos sin perfil t\xE9cnico y la API para integrar en sistemas externos.",
  accessPoints: [
    "Studio \u2014 studio.ubyca.com (interfaz visual, sin c\xF3digo)",
    "API REST \u2014 api.ubyca.com/v1 (para desarrolladores)"
  ]
};

// src/knowledge/capabilities/studio.ts
var studio = {
  id: "studio",
  name: "Studio",
  tagline: "La interfaz visual de Ubyca para equipos sin perfil t\xE9cnico.",
  description: "Studio es la aplicaci\xF3n web de Ubyca disponible en studio.ubyca.com. Permite crear proyectos, configurar GeoPoints y pol\xEDgonos sobre el mapa, gestionar contenido multimedia asociado a cada zona, monitorear visitas en tiempo real y analizar m\xE9tricas espaciales \u2014 todo sin escribir c\xF3digo. Es la contraparte visual de la API: ambas acceden al mismo motor de presencia.",
  keyFeatures: [
    "Editor visual de GeoPoints con radios y pol\xEDgonos personalizados",
    "Configuraci\xF3n de reglas por zona: horarios, dwell time m\xEDnimo, cupos",
    "Dashboard de analytics: visitas, activaciones, conversi\xF3n y tendencias",
    "Mapa de visitas en tiempo real con zona m\xE1s activa y ranking",
    "Gesti\xF3n de equipos con roles y permisos diferenciados",
    "Generaci\xF3n de c\xF3digos QR y links de compartir por proyecto",
    "Gesti\xF3n centralizada de m\xFAltiples proyectos en un workspace",
    "Portal de desarrolladores para crear y gestionar API keys"
  ],
  whoIsItFor: "Equipos de marketing, operaciones y gesti\xF3n que necesitan operar sobre datos de presencia f\xEDsica sin depender del \xE1rea t\xE9cnica.",
  relatedCapabilities: ["geopoints", "analytics", "live-visits", "spatial-intelligence", "smart-proxies"]
};

// src/knowledge/capabilities/api.ts
var api = {
  id: "api",
  name: "API",
  tagline: "REST API para integrar validaci\xF3n de presencia en cualquier sistema.",
  description: "La API de Ubyca expone un conjunto de endpoints REST para validar presencia GPS, consultar GeoPoints y consumir analytics desde cualquier sistema externo. Usa autenticaci\xF3n Bearer token con scopes por API key. La especificaci\xF3n completa est\xE1 disponible en OpenAPI 3.1. Base URL: https://api.ubyca.com/v1. Latencia de validaci\xF3n: menos de 80ms.",
  keyFeatures: [
    "POST /presence/validate \u2014 validaci\xF3n GPS con reglas de negocio (dwell time, horario, capacidad)",
    "POST /presence/check \u2014 consulta r\xE1pida de presencia sin reglas",
    "GET /locations/{id} \u2014 geometr\xEDa, radio y metadatos de un GeoPoint",
    "GET /projects/{id}/analytics \u2014 m\xE9tricas de visitas, dwell time y conversi\xF3n",
    "Autenticaci\xF3n Bearer token con scopes por endpoint",
    "Respuesta en JSON en menos de 80ms",
    "Especificaci\xF3n OpenAPI 3.1 descargable"
  ],
  whoIsItFor: "Desarrolladores e integradores que necesitan validar presencia f\xEDsica como parte de un sistema propio: apps m\xF3viles, plataformas corporativas, CRM, ERP o cualquier sistema que necesite saber si un usuario est\xE1 en un lugar.",
  apiEndpoints: [
    "POST /presence/validate",
    "POST /presence/check",
    "GET /locations/{id}",
    "GET /projects/{id}/analytics"
  ],
  relatedCapabilities: ["geopoints", "presence", "analytics", "integrations"]
};

// src/knowledge/capabilities/geopoints.ts
var geopoints = {
  id: "geopoints",
  name: "GeoPoints",
  tagline: "Zonas geogr\xE1ficas con l\xF3gica de negocio incorporada.",
  description: "Los GeoPoints son las unidades fundamentales de Ubyca: \xE1reas geogr\xE1ficas definidas por un radio circular o un pol\xEDgono personalizado. Cada GeoPoint tiene un nombre, coordenadas, geometr\xEDa activa y un conjunto de reglas de negocio propias. La validaci\xF3n de presencia siempre ocurre contra un GeoPoint espec\xEDfico. Se crean y administran desde Studio o mediante la Locations API.",
  keyFeatures: [
    "Radio circular configurable en metros (precisi\xF3n exacta)",
    "Pol\xEDgonos personalizados para formas irregulares o complejas",
    "Reglas de horario: activaci\xF3n por d\xEDas y ventanas de tiempo",
    "Dwell time m\xEDnimo: tiempo requerido de permanencia para validar",
    "Cupos: capacidad m\xE1xima simult\xE1nea de presencias v\xE1lidas",
    "Contenido asociado: video, audio, texto o enlace que se desbloquea por proximidad",
    "M\xE9tricas individuales por GeoPoint: visitas, activaciones, conversi\xF3n",
    "Estado activo/inactivo por punto"
  ],
  whoIsItFor: "Cualquier caso donde se necesita definir m\xFAltiples ubicaciones f\xEDsicas con comportamientos, reglas o contenidos distintos entre s\xED.",
  apiEndpoints: ["GET /locations/{id}", "POST /locations", "DELETE /locations/{id}"],
  relatedCapabilities: ["presence", "analytics", "studio"]
};

// src/knowledge/capabilities/presence.ts
var presence = {
  id: "presence",
  name: "Presencia f\xEDsica",
  tagline: "Validaci\xF3n GPS server-side en tiempo real.",
  description: "El n\xFAcleo de Ubyca es la validaci\xF3n de presencia f\xEDsica: contrastar las coordenadas GPS de un dispositivo contra los GeoPoints configurados. La validaci\xF3n ocurre en el servidor, no es auto-declarada por el usuario. El resultado incluye si el usuario est\xE1 dentro del \xE1rea, la distancia exacta al centro en metros, el tiempo de permanencia acumulado en la sesi\xF3n y el resultado de las reglas de negocio definidas en el GeoPoint. La respuesta llega en menos de 80ms.",
  keyFeatures: [
    "Validaci\xF3n server-side: no depende de auto-declaraci\xF3n del dispositivo",
    "Resultado: presente / ausente + distancia exacta en metros",
    "Dwell time: tiempo de permanencia acumulado en segundos",
    "Evaluaci\xF3n de reglas: horario, dwell time m\xEDnimo y capacidad m\xE1xima",
    "Respuesta en menos de 80ms",
    "Dos modos: validate (con reglas) y check (sin reglas, solo GPS)",
    "No requiere app nativa: funciona desde el navegador m\xF3vil",
    "Sin hardware adicional: usa el GPS del dispositivo del usuario"
  ],
  whoIsItFor: "Cualquier sistema que necesite saber con certeza si un usuario est\xE1 f\xEDsicamente en un lugar espec\xEDfico en este momento.",
  apiEndpoints: ["POST /presence/validate", "POST /presence/check"],
  relatedCapabilities: ["geopoints", "api", "analytics"]
};

// src/knowledge/capabilities/analytics.ts
var analytics = {
  id: "analytics",
  name: "Analytics",
  tagline: "M\xE9tricas reales de comportamiento espacial.",
  description: "Analytics es el m\xF3dulo de m\xE9tricas hist\xF3ricas de Ubyca. Registra cada interacci\xF3n \u2014 entradas al \xE1rea, activaciones, clics, completions de dwell time \u2014 y las presenta en dashboards por proyecto y por GeoPoint. Los datos reflejan comportamiento real: cu\xE1ntas personas llegaron, cu\xE1nto tiempo permanecieron y qu\xE9 porcentaje complet\xF3 una acci\xF3n. Son accesibles desde Studio y desde la Analytics API.",
  keyFeatures: [
    "Entradas al radio por GeoPoint: frecuencia y horarios",
    "Activaciones y clics por contenido asociado",
    "Tasa de conversi\xF3n: entrada \u2192 activaci\xF3n",
    "Dwell time promedio por punto y por per\xEDodo",
    "Tendencias y comparativas entre per\xEDodos de tiempo",
    "M\xE9tricas de Smart Proxies: openings, location granted, clics, dwell completions",
    "Sesiones \xFAnicas y usuarios \xFAnicos que hicieron clic",
    "Datos exportables v\xEDa Analytics API"
  ],
  whoIsItFor: "Equipos de operaciones, marketing y producto que necesitan medir el rendimiento real de sus ubicaciones f\xEDsicas para tomar decisiones basadas en datos.",
  apiEndpoints: ["GET /projects/{id}/analytics"],
  relatedCapabilities: ["geopoints", "live-visits", "spatial-intelligence", "smart-proxies"]
};

// src/knowledge/capabilities/live-visits.ts
var liveVisits = {
  id: "live-visits",
  name: "Visitas en vivo",
  tagline: "Monitoreo de presencia activa en tiempo real.",
  description: "Visitas en vivo es la vista de monitoreo en tiempo real de Ubyca. Muestra cu\xE1ntos usuarios est\xE1n activos en el conjunto de ubicaciones ahora mismo, cu\xE1l es la zona m\xE1s activa, cu\xE1ntas activaciones ocurrieron hoy y el ranking de zonas por tr\xE1fico. Est\xE1 disponible tanto para proyectos basados en GeoPoints como para Smart Proxies. Los datos se actualizan sin necesidad de recargar la p\xE1gina.",
  keyFeatures: [
    "Visitantes activos en este momento (conteo en tiempo real)",
    "Zona m\xE1s activa del proyecto con recuento de presencias",
    "Activaciones del d\xEDa y delta respecto al d\xEDa anterior",
    "Ranking de zonas por tr\xE1fico activo",
    "Intensidad GPS de las se\xF1ales activas",
    "Disponible para proyectos con GeoPoints y para Smart Proxies",
    "Vista consolidada de todos los proxies activos simult\xE1neamente"
  ],
  whoIsItFor: "Equipos que operan eventos, instalaciones o campa\xF1as activas y necesitan visibilidad en tiempo real de lo que est\xE1 ocurriendo en cada zona.",
  relatedCapabilities: ["analytics", "smart-proxies", "spatial-intelligence"]
};

// src/knowledge/capabilities/spatial-intelligence.ts
var spatialIntelligence = {
  id: "spatial-intelligence",
  name: "Inteligencia espacial",
  tagline: "Patrones de comportamiento y mapas de calor geoespaciales.",
  description: "Inteligencia espacial es la capa anal\xEDtica avanzada de Ubyca. Procesa los puntos GPS hist\xF3ricos y en tiempo real para generar mapas de intensidad, detectar hotspots de concentraci\xF3n y revelar patrones de comportamiento que no son visibles en m\xE9tricas simples. Permite entender c\xF3mo se mueven y d\xF3nde se concentran las personas dentro de un espacio o territorio.",
  keyFeatures: [
    "Mapas de intensidad GPS: densidad de presencia por coordenada",
    "Detecci\xF3n de hotspots: zonas de m\xE1xima concentraci\xF3n con radio estimado",
    "Modos hist\xF3rico y en vivo (para Smart Proxies)",
    "Comparaci\xF3n de distribuci\xF3n espacial entre zonas",
    "Identificaci\xF3n de patrones por horario y zona geogr\xE1fica",
    "Visualizaci\xF3n en mapa dentro de Studio"
  ],
  whoIsItFor: "Equipos de operaciones, urbanismo, retail o log\xEDstica que necesitan entender el comportamiento espacial de personas dentro de un \xE1rea, no solo contarlas.",
  relatedCapabilities: ["analytics", "live-visits", "smart-proxies", "geopoints"]
};

// src/knowledge/capabilities/smart-proxies.ts
var smartProxies = {
  id: "smart-proxies",
  name: "Smart Proxies",
  tagline: "A\xF1ade tracking geolocalizado a cualquier URL existente.",
  description: "Smart Proxies es una feature que convierte cualquier URL existente en un punto de experiencia geolocalizada. Ubyca act\xFAa como proxy inverso: crea una URL p\xFAblica propia que sirve el contenido del sitio destino mientras registra la ubicaci\xF3n GPS de cada visitante, el tiempo de permanencia, los clics y las conversiones. No requiere modificar el sitio destino. Antes de activar, Ubyca escanea la compatibilidad del sitio destino.",
  keyFeatures: [
    "Proxy inverso sobre cualquier URL: el contenido original no se modifica",
    "Registro de ubicaci\xF3n GPS de cada visitante con su consentimiento",
    "M\xE9tricas propias: openings, location granted, clics, dwell completions",
    "Tiempo de permanencia promedio (avgDwellSeconds)",
    "Sesiones \xFAnicas y usuarios \xFAnicos que interactuaron",
    "Tasa de conversi\xF3n: visitantes \u2192 activaciones",
    "Mapas de intensidad y hotspots de los visitantes",
    "Monitoreo en tiempo real de visitas activas",
    "Escaneo previo de compatibilidad del sitio destino",
    "Dominio personalizado opcional por proxy"
  ],
  whoIsItFor: "Organizaciones que tienen sitios o aplicaciones web existentes y quieren a\xF1adir tracking de presencia f\xEDsica y analytics geoespaciales sin modificar su c\xF3digo fuente.",
  relatedCapabilities: ["analytics", "live-visits", "spatial-intelligence"]
};

// src/knowledge/capabilities/integrations.ts
var integrations = {
  id: "integrations",
  name: "Integraciones",
  tagline: "Presencia f\xEDsica como input en sistemas ya existentes.",
  description: "Ubyca no reemplaza los sistemas del cliente: los complementa. Cualquier sistema que pueda hacer llamadas HTTP puede consumir resultados de validaci\xF3n de presencia, leer datos de GeoPoints y acceder a analytics. No existe un marketplace de integraciones predefinidas ni conectores nativos con CRM, ERP o plataformas de marketing: toda integraci\xF3n se construye sobre la REST API de Ubyca. El cliente mantiene el control total de la l\xF3gica de negocio; Ubyca aporta \xFAnicamente el dato de presencia y sus m\xE9tricas.",
  keyFeatures: [
    "Apps m\xF3viles iOS / Android: llamada a API desde la app nativa del cliente",
    "Sitios web y PWA: validaci\xF3n GPS desde el navegador via fetch a la API",
    "E-commerce: gate de beneficios que requiere presencia f\xEDsica verificada",
    "CRM y ERP: registro autom\xE1tico de visitas de campo verificadas por GPS",
    "Sistemas de control de acceso: presencia como condici\xF3n de autorizaci\xF3n",
    "Plataformas de fidelizaci\xF3n: acumulaci\xF3n de puntos solo por visita validada",
    "Sin webhooks: la integraci\xF3n es siempre request-response iniciado por el cliente"
  ],
  whoIsItFor: "Desarrolladores y arquitectos de sistemas que quieren a\xF1adir presencia f\xEDsica verificada como un input dentro de flujos y reglas ya existentes, sin modificar la infraestructura central del cliente.",
  relatedCapabilities: ["api", "presence", "geopoints", "analytics"]
};

// src/knowledge/use-cases/field-sales.ts
var fieldSalesVisits = {
  id: "field-sales-visits",
  vertical: "field-sales",
  title: "Visitas de vendedores a puntos de venta",
  problem: "El equipo comercial debe visitar tiendas o clientes en terreno, pero no hay forma confiable de verificar que las visitas ocurrieron, cu\xE1nto tiempo duraron ni con qu\xE9 frecuencia se realizan. Los reportes manuales son poco confiables y dif\xEDciles de auditar.",
  solution: "Puedes obtener un historial real de visitas comerciales \u2014 hora exacta, tiempo de permanencia y frecuencia por punto de venta \u2014 sin depender de reportes manuales que pueden alterarse. La presencia se verifica autom\xE1ticamente en el servidor cuando el vendedor llega al \xE1rea, no es auto-declarada.",
  capabilities: ["geopoints", "presence", "analytics"],
  matchKeywords: [
    "vendedor",
    "promotor",
    "punto de venta",
    "fuerza de ventas",
    "visita comercial",
    "cobertura comercial",
    "ruta de ventas"
  ]
};
var fieldSalesSupervision = {
  id: "field-sales-supervision",
  vertical: "field-sales",
  title: "Supervisi\xF3n de equipo en terreno",
  problem: "Un supervisor necesita saber qu\xE9 zonas est\xE1 cubriendo su equipo en tiempo real, sin tener que llamar a cada persona ni confiar en reportes de posici\xF3n auto-declarados.",
  solution: "Puedes ver en tiempo real qu\xE9 zonas est\xE1 cubriendo tu equipo, qui\xE9n est\xE1 presente en cada punto y cu\xE1l es la cobertura real \u2014 sin que nadie haga check-ins manuales. El sistema registra el historial completo de cobertura por persona, zona y horario para revisi\xF3n posterior.",
  capabilities: ["geopoints", "presence", "analytics", "live-visits", "spatial-intelligence"],
  matchKeywords: [
    "supervisor",
    "supervisar",
    "supervisi\xF3n",
    "ronda",
    "cobertura de zona",
    "equipo en terreno",
    "personal en campo",
    "monitorear equipo"
  ]
};
var fieldSalesDelivery = {
  id: "field-sales-delivery",
  vertical: "field-sales",
  title: "Control de rutas de reparto y distribuci\xF3n",
  problem: "Una empresa de distribuci\xF3n necesita verificar que los conductores o repartidores pasaron efectivamente por los puntos de entrega asignados, con la hora exacta y el tiempo que permanecieron.",
  solution: "Puedes verificar que tus conductores o repartidores pasaron por los puntos de entrega asignados, con hora exacta y tiempo de permanencia \u2014 sin depender de declaraciones del propio equipo. Ves la cobertura de rutas en tiempo real desde Studio y exportas los datos v\xEDa API a tu sistema log\xEDstico existente.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "reparto",
    "distribuci\xF3n",
    "conductor",
    "chofer",
    "entrega",
    "ruta de entrega",
    "log\xEDstica de campo",
    "cadena de distribuci\xF3n"
  ]
};

// src/knowledge/use-cases/events.ts
var eventsAccess = {
  id: "events-access",
  vertical: "events",
  title: "Control de acceso sin QR ni hardware",
  problem: "Un organizador de eventos necesita controlar que los asistentes est\xE9n f\xEDsicamente presentes en el lugar antes de habilitarles acceso a contenido, descuentos o beneficios. Los QR son f\xE1cilmente compartibles y el hardware de acceso es caro y dif\xEDcil de escalar.",
  solution: "S\xED. Puedes controlar el acceso a tu evento sin QR, sin tarjeta y sin hardware: la \xFAnica condici\xF3n es que el usuario est\xE9 f\xEDsicamente en el \xE1rea. No hay c\xF3digo que compartir ni falsificar \u2014 la validaci\xF3n es por ubicaci\xF3n real, verificada en el servidor. Puedes definir el per\xEDmetro exacto del evento, configurar horarios de activaci\xF3n y recibir la respuesta en menos de 80 ms v\xEDa API.",
  capabilities: ["geopoints", "presence", "api"],
  matchKeywords: [
    "evento",
    "acceso sin QR",
    "control de acceso",
    "asistente",
    "festival",
    "conferencia",
    "per\xEDmetro",
    "entrada sin c\xF3digo",
    // Lenguaje natural — acceso sin QR
    "sin usar QR",
    "sin QR",
    "controlar acceso sin QR",
    "sin c\xF3digo QR",
    "sin escanear",
    "alternativa al QR",
    "sin tarjeta ni QR",
    "acceso por ubicaci\xF3n real",
    "acceso sin hardware",
    "controlar el acceso sin",
    "acceso sin lector"
  ]
};
var eventsExperience = {
  id: "events-experience",
  vertical: "events",
  title: "Experiencias geoactivadas en eventos",
  problem: "Un organizador quiere que los asistentes descubran contenido o actividades diferentes seg\xFAn en qu\xE9 parte del evento se encuentren, sin tener que instalar una app dedicada.",
  solution: "Puedes activar contenido diferente seg\xFAn en qu\xE9 stand, zona o sala se encuentre el asistente \u2014 sin QR ni personal en cada punto. Al llegar a cada \xE1rea, el contenido correspondiente se activa autom\xE1ticamente en el dispositivo. Desde Studio puedes ver en tiempo real qu\xE9 zonas tienen m\xE1s tr\xE1fico.",
  capabilities: ["geopoints", "presence", "analytics", "live-visits", "smart-proxies"],
  matchKeywords: [
    "stand",
    "zona del evento",
    "contenido por zona",
    "experiencia interactiva",
    "activaci\xF3n por ubicaci\xF3n",
    "gamificaci\xF3n evento",
    "recorrido guiado"
  ]
};
var eventsAnalytics = {
  id: "events-analytics",
  vertical: "events",
  title: "M\xE9tricas de asistencia y comportamiento en eventos",
  problem: "Despu\xE9s de un evento, el organizador no sabe cu\xE1nta gente pas\xF3 por cada zona, cu\xE1nto tiempo permanecieron, qu\xE9 stands fueron m\xE1s visitados ni cu\xE1l fue el flujo real de asistentes.",
  solution: "Despu\xE9s del evento puedes saber exactamente cu\xE1nta gente pas\xF3 por cada zona, cu\xE1nto tiempo permanecieron, cu\xE1l fue el stand m\xE1s visitado y cu\xE1l fue el pico de tr\xE1fico \u2014 datos reales, no estimaciones. Los mapas de intensidad muestran d\xF3nde se concentr\xF3 la gente. Exportas todos los datos v\xEDa API o los analizas directamente en Studio.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"],
  matchKeywords: [
    "m\xE9tricas de evento",
    "comportamiento de asistentes",
    "zonas m\xE1s visitadas",
    "flujo de personas",
    "tiempo en stand",
    "reporte de evento"
  ]
};

// src/knowledge/use-cases/retail.ts
var retailDwellTime = {
  id: "retail-dwell-time",
  vertical: "retail",
  title: "Tiempo de permanencia en local comercial",
  problem: "Un local comercial quiere saber cu\xE1nto tiempo pasan los clientes dentro de la tienda y cu\xE1l es el momento del d\xEDa con m\xE1s tr\xE1fico real \u2014 datos que los sistemas de caja no capturan porque no registran quienes entran sin comprar.",
  solution: "S\xED. Puedes medir cu\xE1nto tiempo permanecen tus clientes en el local, en qu\xE9 horarios hay m\xE1s tr\xE1fico y cu\xE1ntas personas entran \u2014 sin hardware adicional. En locales de gran superficie (supermercados, showrooms, centros comerciales), puedes dividir el \xE1rea en zonas de al menos 50 metros de separaci\xF3n para analizar cada sector por separado. En locales peque\xF1os o medianos el an\xE1lisis cubre el local como una unidad: el GPS en interiores no permite distinguir con fiabilidad entre zonas m\xE1s cercanas.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"],
  matchKeywords: [
    "tiempo en local",
    "permanencia en tienda",
    "cu\xE1nto tiempo clientes",
    "tr\xE1fico de local",
    "comportamiento en tienda",
    "retail analytics",
    "flujo de clientes",
    "mapa de calor tienda",
    // Lenguaje natural — permanencia
    "cu\xE1nto tiempo permanecen",
    "tiempo de permanencia",
    "duraci\xF3n de visita",
    "dwell time",
    "cu\xE1nto tiempo estuvieron",
    "tiempo que pasan en",
    "permanencia en ubicaci\xF3n",
    "cu\xE1nto permanecen"
  ]
};
var retailPromotion = {
  id: "retail-promotion",
  vertical: "retail",
  title: "Promociones que se activan por presencia f\xEDsica",
  problem: "Un retailer quiere mostrar una oferta o descuento especial solo a quienes est\xE1n f\xEDsicamente en el local, sin que la promoci\xF3n se comparta y use desde fuera de la tienda.",
  solution: "Puedes mostrar una promoci\xF3n o descuento exclusivo solo a quienes est\xE9n f\xEDsicamente en el local \u2014 no puede compartirse ni usarse desde casa porque la validaci\xF3n ocurre en el servidor, no es auto-declarada. Funciona sin app nativa: cualquier navegador web puede solicitar la validaci\xF3n de presencia.",
  capabilities: ["geopoints", "presence", "api"],
  matchKeywords: [
    "promoci\xF3n en local",
    "descuento presencial",
    "oferta por ubicaci\xF3n",
    "beneficio al llegar",
    "cup\xF3n por presencia",
    "solo en tienda"
  ]
};
var retailSmartProxy = {
  id: "retail-smart-proxy",
  vertical: "retail",
  title: "Tracking de visitas a tienda online desde el local f\xEDsico",
  problem: "Una tienda f\xEDsica tiene tambi\xE9n un e-commerce. Quiere entender cu\xE1ntos clientes visitan el sitio web mientras est\xE1n en el local f\xEDsico, y si esas visitas tienen una tasa de conversi\xF3n diferente.",
  solution: "Puedes detectar cu\xE1ntos clientes visitan tu e-commerce mientras est\xE1n f\xEDsicamente en el local, y si esas visitas tienen una tasa de conversi\xF3n diferente. El tracking ocurre sin modificar el sitio e-commerce: un Smart Proxy envuelve el enlace existente y registra las sesiones que ocurrieron desde dentro del local.",
  capabilities: ["smart-proxies", "analytics", "presence"],
  matchKeywords: [
    "tienda online y f\xEDsica",
    "e-commerce presencial",
    "omnichannel",
    "cliente en local visita web",
    "conversi\xF3n presencial"
  ]
};

// src/knowledge/use-cases/loyalty.ts
var loyaltyPhysicalVisits = {
  id: "loyalty-physical-visits",
  vertical: "loyalty",
  title: "Programa de fidelizaci\xF3n por visitas f\xEDsicas verificadas",
  problem: "Una marca quiere premiar a los clientes que visitan el local f\xEDsico, pero no tiene forma de verificar que la visita ocurri\xF3 realmente. Los check-ins en redes sociales son voluntarios y auto-declarados. Los cupones en papel o QR son f\xE1cilmente falsificables.",
  solution: "Puedes verificar en tiempo real que el cliente est\xE1 f\xEDsicamente en el local antes de otorgarle un beneficio o recompensa \u2014 sin QR ni tarjeta. La validaci\xF3n ocurre en el servidor en menos de 80 ms, lo que permite integrarla al flujo de compra o al momento de la caja. Cada visita queda registrada con hora y duraci\xF3n para auditor\xEDa.",
  capabilities: ["geopoints", "presence", "api", "analytics"],
  matchKeywords: [
    "fidelizaci\xF3n",
    "puntos por visita",
    "loyalty",
    "programa de lealtad",
    "premiar visita",
    "recompensa presencial",
    "beneficio por ir al local"
  ]
};
var loyaltyMultiLocation = {
  id: "loyalty-multi-location",
  vertical: "loyalty",
  title: "Fidelizaci\xF3n en cadena de locales",
  problem: "Una cadena de restaurantes, farmacias o tiendas quiere implementar un sistema de fidelizaci\xF3n unificado que reconozca cuando el cliente visita cualquier sucursal, acumule visitas y entregue beneficios de forma centralizada.",
  solution: "S\xED. Puedes reconocer autom\xE1ticamente cuando un cliente visita cualquier sucursal de la cadena \u2014 sin que tenga que declarar d\xF3nde est\xE1 ni escanear nada \u2014 y acumular esas visitas en un perfil unificado. Eso te permite premiar la frecuencia y la amplitud de visitas: el cliente que va a tres sucursales distintas puede recibir un beneficio distinto al que siempre va a la misma. El historial se integra v\xEDa API a tu CRM o sistema de loyalty existente. Los datos de comportamiento \u2014 qu\xE9 sucursales visita cada cliente, con qu\xE9 frecuencia y en qu\xE9 horarios \u2014 informan decisiones de personalizaci\xF3n que antes no ten\xEDas.",
  capabilities: ["geopoints", "presence", "analytics", "api", "integrations"],
  matchKeywords: [
    "cadena de locales",
    "sucursales",
    "multi-local",
    "franquicia",
    "fidelizaci\xF3n cadena",
    "visita a cualquier sucursal",
    // Lenguaje natural — visitas a múltiples locales
    "visitar varios locales",
    "tres locales",
    "locales distintos",
    "distintos locales",
    "completar visitas a locales",
    "recorrido entre locales",
    "premiar por visitar varios",
    "visitas a varios puntos",
    "diferentes sucursales",
    // Premiar clientes que visiten más de una tienda (Q5)
    "premiar a los clientes",
    "visiten m\xE1s de una",
    "visiten mas de una",
    "visiten varias",
    "visitar m\xE1s de una tienda",
    "visitar mas de una tienda",
    "clientes que visiten",
    "premiar visitas"
  ]
};
var loyaltyEngagement = {
  id: "loyalty-engagement",
  vertical: "loyalty",
  title: "Contenido exclusivo por presencia f\xEDsica",
  problem: "Una marca quiere entregar contenido exclusivo (videos, descuentos, material de lanzamiento) solo a clientes que est\xE9n presentes en un evento o local, como refuerzo de la experiencia f\xEDsica.",
  solution: "Puedes entregar contenido exclusivo (videos, descuentos, material de lanzamiento) solo a quienes est\xE9n f\xEDsicamente en el lugar \u2014 el link no funciona fuera del \xE1rea, no puede compartirse ni usarse desde casa. El contenido puede estar en una URL existente envuelta con Smart Proxy o detr\xE1s de una llamada a la API que valida presencia.",
  capabilities: ["geopoints", "presence", "smart-proxies", "api"],
  matchKeywords: [
    "contenido exclusivo presencial",
    "material solo en local",
    "acceso por ubicaci\xF3n",
    "beneficio por estar presente",
    "experiencia f\xEDsica exclusiva",
    "lanzamiento presencial"
  ]
};

// src/knowledge/use-cases/tourism.ts
var tourismRoutes = {
  id: "tourism-routes",
  vertical: "tourism",
  title: "Contenido contextual en monumentos, rutas y puntos de inter\xE9s",
  problem: "Una ciudad, organismo de patrimonio, museo u operador tur\xEDstico quiere que los visitantes descubran informaci\xF3n, audio o video al llegar a un monumento, sitio hist\xF3rico o parada de circuito \u2014 sin escanear un QR ni abrir una app dedicada.",
  solution: "S\xED. Puedes crear una experiencia donde el contenido \u2014 texto, audio, video, enlace \u2014 se activa autom\xE1ticamente cuando el visitante llega a cada punto, sin QR ni app dedicada. Funciona tanto para un \xFAnico monumento como para circuitos completos de m\xFAltiples paradas. Desde Studio puedes ver cu\xE1les puntos generan m\xE1s permanencia, cu\xE1les se omiten y actualizar el contenido sin tocar la infraestructura.",
  capabilities: ["geopoints", "presence", "analytics", "smart-proxies"],
  matchKeywords: [
    "monumento",
    "patrimonio",
    "patrimonio hist\xF3rico",
    "sitio hist\xF3rico",
    "contenido en monumento",
    "experiencia patrimonial",
    "turismo cultural",
    "punto de inter\xE9s hist\xF3rico",
    "museo",
    "circuito",
    "ruta tur\xEDstica",
    "turismo",
    "gu\xEDa de viaje",
    "punto de inter\xE9s",
    "parada tur\xEDstica",
    "tour autoguiado",
    "audio gu\xEDa",
    "contenido por ubicaci\xF3n",
    "desbloquear contenido en punto",
    "desbloquear contenido",
    "cerca de monumentos",
    "contenido al acercarse a",
    "activar contenido en monumento",
    // Lenguaje natural del usuario
    "recorrido tur\xEDstico",
    "recorrido patrimonial",
    "recorrido por la ciudad",
    "paseo tur\xEDstico",
    "paseo cultural",
    "paseo por monumentos",
    "gu\xEDa tur\xEDstica",
    "experiencia tur\xEDstica",
    "hacer un recorrido",
    "hacer turismo",
    "tour por la ciudad",
    "tour cultural",
    "visitar monumentos",
    "visitar museos",
    "recorrido autoguiado",
    "app de turismo",
    "app para turistas",
    "informaci\xF3n en sitios",
    "informaci\xF3n al llegar a",
    // Experiencias de ciudad con múltiples puntos
    "distintos puntos",
    "puntos de una ciudad",
    "distintos puntos de la ciudad",
    "visitar distintos puntos",
    "puntos de inter\xE9s de la ciudad",
    "experiencia ciudad puntos",
    "recorrido por puntos",
    // Vocabulario adicional — descubrimiento y exploración
    "distintos lugares",
    "distintos lugares de una ciudad",
    "descubran distintos",
    "exploraci\xF3n urbana",
    "exploracion urbana",
    "avanzan por una ruta"
  ]
};
var tourismVerification = {
  id: "tourism-verification",
  vertical: "tourism",
  title: "Verificaci\xF3n de visita a atractivos tur\xEDsticos",
  problem: "Un operador de turismo o una oficina de turismo quiere certificar que los visitantes realmente estuvieron en los lugares del itinerario, para emitir sellos digitales, certificados o habilitar beneficios en el siguiente punto.",
  solution: "Puedes emitir certificados o sellos digitales que solo se generan si el visitante estuvo f\xEDsicamente en el lugar el tiempo m\xEDnimo requerido \u2014 validaci\xF3n objetiva, no auto-declarada. El historial de visitas queda disponible en analytics para reporting.",
  capabilities: ["geopoints", "presence", "api", "analytics"],
  matchKeywords: [
    "certificado de visita",
    "sello tur\xEDstico",
    "verificar itinerario",
    "comprobar presencia en atractivo",
    "pasaporte tur\xEDstico",
    "recorrido completado",
    "check-in tur\xEDstico verificado"
  ]
};
var tourismCityAnalytics = {
  id: "tourism-city-analytics",
  vertical: "tourism",
  title: "An\xE1lisis de flujo tur\xEDstico en una ciudad",
  problem: "Una municipalidad o ente de turismo quiere entender c\xF3mo se mueven los turistas: qu\xE9 zonas visitan, cu\xE1nto tiempo permanecen, cu\xE1les son las rutas m\xE1s frecuentes y cu\xE1les los atractivos menos visitados.",
  solution: "Puedes entender c\xF3mo se mueven realmente los turistas en tu ciudad: qu\xE9 atractivos generan m\xE1s visitas y permanencia, qu\xE9 rutas son las m\xE1s frecuentes y cu\xE1les quedan subutilizadas. Los mapas de intensidad muestran d\xF3nde se concentran los visitantes. Puedes comparar flujo por zona, horario y per\xEDodo para identificar qu\xE9 atractivos necesitan m\xE1s promoci\xF3n o infraestructura.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"],
  matchKeywords: [
    "flujo tur\xEDstico",
    "an\xE1lisis de visitantes ciudad",
    "comportamiento turista",
    "zonas m\xE1s visitadas ciudad",
    "destino tur\xEDstico analytics",
    "planificaci\xF3n tur\xEDstica",
    "municipio y turismo"
  ]
};

// src/knowledge/use-cases/education.ts
var educationAttendance = {
  id: "education-attendance",
  vertical: "education",
  title: "Registro de asistencia sin pasar lista",
  problem: "Una instituci\xF3n educativa necesita registrar que los alumnos est\xE1n f\xEDsicamente en el aula o campus. El proceso manual de pasar lista consume tiempo de clase y es f\xE1cilmente manipulable. Las soluciones con lectores de tarjetas o biometr\xEDa son costosas.",
  solution: "Puedes registrar la asistencia autom\xE1ticamente cuando el alumno llega al campus o aula \u2014 sin pasar lista y sin que el alumno pueda declarar una presencia que no ocurri\xF3. La verificaci\xF3n es en el servidor, no es auto-declarada. Puedes definir ventanas horarias por materia o turno y exportar el historial al sistema acad\xE9mico existente.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "asistencia",
    "registro de asistencia",
    "control de asistencia",
    "alumno presente",
    "pasar lista",
    "campus universitario",
    "escuela",
    "universidad",
    "colegio",
    "estudiante"
  ]
};
var educationCampusExperience = {
  id: "education-campus-experience",
  vertical: "education",
  title: "Experiencias de campus activadas por ubicaci\xF3n",
  problem: "Una universidad o colegio quiere ofrecer informaci\xF3n contextual seg\xFAn en qu\xE9 sector del campus se encuentre el alumno: qu\xE9 edificio visit\xF3, qu\xE9 facultad o cu\xE1l es el \xE1rea de servicios m\xE1s cercana.",
  solution: "Puedes mostrar informaci\xF3n contextual distinta seg\xFAn en qu\xE9 edificio o sector del campus se encuentre el alumno: horario de laboratorios al llegar a ciencias, recursos al llegar a biblioteca, tr\xE1mites al llegar a administraci\xF3n. Cada zona debe ser un edificio o \xE1rea exterior de al menos 30-50 metros \u2014 en campus abiertos el GPS funciona con buena precisi\xF3n. La distinci\xF3n entre salas o pisos dentro de un mismo edificio no es fiable con GPS.",
  capabilities: ["geopoints", "presence", "smart-proxies"],
  matchKeywords: [
    "campus digital",
    "experiencia universitaria",
    "contenido en aula",
    "orientaci\xF3n en campus",
    "informaci\xF3n contextual universidad",
    "biblioteca digital por ubicaci\xF3n"
  ]
};
var educationFieldTrips = {
  id: "education-field-trips",
  vertical: "education",
  title: "Verificaci\xF3n de presencia en salidas pedag\xF3gicas",
  problem: "Un docente organiza una salida pedag\xF3gica o trabajo de campo y necesita verificar que los estudiantes visitaron los puntos del recorrido, sin depender de fotos o informes que pueden falsificarse.",
  solution: "Puedes verificar que cada estudiante lleg\xF3 a los puntos del recorrido y permaneci\xF3 el tiempo m\xEDnimo requerido \u2014 sin fotos ni informes que pueden falsificarse. La verificaci\xF3n es en el servidor, no auto-declarada. El docente ve el historial completo en Studio o lo consulta v\xEDa API.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "salida pedag\xF3gica",
    "trabajo de campo",
    "excursi\xF3n escolar",
    "visita educativa",
    "recorrido de campo",
    "actividad fuera del aula"
  ]
};

// src/knowledge/use-cases/municipalities.ts
var municipalitiesPublicServices = {
  id: "municipalities-public-services",
  vertical: "municipalities",
  title: "Verificaci\xF3n de presencia en servicios p\xFAblicos municipales",
  problem: "Una municipalidad necesita registrar que los ciudadanos est\xE1n f\xEDsicamente en la ventanilla o dependencia para acceder a un servicio. Los turnos en papel o por tel\xE9fono no evitan que alguien acuda en nombre de otro ni que se declaren presencias falsas.",
  solution: "Puedes verificar que el ciudadano est\xE1 f\xEDsicamente en la ventanilla o dependencia cuando solicita un servicio \u2014 evitando que alguien acceda en nombre de otro o declare una presencia que no ocurri\xF3. La validaci\xF3n se integra al sistema de turnos existente v\xEDa API y el registro queda disponible para auditor\xEDas.",
  capabilities: ["geopoints", "presence", "api", "analytics"],
  matchKeywords: [
    "municipio",
    "municipalidad",
    "gobierno local",
    "servicio p\xFAblico",
    "ventanilla",
    "tr\xE1mite presencial",
    "ciudadano",
    "dependencia p\xFAblica",
    "oficina municipal"
  ]
};
var municipalitiesUrbanAnalysis = {
  id: "municipalities-urban-analysis",
  vertical: "municipalities",
  title: "An\xE1lisis de flujo peatonal en espacios p\xFAblicos",
  problem: "Una municipalidad quiere entender c\xF3mo circulan las personas en una plaza, parque, mercado o centro hist\xF3rico: cu\xE1ntas personas hay en cada momento, qu\xE9 zonas est\xE1n saturadas y cu\xE1les subutilizadas.",
  solution: "Puedes visualizar c\xF3mo circula la gente en plazas, parques, mercados y centros hist\xF3ricos: qu\xE9 zonas est\xE1n saturadas, cu\xE1les subutilizadas y c\xF3mo var\xEDa el comportamiento por hora y d\xEDa. Los datos informan decisiones de dise\xF1o urbano, organizaci\xF3n de eventos p\xFAblicos y distribuci\xF3n de recursos.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"],
  matchKeywords: [
    "flujo peatonal",
    "espacio p\xFAblico",
    "plaza",
    "parque",
    "an\xE1lisis urbano",
    "planificaci\xF3n urbana",
    "centro hist\xF3rico",
    "concurrencia",
    "ciudad inteligente",
    "smart city"
  ]
};
var municipalitiesInspection = {
  id: "municipalities-inspection",
  vertical: "municipalities",
  title: "Control de inspectores y agentes en terreno",
  problem: "Una municipalidad tiene inspectores, agentes de tr\xE1nsito o personal de mantenimiento que deben recorrer zonas asignadas. No hay forma de verificar que los recorridos se realizaron sin depender de partes escritos que pueden falsificarse.",
  solution: "Puedes verificar que inspectores y agentes cubrieron sus recorridos asignados, con hora y tiempo de permanencia por punto \u2014 sin partes escritos que pueden falsificarse. El supervisor ve la cobertura real en Studio y exporta el historial a los sistemas municipales.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "inspector municipal",
    "agente de tr\xE1nsito",
    "ronda municipal",
    "personal en terreno",
    "mantenimiento urbano",
    "servicio en campo",
    "control de recorridos"
  ]
};

// src/knowledge/use-cases/real-estate.ts
var realEstateVisits = {
  id: "real-estate-visits",
  vertical: "real-estate",
  title: "Registro de visitas a propiedades en venta o alquiler",
  problem: "Una inmobiliaria necesita saber cu\xE1ntas personas visitaron cada propiedad, cu\xE1nto tiempo permanecieron y si regresaron. Los registros manuales del corredor son incompletos y no permiten comparar el inter\xE9s real entre propiedades.",
  solution: "Puedes saber cu\xE1ntos interesados visitaron cada propiedad, cu\xE1nto tiempo permanecieron y cu\xE1les generan m\xE1s visitas repetidas \u2014 datos reales que informan el precio y la estrategia de marketing, sin depender del corredor. La presencia se verifica autom\xE1ticamente en el servidor.",
  capabilities: ["geopoints", "presence", "analytics"],
  matchKeywords: [
    "inmobiliaria",
    "propiedad",
    "visita a propiedad",
    "open house",
    "comprador",
    "arrendatario",
    "interesado en propiedad",
    "corredora de propiedades",
    "real estate"
  ]
};
var realEstateOpenHouse = {
  id: "real-estate-open-house",
  vertical: "real-estate",
  title: "Sala de ventas y open house con experiencia digital contextual",
  problem: "Una desarrolladora inmobiliaria organiza jornadas de puertas abiertas o mantiene una sala de ventas activa y quiere entregar cat\xE1logo, planos y precios de forma contextual y medible, con o sin requerir que el visitante est\xE9 f\xEDsicamente en el proyecto como condici\xF3n.",
  solution: "S\xED. Puedes crear una experiencia para tu sala de ventas u open house donde el cat\xE1logo, planos y precios se activan autom\xE1ticamente cuando el visitante llega al proyecto \u2014 sin que el material circule fuera del sitio ni llegue a quien no estuvo presente. Registras cu\xE1ntos visitantes llegaron, cu\xE1nto tiempo permanecieron y si regresaron \u2014 datos reales, no reportes del corredor. Todo se configura desde Studio sin modificar tu sitio web actual y sin que el visitante tenga que instalar nada.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"],
  matchKeywords: [
    "open house",
    "puertas abiertas",
    "proyecto inmobiliario",
    "cat\xE1logo presencial",
    "material de venta en sitio",
    "showroom",
    "sala de ventas",
    "visita a sala de ventas",
    "planos en proyecto",
    "precios en sitio",
    "cat\xE1logo inmobiliario",
    "desarrollo inmobiliario",
    "unidades en venta"
  ]
};
var realEstatePortfolio = {
  id: "real-estate-portfolio",
  vertical: "real-estate",
  title: "Portafolio inmobiliario geolocalizado de proyectos construidos",
  problem: "Una constructora o desarrolladora inmobiliaria quiere mostrar su historial de proyectos entregados sobre un mapa \u2014 que potenciales clientes, socios o inversores puedan explorar las obras realizadas por zona geogr\xE1fica y acceder a la informaci\xF3n de cada una.",
  solution: "Puedes mostrar tu historial de proyectos entregados como un cat\xE1logo territorial interactivo: se navega por mapa, no por lista. Al acercarse a cada ubicaci\xF3n, el contenido del proyecto \u2014 ficha t\xE9cnica, renders, dossier o video \u2014 se activa en el dispositivo. Sin app nativa, sin modificar el sitio web existente. Se actualiza desde Studio al agregar nuevos proyectos.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"],
  matchKeywords: [
    // Señales de portafolio inmobiliario específico (fuertes)
    "portafolio inmobiliario",
    "portafolio de proyectos inmobiliarios",
    "cat\xE1logo inmobiliario",
    "cat\xE1logo inmobiliario de proyectos",
    "cat\xE1logo de desarrollos inmobiliarios",
    "proyectos de la constructora",
    "proyectos de la desarrolladora",
    "mapa de proyectos inmobiliarios",
    "portafolio de obras",
    "obras de la constructora",
    "cat\xE1logo de desarrollos",
    // Proyectos completados (compartidas para ganar por combinación)
    "proyectos construidos",
    "proyectos entregados",
    "obras entregadas",
    "desarrollos realizados",
    "historial de proyectos",
    "proyectos realizados",
    "cat\xE1logo de proyectos construidos",
    "obras realizadas inmobiliarias"
  ]
};
var realEstateBuilding = {
  id: "real-estate-building",
  vertical: "real-estate",
  title: "Control de acceso y presencia en edificios comerciales",
  problem: "Una administraci\xF3n de edificio u oficina comercial necesita registrar qui\xE9n accede a qu\xE9 \xE1reas, con qu\xE9 frecuencia y cu\xE1nto tiempo permanece, sin instalar hardware costoso.",
  solution: "Puedes saber qui\xE9n accede a cada \xE1rea del edificio, cu\xE1ndo y cu\xE1nto tiempo permanece \u2014 sin hardware de acceso, lectores de tarjetas ni infraestructura fija. La presencia se valida v\xEDa API directamente desde el dispositivo del usuario. Los datos de uso informan decisiones sobre amenities, seguridad y mantenimiento.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "edificio",
    "oficina comercial",
    "control de acceso edificio",
    "\xE1rea restringida",
    "uso de espacios",
    "gesti\xF3n de instalaciones",
    "facility management"
  ]
};

// src/knowledge/use-cases/operations.ts
var operationsSafety = {
  id: "operations-safety",
  vertical: "operations",
  title: "Control de acceso a zonas industriales o restringidas",
  problem: "Una planta industrial, obra de construcci\xF3n o instalaci\xF3n minera necesita verificar que solo el personal autorizado accede a ciertas zonas. Los sistemas de hardware (torniquetes, lectores de tarjetas) son caros, dif\xEDciles de mover y requieren infraestructura fija.",
  solution: "Puedes restringir el acceso a recursos o sistemas seg\xFAn si el personal est\xE1 f\xEDsicamente dentro de las zonas autorizadas \u2014 sin torniquetes ni lectores de tarjetas. Cuando el personal intenta acceder desde su dispositivo, tu sistema consulta la API para verificar si est\xE1n dentro del \xE1rea autorizada y decide si habilitar o denegar. Ubyca no genera alertas autom\xE1ticas: la l\xF3gica de autorizaci\xF3n vive en tu sistema, Ubyca provee la validaci\xF3n de presencia.",
  capabilities: ["geopoints", "presence", "api"],
  matchKeywords: [
    "zona de riesgo",
    "\xE1rea restringida",
    "planta industrial",
    "obra de construcci\xF3n",
    "miner\xEDa",
    "seguridad industrial",
    "acceso a planta",
    "personal autorizado",
    "zona peligrosa"
  ]
};
var operationsMaintenanceRoutes = {
  id: "operations-maintenance-routes",
  vertical: "operations",
  title: "Verificaci\xF3n de rondas de mantenimiento",
  problem: "Un equipo de mantenimiento debe realizar rondas peri\xF3dicas por instalaciones f\xEDsicas (torres, subestaciones, locales de una cadena). No hay forma de verificar que las rondas ocurrieron sin depender de partes manuales.",
  solution: "S\xED. Puedes confirmar autom\xE1ticamente que tus t\xE9cnicos llegaron al lugar asignado, a qu\xE9 hora y cu\xE1nto tiempo permanecieron \u2014 sin depender de reportes manuales. El supervisor ve en Studio si la ronda se complet\xF3, qu\xE9 puntos se saltaron y cu\xE1nto tiempo tom\xF3 cada uno. Los datos se exportan v\xEDa API a sistemas CMMS o ERP existentes.",
  capabilities: ["geopoints", "presence", "analytics", "api", "integrations"],
  matchKeywords: [
    "ronda de mantenimiento",
    "inspecci\xF3n de instalaciones",
    "mantenimiento preventivo",
    "t\xE9cnico en terreno",
    "torre",
    "subestaci\xF3n",
    "infraestructura f\xEDsica",
    "CMMS",
    "control de rondas",
    // Lenguaje natural — técnicos y verificación de llegada
    "t\xE9cnicos en terreno",
    "confirmar que llegaron",
    "llegaron al lugar asignado",
    "confirmar llegada",
    "verificar que llegaron",
    "lugar asignado",
    "personal lleg\xF3 al lugar",
    "confirmar visita en terreno",
    "trabajadores en terreno",
    "verificar asistencia en terreno",
    // Verificar que trabajadores estuvieron donde debían (Q3)
    "mis trabajadores",
    "estuvieron donde deb\xEDan",
    "estuvieron donde debian",
    "donde deb\xEDan estar",
    "donde debian estar",
    "verificar trabajadores",
    "comprobar trabajadores",
    "verificar que estuvieron",
    "trabajadores realmente estuvieron",
    // Vocabulario adicional — personal externo, contratistas y cuadrillas
    "contratistas",
    "mis contratistas",
    "puntos asignados",
    "proveedores",
    "proveedores en terreno",
    "cuadrillas",
    "personal externo",
    "fue al lugar"
  ]
};
var operationsFleetTracking = {
  id: "operations-fleet-tracking",
  vertical: "operations",
  title: "Validaci\xF3n de presencia de flota en puntos de parada",
  problem: "Una empresa con flota m\xF3vil (transporte de pasajeros, servicios urbanos, log\xEDstica) necesita verificar que los conductores pasaron por los puntos asignados de la ruta, con la hora exacta de cada parada.",
  solution: "Puedes verificar que cada conductor complet\xF3 sus paradas asignadas, con la hora exacta de cada llegada \u2014 sin llamadas de confirmaci\xF3n ni reportes manuales. Los puntos no completados quedan como pendientes en el historial. Ubyca registra llegadas a puntos discretos: no registra la trayectoria entre paradas ni detecta desv\xEDos de ruta. Los datos se integran al sistema de gesti\xF3n de flota v\xEDa API.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "flota",
    "veh\xEDculo",
    "transporte",
    "parada",
    "ruta vehicular",
    "servicio de transporte",
    "gesti\xF3n de flota",
    "bus",
    "cami\xF3n",
    "control de ruta vehicular"
  ]
};

// src/knowledge/use-cases/health.ts
var healthHomeVisits = {
  id: "health-home-visits",
  vertical: "health",
  title: "Verificaci\xF3n de visitas domiciliarias de salud",
  problem: "Un prestador de salud (cl\xEDnica, mutual, seguro m\xE9dico) env\xEDa enfermeros, kinesi\xF3logos o asistentes sociales a domicilios. No hay forma de verificar que el profesional lleg\xF3 al domicilio correcto, a qu\xE9 hora lleg\xF3 y cu\xE1nto tiempo estuvo \u2014 sin depender de reportes manuales que pueden falsificarse.",
  solution: "Puedes verificar objetivamente que el profesional lleg\xF3 al domicilio correcto, a qu\xE9 hora y cu\xE1nto tiempo estuvo \u2014 sin depender de partes manuales. El historial de cada visita (hora de llegada, tiempo de permanencia) queda disponible para auditor\xEDa y facturaci\xF3n, y es exportable v\xEDa API al sistema de gesti\xF3n de turnos o historia cl\xEDnica.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "visita domiciliaria",
    "enfermero a domicilio",
    "kinesiolog\xEDa domiciliaria",
    "asistente social",
    "t\xE9cnico en domicilio",
    "profesional en terreno",
    "atenci\xF3n domiciliaria",
    "servicio a domicilio",
    "prestaci\xF3n en domicilio"
  ]
};
var healthFieldWorkers = {
  id: "health-field-workers",
  vertical: "health",
  title: "Control de personal de salud en terreno",
  problem: "Un organismo de salud p\xFAblica o una red de atenci\xF3n primaria tiene agentes sanitarios, promotores de salud o vacunadores que recorren comunidades o zonas asignadas. No hay forma de verificar la cobertura real sin depender de registros en papel.",
  solution: "Puedes verificar la cobertura real de tus agentes sanitarios en terreno \u2014 cu\xE1ndo estuvieron en cada zona, con qu\xE9 frecuencia y cu\xE1nto tiempo \u2014 sin depender de registros en papel. El coordinador ve la cobertura real desde Studio y exporta los datos a los sistemas de reporte del organismo.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "agente sanitario",
    "promotor de salud",
    "vacunador",
    "agente comunitario",
    "salud p\xFAblica en terreno",
    "cobertura sanitaria",
    "ronda sanitaria",
    "personal de salud en campo",
    "atenci\xF3n primaria en terreno"
  ]
};
var healthOutpatient = {
  id: "health-outpatient",
  vertical: "health",
  title: "Verificaci\xF3n de presencia en centros de atenci\xF3n ambulatoria",
  problem: "Una cl\xEDnica u hospital quiere verificar que los pacientes o profesionales que acceden a ciertos servicios (rehabilitaci\xF3n, di\xE1lisis, quimioterapia) estuvieron f\xEDsicamente presentes en la sesi\xF3n, para cumplimiento y facturaci\xF3n a aseguradoras.",
  solution: "Puedes acreditar que el paciente o profesional estuvo f\xEDsicamente presente en la sesi\xF3n de atenci\xF3n, con hora exacta y duraci\xF3n \u2014 respaldo confiable para auditor\xEDas y facturaci\xF3n a aseguradoras. El historial de sesiones es exportable v\xEDa API al sistema de gesti\xF3n cl\xEDnica existente.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    "centro de salud",
    "cl\xEDnica",
    "hospital",
    "rehabilitaci\xF3n",
    "sesi\xF3n presencial m\xE9dica",
    "verificar asistencia m\xE9dica",
    "paciente presente",
    "auditor\xEDa de prestaciones",
    "facturaci\xF3n m\xE9dica"
  ]
};

// src/knowledge/use-cases/brand-activations.ts
var brandActivationCampaign = {
  id: "brand-activation-campaign",
  vertical: "brand-activations",
  title: "Campa\xF1a f\xEDsico-digital activada por presencia",
  problem: "Una marca quiere lanzar una campa\xF1a donde el contenido \u2014 video de lanzamiento, landing con beneficio, formulario de registro \u2014 solo se activa cuando el consumidor est\xE1 f\xEDsicamente en un punto de venta, evento o espacio espec\xEDfico. Sin esto, el contenido digital se distribuye sin control y pierde el v\xEDnculo con la experiencia f\xEDsica.",
  solution: "S\xED. Puedes saber exactamente cu\xE1ntas personas estuvieron f\xEDsicamente en cada punto de campa\xF1a, en qu\xE9 horarios y cu\xE1nto tiempo permanecieron \u2014 datos verificables, no estimaciones de alcance ni impresiones. El contenido se activa solo cuando el usuario est\xE1 en el lugar, lo que garantiza que cada registro corresponde a una presencia real. Esos datos son exportables y presentables como evidencia del impacto de la campa\xF1a: costo por interacci\xF3n real, no costo por clic. Para el equipo t\xE9cnico: la implementaci\xF3n puede hacerse con Smart Proxy sobre una URL existente o v\xEDa API.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"],
  matchKeywords: [
    "campa\xF1a de marca",
    "activaci\xF3n de marca",
    "brand activation",
    "marketing geolocalizado",
    "campa\xF1a f\xEDsica",
    "campa\xF1a f\xEDsico-digital",
    "contenido de campa\xF1a por ubicaci\xF3n",
    "activar campa\xF1a en punto",
    // Medición y evaluación de campañas en terreno
    "campa\xF1a en terreno",
    "si la campa\xF1a funcion\xF3",
    "resultados de campa\xF1a",
    "evaluar campa\xF1a",
    "medir campa\xF1a",
    "rendimiento de campa\xF1a",
    "si funcion\xF3 la campa\xF1a",
    "medir activaci\xF3n",
    "evaluar activaci\xF3n",
    // Demostrar que una activación presencial generó interacción
    "activaci\xF3n presencial",
    "activacion presencial",
    "gener\xF3 interacci\xF3n",
    "genero interaccion",
    "si gener\xF3 interacci\xF3n",
    "si genero interaccion",
    "demostrar que funcion\xF3",
    "demostrar que funciono",
    "demostrar interacci\xF3n",
    "demostrar interaccion",
    "campa\xF1a gener\xF3 interacci\xF3n",
    "campana genero interaccion",
    // Efectividad y resultados de campañas — lenguaje comercial (Tarea 3)
    "campa\xF1a gener\xF3 resultados",
    "campana genero resultados",
    "demostrar resultados",
    "demostrar impacto",
    "medir impacto",
    "medir efectividad",
    "campa\xF1a funcion\xF3",
    "campana funciono",
    "campa\xF1a exitosa",
    "campana exitosa",
    "activaci\xF3n exitosa",
    "activacion exitosa",
    // Vocabulario adicional — campañas presenciales con impacto
    "campa\xF1a presencial",
    "campana presencial",
    "tuvo impacto",
    "si tuvo impacto",
    "activaci\xF3n funcion\xF3",
    "activacion funciono",
    "si tuvo resultados"
  ],
  subIntentions: [
    {
      id: "medir-resultados-campana",
      patterns: [
        "medir impacto",
        "medir efectividad",
        "medir campa\xF1a",
        "medir campana",
        "medir activaci\xF3n",
        "medir activacion",
        "evaluar campa\xF1a",
        "evaluar campana",
        "evaluar activaci\xF3n",
        "evaluar activacion",
        "si la campa\xF1a funcion\xF3",
        "si la campana funciono",
        "campa\xF1a funcion\xF3",
        "campana funciono",
        "rendimiento de campa\xF1a",
        "rendimiento de campana",
        "activaci\xF3n de marca",
        "activacion de marca"
      ],
      solution: "S\xED. Puedes medir exactamente cu\xE1ntas personas interactuaron con la campa\xF1a, desde qu\xE9 ubicaciones f\xEDsicas, cu\xE1nto tiempo permanecieron y en qu\xE9 horarios \u2014 con datos reales de presencia, no estimaciones de alcance ni impresiones. Los datos son exportables y permiten calcular el costo por interacci\xF3n real."
    },
    {
      id: "demostrar-resultados-campana",
      patterns: [
        "demostrar resultados",
        "demostrar impacto",
        "demostrar que funcion\xF3",
        "demostrar que funciono",
        "demostrar interacci\xF3n",
        "demostrar interaccion",
        "campa\xF1a gener\xF3 resultados",
        "campana genero resultados",
        "campa\xF1a gener\xF3 interacci\xF3n",
        "campana genero interaccion",
        "gener\xF3 interacci\xF3n",
        "genero interaccion",
        "activaci\xF3n presencial",
        "activacion presencial"
      ],
      solution: "S\xED. Puedes demostrar con datos auditables cu\xE1ntas personas participaron en la activaci\xF3n: desde qu\xE9 puntos f\xEDsicos, en qu\xE9 horarios y cu\xE1nto tiempo estuvieron presentes. No son estimaciones \u2014 son registros de presencia real, exportables v\xEDa API y presentables a clientes o stakeholders como evidencia concreta."
    }
  ]
};
var brandActivationLaunch = {
  id: "brand-activation-launch",
  vertical: "brand-activations",
  title: "Lanzamiento de producto geoactivado en punto de venta",
  problem: "Una marca lanza un nuevo producto y quiere que el material exclusivo \u2014 unboxing, video del producto, descuento de lanzamiento \u2014 solo sea accesible para clientes que est\xE9n f\xEDsicamente en el punto de venta durante la ventana de lanzamiento.",
  solution: "Puedes garantizar que el material exclusivo de tu lanzamiento solo sea accesible dentro del punto de venta, durante el horario configurado \u2014 no antes, no fuera del \xE1rea, no compartido fuera del local. El contenido simplemente no funciona si el usuario no est\xE1 f\xEDsicamente donde corresponde. Los datos de activaci\xF3n te muestran el alcance real del lanzamiento punto por punto.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"],
  matchKeywords: [
    "lanzamiento de producto",
    "material de lanzamiento",
    "exclusivo en punto de venta",
    "launch presencial",
    "descuento de lanzamiento",
    "experiencia de lanzamiento",
    "nuevo producto en tienda",
    "activar contenido en PDV"
  ]
};
var brandActivationExperience = {
  id: "brand-activation-experience",
  vertical: "brand-activations",
  title: "Experiencia experiencial geolocalizada",
  problem: "Una agencia o marca organiza una experiencia inmersiva donde el contenido cambia seg\xFAn en qu\xE9 zona f\xEDsica se encuentre el participante: diferentes mensajes, videos o din\xE1micas por punto del recorrido.",
  solution: "Puedes crear una experiencia donde el contenido cambia autom\xE1ticamente seg\xFAn en qu\xE9 estaci\xF3n se encuentre el participante \u2014 sin QR, sin c\xF3digo, sin nadie en el punto. Al llegar a cada \xE1rea, el contenido correspondiente aparece directamente en el tel\xE9fono. Desde Studio puedes ver en tiempo real cu\xE1ntos participantes est\xE1n en cada estaci\xF3n y cu\xE1l genera m\xE1s permanencia.",
  capabilities: ["geopoints", "presence", "analytics", "live-visits"],
  matchKeywords: [
    "experiencia inmersiva",
    "experiencia de marca",
    "experiencia interactiva",
    "activaci\xF3n experiencial",
    "recorrido de marca",
    "instalaci\xF3n de marca",
    "din\xE1mica geolocalizada",
    "pop-up geolocalizado",
    "experiencia en punto"
  ]
};

// src/knowledge/use-cases/crm-integration.ts
var crmIntegration = {
  id: "crm-integration",
  vertical: "integrations",
  title: "Integraci\xF3n de presencia verificada con CRM y Salesforce",
  problem: "Un equipo comercial usa Salesforce u otro CRM para gestionar vendedores, cuentas y oportunidades. Quieren registrar autom\xE1ticamente en el CRM cu\xE1ndo un vendedor visit\xF3 un cliente o punto de venta, con validaci\xF3n GPS objetiva, sin depender de partes manuales ni auto-declaraci\xF3n.",
  solution: "Puedes registrar autom\xE1ticamente en Salesforce o cualquier CRM cu\xE1ndo un vendedor visit\xF3 un cliente o punto de venta, con validaci\xF3n GPS objetiva. No existe un conector nativo plug-and-play para Salesforce: la integraci\xF3n se realiza v\xEDa API REST. El flujo t\xEDpico es tu app de ventas \u2192 API de Ubyca (valida presencia) \u2192 tu backend \u2192 Salesforce. Cualquier sistema con capacidad HTTP puede consumir los resultados.",
  capabilities: ["geopoints", "presence", "api", "integrations"],
  matchKeywords: [
    "Salesforce",
    "CRM",
    "integrar con CRM",
    "conectar con Salesforce",
    "registrar visitas en CRM",
    "sincronizar con Salesforce",
    "enviar datos a CRM",
    "integraci\xF3n con sistema externo",
    "sistema externo",
    "ERP",
    "HubSpot",
    "SAP",
    "plataforma de ventas",
    "conectar con sistema",
    "enviar validaciones a sistema",
    "API externa"
  ]
};

// src/knowledge/use-cases/local-business.ts
var localBusinessProximityPromo = {
  id: "local-business-proximity-promo",
  vertical: "local-business",
  title: "Promociones y experiencias por proximidad para negocios locales",
  problem: "Un negocio local \u2014 taller, restaurante, cafeter\xEDa, peluquer\xEDa, farmacia, gimnasio, tienda \u2014 quiere activar una promoci\xF3n, cup\xF3n o mensaje especial cuando una persona entra en el radio del local. El objetivo es convertir el tr\xE1fico que pasa cerca en interacci\xF3n real con el negocio.",
  solution: "Cuando una persona entra al radio de tu local, puedes mostrarle autom\xE1ticamente una promoci\xF3n, cup\xF3n o mensaje contextual dentro de tu sitio web o app. Puedes configurarlo con o sin verificaci\xF3n de presencia: con verificaci\xF3n, el beneficio se habilita solo dentro del radio; sin verificaci\xF3n, funciona como capa informativa geolocalizada disponible para cualquiera que la abra cerca. Ubyca no env\xEDa notificaciones push autom\xE1ticas: la activaci\xF3n ocurre cuando el usuario ya est\xE1 cerca e interact\xFAa con la experiencia. Sin app nativa para el cliente final.",
  capabilities: ["geopoints", "presence", "analytics", "studio"],
  matchKeywords: [
    // Tipos de negocio (señal débil, suman en combinación)
    "taller",
    "taller de autos",
    "taller mec\xE1nico",
    "restaurante",
    "cafeter\xEDa",
    "peluquer\xEDa",
    "farmacia",
    "gimnasio",
    "negocio local",
    "local comercial",
    "comercio local",
    "tienda local",
    "peque\xF1o comercio",
    "mi negocio",
    "mi local",
    // Patrones de proximidad (señal fuerte, multi-palabra)
    "pasen cerca",
    "pasan cerca",
    "pasar cerca",
    "cerca del local",
    "cerca de mi local",
    "cerca del negocio",
    "cerca de mi negocio",
    "al pasar por",
    "al pasar cerca",
    "cuando pasen",
    "cuando pasan",
    "personas que pasan",
    "gente que pasa",
    "clientes que pasan",
    "tr\xE1fico cerca",
    "gente cerca",
    "clientes cerca",
    "gente alrededor",
    // Patrones de promoción/captación (señal fuerte)
    "enviar promociones",
    "mostrar oferta",
    "mostrar promoci\xF3n",
    "mostrar ofertas",
    "ofertas cerca",
    "oferta al pasar",
    "oferta por cercan\xEDa",
    "oferta por proximidad",
    "promoci\xF3n por proximidad",
    "activar cup\xF3n",
    "cup\xF3n por cercan\xEDa",
    "cup\xF3n al pasar",
    "captar clientes",
    "atraer clientes",
    "captar clientes cerca",
    "mensaje al pasar",
    "contenido al pasar",
    "promoci\xF3n al pasar",
    "campa\xF1a de proximidad",
    "marketing de proximidad",
    "promociones cuando pasen"
  ]
};
var localBusinessFootfall = {
  id: "local-business-footfall",
  vertical: "local-business",
  title: "Medici\xF3n de tr\xE1fico peatonal alrededor del local",
  problem: "Un negocio quiere entender cu\xE1nta gente pasa cerca del local, cu\xE1nta entra efectivamente y en qu\xE9 horarios hay m\xE1s afluencia \u2014 para optimizar su estrategia comercial, horarios de atenci\xF3n o decisiones de apertura de sucursales.",
  solution: "Puedes medir cu\xE1nta gente entra al radio de tu local, en qu\xE9 horarios hay m\xE1s afluencia y cu\xE1nto tiempo permanecen en promedio \u2014 datos que los sistemas de caja no capturan. Ves las visitas en tiempo real desde Studio y comparas el comportamiento entre per\xEDodos. Los datos son exportables v\xEDa API a tu sistema de gesti\xF3n.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"],
  matchKeywords: [
    "tr\xE1fico peatonal",
    "afluencia",
    "cu\xE1nta gente pasa",
    "cu\xE1ntos entran",
    "gente que pasa por fuera",
    "personas afuera del local",
    "atraer personas cercanas",
    "an\xE1lisis de tr\xE1fico local",
    "medir gente cerca",
    "comportamiento peatonal",
    "horarios de mayor tr\xE1fico",
    "pico de tr\xE1fico",
    "flujo externo",
    "tr\xE1fico alrededor",
    "tr\xE1fico exterior",
    "cu\xE1ntos entran al local",
    "cu\xE1ntos pasan por el frente"
  ]
};
var localBusinessContextualMessage = {
  id: "local-business-contextual-message",
  vertical: "local-business",
  title: "Mensajes y contenido contextual seg\xFAn la ubicaci\xF3n del usuario",
  problem: "Una organizaci\xF3n quiere mostrar informaci\xF3n, mensajes o experiencias diferentes seg\xFAn d\xF3nde est\xE1 f\xEDsicamente el usuario: un mensaje distinto al llegar a la sucursal, al barrio, al punto de servicio o a la zona comercial correspondiente.",
  solution: "Puedes mostrar informaci\xF3n, mensajes o experiencias diferentes seg\xFAn en qu\xE9 zona o sucursal est\xE9 el usuario \u2014 autom\xE1ticamente, sin que tenga que seleccionar su ubicaci\xF3n. Config\xFAralo con o sin verificaci\xF3n de presencia: con verificaci\xF3n, el contenido aparece solo dentro del \xE1rea; sin verificaci\xF3n, funciona como capa informativa geolocalizada disponible sin exigir presencia f\xEDsica. Funciona sin app nativa, desde cualquier navegador web.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"],
  matchKeywords: [
    "contenido contextual",
    "mensaje contextual",
    "informaci\xF3n contextual",
    "cambiar mensaje seg\xFAn zona",
    "cambiar contenido por zona",
    "contenido seg\xFAn ubicaci\xF3n",
    "mensaje seg\xFAn ubicaci\xF3n",
    "mostrar informaci\xF3n al llegar",
    "contenido al llegar",
    "experiencia por proximidad",
    "mensaje por proximidad",
    "informaci\xF3n seg\xFAn donde estoy",
    "contenido por zona",
    "experiencia contextual",
    "personalizar por ubicaci\xF3n",
    "activar contenido por zona",
    "informaci\xF3n al acercarme",
    "mensaje al acercarse",
    "contenido al acercarse"
  ]
};

// src/knowledge/use-cases/urban-analytics.ts
var urbanMobilityStudy = {
  id: "urban-mobility-study",
  vertical: "urban-analytics",
  title: "An\xE1lisis de movilidad urbana y evaluaci\xF3n territorial",
  problem: "Una consultora, municipalidad o desarrollador inmobiliario necesita entender c\xF3mo se mueven las personas en una zona espec\xEDfica para tomar decisiones sobre localizaci\xF3n de proyectos, demanda real de servicios, vivienda o infraestructura urbana.",
  solution: "S\xED. Puedes medir cu\xE1ntas personas circulan por una zona, en qu\xE9 horarios y cu\xE1nto tiempo permanecen \u2014 datos observacionales reales para tomar decisiones sobre apertura, expansi\xF3n o inversi\xF3n. Puedes comparar varias zonas entre s\xED e identificar d\xF3nde hay m\xE1s movimiento y en qu\xE9 momentos. Ubyca aporta datos de presencia y flujo georreferenciados: no genera modelos predictivos ni proyecciones estad\xEDsticas, pero s\xED los insumos concretos para construirlos.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"],
  matchKeywords: [
    "movilidad urbana",
    "flujo urbano",
    "estudio de movilidad",
    "an\xE1lisis territorial",
    "evaluaci\xF3n de zona",
    "evaluaci\xF3n de sector",
    "demanda territorial",
    "demanda de zona",
    "demanda geogr\xE1fica",
    "construir viviendas",
    "proyecto de viviendas",
    "sector para construir",
    "comportamiento territorial",
    "densidad urbana",
    "planificaci\xF3n urbana",
    "estudio de tr\xE1fico urbano",
    "an\xE1lisis de flujo urbano",
    "comportamiento en zona",
    "an\xE1lisis de localizaci\xF3n",
    "buen lugar para construir",
    "d\xF3nde construir",
    "flujo de personas en zona",
    "movimiento en el sector",
    // Lenguaje natural — análisis antes de abrir un negocio
    "abrir un negocio",
    "antes de abrir",
    "suficiente movimiento",
    "movimiento de personas",
    "cu\xE1nta gente pasa",
    "potencial de la zona",
    "tr\xE1fico en la zona",
    "actividad en la zona",
    "flujo en la zona",
    "cu\xE1nto tr\xE1fico hay",
    "movimiento en la zona",
    // Evaluación para abrir nueva sucursal (Q9)
    "nueva sucursal",
    "abrir una nueva sucursal",
    "abrir una sucursal",
    "evaluar abrir",
    "evaluar nueva sucursal",
    "abrir nuevo local",
    "abrir una tienda",
    "elegir nueva ubicaci\xF3n",
    "elegir nueva ubicacion"
  ],
  subIntentions: [
    {
      id: "apertura-nueva-ubicacion",
      patterns: [
        "nueva sucursal",
        "abrir una nueva sucursal",
        "abrir una sucursal",
        "evaluar abrir",
        "evaluar nueva sucursal",
        "abrir nuevo local",
        "abrir una tienda",
        "elegir nueva ubicaci\xF3n",
        "elegir nueva ubicacion",
        "abrir un negocio",
        "antes de abrir"
      ],
      solution: "S\xED. Puedes analizar el comportamiento real de personas en distintas zonas antes de decidir d\xF3nde abrir. Mides cu\xE1ntas personas circulan por cada \xE1rea candidata, en qu\xE9 horarios y cu\xE1nto tiempo permanecen \u2014 comparando zonas entre s\xED con datos observacionales concretos, no proyecciones. El resultado: una decisi\xF3n de localizaci\xF3n basada en tr\xE1fico real, no en intuici\xF3n."
    }
  ]
};
var fairMovementAnalysis = {
  id: "fair-movement-analysis",
  vertical: "urban-analytics",
  title: "An\xE1lisis de movimiento y distribuci\xF3n de visitantes en ferias y recintos",
  problem: "Un organizador de ferias, exposiciones, congresos o eventos en recintos quiere entender c\xF3mo se distribuyen los visitantes dentro del espacio, qu\xE9 zonas o pabellones concentran m\xE1s tr\xE1fico, cu\xE1nto tiempo permanecen en cada \xE1rea y cu\xE1les quedan con poca presencia.",
  solution: "Puedes saber cu\xE1ntas personas pasaron por cada zona del recinto, cu\xE1nto tiempo permanecieron y en qu\xE9 momentos del evento hubo picos de tr\xE1fico. Los mapas de intensidad muestran d\xF3nde se concentr\xF3 la gente y cu\xE1les zonas quedaron subutilizadas. Limitaci\xF3n importante: en recintos cerrados, el GPS tiene una precisi\xF3n de 10 a 50 metros. Funciona bien para pabellones o sectores separados al menos 30-50 metros, pero no distingue con fiabilidad entre stands o \xE1reas adyacentes.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"],
  matchKeywords: [
    "feria",
    "exposici\xF3n",
    "expo",
    "congreso",
    "recinto ferial",
    "movimiento en feria",
    "flujo en feria",
    "dentro de una feria",
    "dentro del recinto",
    "distribuci\xF3n de visitantes",
    "distribuci\xF3n en evento",
    "c\xF3mo se mueven las personas",
    "como se mueven las personas",
    "zonas de feria",
    "stands m\xE1s visitados",
    "pabell\xF3n",
    "comportamiento en recinto",
    "tr\xE1fico en recinto",
    "mapa de feria",
    "flujo en recinto"
  ]
};

// src/knowledge/use-cases/geolocated-experiences.ts
var geolocationARExperience = {
  id: "geolocated-ar-experience",
  vertical: "geolocated-experiences",
  title: "Experiencias geolocalizadas: realidad aumentada, mapas interactivos y contenido por puntos",
  problem: "Un desarrollador, agencia o creativo quiere construir una experiencia \u2014 realidad aumentada, mapa interactivo, contenido enriquecido \u2014 que funcione solo en ubicaciones espec\xEDficas del mapa. El contenido o la experiencia no debe activarse desde cualquier lugar, sino \xFAnicamente donde el creador lo defina.",
  solution: "S\xED. Puedes habilitar o bloquear funciones de tu aplicaci\xF3n seg\xFAn si el usuario est\xE1 f\xEDsicamente en una ubicaci\xF3n espec\xEDfica. Tu app consulta la API de Ubyca antes de mostrar el contenido, y el servidor valida la presencia real \u2014 no el GPS autogestionado del dispositivo. Funciona para cualquier tipo de funcionalidad que deba estar disponible solo en un lugar: contenido geolocalizado, acceso a zonas, experiencias interactivas o realidad aumentada. El resultado es una experiencia que literalmente funciona solo donde t\xFA lo definas.",
  capabilities: ["geopoints", "presence", "api", "smart-proxies"],
  matchKeywords: [
    "realidad aumentada",
    "realidad aumentada geolocalizada",
    "RA geolocalizada",
    "AR geolocalizado",
    "mapa interactivo",
    "mapa enriquecido",
    "contenido en mapa",
    "experiencia geolocalizada",
    "experiencia por puntos",
    "activar experiencia",
    "experiencia en territorio",
    "solo en los lugares",
    "funcione solo en",
    "solo donde yo quiera",
    "contenido por mapa",
    "app de mapa",
    "experiencia de mapa",
    "WebXR",
    "A-Frame",
    "capa AR",
    "activar AR",
    "puntos en el mapa",
    "definir puntos en mapa",
    "experiencia que funcione en ubicaciones",
    // Lenguaje natural — juegos y dinámicas
    "gymkhana",
    "yincana",
    "gimkana",
    "caza del tesoro",
    "cazatesoros",
    "b\xFAsqueda del tesoro",
    "juego de pistas",
    "pistas geolocalizadas",
    "trivial geolocalizado",
    "quiz geolocalizado",
    "contenido desbloqueado por ubicaci\xF3n",
    "app que funcione en puntos del mapa",
    // Funciones de app disponibles solo por ubicación (Q11)
    "aplicaci\xF3n m\xF3vil",
    "usuario est\xE9 f\xEDsicamente",
    "funciones geolocalizadas",
    "habilitar funciones por ubicaci\xF3n",
    "solo cuando el usuario est\xE9",
    "funciones por ubicaci\xF3n",
    "app con geolocalizaci\xF3n",
    "funciones disponibles en un lugar",
    // App que activa contenido solo al llegar a un lugar (Q8)
    "solo cuando alguien llegue",
    "aparezcan solo cuando",
    "ciertas cosas aparezcan",
    "llegue a un lugar espec\xEDfico",
    "llegue a un lugar especifico",
    "alguien llegue a un lugar",
    "cosas aparezcan por ubicaci\xF3n",
    "cosas aparezcan por ubicacion",
    "tengo una app y quiero",
    "app y quiero que",
    // Vocabulario adicional — apps existentes integrando Ubyca
    "ya tengo una app",
    "qu\xE9 agrega ubyca",
    "que agrega ubyca"
  ],
  subIntentions: [
    {
      id: "app-trigger-ubicacion",
      patterns: [
        "solo cuando alguien llegue",
        "aparezcan solo cuando",
        "ciertas cosas aparezcan",
        "llegue a un lugar espec\xEDfico",
        "llegue a un lugar especifico",
        "alguien llegue a un lugar",
        "tengo una app y quiero",
        "app y quiero que",
        "solo cuando el usuario est\xE9",
        "funciones por ubicaci\xF3n",
        "funciones por ubicacion",
        "habilitar funciones por ubicaci\xF3n",
        "funciones disponibles en un lugar"
      ],
      solution: "La diferencia clave con usar el GPS del dispositivo directamente: Ubyca valida en el servidor, no en el tel\xE9fono. El usuario no puede manipular la coordenada ni simular estar en un lugar. Adem\xE1s, cada validaci\xF3n queda registrada con timestamp y duraci\xF3n \u2014 historial auditable que el GPS del dispositivo no genera. Si lo que necesitas es confirmar que alguien realmente estuvo en un lugar y durante cu\xE1nto tiempo, eso no se puede resolver solo con el GPS del dispositivo."
    },
    {
      id: "experiencia-geolocalizada",
      patterns: [
        "realidad aumentada",
        "mapa interactivo",
        "contenido en mapa",
        "experiencia geolocalizada",
        "experiencia por puntos",
        "activar experiencia",
        "gymkhana",
        "yincana",
        "caza del tesoro",
        "juego de pistas",
        "WebXR",
        "capa AR",
        "experiencia que funcione en ubicaciones"
      ],
      solution: "S\xED. Puedes construir experiencias \u2014 realidad aumentada, mapas interactivos, din\xE1micas por puntos \u2014 que funcionan \xFAnicamente en las ubicaciones que definas. El contenido no aparece fuera del \xE1rea, no puede compartirse ni accederse desde otro lugar. Funciona sin app nativa instalada: cualquier navegador puede validar la presencia a trav\xE9s de la API."
    }
  ]
};

// src/knowledge/use-cases/ecommerce.ts
var ecommerceIntegration = {
  id: "ecommerce-integration",
  vertical: "integrations",
  title: "Integraci\xF3n de Ubyca con plataformas de e-commerce",
  problem: "Un negocio usa Shopify, Wix, WooCommerce, VTEX, Magento u otra plataforma de comercio electr\xF3nico y quiere saber si puede incorporar presencia f\xEDsica verificada en su tienda online \u2014 por ejemplo, para habilitar descuentos solo en el local f\xEDsico, registrar conversiones de visitas presenciales o medir la relaci\xF3n entre tr\xE1fico f\xEDsico y ventas digitales.",
  solution: "Tu e-commerce no sabe si el usuario que est\xE1 navegando tambi\xE9n est\xE1 en tu tienda f\xEDsica en ese momento. Ubyca agrega esa capa: cuando el cliente est\xE1 presente en el local, tu plataforma puede mostrarle un beneficio exclusivo que no existe online \u2014 precio de local, descuento por visita, contenido de producto reservado para quien est\xE1 presente. La integraci\xF3n es v\xEDa API REST: tu backend consulta a Ubyca, recibe la validaci\xF3n en menos de 80 ms y decide si mostrar el beneficio. Funciona con cualquier plataforma que soporte llamadas HTTP \u2014 Shopify, WooCommerce, VTEX, backend propio.",
  capabilities: ["geopoints", "presence", "api", "smart-proxies", "integrations"],
  matchKeywords: [
    "Shopify",
    "Wix",
    "WooCommerce",
    "VTEX",
    "Magento",
    "PrestaShop",
    "tienda online",
    "tienda en l\xEDnea",
    "tienda virtual",
    "comercio electr\xF3nico",
    "plataforma e-commerce",
    "plataforma de venta online",
    "integrar con Shopify",
    "conectar con Wix",
    "conectar con WooCommerce",
    "ecommerce",
    "e-commerce",
    "carrito de compras online",
    "plugin de presencia",
    "tienda de comercio electr\xF3nico"
  ]
};

// src/knowledge/use-cases/geolocated-catalog.ts
var geolocatedCatalog = {
  id: "geolocated-catalog",
  vertical: "geolocated-catalog",
  title: "Cat\xE1logo o portafolio geolocalizado de proyectos y activos en terreno",
  problem: "Una empresa, consultora, municipalidad, arquitecto o profesional quiere mostrar su portafolio de proyectos, obras realizadas o activos distribuidos en el territorio de forma interactiva \u2014 no como una lista, sino como un mapa donde cada punto da acceso a la informaci\xF3n del proyecto o activo correspondiente.",
  solution: "Puedes mostrar tus proyectos, obras o activos sobre un mapa interactivo: al acercarse a cada ubicaci\xF3n, el contenido asociado se activa autom\xE1ticamente \u2014 ficha del proyecto, fotos, planos, videos o cualquier URL. Sin app nativa: cualquier dispositivo con navegador accede al contenido. Agregas nuevos proyectos desde Studio sin modificar la infraestructura existente.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"],
  matchKeywords: [
    // Intención de catálogo/portafolio
    "cat\xE1logo de proyectos",
    "cat\xE1logo de obras",
    "portafolio territorial",
    "portafolio geolocalizado",
    "portafolio en mapa",
    "cat\xE1logo geolocalizado",
    "cat\xE1logo interactivo",
    "cat\xE1logo en mapa",
    "mostrar proyectos en mapa",
    "mapa de proyectos",
    "mapa de obras",
    "proyectos sobre mapa",
    // Proyectos en terreno (señal fuerte)
    "proyectos en terreno",
    "proyectos realizados",
    "obras realizadas",
    "proyectos construidos",
    "proyectos ejecutados",
    "proyectos entregados",
    "trabajos realizados",
    "trabajos ejecutados",
    // Activos distribuidos
    "activos distribuidos",
    "activos en el territorio",
    "puntos de inter\xE9s mapa",
    // Verticales que usan catálogos (señales de contexto)
    "arquitectura",
    "obra de arquitectura",
    "proyecto de construcci\xF3n",
    "municipalidad y proyectos",
    "obras municipales en mapa",
    "ingenier\xEDa en terreno",
    "visualizar proyectos"
  ]
};

// src/knowledge/use-cases/presence-registration.ts
var presenceRegistration = {
  id: "presence-registration",
  vertical: "access-control",
  title: "Registro de ingreso y validaci\xF3n de presencia en una ubicaci\xF3n",
  problem: "Una organizaci\xF3n necesita registrar que una persona lleg\xF3 a un lugar espec\xEDfico \u2014 con la hora exacta de llegada y el tiempo de permanencia \u2014 sin depender de partes manuales, sin hardware de acceso y sin posibilidad de que el usuario falsifique su presencia.",
  solution: "S\xED. Puedes saber con certeza si una persona lleg\xF3 a un lugar, cu\xE1ndo lleg\xF3 y cu\xE1nto tiempo permaneci\xF3 \u2014 sin que esa persona pueda declararlo por s\xED sola ni falsificarlo. La validaci\xF3n ocurre en el servidor. Ese dato habilita tres casos: verificar que alguien cumpli\xF3 una visita o ronda asignada, registrar asistencia autom\xE1ticamente sin pasar lista, o usar la presencia f\xEDsica como condici\xF3n para habilitar acceso a algo. Los datos son exportables v\xEDa API para auditor\xEDas o integraci\xF3n con sistemas existentes.",
  capabilities: ["geopoints", "presence", "analytics", "api"],
  matchKeywords: [
    // Registro de ingreso (señal fuerte)
    "registro de ingreso",
    "registro de acceso",
    "registro de llegada",
    "registro de presencia",
    "registro de personas",
    "registrar ingreso",
    "registrar ingreso de personas",
    "ingreso de personas",
    "ingreso a un lugar",
    "qui\xE9n ingres\xF3",
    "qui\xE9nes ingresaron",
    "hora de ingreso",
    "hora de llegada",
    // Validación y control (señal fuerte)
    "validaci\xF3n de asistencia",
    "validar llegada",
    "validar asistencia",
    "comprobar asistencia",
    "confirmar llegada",
    "confirmar asistencia",
    "control de ingreso",
    "control de acceso por ubicaci\xF3n",
    "auditor\xEDa de accesos",
    "auditor\xEDa de ingresos",
    // Check-in
    "check-in geolocalizado",
    "check-in por GPS",
    "check-in sin hardware",
    "registro sin hardware",
    "acceso sin hardware",
    // Personas llegando
    "personas que ingresan",
    "cuando llega la persona",
    "validar que lleg\xF3",
    // Verificar que alguien realmente estuvo en un lugar
    "estuvo en un lugar",
    "alguien estuvo en",
    "comprobar que estuvo",
    "realmente estuvo",
    "verificar que estuvo",
    "validar que estuvo",
    "confirmar que estuvo",
    "comprobar presencia",
    // Presencia física, control de acceso y registro de visitas (Tarea 4)
    "lleg\xF3 f\xEDsicamente",
    "llego fisicamente",
    "presencia f\xEDsica",
    "presencia fisica",
    "registrar visitas",
    "registro de visitas",
    "registrar visitas en terreno",
    "control de acceso",
    "acceso por ubicaci\xF3n",
    "acceso por ubicacion",
    "controlar acceso",
    "acceso usando ubicaci\xF3n",
    "acceso usando ubicacion",
    "lleg\xF3 al lugar",
    "llego al lugar"
  ],
  subIntentions: [
    {
      id: "validar-llegada",
      patterns: [
        "lleg\xF3 f\xEDsicamente",
        "llego fisicamente",
        "lleg\xF3 al lugar",
        "llego al lugar",
        "estuvo en un lugar",
        "alguien estuvo en",
        "comprobar que estuvo",
        "realmente estuvo",
        "verificar que estuvo",
        "validar que estuvo",
        "confirmar que estuvo",
        "validar llegada",
        "confirmar llegada",
        "validar asistencia"
      ],
      solution: "S\xED. Puedes verificar si una persona lleg\xF3 f\xEDsicamente a una ubicaci\xF3n determinada \u2014 con la hora exacta de llegada y el tiempo que permaneci\xF3. La validaci\xF3n ocurre en el servidor con GPS; no es auto-declarada ni puede falsificarse. Los datos son exportables v\xEDa API para auditor\xEDas o reportes de asistencia."
    },
    {
      id: "registrar-visitas",
      patterns: [
        "registrar visitas",
        "registrar visitas en terreno",
        "registro de visitas",
        "registro de ingreso",
        "registrar ingreso",
        "registro de llegada",
        "qui\xE9n ingres\xF3",
        "hora de ingreso"
      ],
      solution: "S\xED. Puedes registrar visitas en terreno autom\xE1ticamente \u2014 con fecha, hora exacta y duraci\xF3n de permanencia \u2014 sin partes manuales ni declaraciones del equipo. Cada visita queda registrada cuando la persona llega al punto asignado. Los datos son exportables para control de gesti\xF3n o auditor\xEDas."
    },
    {
      id: "controlar-acceso",
      patterns: [
        "controlar acceso",
        "control de acceso",
        "acceso usando ubicaci\xF3n",
        "acceso usando ubicacion",
        "acceso por ubicaci\xF3n",
        "acceso por ubicacion",
        "comprobar presencia",
        "presencia f\xEDsica",
        "presencia fisica"
      ],
      solution: "S\xED. Puedes usar la ubicaci\xF3n como condici\xF3n para habilitar o restringir acceso a contenido, recursos o zonas. Tu sistema consulta la API de Ubyca para verificar si la persona est\xE1 f\xEDsicamente dentro del \xE1rea autorizada antes de conceder el acceso \u2014 sin hardware adicional, sin QR, sin tarjetas de proximidad."
    }
  ]
};

// src/knowledge/use-cases/spatial-concentration.ts
var spatialConcentration = {
  id: "spatial-concentration",
  vertical: "spatial-analytics",
  title: "Concentraci\xF3n de personas y detecci\xF3n de zonas de mayor afluencia",
  problem: "Una organizaci\xF3n necesita saber en qu\xE9 partes de un \xE1rea, campus, ciudad o recinto se concentra la mayor cantidad de personas, en qu\xE9 horarios y c\xF3mo var\xEDa la distribuci\xF3n a lo largo del tiempo \u2014 para tomar decisiones de dise\xF1o, operaci\xF3n, seguridad o inversi\xF3n.",
  solution: "S\xED. Puedes comparar tus ubicaciones entre s\xED con datos objetivos: cu\xE1ntas personas llegaron a cada una, cu\xE1nto tiempo permanecieron y en qu\xE9 horarios se concentra el tr\xE1fico. Eso te permite identificar qu\xE9 puntos rinden bien, cu\xE1les est\xE1n subutilizados y d\xF3nde hay oportunidades de mejora \u2014 sin depender de ventas ni de opini\xF3n del equipo. Los datos son exportables por punto, por per\xEDodo y por horario.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"],
  matchKeywords: [
    // Concentración (señal fuerte)
    "concentraci\xF3n de personas",
    "d\xF3nde se concentra",
    "donde se concentra",
    "mayor cantidad de personas",
    "concentraci\xF3n territorial",
    "qu\xE9 zonas concentran",
    "que zonas concentran",
    "d\xF3nde hay m\xE1s gente",
    "donde hay mas gente",
    "mayor afluencia",
    "zona de mayor afluencia",
    // Hotspots
    "hotspot",
    "zonas calientes",
    "zona caliente",
    "puntos calientes",
    "punto de m\xE1ximo tr\xE1fico",
    // Distribución espacial
    "distribuci\xF3n espacial",
    "distribuci\xF3n de personas",
    "distribuci\xF3n territorial",
    "mapa de concentraci\xF3n",
    "mapa de calor",
    "mapa de intensidad",
    "comportamiento espacial",
    "densidad de visitas",
    "densidad de personas",
    // Zonas más visitadas (transversal, no vertical-específico)
    "\xE1reas m\xE1s visitadas",
    "zonas m\xE1s visitadas",
    "zonas de mayor tr\xE1fico",
    "flujo por zona",
    "intensidad de tr\xE1fico",
    // Comparación multi-local y rendimiento por punto
    "varias tiendas",
    "comparar tiendas",
    "comparar locales",
    "interacci\xF3n de clientes",
    "rendimiento por tienda",
    "qu\xE9 local tiene m\xE1s tr\xE1fico",
    // Comparación de comportamiento entre ubicaciones
    "comparar el comportamiento",
    "entre varias ubicaciones",
    "comportamiento de visitantes",
    "varias ubicaciones",
    "comparar sucursales",
    "comparar zonas",
    // Valor y rendimiento por sucursal (auditoría anterior)
    "aporta m\xE1s valor",
    "aporta mas valor",
    "cu\xE1l aporta m\xE1s",
    "cual aporta mas",
    "genera mejores resultados",
    "mejores resultados por sucursal",
    "comparar resultados entre sucursales",
    "rendimiento de sucursales",
    // Concentración expresada con vocabulario coloquial
    "donde se junta",
    "d\xF3nde se junta",
    "se junta m\xE1s gente",
    "se junta mas gente",
    "d\xF3nde se acumula gente",
    "donde se acumula gente",
    // Performance comercial de ubicaciones — lenguaje de negocio (Tarea 1, 2)
    "cu\xE1l de mis locales",
    "cual de mis locales",
    "cu\xE1l de mis sucursales",
    "cual de mis sucursales",
    "cu\xE1les de mis sucursales",
    "cuales de mis sucursales",
    "cu\xE1l de mis tiendas",
    "cual de mis tiendas",
    "cu\xE1les de mis tiendas",
    "cuales de mis tiendas",
    "cu\xE1l de mis puntos",
    "cual de mis puntos",
    "recibe m\xE1s visitas",
    "recibe mas visitas",
    "m\xE1s visitas",
    "mas visitas",
    "genera m\xE1s interacci\xF3n",
    "genera mas interaccion",
    "m\xE1s interacci\xF3n",
    "mas interaccion",
    "funciona mejor",
    "funcionan mejor",
    "mejor desempe\xF1o",
    "mejor desempeno",
    "rendimiento comercial",
    "mejor rendimiento",
    "aporta valor",
    "genera valor",
    "genera resultados",
    "aportando valor",
    "sucursal m\xE1s exitosa",
    "sucursal mas exitosa",
    "cadena de restaurantes",
    // Lenguaje coloquial de afluencia (Tarea 5)
    "concurrido",
    "qu\xE9 tan concurrido",
    "que tan concurrido",
    "se llena",
    "se junta gente",
    "tr\xE1fico de personas",
    "trafico de personas",
    "movimiento de personas",
    "donde hay mas movimiento"
  ],
  subIntentions: [
    {
      id: "comparar-ubicaciones",
      patterns: [
        "cu\xE1l de mis locales",
        "cual de mis locales",
        "cu\xE1l de mis sucursales",
        "cual de mis sucursales",
        "cu\xE1les de mis sucursales",
        "cuales de mis sucursales",
        "cu\xE1l de mis puntos",
        "cual de mis puntos",
        "funciona mejor",
        "funcionan mejor",
        "recibe m\xE1s visitas",
        "recibe mas visitas",
        "genera m\xE1s interacci\xF3n",
        "genera mas interaccion",
        "aporta m\xE1s valor",
        "aporta mas valor",
        "genera mejores resultados",
        "rendimiento de sucursales",
        "cadena de restaurantes",
        "mejor desempe\xF1o",
        "mejor desempeno",
        "rendimiento comercial",
        "mejor rendimiento",
        "sucursal m\xE1s exitosa",
        "sucursal mas exitosa"
      ],
      solution: "S\xED. Puedes ver con datos exactos qu\xE9 sucursales atraen m\xE1s visitas, cu\xE1les retienen m\xE1s tiempo a los visitantes y cu\xE1les quedan rezagadas \u2014 sin depender de ventas ni de la percepci\xF3n del equipo. Eso te da una base objetiva para decidir d\xF3nde reforzar, d\xF3nde optimizar horarios y cu\xE1les pueden estar mal posicionadas. Los datos se comparan por punto, por per\xEDodo y por horario, y son exportables para an\xE1lisis propios."
    },
    {
      id: "concurrencia-afluencia",
      patterns: [
        "concurrido",
        "qu\xE9 tan concurrido",
        "que tan concurrido",
        "se llena",
        "se junta gente",
        "se junta m\xE1s gente",
        "se junta mas gente",
        "tr\xE1fico de personas",
        "trafico de personas",
        "movimiento de personas",
        "donde hay mas movimiento",
        "d\xF3nde hay m\xE1s gente",
        "donde hay mas gente",
        "d\xF3nde se concentra",
        "donde se concentra",
        "donde se junta",
        "d\xF3nde se junta",
        "mayor afluencia",
        "mapa de calor"
      ],
      solution: "S\xED. Puedes medir cu\xE1ntas personas circulan por una zona, en qu\xE9 horarios se producen los picos de afluencia y c\xF3mo var\xEDa el patr\xF3n a lo largo del tiempo. El sistema genera mapas de intensidad GPS que muestran qu\xE9 \xE1reas concentran m\xE1s tr\xE1fico y en qu\xE9 momentos \u2014 sin hardware, sin sensores y sin encuestas."
    }
  ]
};

// src/knowledge/limitations.ts
var limitations = [
  {
    area: "Precisi\xF3n GPS en interiores",
    description: "La precisi\xF3n GPS degrada significativamente en interiores, especialmente en edificios de concreto grueso, s\xF3tanos o zonas sin l\xEDnea de visi\xF3n al cielo. El error t\xEDpico indoor puede ser de 10 a 50 metros, lo que puede resultar en falsos positivos o negativos si el GeoPoint tiene un radio peque\xF1o.",
    workaround: "Usar radios de GeoPoint de al menos 30-50 metros en interiores. Para espacios interiores grandes con zonas bien separadas, definir pol\xEDgonos m\xE1s amplios. En interiores con requerimientos de alta precisi\xF3n, evaluar alternativas como Bluetooth beacons combinados con validaci\xF3n Ubyca."
  },
  {
    area: "Disponibilidad de GPS en el dispositivo del usuario",
    description: "Ubyca requiere que el dispositivo del usuario tenga GPS y que el usuario otorgue permiso de ubicaci\xF3n. Si el usuario deniega el permiso, la validaci\xF3n de presencia no puede ejecutarse. No hay fallback a IP geolocation ni Wi-Fi positioning, ya que estos m\xE9todos son inexactos y falsificables.",
    workaround: "Dise\xF1ar el flujo para solicitar el permiso de ubicaci\xF3n con contexto claro de por qu\xE9 se necesita. Los Smart Proxies incluyen una pantalla de solicitud de permiso antes de la validaci\xF3n."
  },
  {
    area: "App nativa no disponible",
    description: "Ubyca no tiene una app nativa propia en iOS o Android. La validaci\xF3n de presencia funciona desde el navegador web del usuario o desde apps de terceros que integran la API. Esto limita la capacidad de hacer validaciones de presencia en segundo plano (background location).",
    workaround: "Para casos que requieren validaci\xF3n continua en segundo plano, integrar la API de Ubyca en la app nativa propia del cliente."
  },
  {
    area: "Ausencia de marketplace de integraciones predefinidas",
    description: "Ubyca no tiene conectores nativos con sistemas CRM, ERP, plataformas de e-commerce espec\xEDficas ni herramientas de marketing automation. Toda integraci\xF3n requiere desarrollo personalizado sobre la API REST.",
    workaround: "La integraci\xF3n se construye sobre la API REST est\xE1ndar de Ubyca: cualquier plataforma que soporte HTTP puede consumir resultados de presencia. Ubyca no tiene webhooks, por lo que el sistema cliente es quien inicia las llamadas."
  },
  {
    area: "Latencia en entornos con mala conectividad",
    description: "La validaci\xF3n de presencia requiere conectividad a internet en el momento de la solicitud. En zonas con se\xF1al d\xE9bil (\xE1reas rurales, s\xF3tanos, zonas de eventos congestionadas), la llamada a la API puede timeout o demorar m\xE1s de 80 ms. No hay modo offline.",
    workaround: "Dise\xF1ar el flujo con timeouts generosos y mensajes de error amigables. Para eventos masivos, verificar la cobertura de datos m\xF3viles del venue con antelaci\xF3n."
  },
  {
    area: "L\xEDmites de GeoPoints por proyecto",
    description: "Cada plan de Ubyca tiene un l\xEDmite de GeoPoints activos por proyecto. Proyectos con cientos de puntos (como una cadena con muchas sucursales) requieren un plan Enterprise. Los l\xEDmites exactos dependen del plan contratado.",
    workaround: "Para cadenas con muchas sucursales, contactar a Ubyca para un plan Enterprise o evaluar la arquitectura de m\xFAltiples proyectos."
  },
  {
    area: "Sin tracking continuo de trayectoria",
    description: "Ubyca registra eventos de entrada y permanencia en zonas definidas, pero no registra la trayectoria continua de una persona entre GeoPoints. No es un sistema de seguimiento GPS en tiempo real punto a punto.",
    workaround: "Para casos que requieren trayectoria completa (rutas entre puntos), combinar Ubyca para la validaci\xF3n de llegada a puntos clave con un sistema de tracking de flota GPS dedicado para la ruta entre puntos."
  },
  {
    area: "Datos hist\xF3ricos y retenci\xF3n",
    description: "La retenci\xF3n de datos hist\xF3ricos de presencia y analytics depende del plan contratado. Los planes b\xE1sicos pueden tener ventanas de retenci\xF3n m\xE1s cortas. Para cumplimiento o auditor\xEDa a largo plazo, es necesario exportar los datos peri\xF3dicamente v\xEDa API.",
    workaround: "Implementar una exportaci\xF3n peri\xF3dica automatizada v\xEDa API hacia el sistema de almacenamiento propio del cliente para casos de cumplimiento o auditor\xEDa."
  },
  {
    area: "Consentimiento GPS y privacidad del usuario final",
    description: "Ubyca no realiza seguimiento oculto de ning\xFAn tipo. Para que la validaci\xF3n de presencia funcione, el usuario final debe abrir activamente el enlace o la aplicaci\xF3n que realiza la solicitud, y el navegador o sistema operativo debe solicitar y recibir el permiso de ubicaci\xF3n expl\xEDcitamente. Ubyca no accede a la ubicaci\xF3n en segundo plano sin acci\xF3n del usuario. El cliente que implementa Ubyca es responsable exclusivo de: informar a sus usuarios del uso de datos de ubicaci\xF3n, obtener los consentimientos que exija la legislaci\xF3n aplicable en su jurisdicci\xF3n, y cumplir con la normativa de privacidad vigente en cada pa\xEDs donde opere. Ubyca provee infraestructura t\xE9cnica, no asesoramiento legal ni garant\xEDas de cumplimiento normativo.",
    workaround: "Incluir en el flujo de usuario una pantalla de consentimiento clara antes de solicitar la ubicaci\xF3n. Los Smart Proxies de Ubyca incluyen una pantalla de permiso integrada. Para integraciones v\xEDa API, el cliente debe implementar su propio flujo de consentimiento."
  },
  {
    area: "Identificaci\xF3n de usuarios \u2014 Ubyca no gestiona identidades",
    description: 'Ubyca valida coordenadas GPS contra GeoPoints configurados. No tiene un sistema de identidad de usuarios propio: la API no requiere ni almacena un user_id nativo. Una solicitud de validaci\xF3n contiene las coordenadas y el location_id, pero no sabe a qui\xE9n pertenece esa solicitud. En Studio, las m\xE9tricas de analytics muestran conteos agregados (visitas, activaciones, dwell time), no perfiles individuales. Si el cliente necesita asociar presencias a personas identificadas (por ejemplo, saber que fue "Pedro" quien visit\xF3 el punto A), debe implementar su propio sistema de autenticaci\xF3n e incluir el identificador en la l\xF3gica de su aplicaci\xF3n. Ubyca responde si las coordenadas son v\xE1lidas: el cliente decide qu\xE9 hacer con eso y a qui\xE9n se las atribuye.',
    workaround: "El sistema integrador mantiene la sesi\xF3n del usuario autenticado (login propio o OAuth) y, al llamar a la API de Ubyca, vincula el resultado de presencia con el user_id de su propio sistema. Ubyca no almacena esa vinculaci\xF3n: es responsabilidad del sistema cliente."
  },
  {
    area: "Webhooks \u2014 no disponibles actualmente",
    description: "Ubyca no tiene un sistema de webhooks que notifique proactivamente a sistemas externos cuando ocurre un evento de presencia (entrada, salida, dwell time completado). La integraci\xF3n actual es exclusivamente request-response: el sistema externo llama a la API de Ubyca y recibe el resultado en ese momento. Ubyca no puede iniciar una notificaci\xF3n hacia un endpoint externo.",
    workaround: "Implementar polling peri\xF3dico a la Analytics API para detectar cambios en m\xE9tricas. Para validaci\xF3n en tiempo real, el sistema del cliente debe ser quien llame a Ubyca en el momento relevante (cuando el usuario abre la app, escanea un c\xF3digo, etc.), no esperar una notificaci\xF3n entrante."
  }
];

// src/knowledge/product-faq.ts
var faqWhatIsUbyca = {
  id: "faq-what-is-ubyca",
  title: "Qu\xE9 es Ubyca y para qu\xE9 sirve",
  questionPatterns: [
    "qu\xE9 es ubyca",
    "que es ubyca",
    "c\xF3mo funciona ubyca",
    "como funciona ubyca",
    "para qu\xE9 sirve ubyca",
    "para que sirve ubyca",
    "qu\xE9 hace ubyca",
    "que hace ubyca",
    "qu\xE9 problemas resuelve",
    "que problemas resuelve",
    "cu\xE9ntame sobre ubyca",
    "cuentame sobre ubyca",
    "expl\xEDcame ubyca",
    "explicame ubyca",
    "presentaci\xF3n de ubyca",
    "c\xF3mo funciona esto",
    "como funciona esto"
  ],
  answer: "Ubyca responde una pregunta que muchos sistemas no pueden contestar: \xBFesta persona realmente estuvo en ese lugar? Verifica la presencia f\xEDsica en el servidor \u2014 con hora exacta, duraci\xF3n y sin posibilidad de auto-declaraci\xF3n ni falsificaci\xF3n \u2014 y act\xFAa en consecuencia: activa contenido, registra la visita, habilita acceso o genera un dato de anal\xEDtica. Sin hardware, sin apps nativas que instalar. El acceso es desde Studio (interfaz visual sin c\xF3digo) o v\xEDa API REST. Funciona para equipos en terreno, campa\xF1as de marca, control de acceso, fidelizaci\xF3n presencial, an\xE1lisis de tr\xE1fico y experiencias geolocalizadas.",
  tags: ["Studio", "API", "GeoPoints", "Presencia f\xEDsica"]
};
var faqCapabilities = {
  id: "faq-capabilities",
  title: "Capacidades y componentes de Ubyca",
  questionPatterns: [
    "diferencia entre studio y api",
    "diferencia studio api",
    "qu\xE9 es studio",
    "que es studio",
    "qu\xE9 es un geopoint",
    "que es un geopoint",
    "componentes de ubyca",
    "partes de ubyca",
    "m\xF3dulos de ubyca",
    "c\xF3mo se usa ubyca",
    "como se usa ubyca",
    "qu\xE9 puedo hacer con ubyca",
    "que puedo hacer con ubyca",
    "capacidades de ubyca",
    "funcionalidades de ubyca",
    "qu\xE9 incluye ubyca",
    "que incluye ubyca"
  ],
  answer: "Ubyca tiene cinco componentes principales. GeoPoints: zonas geogr\xE1ficas definidas sobre un mapa que determinan d\xF3nde se activa una regla o se registra presencia. Presencia f\xEDsica: validaci\xF3n server-side de que el usuario est\xE1 dentro de un GeoPoint. Studio: interfaz visual para crear proyectos, definir zonas, ver anal\xEDtica en tiempo real y gestionar Smart Proxies sin escribir c\xF3digo. API REST: acceso program\xE1tico a todas las capacidades para integrar con sistemas del cliente. Analytics: historial de eventos de presencia, dwell time, flujo y distribuci\xF3n espacial.",
  tags: ["Studio", "API", "GeoPoints", "Presencia f\xEDsica", "Analytics"]
};
var faqAppIntegration = {
  id: "faq-app-integration",
  title: "Integrar Ubyca con una aplicaci\xF3n m\xF3vil o web propia",
  questionPatterns: [
    // Integración con app
    "integrar ubyca",
    "integrar con mi app",
    "integrar en mi app",
    "integrar ubyca con app",
    "puedo integrar ubyca",
    "funciona con aplicaciones m\xF3viles",
    "funciona con aplicacion movil",
    "api en mi app",
    "api desde mi aplicacion",
    "api dentro de mi app",
    "uso la api desde una app",
    "integrar con una app existente",
    // SDK
    "sdk para app",
    "sdk para ios",
    "sdk para android",
    "sdk movil",
    "sdk de ubyca",
    "tienen sdk",
    // App propia
    "mi aplicacion movil",
    "mi app propia",
    "app propia",
    "app de ios",
    "app de android",
    "app nativa"
  ],
  answer: "S\xED. Ubyca se integra con aplicaciones m\xF3viles y web mediante su API REST. Tu app llama a los endpoints de Ubyca enviando las coordenadas GPS del usuario y recibe la validaci\xF3n de presencia en menos de 80 ms. No existe un SDK nativo oficial para iOS ni Android: la integraci\xF3n se hace directamente contra la API usando cualquier cliente HTTP est\xE1ndar (URLSession, Retrofit, fetch, Axios). Desde tu app puedes verificar presencia, consultar datos de GeoPoints y acceder a analytics. Para validaci\xF3n en segundo plano (background location), tu app nativa debe gestionar el permiso de ubicaci\xF3n continua.",
  tags: ["API", "GeoPoints", "Presencia f\xEDsica"]
};
var faqStadium = {
  id: "faq-stadium",
  title: "Uso de Ubyca en estadios, arenas y grandes recintos",
  questionPatterns: [
    "estadio",
    "arena deportiva",
    "recinto deportivo",
    "recinto masivo",
    "cancha",
    "coliseo",
    "hip\xF3dromo",
    "vel\xF3dromo",
    "ubyca en estadio",
    "usar ubyca en estadio",
    "gran recinto",
    "recinto de gran capacidad",
    "evento masivo",
    "experiencia en estadio"
  ],
  answer: "S\xED. Un estadio o arena puede cubrirse con GeoPoints sobre sus zonas: tribunas, sectores VIP, \xE1rea de campo, pasillos de ingreso. Puedes activar experiencias digitales seg\xFAn la zona donde est\xE9 el asistente, verificar presencia para habilitar beneficios o acceso a contenido, y obtener analytics de distribuci\xF3n de visitantes por sector. Consideraci\xF3n importante: en recintos cerrados la precisi\xF3n GPS var\xEDa entre 10 y 50 metros, lo que funciona bien para sectores amplios como tribunas o pabellones, pero no para distinguir asientos o filas adyacentes.",
  tags: ["GeoPoints", "Presencia f\xEDsica", "Analytics", "Studio"]
};
var faqIndoor = {
  id: "faq-indoor",
  title: "Precisi\xF3n GPS en recintos cerrados e interiores",
  questionPatterns: [
    // Recintos cerrados
    "recintos cerrados",
    "recinto cerrado",
    "interior",
    "indoor",
    "funciona en interiores",
    "funciona indoor",
    "funciona en interior",
    "usar ubyca en interiores",
    "uso en interiores",
    "uso indoor",
    "dentro de un edificio",
    "adentro de un edificio",
    // Lugares específicos
    "mall",
    "centro comercial",
    "shopping",
    "galer\xEDa comercial",
    "recinto cubierto",
    // Precisión GPS
    "precisi\xF3n indoor",
    "gps indoor",
    "gps en interior",
    "precisi\xF3n en interiores",
    "error gps interior",
    "funciona sin se\xF1al gps",
    "se\xF1al gps en interior"
  ],
  answer: "Ubyca funciona en recintos cerrados, pero con limitaciones que es importante conocer. El GPS en entornos indoor tiene una precisi\xF3n de 10 a 50 metros seg\xFAn el tipo de construcci\xF3n y la se\xF1al disponible. Esto significa que Ubyca puede delimitar zonas amplias \u2014 pisos, pabellones, sectores separados al menos 30-50 metros \u2014 pero no puede distinguir con fiabilidad entre zonas m\xE1s cercanas entre s\xED. En exteriores, la precisi\xF3n es de 3-10 metros y el rendimiento es significativamente mejor. Para casos indoor que requieren alta densidad de zonas peque\xF1as, se recomienda evaluar el caso concreto antes de implementar.",
  tags: ["GeoPoints", "Presencia f\xEDsica"]
};
var faqMonitoring = {
  id: "faq-monitoring",
  title: "Ubyca y el monitoreo o seguimiento de personas",
  questionPatterns: [
    // Monitoreo
    "monitorear personas",
    "monitorear a personas",
    "monitorear a las personas",
    "monitoreo de personas",
    "monitoreo de usuarios",
    // Seguimiento / rastreo
    "seguimiento de personas",
    "seguimiento de usuarios",
    "seguir personas",
    "rastrear personas",
    "rastreo de personas",
    "rastrear usuarios",
    "tracking de personas",
    "tracking de usuarios",
    // Vigilancia
    "vigilar personas",
    "vigilancia",
    "controlar personas",
    // Localización
    "localizar personas",
    "saber d\xF3nde est\xE1n las personas",
    "saber donde estan las personas",
    "ubicaci\xF3n de personas",
    // Privacidad
    "es legal",
    "cumple gdpr",
    "cumple con privacidad",
    "datos personales",
    "privacidad de usuarios"
  ],
  answer: "Ubyca no realiza seguimiento oculto ni tracking continuo de personas. La validaci\xF3n de presencia ocurre cuando el usuario genera activamente una solicitud al sistema \u2014 abre un link, usa la app del cliente o interact\xFAa con la experiencia configurada. Ubyca no lee la ubicaci\xF3n del dispositivo en segundo plano sin acci\xF3n del usuario. En escenarios de monitoreo de equipos de trabajo (agentes de campo, vendedores, t\xE9cnicos), la soluci\xF3n requiere que los propios trabajadores participen activamente en cada validaci\xF3n. El cumplimiento normativo corresponde al cliente que implementa la soluci\xF3n, de acuerdo con la legislaci\xF3n aplicable en su jurisdicci\xF3n \u2014 Ubyca provee infraestructura t\xE9cnica, no asesoramiento legal.",
  tags: ["Presencia f\xEDsica", "API"]
};
var faqVsQR = {
  id: "faq-vs-qr",
  title: "Diferencia entre Ubyca y usar un QR en cada ubicaci\xF3n",
  questionPatterns: [
    "diferencia entre ubyca y qr",
    "diferencia con qr",
    "ventaja sobre qr",
    "comparado con qr",
    "ubyca vs qr",
    "qr tradicional",
    "poner un qr",
    "usar qr",
    "simplemente poner un qr",
    "diferencia entre usar ubyca y qr",
    "por qu\xE9 no usar qr",
    "para que sirve si tengo qr",
    "ya tengo qr",
    "en vez de qr",
    // Vocabulario adicional — comparación con landing/página QR
    "landing con qr",
    "landing con un qr",
    "p\xE1gina con qr",
    "pagina con qr",
    "simplemente qr",
    "que diferencia hay con"
  ],
  answer: 'Un QR es suficiente cuando solo necesitas distribuir un enlace o facilitar acceso a contenido. El problema es que un QR puede compartirse, fotografiarse y usarse desde cualquier lugar y momento \u2014 no hay forma de saber si quien lo escane\xF3 estaba f\xEDsicamente donde deb\xEDa estar. Ubyca resuelve casos donde eso importa: valida en el servidor que el usuario est\xE1 dentro de un GeoPoint antes de activar el contenido, registrar la visita o habilitar el beneficio. No puede falsificarse compartiendo un link ni escaneando desde casa. Adem\xE1s, Ubyca registra datos reales de presencia, cu\xE1nto tiempo estuvo el usuario y desde qu\xE9 ubicaci\xF3n \u2014 datos que un QR no genera. Si tu caso solo requiere "dar acceso a un link", un QR puede ser suficiente. Si necesitas verificar que alguien estuvo f\xEDsicamente en el lugar, medir esa presencia o activar reglas basadas en ubicaci\xF3n real, Ubyca es la herramienta correcta.',
  tags: ["GeoPoints", "Presencia f\xEDsica", "Analytics"]
};
var faqVsGoogleAnalytics = {
  id: "faq-vs-google-analytics",
  title: "Diferencia entre Ubyca y Google Analytics (GA4)",
  questionPatterns: [
    // Catch-all — cualquier mención de Google Analytics o GA4
    "google analytics",
    "google analitycs",
    "ga4",
    "google analytics 4",
    // Diferencia / comparación directa
    "diferencia entre ubyca y google analytics",
    "diferencia con google analytics",
    "cual es la diferencia entre ubyca y google analytics",
    "comparado con google analytics",
    "versus google analytics",
    "vs google analytics",
    "ubyca vs google analytics",
    "ubyca versus google analytics",
    // Por qué usar Ubyca si ya tengo GA
    "por qu\xE9 usar ubyca si ya tengo google analytics",
    "por que usar ubyca si ya tengo google analytics",
    "para qu\xE9 sirve si tengo google analytics",
    "para que sirve si tengo google analytics",
    "ya tengo google analytics",
    "si ya tengo google analytics",
    "tengo google analytics",
    "uso google analytics",
    "ya uso google analytics",
    "con google analytics basta",
    // Google Analytics hace lo mismo
    "google analytics no hace lo mismo",
    "google analytics hace lo mismo",
    "no hace lo mismo que google analytics",
    // ¿Es parecido / similar?
    "es parecido a google analytics",
    "parecido a google analytics",
    "similar a google analytics",
    "es lo mismo que google analytics",
    "funciona como google analytics",
    // ¿Qué aporta Ubyca que no tenga GA?
    "qu\xE9 aporta ubyca que no tenga google analytics",
    "que aporta ubyca que no tenga google analytics",
    "qu\xE9 aporta ubyca que no tenga ga4",
    "que aporta ubyca que no tenga ga4",
    // ¿Reemplaza / sustituye / compite?
    "reemplaza google analytics",
    "sustituye google analytics",
    "reemplazar google analytics",
    "sustituir google analytics",
    "ubyca compite con google analytics",
    "compite con google analytics"
  ],
  answer: 'Google Analytics y Ubyca no compiten directamente: miden cosas distintas. Google Analytics analiza el comportamiento digital dentro de un sitio web o aplicaci\xF3n \u2014 p\xE1ginas vistas, clics, sesiones y conversiones dentro de una experiencia digital. Ubyca responde una pregunta diferente: \xBFesta persona estuvo f\xEDsicamente en este lugar? Valida presencia en el mundo real, registra cu\xE1ndo ocurri\xF3, cu\xE1nto tiempo permaneci\xF3 el visitante y si una activaci\xF3n presencial gener\xF3 presencia verificada \u2014 independientemente de si el usuario interactu\xF3 con un sitio web o no. Muchas organizaciones usan ambas herramientas de forma complementaria: Google Analytics para entender el comportamiento online y Ubyca para entender lo que ocurre en sus puntos f\xEDsicos. Si tu pregunta es "\xBFcu\xE1ntas personas visitaron mi sitio?", Google Analytics la responde. Si tu pregunta es "\xBFcu\xE1ntas personas estuvieron f\xEDsicamente en mi local?", Ubyca la responde.',
  tags: ["Analytics", "Presencia f\xEDsica", "GeoPoints"]
};
var faqNoHardware = {
  id: "faq-no-hardware",
  title: "Ubyca no requiere hardware, sensores ni dispositivos f\xEDsicos",
  questionPatterns: [
    // Pregunta directa sobre hardware
    "necesito hardware",
    "requiere hardware",
    "necesitan hardware",
    "necesita hardware",
    "hay hardware",
    "tiene hardware",
    // Instalar algo
    "necesito instalar algo",
    "instalar algo en el local",
    "instalar algo f\xEDsico",
    "hay que instalar algo",
    "instalar algo",
    "necesito instalar",
    "hay que instalar",
    "qu\xE9 hay que instalar",
    "que hay que instalar",
    // Dispositivos y sensores
    "necesito beacons",
    "requiere beacons",
    "necesito sensores",
    "requiere sensores",
    "dispositivos f\xEDsicos",
    "dispositivos especiales",
    "necesito dispositivos",
    "requiere dispositivos",
    "equipos f\xEDsicos",
    "equipos especiales",
    // Sin hardware — confirmaciones positivas
    "sin hardware",
    "sin sensores",
    "sin beacons",
    "sin torniquetes",
    "sin lectores",
    "sin infraestructura",
    "sin dispositivos",
    "sin equipos f\xEDsicos",
    "sin infraestructura adicional",
    "sin nada f\xEDsico",
    // Funcionamiento sin hardware
    "funciona sin hardware",
    "funciona sin instalar",
    "funciona sin sensores",
    "funciona sin beacons",
    "funciona sin dispositivos",
    // Algo físico (formulación genérica)
    "algo f\xEDsico",
    "algo fisico",
    "necesito algo f\xEDsico",
    "necesito algo fisico"
  ],
  answer: "No. Ubyca no requiere hardware, sensores, beacons ni dispositivos f\xEDsicos instalados en ning\xFAn punto. La validaci\xF3n de presencia se realiza a partir de la ubicaci\xF3n GPS del tel\xE9fono del usuario y se procesa en los servidores de Ubyca \u2014 sin equipos que instalar, calibrar ni mantener. Puedes comenzar con tu sitio web, app o una integraci\xF3n v\xEDa API sin modificar la infraestructura f\xEDsica de ning\xFAn local.",
  tags: ["GeoPoints", "Presencia f\xEDsica", "API"]
};
var faqApiIntegration = {
  id: "faq-api-integration",
  title: "API, integraci\xF3n e implementaci\xF3n t\xE9cnica de Ubyca",
  questionPatterns: [
    // ¿Tiene API?
    "tiene api",
    "tienen api",
    "tiene una api",
    "tiene api rest",
    "api disponible",
    "expone api",
    // Cómo se integra
    "se integra",
    "como se integra",
    "c\xF3mo se integra",
    "se integra con mi sistema",
    "integra con mi sistema",
    "se puede integrar",
    "puedo integrarlo",
    "puedo integrarla",
    "c\xF3mo integro ubyca",
    "como integro ubyca",
    // Conectar
    "conecto ubyca",
    "conectar ubyca con",
    "c\xF3mo conecto ubyca",
    "como conecto ubyca",
    "conectar con mi sistema",
    "conectar con mi plataforma",
    // Funciona con mi app / web / sistema
    "funciona con mi app",
    "funciona con mi aplicaci\xF3n",
    "funciona con mi aplicacion",
    "funciona con mi web",
    "funciona con mi sistema",
    "funciona con mi plataforma",
    "compatible con mi sistema",
    "compatible con mi plataforma",
    // SDK
    "necesito un sdk",
    "necesito sdk",
    "hay sdk",
    "tiene sdk",
    "requiere sdk",
    "sin sdk",
    // Desarrollador y programación
    "necesito un desarrollador",
    "necesito desarrollador",
    "hace falta un desarrollador",
    "hace falta desarrollador",
    "hace falta programar",
    "falta programar",
    "hace falta desarrollo",
    "requiere desarrollo",
    "sin desarrollador",
    "sin programador",
    "sin programar",
    "sin c\xF3digo",
    "sin codigo",
    "necesito programar",
    "necesito saber programar",
    // Tiempo de implementación
    "cu\xE1nto tarda implementarlo",
    "cuanto tarda implementarlo",
    "tarda implementarlo",
    "cu\xE1nto tarda la integraci\xF3n",
    "cuanto tarda la integracion",
    "tiempo de implementaci\xF3n",
    "tiempo de implementacion",
    "cu\xE1nto tiempo tarda",
    "cuanto tiempo tarda",
    "cu\xE1nto lleva implementarlo",
    "cuanto lleva implementarlo",
    // Smart Proxy
    "smart proxy",
    "smart proxies"
  ],
  answer: "S\xED. Ubyca dispone de una API REST que permite validar presencia f\xEDsica desde cualquier aplicaci\xF3n, backend o plataforma web \u2014 sin SDK propietario ni infraestructura especial. Tu sistema llama a un endpoint HTTP, recibe la validaci\xF3n en menos de 80 ms y decide qu\xE9 hacer con ella. Para casos sin c\xF3digo: Smart Proxies envuelven una URL existente con validaci\xF3n de presencia geogr\xE1fica sin modificar tu plataforma \u2014 configurables desde Studio sin escribir una l\xEDnea. Para integraci\xF3n personalizada: tu equipo t\xE9cnico conecta la API con cualquier backend, app iOS o Android, o sistema web mediante llamadas HTTP est\xE1ndar. No existe SDK nativo oficial \u2014 se usa cualquier cliente HTTP. El esfuerzo depende del caso: un Smart Proxy puede activarse en horas; una integraci\xF3n backend completa, de un d\xEDa a una semana.",
  tags: ["API", "Studio", "Smart Proxies"]
};
var productFaqs = [
  faqWhatIsUbyca,
  faqCapabilities,
  faqAppIntegration,
  faqStadium,
  faqIndoor,
  faqMonitoring,
  faqVsQR,
  faqVsGoogleAnalytics,
  faqNoHardware,
  faqApiIntegration
];

// src/knowledge/business-goals.ts
var goalMarketing = {
  id: "goal-marketing",
  title: "Marketing geolocalizado y campa\xF1as f\xEDsico-digitales",
  matchKeywords: [
    "hacer marketing",
    "quiero hacer marketing",
    "estrategia de marketing",
    "acciones de marketing",
    "marketing digital",
    "marketing para mi negocio",
    "marketing territorial",
    "marketing con ubicaci\xF3n",
    "campa\xF1a de marketing",
    "campa\xF1a de publicidad",
    "hacer una campa\xF1a",
    "lanzar una campa\xF1a",
    "promocionar mi negocio",
    "promocionar negocio",
    "publicidad para mi negocio",
    "dar a conocer mi negocio",
    "llegar a mis clientes",
    "comunicarme con clientes",
    "promoci\xF3n geolocalizada",
    "campa\xF1as de proximidad"
  ],
  solution: "Marketing sin datos de presencia real es publicidad a ciegas. Puedes vincular tus campa\xF1as directamente a qui\xE9n estuvo f\xEDsicamente en el punto de venta, evento o zona que definas: el contenido, cup\xF3n o mensaje se activa solo cuando el consumidor est\xE1 presente. Mides cu\xE1ntas personas interactuaron con la campa\xF1a desde cada punto, cu\xE1nto tiempo permanecieron y en qu\xE9 horarios. El resultado: marketing medible en t\xE9rminos de presencia real, no de clics o impresiones.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"]
};
var goalAttractCustomers = {
  id: "goal-attract-customers",
  title: "Atraer clientes y generar tr\xE1fico al local",
  matchKeywords: [
    "atraer m\xE1s clientes",
    "atraer nuevos clientes",
    "captar nuevos clientes",
    "conseguir m\xE1s clientes",
    "generar m\xE1s tr\xE1fico",
    "aumentar visitas al local",
    "m\xE1s clientes al local",
    "aumentar afluencia",
    "que vengan m\xE1s clientes",
    "que entren m\xE1s personas",
    "c\xF3mo conseguir m\xE1s clientes",
    "c\xF3mo atraer personas",
    "convertir tr\xE1fico en clientes",
    "m\xE1s personas que entren",
    "atraer personas al local",
    "captar personas cercanas",
    // Formas conjugadas y variantes
    "atraigo m\xE1s clientes",
    "atraigo mas clientes",
    "c\xF3mo atraigo m\xE1s",
    "como atraigo mas",
    "c\xF3mo atraigo clientes",
    "como atraigo clientes",
    "llevo m\xE1s gente",
    "llevo mas gente",
    "llevar m\xE1s gente a mis tiendas",
    "llevar mas gente a mis tiendas",
    "llevar gente a mis sucursales",
    "m\xE1s gente en mis locales",
    "mas gente en mis locales",
    "incremento el tr\xE1fico",
    "incremento el trafico",
    "incrementar el tr\xE1fico en mis locales",
    "incrementar el trafico en mis locales",
    "incrementar afluencia",
    // Conjugaciones primera persona
    "capto clientes",
    "capto m\xE1s clientes",
    "capto mas clientes",
    "capto personas",
    "capto m\xE1s personas",
    "capto mas personas",
    "genero tr\xE1fico",
    "genero trafico",
    "genero m\xE1s tr\xE1fico",
    "genero mas trafico",
    "llevo personas al local",
    "llevo m\xE1s personas",
    "llevo mas personas"
  ],
  solution: "La gente ya est\xE1 pasando cerca de tu local. El reto es convertir ese tr\xE1fico en visitas reales. Puedes activar una promoci\xF3n, mensaje o beneficio exclusivo en tu sitio web o app cuando alguien entra al radio del local \u2014 visible en ese momento, no despu\xE9s. Mides cu\xE1ntas personas entraron, en qu\xE9 horarios hay m\xE1s afluencia y cu\xE1nto tiempo permanecieron, para optimizar cu\xE1ndo y c\xF3mo impactar. La activaci\xF3n ocurre cuando el usuario ya est\xE1 cerca e interact\xFAa con la experiencia \u2014 no es notificaci\xF3n push.",
  capabilities: ["geopoints", "presence", "analytics", "smart-proxies"]
};
var goalIncreaseSales = {
  id: "goal-increase-sales",
  title: "Aumentar ventas con presencia f\xEDsica y experiencias geolocalizadas",
  matchKeywords: [
    "vender m\xE1s",
    "aumentar ventas",
    "incrementar ventas",
    "m\xE1s ventas",
    "impulsar ventas",
    "mejorar ventas",
    "quiero vender m\xE1s",
    "c\xF3mo vendo m\xE1s",
    "aumentar mis ventas",
    "subir las ventas",
    "incrementar conversi\xF3n",
    "aumentar conversi\xF3n",
    "mejorar mis resultados comerciales",
    "m\xE1s ingresos",
    "generar m\xE1s ingresos",
    "mejorar el rendimiento comercial",
    // Variantes con artículo y formas conjugadas
    "aumentar las ventas",
    "aumentar las ventas en mi tienda",
    "c\xF3mo aumento las ventas",
    "como aumento las ventas",
    "c\xF3mo aumento mis ventas",
    "como aumento mis ventas",
    "mejorar los resultados",
    "mejorar resultados de mi local",
    "mejorar resultados del local",
    "mejorar los resultados de mi local",
    "generar mas ingresos",
    "m\xE1s ventas en mi tienda",
    "mas ventas en mi tienda",
    // Conjugaciones primera persona
    "aumento ventas",
    "impulso ventas",
    "impulso mis ventas",
    "impulso las ventas",
    "incremento ingresos",
    "incremento mis ingresos",
    "genero m\xE1s ventas",
    "genero mas ventas"
  ],
  solution: "Vender m\xE1s en tu local f\xEDsico pasa por dos cosas: saber qu\xE9 clientes tienes de verdad y aprovechar el momento en que est\xE1n presentes. Puedes activar promociones exclusivas justo cuando el cliente llega al punto de venta, medir cu\xE1ntas personas entran y en qu\xE9 horarios hay m\xE1s tr\xE1fico, y dise\xF1ar incentivos que conviertan visitas en compras. Con datos reales de comportamiento en tu local \u2014 qui\xE9n entra, cu\xE1nto permanece, en qu\xE9 horarios \u2014 ajustas tu estrategia con evidencia, no con intuici\xF3n.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"]
};
var goalInteractiveGame = {
  id: "goal-interactive-game",
  title: "Juegos geolocalizados y experiencias interactivas en terreno",
  matchKeywords: [
    "juego",
    "hacer un juego",
    "quiero hacer un juego",
    "crear un juego",
    "puedo hacer un juego",
    "juego geolocalizado",
    "juego en terreno",
    "juego en el mapa",
    "juego al aire libre",
    "juego urbano",
    "juego interactivo",
    "gymkhana",
    "yincana",
    "gimkana",
    "caza del tesoro",
    "cazatesoros",
    "b\xFAsqueda del tesoro",
    "juego de pistas",
    "pistas geolocalizadas",
    "trivial geolocalizado",
    "quiz en terreno",
    "din\xE1mica al aire libre",
    "din\xE1mica en terreno",
    "actividad interactiva",
    "actividad en terreno",
    "desaf\xEDo geolocalizado",
    "desaf\xEDo en terreno",
    "competencia geolocalizada",
    "competencia en terreno",
    "experiencia interactiva en terreno",
    "recorrido con desaf\xEDos",
    "recorrido gamificado",
    // Analogía Pokémon GO
    "pok\xE9mon go",
    "pokemon go",
    "parecido a pok\xE9mon",
    "tipo pok\xE9mon go",
    "similar a pokemon",
    "juego tipo pokemon",
    "como pokemon"
  ],
  solution: "S\xED. Puedes construir juegos, gymkhanas, cazatesoros o din\xE1micas donde los participantes deben estar f\xEDsicamente en cada punto para avanzar \u2014 sin que puedan simular la ubicaci\xF3n desde casa. Tu aplicaci\xF3n desbloquea el siguiente desaf\xEDo, revela la pista o acumula los puntos solo cuando el usuario llega al \xE1rea real. Funciona para juegos urbanos, circuitos gamificados, recorridos con desaf\xEDos y cualquier din\xE1mica donde la presencia f\xEDsica sea la condici\xF3n para avanzar.",
  capabilities: ["geopoints", "presence", "api", "analytics"]
};
var goalImproveLoyalty = {
  id: "goal-improve-loyalty",
  title: "Fidelizaci\xF3n y retenci\xF3n de clientes presenciales",
  matchKeywords: [
    "fidelizar clientes",
    "fidelizar a mis clientes",
    "fidelizar a los clientes",
    "c\xF3mo fidelizo",
    "como fidelizo",
    "quiero fidelizar",
    "lograr que vuelvan",
    "que vuelvan mis clientes",
    "que regresen",
    "aumentar la frecuencia de visita",
    "la frecuencia de visita",
    "frecuencia de visitas",
    "incentivar visitas repetidas",
    "visitas repetidas",
    "que vuelvan a comprar",
    "que vuelvan a visitarme",
    "clientes recurrentes",
    "retenci\xF3n de clientes",
    "retener clientes",
    "fidelidad de clientes",
    "m\xE1s recurrencia",
    "mas recurrencia",
    "mayor frecuencia de visita",
    // Conjugaciones primera persona
    "premio clientes",
    "premio a mis clientes",
    "premio clientes frecuentes",
    "premio visitas",
    "clientes frecuentes",
    "incentivo que vuelvan",
    "incentivo visitas",
    "hago que vuelvan",
    "hago que regresen"
  ],
  solution: "La fidelizaci\xF3n real parte de saber qu\xE9 clientes vuelven, con qu\xE9 frecuencia y a qu\xE9 sucursales. Puedes reconocer autom\xE1ticamente cada visita de un cliente \u2014 sin que tenga que declarar d\xF3nde est\xE1 ni escanear nada \u2014 y premiarlo seg\xFAn su comportamiento real: cu\xE1ntas veces volvi\xF3, qu\xE9 sucursales distintas visit\xF3 o cu\xE1nto tiempo permaneci\xF3. Eso te permite dise\xF1ar beneficios que incentiven exactamente lo que quieres lograr \u2014 mayor frecuencia, mayor amplitud de visitas \u2014 con datos de comportamiento real, no estimaciones.",
  capabilities: ["geopoints", "presence", "analytics", "api", "integrations"]
};
var goalMeasureMarketingROI = {
  id: "goal-measure-marketing-roi",
  title: "Medir y demostrar el retorno real de campa\xF1as y activaciones",
  matchKeywords: [
    "justificar campa\xF1a",
    "justificar una campa\xF1a",
    "justifico la campa\xF1a",
    "c\xF3mo mido el impacto",
    "como mido el impacto",
    "medir el impacto",
    "medir el retorno",
    "el impacto de mi campa\xF1a",
    "el impacto de mi campana",
    "el impacto de mis campa\xF1as",
    "el impacto de mis campanas",
    "retorno de campa\xF1a",
    "roi de campa\xF1a",
    "roi de la campa\xF1a",
    "retorno de una campa\xF1a",
    "retorno de una campana",
    "saber si la activaci\xF3n funcion\xF3",
    "saber si la activacion funciono",
    "si la campa\xF1a tuvo impacto",
    "si la campana tuvo impacto",
    "medir mis campa\xF1as",
    "medir mis campanas",
    "si funcion\xF3 la campa\xF1a",
    "si funciono la campana",
    "probar que la campa\xF1a funcion\xF3",
    "probar que funciono",
    "evidencia de campa\xF1a",
    "evidencia de la activacion",
    // Conjugaciones primera persona
    "justifico una inversi\xF3n",
    "justifico una inversion",
    "justifico el gasto",
    "justifico inversi\xF3n",
    "justifico inversion",
    "justifico marketing",
    "mido el retorno",
    "mido el impacto",
    "mido campa\xF1as",
    "mido campanas",
    "mido mis campa\xF1as",
    "mido mis campanas",
    "demuestro resultados",
    "demuestro impacto",
    "demuestro el impacto"
  ],
  solution: "Para justificar una campa\xF1a presencial o demostrar que una activaci\xF3n funcion\xF3, necesitas datos de presencia real \u2014 no alcance ni impresiones. Puedes saber exactamente cu\xE1ntas personas estuvieron f\xEDsicamente en cada punto de campa\xF1a, en qu\xE9 horarios y cu\xE1nto tiempo permanecieron. Esos registros son exportables y presentables como evidencia objetiva: costo por interacci\xF3n real, no costo por clic. El contenido se activa solo cuando alguien est\xE1 en el lugar \u2014 lo que garantiza que cada registro corresponde a presencia verificada.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"]
};
var goalImproveOperations = {
  id: "goal-improve-operations",
  title: "Control y auditor\xEDa de equipos y operaciones en terreno",
  matchKeywords: [
    "controlar equipos en terreno",
    "controlar equipos",
    "controlar a mi equipo",
    "controlar mi equipo en terreno",
    "equipos en terreno",
    "equipos en campo",
    "personal en campo",
    "verificar visitas de mi equipo",
    "verificar que se realizaron",
    "saber si cumplieron la ruta",
    "saber si cumplieron",
    "cumplieron la ruta",
    "cumplimiento de ruta",
    "cumplimiento operativo",
    "auditar personal",
    "auditor\xEDa de personal",
    "auditoria de personal",
    "auditar operaciones",
    "auditar a mi equipo",
    "supervisar equipos en terreno",
    "control de equipos en terreno",
    "verificar rondas",
    "verificar recorridos",
    "saber si el equipo fue",
    "saber si fueron al lugar",
    // Conjugaciones primera persona
    "controlo mis t\xE9cnicos",
    "controlo t\xE9cnicos",
    "controlo a mis t\xE9cnicos",
    "controlo tecnicos",
    "controlo mis tecnicos",
    "controlo a mis tecnicos",
    "hago m\xE1s eficiente",
    "hago mas eficiente",
    "hago m\xE1s eficiente mi operaci\xF3n",
    "hago mas eficiente mi operacion",
    "reduzco errores",
    "reduzco errores en terreno",
    "controlo rutas",
    "controlo mis rutas",
    "audito personal"
  ],
  solution: "Saber si tu equipo realmente estuvo donde deb\xEDa es dif\xEDcil sin depender de reportes manuales que pueden falsificarse. Puedes confirmar autom\xE1ticamente que t\xE9cnicos, vendedores, contratistas o cuadrillas llegaron a los puntos asignados \u2014 con hora exacta y tiempo de permanencia \u2014 sin partes de papel ni declaraciones del propio equipo. El supervisor ve la cobertura real y puede auditar cualquier per\xEDodo hist\xF3rico. Los datos son exportables para integraci\xF3n con sistemas de gesti\xF3n existentes.",
  capabilities: ["geopoints", "presence", "analytics", "api"]
};
var goalChooseLocation = {
  id: "goal-choose-location",
  title: "Elegir la mejor ubicaci\xF3n para abrir o expandir un negocio",
  matchKeywords: [
    "d\xF3nde abrir mi negocio",
    "donde abrir mi negocio",
    "d\xF3nde abrir una tienda",
    "donde abrir una tienda",
    "c\xF3mo elegir una ubicaci\xF3n",
    "como elegir una ubicacion",
    "c\xF3mo elijo d\xF3nde abrir",
    "como elijo donde abrir",
    "la mejor ubicaci\xF3n para",
    "la mejor ubicacion para",
    "la mejor ubicaci\xF3n",
    "la mejor ubicacion",
    "validar una zona antes de invertir",
    "validar una zona",
    "validar zona antes de abrir",
    "elegir d\xF3nde expandirme",
    "elegir donde expandirme",
    "d\xF3nde me conviene abrir",
    "donde me conviene abrir",
    "qu\xE9 zona elegir",
    "que zona elegir",
    "mejor zona para abrir",
    "cu\xE1l es la mejor zona",
    "cual es la mejor zona",
    // Conjugaciones primera persona y términos de expansión
    "valido una zona",
    "valido la zona",
    "pr\xF3xima sucursal",
    "proxima sucursal",
    "pr\xF3xima tienda",
    "proxima tienda",
    "zona con potencial",
    "zona rentable",
    "zona m\xE1s rentable",
    "zona mas rentable"
  ],
  solution: "Elegir d\xF3nde abrir o expandirse suele basarse en intuici\xF3n o en datos de mercado indirectos. Puedes medir cu\xE1ntas personas circulan realmente por las zonas candidatas, en qu\xE9 horarios se concentra el tr\xE1fico y cu\xE1nto tiempo permanecen \u2014 y comparar varias ubicaciones entre s\xED con datos observacionales concretos. Eso convierte una decisi\xF3n de inversi\xF3n en algo respaldado por evidencia real de comportamiento, no en una apuesta.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"]
};
var goalCustomerExperience = {
  id: "goal-customer-experience",
  title: "Personalizaci\xF3n y experiencia presencial del cliente",
  matchKeywords: [
    // Mejorar la experiencia
    "mejorar la experiencia",
    "mejorar experiencia en tienda",
    "mejorar la experiencia en tienda",
    "mejorar la experiencia en el local",
    "experiencia de cliente",
    "experiencia del cliente",
    "la experiencia de clientes",
    "experiencia en tienda",
    "experiencia en el local",
    "experiencia presencial",
    // Personalización
    "personalizar la experiencia",
    "experiencia personalizada",
    "personalizaci\xF3n por ubicaci\xF3n",
    "personalizacion por ubicacion",
    "experiencia diferente",
    "experiencia diferente en mis sucursales",
    // Sorprender / Bienvenida
    "sorprender al cliente",
    "sorprender a mis clientes",
    "sorprender a los clientes",
    "bienvenida autom\xE1tica",
    "bienvenida automatica",
    "mensaje de bienvenida",
    "dar una bienvenida",
    // Contenido contextual y activaciones al llegar
    "contenido al llegar",
    "contenido contextual",
    "cuando alguien llega",
    "mostrar contenido cuando",
    "mostrar contenido al llegar",
    "mostrar algo al llegar",
    "activar contenido al llegar",
    "activar contenido cuando",
    "activar al llegar",
    "experiencia contextual",
    "experiencia geolocalizada",
    "experiencia seg\xFAn ubicaci\xF3n",
    "experiencia segun ubicacion",
    // Hacer la visita más atractiva
    "mejorar la visita",
    "visita m\xE1s atractiva",
    "visita mas atractiva",
    "hacer la visita m\xE1s atractiva",
    "hacer la visita mas atractiva",
    "hacer m\xE1s atractiva la visita",
    "hacer mas atractiva la visita",
    // Conjugaciones primera persona
    "personalizo la experiencia",
    "personalizo mi experiencia",
    "sorprendo a mis clientes",
    "sorprendo al cliente",
    "doy la bienvenida",
    "doy una bienvenida",
    "muestro contenido al llegar",
    "muestro algo al llegar",
    "mejoro la experiencia",
    "mejoro la visita",
    "hago m\xE1s atractiva la visita",
    "hago mas atractiva la visita"
  ],
  solution: "Puedes transformar la llegada de un cliente a tu local en un momento memorable: cuando alguien entra al radio del local, puedes activar autom\xE1ticamente un mensaje de bienvenida, contenido exclusivo de esa ubicaci\xF3n, una promoci\xF3n del d\xEDa o informaci\xF3n contextual relevante \u2014 sin que el cliente tenga que buscar nada ni declarar d\xF3nde est\xE1. El contenido puede ser diferente por local, por zona o por horario. La activaci\xF3n ocurre directamente en tu sitio web o app, sin instalar nada en el espacio f\xEDsico.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"]
};
var businessGoals = [
  goalMarketing,
  goalAttractCustomers,
  goalIncreaseSales,
  goalInteractiveGame,
  goalImproveLoyalty,
  goalMeasureMarketingROI,
  goalImproveOperations,
  goalChooseLocation,
  goalCustomerExperience
];

// src/knowledge/index.ts
var knowledge = {
  product,
  capabilities: [
    studio,
    api,
    geopoints,
    presence,
    analytics,
    liveVisits,
    spatialIntelligence,
    smartProxies,
    integrations
  ],
  useCases: [
    fieldSalesVisits,
    fieldSalesSupervision,
    fieldSalesDelivery,
    eventsAccess,
    eventsExperience,
    eventsAnalytics,
    retailDwellTime,
    retailPromotion,
    retailSmartProxy,
    loyaltyPhysicalVisits,
    loyaltyMultiLocation,
    loyaltyEngagement,
    tourismRoutes,
    tourismVerification,
    tourismCityAnalytics,
    educationAttendance,
    educationCampusExperience,
    educationFieldTrips,
    municipalitiesPublicServices,
    municipalitiesUrbanAnalysis,
    municipalitiesInspection,
    realEstateVisits,
    realEstateOpenHouse,
    realEstatePortfolio,
    realEstateBuilding,
    operationsSafety,
    operationsMaintenanceRoutes,
    operationsFleetTracking,
    healthHomeVisits,
    healthFieldWorkers,
    healthOutpatient,
    brandActivationCampaign,
    brandActivationLaunch,
    brandActivationExperience,
    crmIntegration,
    localBusinessProximityPromo,
    localBusinessFootfall,
    localBusinessContextualMessage,
    urbanMobilityStudy,
    fairMovementAnalysis,
    geolocationARExperience,
    ecommerceIntegration,
    geolocatedCatalog,
    presenceRegistration,
    spatialConcentration
  ],
  limitations,
  faqs: productFaqs,
  businessGoals
};

// src/knowledge/solutionMatcher.ts
function normalize(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function scoreKeywords(patterns, lower) {
  return patterns.filter((k) => lower.includes(normalize(k))).reduce((sum, k) => sum + (normalize(k).includes(" ") ? 2 : 1), 0);
}
function detectSubIntention(subIntentions, lower) {
  let best = null;
  let bestScore = 0;
  for (const sub of subIntentions) {
    const score = scoreKeywords(sub.patterns, lower);
    if (score > bestScore) {
      bestScore = score;
      best = sub;
    }
  }
  return best;
}
function scoreWithMatches(patterns, lower) {
  const matched = patterns.filter((k) => lower.includes(normalize(k)));
  const score = matched.reduce((sum, k) => sum + (normalize(k).includes(" ") ? 2 : 1), 0);
  return { score, matched };
}
function auditMatch(query) {
  const normalized = normalize(query);
  const candidates = [];
  for (const faq of knowledge.faqs) {
    const { score, matched } = scoreWithMatches(faq.questionPatterns, normalized);
    candidates.push({ id: faq.id, title: faq.title, type: "FAQ", score, matchedKeywords: matched });
  }
  for (const goal of knowledge.businessGoals) {
    const { score, matched } = scoreWithMatches(goal.matchKeywords, normalized);
    candidates.push({ id: goal.id, title: goal.title, type: "BusinessGoal", score, matchedKeywords: matched });
  }
  for (const uc of knowledge.useCases) {
    const { score, matched } = scoreWithMatches(uc.matchKeywords, normalized);
    candidates.push({ id: uc.id, title: uc.title, type: "UseCase", score, matchedKeywords: matched });
  }
  const typePriority = { FAQ: 3, BusinessGoal: 2, UseCase: 1 };
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return typePriority[b.type] - typePriority[a.type];
  });
  const top3 = candidates.filter((c) => c.score > 0).slice(0, 3);
  const winner = top3.length > 0 ? top3[0] : null;
  let subIntentionId;
  let subIntentionSolution;
  if (winner?.type === "UseCase") {
    const uc = knowledge.useCases.find((u) => u.id === winner.id);
    if (uc?.subIntentions?.length) {
      const sub = detectSubIntention(uc.subIntentions, normalized);
      if (sub) {
        subIntentionId = sub.id;
        subIntentionSolution = sub.solution;
      }
    }
  }
  return { query, normalized, top3, winner, isFallback: winner === null, subIntentionId, subIntentionSolution };
}

// scripts/audit-vs-ga.ts
var TARGET = "faq-vs-google-analytics";
var required = [
  { q: "\xBFCu\xE1l es la diferencia entre Ubyca y Google Analytics?" },
  { q: "\xBFPor qu\xE9 usar Ubyca si ya tengo Google Analytics?" },
  { q: "\xBFGoogle Analytics no hace lo mismo?" },
  { q: "\xBFQu\xE9 aporta Ubyca que no tenga GA4?" },
  { q: "\xBFEs parecido a Google Analytics?" },
  { q: "\xBFReemplaza Google Analytics?" },
  { q: "\xBFUbyca compite con Google Analytics?" }
];
var extra = [
  "\xBFPara qu\xE9 sirve si ya tengo Google Analytics?",
  "\xBFEs lo mismo que Google Analytics?",
  "\xBFQu\xE9 aporta Ubyca que no tenga Google Analytics?",
  "\xBFSustituye Google Analytics?"
];
var regression = [
  { q: "\xBFUbyca vs QR?", expected: "faq-vs-qr" },
  { q: "\xBFC\xF3mo mido el retorno de mis campa\xF1as?", expected: "goal-measure-marketing-roi" },
  { q: "\xBFTiene API?", expected: "faq-api-integration" },
  { q: "\xBFNecesito hardware?", expected: "faq-no-hardware" },
  { q: "\xBFC\xF3mo fidelizo a mis clientes?", expected: "goal-improve-loyalty" },
  { q: "\xBFC\xF3mo mido el impacto de mis campa\xF1as?", expected: "goal-measure-marketing-roi" }
];
console.log("\u2500\u2500 TABLA DE VALIDACI\xD3N REQUERIDA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
var pass = 0;
for (const { q } of required) {
  const r = auditMatch(q);
  const id = r.winner?.id ?? "DEFAULT";
  const score = r.winner?.score ?? 0;
  const ok = id === TARGET;
  if (ok) pass++;
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(" | ") ?? "\u2014";
  console.log(`${ok ? "\u2713" : "\u2717"} [${id}] score=${score}`);
  console.log(`   Q: ${q}`);
  console.log(`   keys: ${keys}`);
}
console.log(`
${pass}/${required.length} pasan \u2192 ${TARGET}`);
console.log("\n\u2500\u2500 COBERTURA ADICIONAL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
for (const q of extra) {
  const r = auditMatch(q);
  const id = r.winner?.id ?? "DEFAULT";
  const score = r.winner?.score ?? 0;
  const ok = id === TARGET;
  const keys = r.winner?.matchedKeywords?.slice(0, 2).join(" | ") ?? "\u2014";
  console.log(`${ok ? "\u2713" : "\u2014"} [${id}] score=${score}  "${q}"`);
  if (keys !== "\u2014") console.log(`   keys: ${keys}`);
}
console.log("\n\u2500\u2500 REGRESI\xD3N \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
var regPass = 0;
for (const { q, expected } of regression) {
  const r = auditMatch(q);
  const id = r.winner?.id ?? "DEFAULT";
  const ok = id === expected;
  if (ok) regPass++;
  console.log(`${ok ? "\u2713" : "\u2717"} [${id}]  "${q}"`);
  if (!ok) console.log(`   expected: ${expected}`);
}
console.log(`
${regPass}/${regression.length} regresiones OK`);
