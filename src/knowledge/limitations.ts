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
      'Usar los webhooks de Ubyca (cuando el evento ocurre, notificar a un endpoint ' +
      'externo) para disparar integraciones desde el sistema destino. La API REST ' +
      'estándar permite integración con cualquier plataforma que soporte HTTP.',
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
]
