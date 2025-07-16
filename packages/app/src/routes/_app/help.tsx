import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/help')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/help"!</div>
}
