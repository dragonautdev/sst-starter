import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/billing')({
  component: BillingRouteComponent,
})

function BillingRouteComponent() {
  return <div>Billing</div>
} 