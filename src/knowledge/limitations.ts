import type { Limitation } from './types'

export const limitations: Limitation[] = [
  {
    area: 'Precisión GPS en interiores',
    description:
      'La precisión GPS degrada significativamente en interiores, especialmente en ' +
      'edificios de concreto grueso, sótanos o zonas sin línea de visión al cielo. ' +
      'El error típico indoor puede ser de 10 a 50 metros, lo que puede resultar en ' +
      'falsos positivos o negativos si el GeoPoint tiene un radio pequeño.',
    workaround:
      'Usar radios de GeoPoint de al menos 30-50 metros en interiores. Para espacios ' +
      'interiores grandes con zonas bien separadas, definir polígonos más amplios. ' +
      'En interiores con requerimientos de alta precisión, evaluar alternativas como ' +
      'Bluetooth beacons combinados con validación Ubyca.',
  },
  {
    area: 'Disponibilidad de GPS en el dispositivo del usuario',
    description:
      'Ubyca requiere que el dispositivo del usuario tenga GPS y que el usuario ' +
      'otorgue permiso de ubicación. Si el usuario deniega el permiso, la validación ' +
      'de presencia no puede ejecutarse. No hay fallback a IP geolocation ni Wi-Fi ' +
      'positioning, ya que estos métodos son inexactos y falsificables.',
    workaround:
      'Diseñar el flujo para solicitar el permiso de ubicación con contexto claro ' +
      'de por qué se necesita. Los Smart Proxies incluyen una pantalla de solicitud ' +
      'de permiso antes de la validación.',
  },
  {
    area: 'App nativa no disponible',
    description:
      'Ubyca no tiene una app nativa propia en iOS o Android. La validación de ' +
      'presencia funciona desde el navegador web del usuario o desde apps de terceros ' +
      'que integran la API. Esto limita la capacidad de hacer validaciones de presencia ' +
      'en segundo plano (background location).',
    workaround:
      'Para casos que requieren validación continua en segundo plano, integrar la ' +
      'API de Ubyca en la app nativa propia del cliente.',
  },
  {
    area: 'Ausencia de marketplace de integraciones predefinidas',
    description:
      'Ubyca no tiene conectores nativos con sistemas CRM, ERP, plataformas de ' +
      'e-commerce específicas ni herramientas de marketing automation. Toda integración ' +
      'requiere desarrollo personalizado sobre la API REST.',
    workaround:
      'La integración se construye sobre la API REST estándar de Ubyca: cualquier ' +
      'plataforma que soporte HTTP puede consumir resultados de presencia. Ubyca no ' +
      'tiene webhooks, por lo que el sistema cliente es quien inicia las llamadas.',
  },
  {
    area: 'Latencia en entornos con mala conectividad',
    description:
      'La validación de presencia requiere conectividad a internet en el momento de ' +
      'la solicitud. En zonas con señal débil (áreas rurales, sótanos, zonas de ' +
      'eventos congestionadas), la llamada a la API puede timeout o demorar más de ' +
      '80 ms. No hay modo offline.',
    workaround:
      'Diseñar el flujo con timeouts generosos y mensajes de error amigables. Para ' +
      'eventos masivos, verificar la cobertura de datos móviles del venue con ' +
      'antelación.',
  },
  {
    area: 'Límites de GeoPoints por proyecto',
    description:
      'Cada plan de Ubyca tiene un límite de GeoPoints activos por proyecto. ' +
      'Proyectos con cientos de puntos (como una cadena con muchas sucursales) ' +
      'requieren un plan Enterprise. Los límites exactos dependen del plan contratado.',
    workaround:
      'Para cadenas con muchas sucursales, contactar a Ubyca para un plan Enterprise ' +
      'o evaluar la arquitectura de múltiples proyectos.',
  },
  {
    area: 'Sin tracking continuo de trayectoria',
    description:
      'Ubyca registra eventos de entrada y permanencia en zonas definidas, pero no ' +
      'registra la trayectoria continua de una persona entre GeoPoints. No es un ' +
      'sistema de seguimiento GPS en tiempo real punto a punto.',
    workaround:
      'Para casos que requieren trayectoria completa (rutas entre puntos), combinar ' +
      'Ubyca para la validación de llegada a puntos clave con un sistema de tracking ' +
      'de flota GPS dedicado para la ruta entre puntos.',
  },
  {
    area: 'Datos históricos y retención',
    description:
      'La retención de datos históricos de presencia y analytics depende del plan ' +
      'contratado. Los planes básicos pueden tener ventanas de retención más cortas. ' +
      'Para cumplimiento o auditoría a largo plazo, es necesario exportar los datos ' +
      'periódicamente vía API.',
    workaround:
      'Implementar una exportación periódica automatizada vía API hacia el sistema ' +
      'de almacenamiento propio del cliente para casos de cumplimiento o auditoría.',
  },
  {
    area: 'Consentimiento GPS y privacidad del usuario final',
    description:
      'Ubyca no realiza seguimiento oculto de ningún tipo. Para que la validación ' +
      'de presencia funcione, el usuario final debe abrir activamente el enlace o ' +
      'la aplicación que realiza la solicitud, y el navegador o sistema operativo ' +
      'debe solicitar y recibir el permiso de ubicación explícitamente. ' +
      'Ubyca no accede a la ubicación en segundo plano sin acción del usuario. ' +
      'El cliente que implementa Ubyca es responsable exclusivo de: informar a ' +
      'sus usuarios del uso de datos de ubicación, obtener los consentimientos ' +
      'que exija la legislación aplicable en su jurisdicción, y cumplir con la ' +
      'normativa de privacidad vigente en cada país donde opere. Ubyca provee ' +
      'infraestructura técnica, no asesoramiento legal ni garantías de cumplimiento normativo.',
    workaround:
      'Incluir en el flujo de usuario una pantalla de consentimiento clara antes ' +
      'de solicitar la ubicación. Los Smart Proxies de Ubyca incluyen una pantalla ' +
      'de permiso integrada. Para integraciones vía API, el cliente debe implementar ' +
      'su propio flujo de consentimiento.',
  },
  {
    area: 'Identificación de usuarios — Ubyca no gestiona identidades',
    description:
      'Ubyca valida coordenadas GPS contra GeoPoints configurados. No tiene un ' +
      'sistema de identidad de usuarios propio: la API no requiere ni almacena un ' +
      'user_id nativo. Una solicitud de validación contiene las coordenadas y el ' +
      'location_id, pero no sabe a quién pertenece esa solicitud. ' +
      'En Studio, las métricas de analytics muestran conteos agregados (visitas, ' +
      'activaciones, dwell time), no perfiles individuales. ' +
      'Si el cliente necesita asociar presencias a personas identificadas ' +
      '(por ejemplo, saber que fue "Pedro" quien visitó el punto A), debe ' +
      'implementar su propio sistema de autenticación e incluir el identificador ' +
      'en la lógica de su aplicación. Ubyca responde si las coordenadas son ' +
      'válidas: el cliente decide qué hacer con eso y a quién se las atribuye.',
    workaround:
      'El sistema integrador mantiene la sesión del usuario autenticado (login propio ' +
      'o OAuth) y, al llamar a la API de Ubyca, vincula el resultado de presencia ' +
      'con el user_id de su propio sistema. Ubyca no almacena esa vinculación: ' +
      'es responsabilidad del sistema cliente.',
  },
  {
    area: 'Webhooks — no disponibles actualmente',
    description:
      'Ubyca no tiene un sistema de webhooks que notifique proactivamente a sistemas ' +
      'externos cuando ocurre un evento de presencia (entrada, salida, dwell time ' +
      'completado). La integración actual es exclusivamente request-response: el ' +
      'sistema externo llama a la API de Ubyca y recibe el resultado en ese momento. ' +
      'Ubyca no puede iniciar una notificación hacia un endpoint externo.',
    workaround:
      'Implementar polling periódico a la Analytics API para detectar cambios en ' +
      'métricas. Para validación en tiempo real, el sistema del cliente debe ' +
      'ser quien llame a Ubyca en el momento relevante (cuando el usuario abre ' +
      'la app, escanea un código, etc.), no esperar una notificación entrante.',
  },
]
