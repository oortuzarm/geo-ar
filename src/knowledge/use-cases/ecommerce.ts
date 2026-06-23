import type { UseCase } from '../types'

export const ecommerceIntegration: UseCase = {
  id: 'ecommerce-integration',
  vertical: 'integrations',
  title: 'Integración de Ubyca con plataformas de e-commerce',
  problem:
    'Un negocio usa Shopify, Wix, WooCommerce, VTEX, Magento u otra plataforma ' +
    'de comercio electrónico y quiere saber si puede incorporar presencia física ' +
    'verificada en su tienda online — por ejemplo, para habilitar descuentos solo ' +
    'en el local físico, registrar conversiones de visitas presenciales o medir ' +
    'la relación entre tráfico físico y ventas digitales.',
  solution:
    'Puedes habilitar descuentos, precios especiales o contenidos exclusivos en ' +
    'tu e-commerce solo cuando el usuario está físicamente en el local. No existen ' +
    'plugins nativos para Shopify, Wix, WooCommerce ni otras plataformas: la ' +
    'integración se construye vía API REST. Tu plataforma o backend llama a Ubyca ' +
    'para validar si el usuario está en el punto antes de aplicar el beneficio. ' +
    'También puedes usar Smart Proxy para que un enlace de tu e-commerce solo ' +
    'funcione dentro del radio definido. La lógica del carrito vive en tu plataforma; ' +
    'Ubyca aporta el dato de presencia física verificada.',
  capabilities: ['geopoints', 'presence', 'api', 'smart-proxies', 'integrations'],
  matchKeywords: [
    'Shopify', 'Wix', 'WooCommerce', 'VTEX', 'Magento', 'PrestaShop',
    'tienda online', 'tienda en línea', 'tienda virtual',
    'comercio electrónico', 'plataforma e-commerce', 'plataforma de venta online',
    'integrar con Shopify', 'conectar con Wix', 'conectar con WooCommerce',
    'ecommerce', 'e-commerce', 'carrito de compras online',
    'plugin de presencia', 'tienda de comercio electrónico',
  ],
}
