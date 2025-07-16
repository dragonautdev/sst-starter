import { AppLayout } from "@/components/layout/AppLayout"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )

}