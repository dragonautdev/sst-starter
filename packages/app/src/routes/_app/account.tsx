import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/account')({
  component: AccountRouteComponent,
})

function AccountRouteComponent() {
  return <div>Account</div>
} 