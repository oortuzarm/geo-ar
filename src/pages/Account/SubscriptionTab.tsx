import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PaymentMethod {
  last4:    string
  brand:    'Visa' | 'Mastercard' | 'Amex' | 'Other'
  type:     'Crédito' | 'Débito'
  expMonth: number
  expYear:  number
}

export interface ActiveSubscription {
  orderId:       string
  nextBillingAt: string
  planName:      string
  billingCycle:  'Mensual' | 'Anual'
  paymentMethod: string
  amount:        string
  currency:      string
}

export interface PaymentRecord {
  orderId:       string
  date:          string
  status:        'Pagado' | 'Fallido' | 'Reembolsado'
  billingCycle:  'Mensual' | 'Anual'
  paymentMethod: string
  amount:        string
  currency:      string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_PAYMENT_METHOD: PaymentMethod = {
  last4:    '4242',
  brand:    'Visa',
  type:     'Crédito',
  expMonth: 8,
  expYear:  2028,
}

const MOCK_SUBSCRIPTION: ActiveSubscription = {
  orderId:       'ORD-UBYCA-0001',
  nextBillingAt: '22/06/2026',
  planName:      'Pro',
  billingCycle:  'Mensual',
  paymentMethod: 'Tarjeta de crédito',
  amount:        '19',
  currency:      'USD',
}

const MOCK_PAYMENT_HISTORY: PaymentRecord[] = [
  {
    orderId:       'ORD-UBYCA-0001',
    date:          '22/05/2026',
    status:        'Pagado',
    billingCycle:  'Mensual',
    paymentMethod: 'Tarjeta de crédito',
    amount:        '19',
    currency:      'USD',
  },
  {
    orderId:       'ORD-UBYCA-0000',
    date:          '22/04/2026',
    status:        'Pagado',
    billingCycle:  'Mensual',
    paymentMethod: 'Tarjeta de crédito',
    amount:        '19',
    currency:      'USD',
  },
]

// ── Shared primitives ─────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900/70 border border-white/[0.07] rounded-2xl px-6 py-5 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-gray-100">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-gray-200">{children}</span>
    </div>
  )
}

// ── PaymentMethodCard ─────────────────────────────────────────────────────────

function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  const expFormatted = `${String(method.expMonth).padStart(2, '0')}/${method.expYear}`

  function handleChange() {
    // TODO: open Paddle payment method update overlay when integrated
    console.log('[SUBSCRIPTION] handleChangePaymentMethod — Paddle not yet integrated')
  }

  return (
    <Card>
      <SectionHeader title="Método de pago" subtitle="Tarjeta guardada en tu cuenta." />

      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-9 rounded-lg bg-gray-800 border border-white/[0.08] flex items-center justify-center shrink-0">
          <span className="text-xs font-bold tracking-widest text-gray-300">{method.brand.toUpperCase()}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-100 tracking-wider">
            •••• •••• •••• {method.last4}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {method.type} · {method.brand} · Vence {expFormatted}
          </p>
        </div>
      </div>

      <button
        onClick={handleChange}
        className="px-4 py-2 text-sm font-medium rounded-md border border-gray-700
                   text-gray-300 hover:bg-gray-800 hover:border-gray-600
                   transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600
                   focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Cambiar método de pago
      </button>
    </Card>
  )
}

// ── ActiveSubscriptionCard ────────────────────────────────────────────────────

function ActiveSubscriptionCard({ subscription: sub }: { subscription: ActiveSubscription }) {
  function handleCancel() {
    // TODO: trigger Paddle cancellation flow when integrated
    console.log('[SUBSCRIPTION] handleCancelSubscription — Paddle not yet integrated')
  }

  return (
    <Card>
      <SectionHeader title="Suscripción activa" subtitle="Detalles de tu plan actual." />

      <div className="divide-y divide-white/[0.05] mb-5">
        <InfoRow label="Número de orden">
          <span className="font-mono text-xs text-gray-300">{sub.orderId}</span>
        </InfoRow>
        <InfoRow label="Próximo pago">{sub.nextBillingAt}</InfoRow>
        <InfoRow label="Plan actual">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
            {sub.planName}
          </span>
        </InfoRow>
        <InfoRow label="Facturación">{sub.billingCycle}</InfoRow>
        <InfoRow label="Método de pago">{sub.paymentMethod}</InfoRow>
        <InfoRow label="Monto">
          <span className="font-medium tabular-nums">{sub.currency} {sub.amount}</span>
        </InfoRow>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/app/plans"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
                     bg-brand-600 hover:bg-brand-700 text-white transition-colors
                     focus:outline-none focus:ring-2 focus:ring-brand-500
                     focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Mejorar plan
        </Link>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium rounded-md border border-red-800/50
                     text-red-400 hover:bg-red-900/20 hover:border-red-700/60
                     transition-colors focus:outline-none"
        >
          Cancelar suscripción
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-600">
        ¿Necesitas ayuda con tu suscripción?{' '}
        <button
          onClick={() => console.log('[SUPPORT] Contact support')}
          className="text-gray-500 hover:text-gray-400 underline underline-offset-2 transition-colors"
        >
          Contáctanos.
        </button>
      </p>
    </Card>
  )
}

// ── PaymentHistoryTable ───────────────────────────────────────────────────────

const STATUS_CLASSES: Record<PaymentRecord['status'], string> = {
  Pagado:      'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40',
  Fallido:     'bg-red-900/30 text-red-400 border border-red-800/40',
  Reembolsado: 'bg-amber-900/30 text-amber-400 border border-amber-800/40',
}

function PaymentHistoryTable({ records }: { records: PaymentRecord[] }) {
  function downloadInvoice(orderId: string) {
    // TODO: replace with Paddle invoice PDF URL when integrated
    console.log(`[INVOICE] downloadInvoice(${orderId}) — Paddle not yet integrated`)
  }

  return (
    <Card>
      <SectionHeader
        title="Historial de pagos"
        subtitle="Registro de todos los cobros en tu cuenta."
      />

      {records.length === 0 ? (
        <p className="text-sm text-gray-500">No hay pagos registrados aún.</p>
      ) : (
        // -mx-6 counteracts card's px-6 so the table bleeds edge-to-edge
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {(['Número de orden', 'Fecha', 'Estado', 'Facturación', 'Método de pago', 'Monto'] as const).map(col => (
                  <th
                    key={col}
                    className="px-6 pb-3 text-left text-xs font-medium text-gray-500
                               uppercase tracking-wide whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {records.map(record => (
                <tr
                  key={record.orderId}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => downloadInvoice(record.orderId)}
                      className="font-mono text-xs text-brand-400 hover:text-brand-300
                                 underline underline-offset-2 transition-colors"
                    >
                      {record.orderId}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-gray-400">
                    {record.date}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full
                                      text-xs font-medium ${STATUS_CLASSES[record.status]}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-gray-400">
                    {record.billingCycle}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-gray-400">
                    {record.paymentMethod}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap font-medium tabular-nums text-gray-200">
                    {record.currency} {record.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

// ── SubscriptionTab ───────────────────────────────────────────────────────────

export default function SubscriptionTab() {
  return (
    <div className="space-y-4">
      <PaymentMethodCard   method={MOCK_PAYMENT_METHOD}           />
      <ActiveSubscriptionCard subscription={MOCK_SUBSCRIPTION}   />
      <PaymentHistoryTable    records={MOCK_PAYMENT_HISTORY}      />
    </div>
  )
}
