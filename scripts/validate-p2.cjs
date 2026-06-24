"use strict";

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
  solution: "Puedes ver en tiempo real qu\xE9 zonas est\xE1 cubriendo tu equipo y cu\xE1l es la cobertura real \u2014 sin que nadie haga check-ins manuales. Cuando cada integrante est\xE1 autenticado en tu app y su dispositivo valida presencia en la zona asignada, tu sistema puede asociar ese evento al perfil del empleado correspondiente via API. El historial completo de cobertura por zona y horario queda disponible para revisi\xF3n posterior.",
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
    "solo en tienda",
    // Dentro del local / validación de presencia
    "solo funcione dentro del local",
    "funcione dentro del local",
    "solo dentro del local",
    "solo en el local",
    "dentro de la tienda",
    "que funcione dentro",
    "funcione solo dentro",
    // Clientes presentes en el momento
    "clientes que est\xE1n en el local",
    "est\xE1n en el local en ese momento",
    "clientes en el local en ese momento",
    "presentes en el local",
    "solo a los clientes que est\xE1n",
    "en el local en ese momento",
    // Descriptores naturales
    "promoci\xF3n especial",
    "oferta exclusiva en tienda",
    "descuento solo en tienda",
    "beneficio solo en tienda"
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
  solution: "S\xED. Puedes registrar eventos de presencia verificada en cualquier sucursal de la cadena \u2014 sin que el usuario tenga que declarar d\xF3nde est\xE1 ni escanear nada. Cuando tu sistema de loyalty gestiona la identidad de tus usuarios (login propio), puede asociar cada evento de presencia al perfil correspondiente via API: cu\xE1ntas visitas se registraron en cada sucursal, con qu\xE9 frecuencia y en qu\xE9 horarios. Eso permite premiar la frecuencia y la amplitud de visitas seg\xFAn criterios configurables en tu plataforma. Ubyca registra el evento de presencia; tu sistema determina a qui\xE9n pertenece y act\xFAa en consecuencia.",
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
    // Patrones inequívocos de educación (multi-palabra = 2pts)
    "registro de asistencia",
    "control de asistencia",
    "registrar asistencia",
    "controlar asistencia",
    "gestionar asistencia",
    "validar asistencia",
    "asistencia de alumnos",
    "asistencia escolar",
    "asistencia universitaria",
    "asistencia estudiantil",
    "asistencia en clases",
    "asistencia en clase",
    "asistencia en campus",
    "asistencia de estudiantes",
    "presencia de estudiantes",
    "presencia de alumnos",
    "alumno presente",
    "pasar lista",
    // Entidades educativas (single-palabra, señal fuerte)
    "campus universitario",
    "escuela",
    "universidad",
    "colegio",
    "estudiante",
    "alumno"
    // NOTA: 'asistencia' bare fue eliminado — era demasiado amplio y
    // causaba colisiones con gimnasios, sucursales y contextos comerciales.
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
  problem: "Una inmobiliaria necesita saber cu\xE1ntos eventos de visita ocurrieron en cada propiedad, cu\xE1nto tiempo permanecieron los interesados y qu\xE9 propiedades generan m\xE1s inter\xE9s real. Los registros manuales del corredor son incompletos y no permiten comparar el inter\xE9s real entre propiedades.",
  solution: "Puedes saber cu\xE1ntos eventos de visita se registraron en cada propiedad, cu\xE1nto tiempo permanecieron los interesados y qu\xE9 propiedades acumulan mayor inter\xE9s \u2014 datos reales que informan el precio y la estrategia de marketing, sin depender del corredor. La presencia se verifica autom\xE1ticamente en el servidor.",
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
  solution: "S\xED. Puedes crear una experiencia para tu sala de ventas u open house donde el cat\xE1logo, planos y precios se activan autom\xE1ticamente cuando el visitante llega al proyecto \u2014 sin que el material circule fuera del sitio ni llegue a quien no estuvo presente. Registras cu\xE1ntos eventos de visita se produjeron, cu\xE1nto tiempo permaneci\xF3 cada uno y en qu\xE9 jornadas hubo mayor afluencia \u2014 datos reales, no reportes del corredor. Todo se configura desde Studio sin modificar tu sitio web actual y sin que el visitante tenga que instalar nada.",
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
    "unidades en venta",
    // Se activan al llegar
    "planos y precios",
    "planos y precios se activen",
    "se activen autom\xE1ticamente",
    "se activen al llegar",
    "activen cuando llegue",
    "activen cuando llega",
    "cuando un interesado llega",
    "interesado llega al proyecto",
    "cuando llegue al proyecto",
    "cuando lleguen al proyecto",
    // Material que circule solo en el proyecto
    "material circule fuera",
    "material exclusivo",
    "circule fuera del proyecto",
    "que no circule fuera",
    "material de open house",
    "contenido del open house"
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
  problem: "Una administraci\xF3n de edificio u oficina comercial necesita registrar qu\xE9 \xE1reas registran actividad, con qu\xE9 frecuencia y cu\xE1nto tiempo permanecen los ocupantes \u2014 sin instalar hardware costoso.",
  solution: "Puedes registrar eventos de presencia en cada \xE1rea del edificio, cu\xE1ndo ocurren y cu\xE1nto tiempo duran \u2014 sin hardware de acceso, lectores de tarjetas ni infraestructura fija. La presencia se valida v\xEDa API directamente desde el dispositivo del usuario. Para saber a qui\xE9n corresponde cada evento, el sistema del edificio debe gestionar la autenticaci\xF3n de los usuarios e incluir el identificador al llamar la API. Los datos de uso informan decisiones sobre amenities, seguridad y mantenimiento.",
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
    "promociones cuando pasen",
    // Activación al llegar (no solo al pasar)
    "cuando alguien llegue",
    "cuando llegue al local",
    "al llegar al local",
    "al llegar a mi tienda",
    "al llegar al negocio",
    // Ofertas que aparecen automáticamente
    "aparezca autom\xE1ticamente",
    "aparezca al llegar",
    "le aparezca",
    "oferta del d\xEDa",
    "oferta del dia",
    "oferta al llegar",
    "mostrar oferta al llegar",
    "autom\xE1ticamente al llegar",
    "autom\xE1ticamente cuando llegue",
    "aparezca cuando llegue",
    "mostrar promoci\xF3n al llegar"
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
    "contenido al acercarse",
    // Contenido diferente según ubicación
    "contenido diferente",
    "contenido diferente por zona",
    "contenido diferente dependiendo",
    "dependiendo de donde est\xE9",
    "dependiendo de donde este",
    "contenido seg\xFAn d\xF3nde est\xE9",
    // Solo aparezca cuando alguien entre
    "solo aparezca cuando",
    "cuando alguien entre",
    "solo aparezca",
    "aparezca cuando alguien entre",
    "informaci\xF3n solo aparezca",
    "que cierta informaci\xF3n",
    // Desbloquear información por zona
    "desbloquear informaci\xF3n",
    "informaci\xF3n exclusiva por ubicaci\xF3n",
    "contenido exclusivo en el lugar"
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
    "que agrega ubyca",
    // Desbloquear contenido por ubicación
    "desbloquear contenido",
    "desbloquear por ubicaci\xF3n",
    "desbloquear por ubicacion",
    "desbloquear al llegar",
    "\xFAnicamente cuando llegue",
    "unicamente cuando llegue",
    "persona llegue a una ubicaci\xF3n",
    "persona llegue a una ubicacion",
    "contenido desbloqueado",
    "acceso desbloqueado por ubicaci\xF3n"
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
        "funciones disponibles en un lugar",
        // Desbloquear contenido por ubicación
        "desbloquear contenido",
        "desbloquear al llegar",
        "\xFAnicamente cuando llegue",
        "unicamente cuando llegue",
        "persona llegue a una ubicaci\xF3n",
        "persona llegue a una ubicacion"
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
var faqWhyUbyca = {
  id: "faq-why-ubyca",
  title: "Por qu\xE9 implementar Ubyca: valor, beneficios y diferenciador",
  questionPatterns: [
    // Por qué usar / implementar
    "por qu\xE9 deber\xEDa usar ubyca",
    "por que deberia usar ubyca",
    "por qu\xE9 deber\xEDa implementar ubyca",
    "por que deberia implementar ubyca",
    "por qu\xE9 implementar ubyca",
    "por que implementar ubyca",
    "por qu\xE9 contratar ubyca",
    "por que contratar ubyca",
    "por qu\xE9 ubyca",
    "por que ubyca",
    // Qué gano / beneficio
    "qu\xE9 gano con ubyca",
    "que gano con ubyca",
    "qu\xE9 gano implement\xE1ndolo",
    "que gano implementandolo",
    "qu\xE9 beneficio tiene para mi negocio",
    "que beneficio tiene para mi negocio",
    "beneficios de ubyca",
    "beneficio de ubyca",
    "ventajas de ubyca",
    "ventaja de ubyca",
    // Por qué cambiar
    "por qu\xE9 no seguir haciendo lo mismo",
    "por que no seguir haciendo lo mismo",
    "por qu\xE9 cambiar lo que hago",
    "por que cambiar lo que hago",
    "qu\xE9 cambia realmente con ubyca",
    "que cambia realmente con ubyca",
    "qu\xE9 cambia con ubyca",
    "que cambia con ubyca",
    // Qué problema / valor / propuesta
    "qu\xE9 problema resuelve",
    "que problema resuelve",
    "qu\xE9 valor aporta ubyca",
    "que valor aporta ubyca",
    "valor de ubyca",
    "propuesta de valor de ubyca",
    "qu\xE9 aporta ubyca",
    "que aporta ubyca",
    // Justificación y ROI
    "justificar la inversi\xF3n en ubyca",
    "justificar la inversion en ubyca",
    "justificar implementar ubyca",
    "justificar ubyca",
    "vale la pena ubyca",
    "vale la pena implementar",
    "me conviene ubyca",
    "conviene usar ubyca",
    "retorno de ubyca",
    "roi de ubyca"
  ],
  answer: "La mayor\xEDa de las herramientas te dicen qu\xE9 hizo alguien en tu sitio web. Ubyca te dice qu\xE9 hizo alguien en el mundo f\xEDsico: si estuvo realmente en tu local, cu\xE1nto tiempo permaneci\xF3, en qu\xE9 horarios hay m\xE1s actividad y qu\xE9 ubicaciones generan m\xE1s valor. El resultado es visibilidad completa sobre lo que ocurre en tus puntos f\xEDsicos \u2014 sin depender de reportes manuales, declaraciones del personal ni estimaciones. Con esos datos puedes tomar mejores decisiones de inversi\xF3n, demostrar el impacto real de tus campa\xF1as presenciales, controlar equipos en terreno y optimizar la experiencia de quien visita tus espacios. Lo que cambia con Ubyca es que el mundo f\xEDsico deja de ser una caja negra.",
  tags: ["Presencia f\xEDsica", "Analytics", "GeoPoints", "Studio"]
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
  faqWhyUbyca,
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
  solution: "Si el objetivo es atraer m\xE1s personas a una ubicaci\xF3n f\xEDsica, el primer paso es saber qu\xE9 acciones realmente generan visitas y cu\xE1les no. Sin esa informaci\xF3n, las campa\xF1as y promociones se dise\xF1an a ciegas. Con datos reales de presencia puedes medir qu\xE9 mensajes o incentivos efectivamente llevaron a alguien al local, en qu\xE9 horarios hay m\xE1s afluencia natural y qu\xE9 d\xEDas necesitan mayor impulso. El resultado: decisiones de activaci\xF3n basadas en comportamiento real, no en suposiciones sobre cu\xE1ndo y c\xF3mo impactar a tu audiencia.",
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
  solution: "Aumentar ventas en puntos f\xEDsicos requiere entender qu\xE9 ocurre realmente dentro del local: cu\xE1ntas personas entran, en qu\xE9 horarios hay m\xE1s tr\xE1fico, cu\xE1nto tiempo permanecen los visitantes y qu\xE9 acciones los convierten en compradores. Sin esos datos, las decisiones de promoci\xF3n, disposici\xF3n y horarios dependen de intuici\xF3n. Con informaci\xF3n real de comportamiento en tienda, puedes identificar los momentos de mayor oportunidad, dise\xF1ar incentivos precisos y ajustar la estrategia comercial con evidencia observable, no con estimaciones.",
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
  solution: "Un programa de fidelizaci\xF3n efectivo premia el comportamiento real: cu\xE1ntas visitas se registran en cada punto, con qu\xE9 frecuencia se producen y en qu\xE9 horarios. No cu\xE1ntos correos abri\xF3 un contacto ni cu\xE1ntos puntos acumul\xF3 en un formulario. Cuando los beneficios se basan en visitas presenciales verificadas, el programa incentiva exactamente lo que importa al negocio \u2014 mayor frecuencia de visita, mayor cobertura entre sucursales \u2014 y el usuario los recibe sin tener que escanear nada ni declarar que estuvo all\xED. Para asociar visitas a personas identificadas, el sistema de loyalty del cliente debe gestionar la identidad de sus usuarios y vincularla via API.",
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
  solution: "En operaciones con equipos distribuidos en terreno, el punto ciego habitual es no saber si las visitas realmente ocurrieron. Los reportes manuales dependen de la honestidad del equipo y no pueden verificarse a posteriori. Con registros autom\xE1ticos de presencia, cada visita queda documentada con hora de llegada y tiempo de permanencia, sin que el supervisor deba depender de lo que le informan. Es posible auditar cualquier per\xEDodo hist\xF3rico, identificar brechas en la cobertura de rutas y tomar decisiones correctivas con evidencia objetiva, no con percepciones.",
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
  solution: "Elegir entre ubicaciones candidatas para abrir o expandirse es una de las decisiones de mayor impacto y menor certeza en un negocio f\xEDsico. Los estudios de mercado dan una aproximaci\xF3n, pero no dicen cu\xE1ntas personas circulan realmente por cada zona en los horarios que importan. Con datos reales de comportamiento en las ubicaciones candidatas \u2014 tr\xE1fico por hora, tiempo de permanencia, distribuci\xF3n semanal \u2014 la decisi\xF3n pasa de ser una apuesta a ser un an\xE1lisis. Es posible comparar zonas en igualdad de condiciones y respaldar la elecci\xF3n con evidencia observable antes de invertir.",
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
  solution: "Cuando alguien entra a un local, tiene expectativas. Lo que diferencia una visita ordinaria de una experiencia memorable es que el espacio responda a su presencia de forma relevante y oportuna. Puedes ofrecer una bienvenida personalizada, una promoci\xF3n del d\xEDa, informaci\xF3n exclusiva de esa ubicaci\xF3n o contenido contextual \u2014 activado autom\xE1ticamente en el momento en que el cliente llega, sin que tenga que buscar nada ni declarar d\xF3nde est\xE1. El contenido puede variar por local, por zona o por horario, y se entrega a trav\xE9s de tu sitio web o app existente.",
  capabilities: ["geopoints", "presence", "smart-proxies", "analytics"]
};
var goalDecisionMaking = {
  id: "goal-decision-making",
  title: "Toma de decisiones ejecutivas basadas en datos de presencia",
  matchKeywords: [
    // Decisiones generales
    "tomar mejores decisiones",
    "tomar decisiones",
    "decisiones basadas en datos",
    "decision basada en datos",
    "tomar decisiones comerciales",
    "tomar decisiones de negocio",
    "decidir una estrategia",
    "validar una decisi\xF3n",
    "validar una decision",
    // Inversión y asignación de recursos
    "decidir d\xF3nde invertir",
    "decidir donde invertir",
    "saber d\xF3nde invertir",
    "saber donde invertir",
    "d\xF3nde invertir",
    "donde invertir",
    "asignar recursos",
    "asignaci\xF3n de recursos",
    "asignacion de recursos",
    "priorizar inversiones",
    "justificar inversiones",
    // Qué local / sucursal rinde más
    "qu\xE9 local funciona mejor",
    "que local funciona mejor",
    "qu\xE9 sucursal funciona mejor",
    "que sucursal funciona mejor",
    "cu\xE1l funciona mejor",
    "cual funciona mejor",
    "decidir qu\xE9 sucursal",
    "decidir que sucursal",
    // Estrategia y validación de hipótesis
    "validar una estrategia",
    "validar una hip\xF3tesis",
    "validar una hipotesis",
    // Expansión y crecimiento
    "d\xF3nde expandirse",
    "donde expandirse",
    "d\xF3nde crecer",
    "donde crecer",
    "decidir d\xF3nde abrir",
    "decidir donde abrir",
    // Identificar oportunidades
    "identificar oportunidades",
    "d\xF3nde est\xE1n las oportunidades",
    "donde estan las oportunidades",
    // Comparar y evaluar
    "comparar el desempe\xF1o",
    "comparar el desempeno",
    "comparar el rendimiento",
    "comparar el desempe\xF1o de",
    "comparar sucursales",
    "comparar locales",
    "comparar ubicaciones",
    "evaluar ubicaciones",
    "evaluar rendimiento",
    "elegir una ubicaci\xF3n",
    "elegir una ubicacion"
  ],
  solution: "Las decisiones m\xE1s costosas en un negocio con presencia f\xEDsica \u2014 d\xF3nde expandirse, qu\xE9 sucursales priorizar, qu\xE9 campa\xF1as escalar, d\xF3nde concentrar recursos \u2014 suelen tomarse con informaci\xF3n incompleta o basada en percepciones. El ant\xEDdoto es disponer de datos reales de comportamiento en cada ubicaci\xF3n: cu\xE1ntas personas estuvieron, cu\xE1nto tiempo, en qu\xE9 horarios y c\xF3mo evolucion\xF3 eso a lo largo del tiempo. Con esa base, comparar el desempe\xF1o de locales deja de ser una discusi\xF3n y se convierte en un dato. Validar una zona antes de invertir deja de ser una apuesta y pasa a ser un an\xE1lisis fundamentado.",
  capabilities: ["analytics", "geopoints", "presence", "spatial-intelligence"]
};
var goalDigitalTransformation = {
  id: "goal-digital-transformation",
  title: "Digitalizaci\xF3n de espacios f\xEDsicos y puente f\xEDsico-digital",
  matchKeywords: [
    // Digitalizar sucursales / puntos físicos
    "digitalizar sucursales",
    "digitalizo mis sucursales",
    "digitalizar mis sucursales",
    "digitalizaci\xF3n de sucursales",
    "digitalizacion de sucursales",
    "digitalizar puntos f\xEDsicos",
    "digitalizar puntos fisicos",
    "digitalizar puntos de venta",
    "digitalizar mis locales",
    "digitalizar la experiencia f\xEDsica",
    "digitalizar la experiencia fisica",
    "digitalizar la experiencia presencial",
    // Conectar mundo físico y digital
    "conectar mundo f\xEDsico y digital",
    "conectar mundo fisico y digital",
    "conectar lo f\xEDsico con lo digital",
    "conectar lo fisico con lo digital",
    "conectar el mundo f\xEDsico con el digital",
    "conectar el mundo fisico con el digital",
    "conectar fisico con digital",
    "mundo f\xEDsico y digital",
    "mundo fisico y digital",
    "f\xEDsico y digital",
    "fisico y digital",
    "puente entre f\xEDsico y digital",
    "puente fisico digital",
    // Modernizar / transformar
    "modernizar experiencia presencial",
    "modernizar mis sucursales",
    "modernizar mis locales",
    "transformaci\xF3n digital",
    "transformacion digital",
    "transformaci\xF3n digital de mis locales",
    "transformacion digital de mis locales",
    "digitalizaci\xF3n f\xEDsica",
    "digitalizacion fisica",
    // Datos del mundo físico
    "datos del mundo f\xEDsico",
    "datos del mundo fisico",
    "llevar anal\xEDtica al mundo real",
    "llevar analitica al mundo real",
    "inteligencia del mundo f\xEDsico",
    "inteligencia del mundo fisico",
    "convertir presencia en datos",
    "llevar lo f\xEDsico a lo digital",
    "llevar lo fisico a lo digital"
  ],
  solution: "Tus sucursales, locales y puntos de venta generan actividad todos los d\xEDas, pero esa actividad suele quedar fuera de tus sistemas digitales: no hay datos, no hay trazabilidad, no hay forma de actuar sobre ella en tiempo real. Integrar el mundo f\xEDsico con tus plataformas digitales significa que cuando alguien llega a un punto espec\xEDfico, tus sistemas pueden saberlo y responder: mostrar contenido relevante, registrar la visita, habilitar un beneficio o disparar un flujo autom\xE1tico. Sin instalar hardware adicional ni modificar la infraestructura f\xEDsica de ning\xFAn local.",
  capabilities: ["geopoints", "presence", "smart-proxies", "api", "analytics"]
};
var goalMeasurePhysical = {
  id: "goal-measure-physical",
  title: "Medir el comportamiento f\xEDsico en ubicaciones reales",
  matchKeywords: [
    // Medir lo que ocurre físicamente
    "medir lo que ocurre f\xEDsicamente",
    "medir lo que ocurre fisicamente",
    "medir lo que pasa en mis locales",
    "medir lo que ocurre en mis locales",
    // Saber qué pasa en locales
    "saber qu\xE9 pasa en mis locales",
    "saber que pasa en mis locales",
    "qu\xE9 pasa en mis locales",
    "que pasa en mis locales",
    "qu\xE9 ocurre en mis locales",
    "que ocurre en mis locales",
    "qu\xE9 pasa en mis sucursales",
    "que pasa en mis sucursales",
    "qu\xE9 ocurre en mis puntos",
    "que ocurre en mis puntos",
    // Comportamiento presencial
    "datos del comportamiento presencial",
    "comportamiento presencial",
    "comportamiento en tienda",
    "comportamiento en el local",
    "entender el comportamiento en el mundo real",
    // Medir actividad / presencia
    "medir actividad f\xEDsica en ubicaciones",
    "medir actividad fisica",
    "medir actividad en mis locales",
    "medir presencia",
    "medir visitas presenciales",
    "medir visitas",
    "medir tr\xE1fico f\xEDsico",
    "medir trafico fisico",
    // Medir permanencia
    "medir permanencia",
    "tiempo de permanencia",
    "dwell time",
    "cu\xE1nto tiempo permanecen",
    "cuanto tiempo permanecen",
    // Métricas de ubicaciones
    "m\xE9tricas de ubicaciones f\xEDsicas",
    "metricas de ubicaciones fisicas",
    "m\xE9tricas de mis locales",
    "metricas de mis locales",
    "anal\xEDtica de presencia",
    "analitica de presencia",
    "anal\xEDtica del mundo f\xEDsico",
    "analitica del mundo fisico",
    "datos de visita",
    "datos de visitas",
    // Cuántas personas
    "cu\xE1ntas personas entran",
    "cuantas personas entran",
    "cu\xE1nta gente entra",
    "cuanta gente entra",
    "cu\xE1ntas personas visitan",
    "cuantas personas visitan",
    // Asistencia de clientes — contexto comercial, no educativo
    "asistencia de clientes",
    "medir asistencia de clientes",
    "medir asistencia",
    // Concurrencia — vocabulario de negocio
    "concurrencia",
    "medir concurrencia"
  ],
  solution: "Lo que ocurre f\xEDsicamente en tus locales \u2014 cu\xE1ntas personas entran, cu\xE1nto tiempo permanecen, en qu\xE9 horarios hay m\xE1s actividad, c\xF3mo se distribuyen entre zonas \u2014 es informaci\xF3n cr\xEDtica de negocio que la mayor\xEDa de las organizaciones sencillamente no tiene. Disponer de esos datos cambia la forma en que se toman decisiones: puedes comparar el rendimiento real de sucursales, detectar patrones de comportamiento, validar si una campa\xF1a gener\xF3 visitas f\xEDsicas reales y asignar recursos donde los n\xFAmeros lo justifican. Es anal\xEDtica de comportamiento f\xEDsico \u2014 el equivalente de lo que una herramienta digital hace en el mundo online, aplicado al mundo real.",
  capabilities: ["geopoints", "presence", "analytics", "spatial-intelligence", "live-visits"]
};
var goalRetailStores = {
  id: "goal-retail-stores",
  title: "Retail y tiendas f\xEDsicas",
  matchKeywords: [
    // Tipo de establecimiento
    "tienda",
    "tiendas",
    "mi tienda",
    "mis tiendas",
    "tienda f\xEDsica",
    "tienda fisica",
    "tienda de muebles",
    "tienda de ropa",
    "tienda de electr\xF3nica",
    "tienda de electronica",
    "tienda de moda",
    "varias tiendas",
    "cadena de tiendas",
    "showroom",
    "sala de exhibici\xF3n",
    "sala de exhibicion",
    "retail",
    "punto de venta f\xEDsico",
    "punto de venta fisico",
    "local comercial",
    "locales comerciales",
    // Rubros
    "muebles",
    "electr\xF3nica",
    "electronica",
    "moda",
    "indumentaria",
    "electrodom\xE9sticos",
    "electrodomesticos",
    "decoraci\xF3n",
    "decoracion",
    // Objetivos en tienda
    "a mi tienda",
    "personas a mi tienda",
    "clientes a mi tienda",
    "mas personas a mi tienda",
    "m\xE1s personas a mi tienda",
    "atraer a mi tienda",
    "tr\xE1fico a mi tienda",
    "trafico a mi tienda",
    "visitas a mi tienda",
    "visitas a mis tiendas",
    "comparar mis tiendas",
    "comparar tiendas",
    "tr\xE1fico en tienda",
    "trafico en tienda",
    "rendimiento de mis tiendas",
    "desempe\xF1o de mis tiendas",
    // Múltiples locales / concurrencia
    "varios locales",
    "concurrencia",
    "medir concurrencia"
  ],
  solution: "Para una tienda o cadena de retail, la pregunta central es qu\xE9 genera tr\xE1fico real y qu\xE9 convierte ese tr\xE1fico en ventas. Sin datos de comportamiento en el punto de venta \u2014 cu\xE1ntas personas entran, en qu\xE9 horarios hay m\xE1s demanda, cu\xE1nto tiempo permanecen y c\xF3mo var\xEDa el rendimiento entre locales \u2014 las decisiones de promoci\xF3n, personal y expansi\xF3n se toman a ciegas. Con esa informaci\xF3n puedes comparar el desempe\xF1o de tus tiendas, identificar cu\xE1les necesitan intervenci\xF3n, optimizar horarios de atenci\xF3n y medir si una campa\xF1a local gener\xF3 visitas reales o solo impresiones.",
  capabilities: ["geopoints", "presence", "analytics", "smart-proxies"]
};
var goalGyms = {
  id: "goal-gyms",
  title: "Gimnasios y centros deportivos",
  matchKeywords: [
    // Tipo de establecimiento
    "gimnasio",
    "gimnasios",
    "mi gimnasio",
    "cadena de gimnasios",
    "centro deportivo",
    "centros deportivos",
    "centro de fitness",
    "centros de fitness",
    "club deportivo",
    "fitness center",
    "gym",
    // Socios y retención
    "socios",
    "mis socios",
    "retener socios",
    "retenci\xF3n de socios",
    "retencion de socios",
    "socios activos",
    "socios inactivos",
    "socios frecuentes",
    "comportamiento de socios",
    // Frecuencia — más cobertura que goalImproveLoyalty para ganar en score
    "frecuencia de visita",
    "la frecuencia de visita",
    "aumentar la frecuencia de visita",
    "mayor frecuencia de visita",
    "frecuencia de asistencia",
    "asistencia al gimnasio",
    // Horarios
    "horarios punta",
    "horas pico",
    "horarios de alta demanda",
    "hora pico",
    // Sedes — vocabulario propio de cadenas de gimnasios
    "sedes",
    "mis sedes",
    "en cada sede",
    // Asistencia en contexto de gimnasio / sin la palabra "gimnasio"
    "asistencia en cada sede",
    "asistencia entre sedes",
    "asistencia por sede",
    "asistencia en mis sedes",
    "asistencia a mis gimnasios",
    "aumentar la asistencia",
    "baja asistencia"
  ],
  solution: "El negocio de un gimnasio o cadena de fitness depende de dos m\xE9tricas clave: la frecuencia de asistencia y la permanencia. Sin datos reales de cu\xE1ndo se producen visitas, con qu\xE9 frecuencia y en qu\xE9 horarios se concentra la demanda, las decisiones de retenci\xF3n, staffing y programaci\xF3n se dise\xF1an a ciegas. Con informaci\xF3n real de comportamiento puedes detectar ca\xEDdas en la frecuencia general de visitas por franja horaria y per\xEDodo, optimizar la carga de personal seg\xFAn demanda real y dise\xF1ar beneficios que incentiven lo que quieres lograr: mayor asistencia, mayor fidelidad, menor tasa de abandono. Para vincular esos datos a socios individuales, el sistema de gesti\xF3n del gimnasio debe integrar su propia base de socios via API.",
  capabilities: ["geopoints", "presence", "analytics", "api"]
};
var goalRestaurants = {
  id: "goal-restaurants",
  title: "Restaurantes y gastronom\xEDa",
  matchKeywords: [
    // Tipo de establecimiento
    "restaurante",
    "restaurantes",
    "mi restaurante",
    "cadena de restaurantes",
    "cafeter\xEDa",
    "cafeterias",
    "caf\xE9",
    "cafe",
    "bar",
    "bares",
    "food court",
    "patio de comidas",
    "local gastron\xF3mico",
    "local gastronomico",
    "negocio gastron\xF3mico",
    "negocio gastronomico",
    // Comparar locales — dos frases para ganarle score a goalDecisionMaking
    "saber que local",
    "saber qu\xE9 local",
    "que local funciona mejor",
    "qu\xE9 local funciona mejor",
    // Campañas y tráfico
    "campa\xF1as locales",
    "campanas locales",
    "horarios del restaurante",
    "flujo del restaurante",
    "tr\xE1fico del restaurante",
    "trafico del restaurante",
    "comparar restaurantes",
    "comparar mis restaurantes",
    "cu\xE1l restaurante funciona mejor",
    "cual restaurante funciona mejor"
  ],
  solution: "Para un restaurante o cadena gastron\xF3mica, los datos que m\xE1s importan son los que ocurren en el local: qu\xE9 tan lleno est\xE1 realmente en cada franja horaria, c\xF3mo var\xEDa el flujo entre locales y qu\xE9 campa\xF1as de proximidad generan visitas reales versus impresiones digitales. Con esa informaci\xF3n puedes comparar el rendimiento real de tus locales, detectar cu\xE1les tienen demanda no cubierta, ajustar operaciones seg\xFAn comportamiento observado y demostrar el impacto de tus acciones de marketing con evidencia de presencia f\xEDsica, no solo con m\xE9tricas de pauta.",
  capabilities: ["geopoints", "presence", "analytics", "smart-proxies"]
};
var goalEvents = {
  id: "goal-events",
  title: "Eventos, ferias y activaciones",
  matchKeywords: [
    // Tipo de evento
    "evento",
    "eventos",
    "organizar eventos",
    "organizo eventos",
    "feria",
    "ferias",
    "congreso",
    "congresos",
    "exposici\xF3n",
    "exposicion",
    "exposiciones",
    "activaci\xF3n de marca",
    "activacion de marca",
    "activaciones de marca",
    "evento corporativo",
    "eventos corporativos",
    "conferencia",
    "conferencias",
    "jornada",
    "jornadas",
    // Patrocinadores
    "patrocinadores",
    "patrocinador",
    "sponsor",
    "sponsors",
    "justificar patrocinadores",
    "justificar sponsors",
    "demostrar a patrocinadores",
    "roi del evento",
    "roi de eventos",
    // Asistencia y evidencia
    "asistencia real",
    "asistentes reales",
    "aforo real",
    "aforo",
    "demostrar asistencia",
    "evidencia de asistencia",
    "asistencia verificada",
    "cu\xE1ntas personas asistieron",
    "cuantas personas asistieron",
    "impacto del evento"
  ],
  solution: "Organizar un evento, feria o activaci\xF3n implica asumir compromisos ante clientes, marcas y patrocinadores. El problema central es demostrar lo que realmente ocurri\xF3: cu\xE1ntas personas estuvieron f\xEDsicamente presentes, cu\xE1nto tiempo permanecieron en cada zona y cu\xE1l fue el alcance real de la experiencia. Con registros objetivos de asistencia y permanencia puedes presentar evidencia concreta ante sponsors, calcular el costo por interacci\xF3n real y ajustar el dise\xF1o de futuros eventos bas\xE1ndote en el comportamiento observado en cada edici\xF3n, no en estimaciones de aforo.",
  capabilities: ["geopoints", "presence", "analytics", "api"]
};
var goalShoppingCenters = {
  id: "goal-shopping-centers",
  title: "Centros comerciales y malls",
  matchKeywords: [
    // Tipo de establecimiento
    "mall",
    "centro comercial",
    "centros comerciales",
    "un centro comercial",
    "shopping",
    "shopping center",
    "plaza comercial",
    "galer\xEDa comercial",
    "galeria comercial",
    "mi mall",
    "mi centro comercial",
    // Tráfico y zonas
    "tr\xE1fico por zona",
    "trafico por zona",
    "tr\xE1fico por sector",
    "trafico por sector",
    "zonas del mall",
    "zonas del centro comercial",
    "sectores del mall",
    "sector del mall",
    "comparar sectores",
    "comparar zonas del mall",
    "comparar sectores del mall",
    // Locatarios
    "locatarios",
    "locales del mall",
    "locales del centro comercial",
    "campa\xF1as del mall",
    "rendimiento por zona"
  ],
  solution: "Un centro comercial gestiona m\xFAltiples zonas, niveles y locatarios con rendimientos muy distintos. Sin datos de tr\xE1fico por sector, los gerentes comerciales toman decisiones de asignaci\xF3n de espacios y campa\xF1as bas\xE1ndose en percepciones o en declaraciones de locatarios. Con informaci\xF3n real de comportamiento \u2014 cu\xE1ntas personas circulan por cada zona, en qu\xE9 horarios se concentra el flujo y c\xF3mo var\xEDa entre d\xEDas \u2014 puedes identificar las \xE1reas de mayor y menor desempe\xF1o, fundamentar negociaciones de renta y dise\xF1ar campa\xF1as que generen desplazamiento real hacia zonas con menor tr\xE1fico.",
  capabilities: ["geopoints", "analytics", "spatial-intelligence", "live-visits"]
};
var goalFranchises = {
  id: "goal-franchises",
  title: "Franquicias y cadenas de locales",
  matchKeywords: [
    // Tipo de negocio
    "franquicia",
    "franquicias",
    "mi franquicia",
    "mis franquicias",
    "franquiciado",
    "franquiciados",
    "franquiciador",
    "cadena de locales",
    "red de locales",
    "red de sucursales",
    "multisucursal",
    "multi-sucursal",
    // Comparar y evaluar — "sucursales" sola + "comparar sucursales" superan a goalDecisionMaking
    "sucursales",
    "comparar sucursales",
    "comparar mis sucursales",
    "comparar franquicias",
    "comparar mis franquicias",
    "desempe\xF1o de sucursales",
    "rendimiento de sucursales",
    "desempe\xF1o de franquicias",
    "rendimiento de franquicias",
    // Identificar problemas
    "locales d\xE9biles",
    "locales debiles",
    "detectar locales d\xE9biles",
    "detectar locales debiles",
    "sucursales d\xE9biles",
    "sucursales debiles",
    "sucursales con bajo rendimiento",
    // Expansión
    "expansi\xF3n de franquicia",
    "expansion de franquicia",
    "estandarizar operaciones",
    "estandarizaci\xF3n",
    "estandarizacion"
  ],
  solution: "En una cadena de franquicias o red de sucursales, el desaf\xEDo no es solo saber que todas operan, sino entender cu\xE1les funcionan mejor y por qu\xE9. Sin datos comparables de tr\xE1fico real, las evaluaciones de desempe\xF1o dependen de ventas declaradas, reportes de franquiciados o visitas estimadas. Con informaci\xF3n objetiva de presencia y comportamiento en cada local puedes identificar las sucursales que est\xE1n por debajo de su potencial, detectar los patrones que diferencian a las m\xE1s exitosas y tomar decisiones de expansi\xF3n, cierre o intervenci\xF3n con evidencia observable, no con intuici\xF3n.",
  capabilities: ["geopoints", "analytics", "presence", "api"]
};
var goalTourism = {
  id: "goal-tourism",
  title: "Turismo y destinos",
  matchKeywords: [
    // Tipo de destino
    "turismo",
    "turista",
    "turistas",
    "sector tur\xEDstico",
    "sector turistico",
    "atractivo tur\xEDstico",
    "atractivo turistico",
    "atractivos tur\xEDsticos",
    "atractivos turisticos",
    "destino tur\xEDstico",
    "destino turistico",
    "parque tem\xE1tico",
    "parque tematico",
    "parque de atracciones",
    "museo",
    "museos",
    "monumento",
    "monumentos",
    "parque natural",
    "reserva natural",
    "ruta tur\xEDstica",
    "ruta turistica",
    "circuito tur\xEDstico",
    "circuito turistico",
    // Visitantes y recorridos
    "visitantes",
    "flujo de visitantes",
    "recorrido de visitantes",
    "comportamiento de visitantes",
    "recorrido tur\xEDstico",
    "recorrido turistico",
    // Experiencia turística — supera a goalCustomerExperience con dos frases
    "experiencia tur\xEDstica",
    "experiencia turistica",
    "mejorar la experiencia tur\xEDstica",
    "mejorar la experiencia turistica",
    "tour",
    "tours",
    "excursi\xF3n",
    "excursion"
  ],
  solution: "En un destino tur\xEDstico, parque o atractivo, entender c\xF3mo se mueven los visitantes es tan importante como atraerlos. Saber en qu\xE9 zonas se concentran, cu\xE1nto tiempo permanecen en cada punto, qu\xE9 recorridos siguen y cu\xE1ndo hay m\xE1s demanda permite tomar decisiones concretas: qu\xE9 experiencias reforzar, d\xF3nde concentrar el personal, qu\xE9 \xE1reas generan mayor permanencia y qu\xE9 contenidos contextualizar seg\xFAn la ubicaci\xF3n del visitante. Con datos reales de comportamiento presencial, la gesti\xF3n del destino pasa de ser reactiva a anticiparse a lo que los visitantes necesitan.",
  capabilities: ["geopoints", "presence", "analytics", "smart-proxies"]
};
var goalRealEstate = {
  id: "goal-real-estate",
  title: "Inmobiliarias y desarrolladoras",
  matchKeywords: [
    // Tipo de negocio
    "inmobiliaria",
    "inmobiliarias",
    "sector inmobiliario",
    "desarrolladora",
    "desarrolladora inmobiliaria",
    "proyecto inmobiliario",
    "proyectos inmobiliarios",
    "desarrollo inmobiliario",
    "emprendimiento inmobiliario",
    // Salas de venta y pilotos
    "sala de venta",
    "salas de venta",
    "sala de ventas",
    "salas de ventas",
    "piloto",
    "pilotos",
    "departamento piloto",
    "casa piloto",
    "sala piloto",
    // Medición específica
    "visitas a salas de venta",
    "visitas a la sala de venta",
    "medir visitas a salas de venta",
    "medir visitas al piloto",
    "visitas al proyecto",
    "inter\xE9s por proyecto",
    "interes por proyecto",
    "qu\xE9 proyecto genera m\xE1s inter\xE9s",
    "que proyecto genera mas interes",
    "qu\xE9 proyecto genera m\xE1s visitas",
    "que proyecto genera mas visitas",
    "comparar proyectos",
    "desempe\xF1o de proyectos"
  ],
  solution: "Para una inmobiliaria o desarrolladora, la informaci\xF3n m\xE1s valiosa no es cu\xE1ntas personas vieron el aviso online, sino cu\xE1ntas llegaron f\xEDsicamente al proyecto, cu\xE1nto tiempo permanecieron en la sala de ventas o piloto y qu\xE9 proyectos generan mayor inter\xE9s real. Con esos datos puedes comparar el desempe\xF1o de tus salas de venta, identificar qu\xE9 campa\xF1as efectivamente llevan visitas f\xEDsicas y ajustar la estrategia de activaci\xF3n seg\xFAn el comportamiento observado, no seg\xFAn las m\xE9tricas de pauta digital o los registros manuales de los ejecutivos de venta.",
  capabilities: ["geopoints", "presence", "analytics", "api"]
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
  goalRealEstate
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

// scripts/validate-p2.ts
function activatedKeywords(keywords, query) {
  const lower = normalize(query);
  return keywords.filter((k) => lower.includes(normalize(k)));
}
var allCandidates = [
  ...knowledge.useCases.map((uc) => ({ id: uc.id, type: "UseCase", keywords: uc.matchKeywords })),
  ...knowledge.businessGoals.map((g) => ({ id: g.id, type: "Goal", keywords: g.matchKeywords })),
  ...knowledge.faqs.map((f) => ({ id: f.id, type: "FAQ", keywords: f.questionPatterns }))
];
function run(label, questions) {
  console.log(`
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550`);
  console.log(`  ${label}`);
  console.log(`\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
`);
  let pass = 0;
  let fail = 0;
  for (const { id, q, expectedId, shouldNeverBe } of questions) {
    const audit = auditMatch(q);
    const actualId = audit.winner?.id ?? "FALLBACK";
    const cand = allCandidates.find((c) => c.id === actualId);
    const activated = cand ? activatedKeywords(cand.keywords, q) : [];
    let verdict = "\u2705";
    let reason = "";
    if (expectedId && actualId !== expectedId) {
      verdict = "\u274C";
      reason = ` \u2192 esperado: ${expectedId}`;
      fail++;
    } else if (shouldNeverBe && actualId === shouldNeverBe) {
      verdict = "\u274C";
      reason = ` \u2192 no debe ser: ${shouldNeverBe}`;
      fail++;
    } else {
      pass++;
    }
    console.log(`${verdict} ${id} | match=${actualId} score=${audit.winner?.score ?? 0}${reason}`);
    console.log(`   Q: "${q}"`);
    if (activated.length) console.log(`   Keys: ${activated.map((k) => `"${k}"`).join(", ")}`);
    if (audit.top3.length > 1) console.log(`   Top3: ${audit.top3.map((c) => `${c.id}(${c.score})`).join(", ")}`);
    console.log();
  }
  console.log(`Resultado: ${pass}/${pass + fail} \u2705`);
  return fail;
}
var comercial = [
  { id: "C1", q: "Tengo una cadena de gimnasios y quiero medir asistencia", expectedId: "goal-gyms" },
  { id: "C2", q: "\xBFC\xF3mo aumenta la asistencia a mis gimnasios?", expectedId: "goal-gyms" },
  { id: "C3", q: "Quiero entender qu\xE9 sedes reciben m\xE1s personas", expectedId: "goal-gyms", shouldNeverBe: "education-attendance" },
  { id: "C4", q: "\xBFC\xF3mo comparo la asistencia entre sucursales?", expectedId: "goal-franchises" },
  { id: "C5", q: "Tengo varios locales y quiero medir concurrencia", expectedId: "goal-retail-stores" },
  { id: "C6", q: "Quiero saber qu\xE9 gimnasio tiene m\xE1s actividad", expectedId: "goal-gyms" },
  { id: "C7", q: "\xBFC\xF3mo medir asistencia de clientes?", shouldNeverBe: "education-attendance" }
];
var educacion = [
  { id: "E1", q: "\xBFC\xF3mo registrar asistencia de alumnos?", expectedId: "education-attendance" },
  { id: "E2", q: "\xBFC\xF3mo controlar asistencia en clases?", expectedId: "education-attendance" },
  { id: "E3", q: "\xBFC\xF3mo validar asistencia en un campus?", expectedId: "education-attendance" },
  { id: "E4", q: "\xBFC\xF3mo registrar presencia de estudiantes?", expectedId: "education-attendance" },
  { id: "E5", q: "\xBFC\xF3mo gestionar asistencia escolar?", expectedId: "education-attendance" }
];
var original50 = [
  { id: "Q01", q: "Quiero saber cu\xE1les de mis sucursales est\xE1n rindiendo mejor antes de decidir d\xF3nde abrir la pr\xF3xima", expectedId: "goal-decision-making" },
  { id: "Q02", q: "Necesito evidencia real para justificar una inversi\xF3n en una nueva zona" },
  { id: "Q03", q: "Tenemos 12 locales y no s\xE9 cu\xE1les generan m\xE1s valor" },
  { id: "Q04", q: "C\xF3mo decido si expandirme a una ciudad nueva sin tomar un riesgo ciego" },
  { id: "Q05", q: "Mi directorio me pide datos concretos sobre el rendimiento de cada punto de venta" },
  { id: "Q06", q: "Quiero saber si mis vendedores realmente visitan los clientes o solo reportan que lo hacen", expectedId: "field-sales-visits" },
  { id: "Q07", q: "Necesito comparar el rendimiento de mis locales para saber cu\xE1les necesitan intervenci\xF3n", expectedId: "goal-decision-making" },
  { id: "Q08", q: "C\xF3mo mido si una campa\xF1a de descuentos gener\xF3 tr\xE1fico real a la tienda", expectedId: "goal-attract-customers" },
  { id: "Q09", q: "Quiero saber en qu\xE9 horarios hay m\xE1s personas en mis tiendas para ajustar al equipo de ventas", expectedId: "goal-retail-stores" },
  { id: "Q10", q: "Necesito demostrarle al due\xF1o que nuestras acciones comerciales realmente generan visitas" },
  { id: "Q11", q: "Lanc\xE9 una activaci\xF3n en tres puntos de venta y no s\xE9 cu\xE1nta gente realmente particip\xF3" },
  { id: "Q12", q: "Quiero mostrarle una promoci\xF3n especial solo a los clientes que est\xE1n en el local en ese momento", expectedId: "retail-promotion" },
  { id: "Q13", q: "C\xF3mo demuestro el ROI de una campa\xF1a presencial a mi directorio", expectedId: "brand-activation-campaign" },
  { id: "Q14", q: "Quiero que cuando alguien llegue a mi tienda le aparezca autom\xE1ticamente una oferta del d\xEDa", expectedId: "local-business-proximity-promo" },
  { id: "Q15", q: "Necesito saber cu\xE1nto tiempo pasan las personas en cada zona de mis eventos para mejorarlos", expectedId: "goal-events" },
  { id: "Q16", q: "Mis t\xE9cnicos deben hacer rondas de mantenimiento y necesito saber si realmente fueron a cada punto", expectedId: "field-sales-supervision" },
  { id: "Q17", q: "Tengo personal distribuido en distintas zonas y no tengo forma de verificar que cumplieron su ruta" },
  { id: "Q18", q: "Necesito auditar si los agentes sanitarios cubrieron todas las zonas asignadas esta semana" },
  { id: "Q19", q: "Quiero saber si mis repartidores pasaron por todos los puntos de entrega con la hora exacta", expectedId: "field-sales-delivery" },
  { id: "Q20", q: "C\xF3mo registro de forma confiable que un inspector municipal hizo su recorrido completo", expectedId: "municipalities-inspection" },
  { id: "Q21", q: "Quiero saber cu\xE1nta gente entra a mi tienda y en qu\xE9 horas hay m\xE1s movimiento", expectedId: "goal-retail-stores" },
  { id: "Q22", q: "C\xF3mo hago para que una promoci\xF3n especial solo funcione dentro del local", expectedId: "retail-promotion" },
  { id: "Q23", q: "Quiero entender cu\xE1nto tiempo pasan mis clientes en la tienda", expectedId: "goal-retail-stores" },
  { id: "Q24", q: "Tengo una tienda f\xEDsica y tambi\xE9n un sitio web, quiero saber si los que visitan el sitio tambi\xE9n vinieron al local", expectedId: "goal-retail-stores" },
  { id: "Q25", q: "C\xF3mo atraigo a las personas que pasan por la puerta de mi local", expectedId: "local-business-proximity-promo" },
  { id: "Q26", q: "Quiero saber en qu\xE9 horarios se concentra m\xE1s la asistencia en cada sede", shouldNeverBe: "education-attendance" },
  { id: "Q27", q: "Necesito comparar la frecuencia de asistencia entre mis diferentes gimnasios", expectedId: "goal-gyms" },
  { id: "Q28", q: "C\xF3mo detecto qu\xE9 sedes tienen baja asistencia para tomar acci\xF3n antes de que sea un problema", shouldNeverBe: "education-attendance" },
  { id: "Q29", q: "Quiero dar beneficios a los socios seg\xFAn cu\xE1ntas veces vinieron al gimnasio este mes", expectedId: "goal-gyms" },
  { id: "Q30", q: "Necesito saber si mis campa\xF1as de retenci\xF3n est\xE1n generando m\xE1s visitas presenciales" },
  { id: "Q31", q: "Quiero saber cu\xE1l de mis locales recibe m\xE1s tr\xE1fico en la hora del almuerzo", expectedId: "spatial-concentration" },
  { id: "Q32", q: "Necesito comparar el flujo de personas entre mis diferentes restaurantes", expectedId: "goal-restaurants" },
  { id: "Q33", q: "C\xF3mo s\xE9 si mi campa\xF1a de descuentos de lunes gener\xF3 m\xE1s visitas que el lunes anterior" },
  { id: "Q34", q: "Quiero mostrar una oferta especial solo cuando el cliente est\xE9 cerca del restaurante" },
  { id: "Q35", q: "Necesito demostrar a mis inversores que la nueva sucursal est\xE1 generando el tr\xE1fico proyectado" },
  { id: "Q36", q: "Quiero saber qu\xE9 zonas del mall tienen m\xE1s tr\xE1fico y en qu\xE9 horarios", expectedId: "goal-shopping-centers" },
  { id: "Q37", q: "Necesito comparar el flujo de personas entre el sector A y el sector B para negociar rentas" },
  { id: "Q38", q: "C\xF3mo s\xE9 cu\xE1les son los pasillos y sectores m\xE1s y menos visitados de mi centro comercial", expectedId: "goal-shopping-centers" },
  { id: "Q39", q: "Quiero ver en tiempo real cu\xE1nta gente hay en cada piso o zona del mall", expectedId: "faq-indoor" },
  { id: "Q40", q: "Necesito generar un reporte de afluencia por zona para presentar a los locatarios", expectedId: "goal-shopping-centers" },
  { id: "Q41", q: "Quiero saber cu\xE1ntas personas visitaron mi sala de ventas esta semana y cu\xE1nto tiempo estuvieron", expectedId: "goal-real-estate" },
  { id: "Q42", q: "C\xF3mo mido el inter\xE9s real en cada uno de mis proyectos inmobiliarios", expectedId: "goal-real-estate" },
  { id: "Q43", q: "Quiero que los planos y precios se activen autom\xE1ticamente cuando un interesado llega al proyecto", expectedId: "real-estate-open-house" },
  { id: "Q44", q: "Necesito comparar cu\xE1ntas visitas recibi\xF3 cada sala de ventas sin depender del reporte del ejecutivo", expectedId: "goal-real-estate" },
  { id: "Q45", q: "C\xF3mo evito que el material exclusivo de mi open house circule fuera del proyecto" },
  { id: "Q46", q: "C\xF3mo se integra esto con nuestro sistema existente, tenemos un backend propio", expectedId: "faq-api-integration" },
  { id: "Q47", q: "Necesito entender qu\xE9 datos entrega el sistema y en qu\xE9 formato" },
  { id: "Q48", q: "Tenemos una app mobile propia en iOS y Android, c\xF3mo incorporamos la validaci\xF3n de ubicaci\xF3n" },
  { id: "Q49", q: "Necesito integrar los datos de visitas con nuestro Salesforce" },
  { id: "Q50", q: "Qu\xE9 diferencia hay entre esto y simplemente leer la geolocalizaci\xF3n del dispositivo nosotros mismos" }
];
var p1 = [
  { id: "V1", q: "Quiero mostrarle una promoci\xF3n especial solo a los clientes que est\xE1n en el local en ese momento", expectedId: "retail-promotion" },
  { id: "V2", q: "Quiero que cuando alguien llegue a mi tienda le aparezca autom\xE1ticamente una oferta del d\xEDa", expectedId: "local-business-proximity-promo" },
  { id: "V3", q: "C\xF3mo hago para que una promoci\xF3n especial solo funcione dentro del local", expectedId: "retail-promotion" },
  { id: "V4", q: "Quiero que los planos y precios se activen autom\xE1ticamente cuando un interesado llega al proyecto", expectedId: "real-estate-open-house" },
  { id: "V5", q: "Quiero desbloquear contenido \xFAnicamente cuando una persona llegue a una ubicaci\xF3n espec\xEDfica", expectedId: "geolocated-ar-experience" },
  { id: "V6", q: "Quiero que cierta informaci\xF3n solo aparezca cuando alguien entre a una zona determinada", expectedId: "local-business-contextual-message" },
  { id: "V7", q: "Quiero mostrar contenido diferente dependiendo de d\xF3nde est\xE9 una persona", expectedId: "local-business-contextual-message" }
];
var totalFail = 0;
totalFail += run("VALIDACIONES P2 \u2014 COMERCIAL (no deben ir a educaci\xF3n)", comercial);
totalFail += run("VALIDACIONES P2 \u2014 EDUCACI\xD3N (deben seguir llegando a educaci\xF3n)", educacion);
console.log("\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
console.log("  REGRESI\xD3N \u2014 50 PREGUNTAS ORIGINALES");
console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
var reg50Pass = 0;
var reg50Fail = 0;
var reg50Issues = [];
for (const { id, q, expectedId, shouldNeverBe } of original50) {
  const audit = auditMatch(q);
  const actualId = audit.winner?.id ?? "FALLBACK";
  if (expectedId && actualId !== expectedId) {
    reg50Fail++;
    reg50Issues.push(`  \u274C ${id}: esperado="${expectedId}" got="${actualId}"`);
  } else if (shouldNeverBe && actualId === shouldNeverBe) {
    reg50Fail++;
    reg50Issues.push(`  \u274C ${id}: no debe ser "${shouldNeverBe}" \u2014 got="${actualId}"`);
  } else {
    reg50Pass++;
  }
}
if (reg50Issues.length) {
  reg50Issues.forEach((l) => console.log(l));
  console.log();
}
console.log(`Resultado: ${reg50Pass}/${reg50Pass + reg50Fail}${reg50Fail > 0 ? " \u274C REGRESIONES" : " \u2705"}`);
console.log("\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
console.log("  REGRESI\xD3N \u2014 P1 (7 PREGUNTAS)");
console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");
var regP1Pass = 0;
var regP1Fail = 0;
var regP1Issues = [];
for (const { id, q, expectedId } of p1) {
  const audit = auditMatch(q);
  const actualId = audit.winner?.id ?? "FALLBACK";
  if (actualId !== expectedId) {
    regP1Fail++;
    regP1Issues.push(`  \u274C ${id}: esperado="${expectedId}" got="${actualId}"`);
  } else {
    regP1Pass++;
  }
}
if (regP1Issues.length) {
  regP1Issues.forEach((l) => console.log(l));
  console.log();
}
console.log(`Resultado: ${regP1Pass}/${regP1Pass + regP1Fail}${regP1Fail > 0 ? " \u274C REGRESIONES" : " \u2705"}`);
console.log("\n" + "\u2550".repeat(57));
console.log(`  TOTAL FALLAS: ${totalFail + reg50Fail + regP1Fail}`);
console.log("\u2550".repeat(57) + "\n");
