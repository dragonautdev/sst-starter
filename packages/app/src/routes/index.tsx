import { useAuth } from "@/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index () {
  const auth = useAuth();

  if (auth.loggedIn) {

    return <Navigate to="/dashboard" />
  }

  return <Spinner />
}