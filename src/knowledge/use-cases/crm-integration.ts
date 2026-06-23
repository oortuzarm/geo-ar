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
    'Puedes registrar automáticamente en Salesforce o cualquier CRM cuándo un ' +
    'vendedor visitó un cliente o punto de venta, con validación GPS objetiva. ' +
    'No existe un conector nativo plug-and-play para Salesforce: la integración ' +
    'se realiza vía API REST. El flujo típico es tu app de ventas → API de Ubyca ' +
    '(valida presencia) → tu backend → Salesforce. Cualquier sistema con capacidad ' +
    'HTTP puede consumir los resultados.',
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
