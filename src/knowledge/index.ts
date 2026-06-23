import type { KnowledgeBase } from './types'
import { product } from './product'
import { studio } from './capabilities/studio'
import { api } from './capabilities/api'
import { geopoints } from './capabilities/geopoints'
import { presence } from './capabilities/presence'
import { analytics } from './capabilities/analytics'
import { liveVisits } from './capabilities/live-visits'
import { spatialIntelligence } from './capabilities/spatial-intelligence'
import { smartProxies } from './capabilities/smart-proxies'
import { integrations } from './capabilities/integrations'
import { fieldSalesVisits, fieldSalesSupervision, fieldSalesDelivery } from './use-cases/field-sales'
import { eventsAccess, eventsExperience, eventsAnalytics } from './use-cases/events'
import { retailDwellTime, retailPromotion, retailSmartProxy } from './use-cases/retail'
import { loyaltyPhysicalVisits, loyaltyMultiLocation, loyaltyEngagement } from './use-cases/loyalty'
import { tourismRoutes, tourismVerification, tourismCityAnalytics } from './use-cases/tourism'
import { educationAttendance, educationCampusExperience, educationFieldTrips } from './use-cases/education'
import { municipalitiesPublicServices, municipalitiesUrbanAnalysis, municipalitiesInspection } from './use-cases/municipalities'
import { realEstateVisits, realEstateOpenHouse, realEstatePortfolio, realEstateBuilding } from './use-cases/real-estate'
import { operationsSafety, operationsMaintenanceRoutes, operationsFleetTracking } from './use-cases/operations'
import { healthHomeVisits, healthFieldWorkers, healthOutpatient } from './use-cases/health'
import { brandActivationCampaign, brandActivationLaunch, brandActivationExperience } from './use-cases/brand-activations'
import { crmIntegration } from './use-cases/crm-integration'
import { localBusinessProximityPromo, localBusinessFootfall, localBusinessContextualMessage } from './use-cases/local-business'
import { urbanMobilityStudy, fairMovementAnalysis } from './use-cases/urban-analytics'
import { geolocationARExperience } from './use-cases/geolocated-experiences'
import { ecommerceIntegration } from './use-cases/ecommerce'
import { geolocatedCatalog } from './use-cases/geolocated-catalog'
import { presenceRegistration } from './use-cases/presence-registration'
import { productOverview, productCapabilities } from './use-cases/product-questions'
import { spatialConcentration } from './use-cases/spatial-concentration'
import { limitations } from './limitations'

export const knowledge: KnowledgeBase = {
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
    integrations,
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
    productOverview,
    productCapabilities,
    spatialConcentration,
  ],
  limitations,
}

export function knowledgeToPromptText(kb: KnowledgeBase = knowledge): string {
  const lines: string[] = []

  lines.push(`# Producto: ${kb.product.name}`)
  lines.push(kb.product.tagline)
  lines.push('')
  lines.push(kb.product.description)
  lines.push('')
  lines.push(`**Posicionamiento:** ${kb.product.positioning}`)
  lines.push(`**Puntos de acceso:** ${kb.product.accessPoints.join(', ')}`)
  lines.push('')

  lines.push('## Capacidades')
  for (const cap of kb.capabilities) {
    lines.push(`### ${cap.name}`)
    lines.push(`_${cap.tagline}_`)
    lines.push(cap.description)
    lines.push('')
    lines.push('Características clave:')
    for (const f of cap.keyFeatures) {
      lines.push(`- ${f}`)
    }
    lines.push(`Para quién: ${cap.whoIsItFor}`)
    if (cap.apiEndpoints?.length) {
      lines.push(`Endpoints: ${cap.apiEndpoints.join(', ')}`)
    }
    lines.push('')
  }

  lines.push('## Casos de uso')
  const verticals = [...new Set(kb.useCases.map(u => u.vertical))]
  for (const vertical of verticals) {
    const cases = kb.useCases.filter(u => u.vertical === vertical)
    lines.push(`### ${vertical}`)
    for (const uc of cases) {
      lines.push(`#### ${uc.title}`)
      lines.push(`**Problema:** ${uc.problem}`)
      lines.push(`**Solución:** ${uc.solution}`)
      lines.push(`**Capacidades involucradas:** ${uc.capabilities.join(', ')}`)
      lines.push('')
    }
  }

  lines.push('## Limitaciones conocidas')
  for (const lim of kb.limitations) {
    lines.push(`### ${lim.area}`)
    lines.push(lim.description)
    if (lim.workaround) {
      lines.push(`**Alternativa:** ${lim.workaround}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

export type { KnowledgeBase, Capability, UseCase, Limitation, ProductInfo } from './types'
