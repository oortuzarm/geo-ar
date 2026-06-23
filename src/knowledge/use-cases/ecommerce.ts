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
    'Tu e-commerce no sabe si el usuario que está navegando también está en tu ' +
    'tienda física en ese momento. Ubyca agrega esa capa: cuando el cliente está ' +
    'presente en el local, tu plataforma puede mostrarle un beneficio exclusivo ' +
    'que no existe online — precio de local, descuento por visita, contenido de ' +
    'producto reservado para quien está presente. La integración es vía API REST: ' +
    'tu backend consulta a Ubyca, recibe la validación en menos de 80 ms y decide ' +
    'si mostrar el beneficio. Funciona con cualquier plataforma que soporte llamadas ' +
    'HTTP — Shopify, WooCommerce, VTEX, backend propio.',
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
