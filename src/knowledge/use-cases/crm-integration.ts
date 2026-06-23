import type { UseCase } from '../types'

export const crmIntegration: UseCase = {
  id: 'crm-integration',
  vertical: 'integrations',
  title: 'Integración de presencia verificada con CRM y Salesforce',
  problem:
    'Un equipo comercial usa Salesforce u otro CRM para gestionar vendedores, ' +
    'cuentas y oportunidades. Quieren registrar automáticamente en el CRM cuándo ' +
    'un vendedor visitó un cliente o punto de venta, con validación GPS objetiva, ' +
    'sin depender de partes manuales ni auto-declaración.',
  solution:
    'Ubyca entrega resultados de validación de presencia vía API REST. El sistema ' +
    'integrador — el propio CRM, un middleware o un proceso backend — lee esos ' +
    'resultados y los asocia a contactos, cuentas, oportunidades o actividades ' +
    'en Salesforce. Ubyca no ofrece un conector nativo plug-and-play para Salesforce: ' +
    'la integración requiere desarrollo vía API. La arquitectura típica es: app ' +
    'del vendedor → API de Ubyca (valida presencia) → tu backend → Salesforce API. ' +
    'Cualquier sistema que pueda hacer llamadas HTTP puede consumir resultados de Ubyca.',
  capabilities: ['geopoints', 'presence', 'api', 'integrations'],
  matchKeywords: [
    'Salesforce', 'CRM', 'integrar con CRM', 'conectar con Salesforce',
    'registrar visitas en CRM', 'sincronizar con Salesforce',
    'enviar datos a CRM', 'integración con sistema externo',
    'sistema externo', 'ERP', 'HubSpot', 'SAP',
    'plataforma de ventas', 'conectar con sistema',
    'enviar validaciones a sistema', 'API externa',
  ],
}
