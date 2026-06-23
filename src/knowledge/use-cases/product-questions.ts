import type { UseCase } from '../types'

export const productOverview: UseCase = {
  id: 'product-overview',
  vertical: 'product',
  title: 'Qué es Ubyca y para qué sirve',
  problem:
    'Alguien quiere entender qué es Ubyca, cómo funciona y qué problemas ' +
    'resuelve antes de evaluar si es relevante para su caso de uso.',
  solution:
    'Ubyca es una plataforma que verifica en el servidor si un usuario está ' +
    'físicamente presente en una ubicación geográfica. Defines zonas sobre ' +
    'cualquier mapa, configuras cuándo y cómo se activan, y obtienes datos ' +
    'reales de presencia, permanencia y comportamiento espacial — sin hardware ' +
    'adicional, sin apps nativas. El acceso se hace desde Studio (interfaz ' +
    'visual sin código) o vía API REST para integración con sistemas propios. ' +
    'La validación ocurre en el servidor en menos de 80 ms: la persona no puede ' +
    'falsificar su ubicación auto-declarándola.',
  capabilities: ['studio', 'api', 'geopoints', 'presence', 'analytics'],
  matchKeywords: [
    'qué es ubyca', 'que es ubyca',
    'cómo funciona ubyca', 'como funciona ubyca',
    'para qué sirve ubyca', 'para que sirve ubyca',
    'qué hace ubyca', 'que hace ubyca',
    'qué problemas resuelve', 'que problemas resuelve',
    'cuéntame sobre ubyca', 'cuentame sobre ubyca',
    'explícame ubyca', 'explicame ubyca',
    'presentación de ubyca', 'presentacion de ubyca',
    'qué es esto', 'que es esto',
    'cómo funciona esto', 'como funciona esto',
  ],
}

export const productCapabilities: UseCase = {
  id: 'product-capabilities',
  vertical: 'product',
  title: 'Capacidades y componentes de Ubyca: Studio, API, GeoPoints',
  problem:
    'Alguien quiere entender las capacidades concretas de Ubyca — Studio, ' +
    'API, GeoPoints, Analytics — y la diferencia entre cada una.',
  solution:
    'Ubyca tiene cinco componentes principales. GeoPoints: zonas geográficas ' +
    'definidas sobre un mapa que determinan dónde se activa una regla o se ' +
    'registra presencia. Presencia física: validación server-side de que el ' +
    'usuario está dentro de un GeoPoint. Studio: interfaz visual para crear ' +
    'proyectos, definir zonas, ver analítica en tiempo real y gestionar Smart ' +
    'Proxies sin código. API REST: acceso programático a todas las capacidades ' +
    'para integrar con sistemas del cliente. Analytics: historial de eventos de ' +
    'presencia, tiempo de permanencia, flujo y distribución espacial por zona.',
  capabilities: ['studio', 'api', 'geopoints', 'presence', 'analytics'],
  matchKeywords: [
    'diferencia entre studio y api', 'diferencia studio api',
    'qué es studio', 'que es studio',
    'qué es un geopoint', 'que es un geopoint',
    'qué es la api de ubyca', 'que es la api de ubyca',
    'componentes de ubyca', 'partes de ubyca', 'módulos de ubyca',
    'cómo se usa ubyca', 'como se usa ubyca',
    'qué puedo hacer con ubyca', 'que puedo hacer con ubyca',
    'funcionalidades de ubyca', 'capacidades de ubyca',
    'herramientas de ubyca', 'funcionamiento de ubyca',
    'qué incluye ubyca', 'que incluye ubyca',
  ],
}
