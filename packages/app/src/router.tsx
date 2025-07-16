import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Spinner } from "./components/ui/spinner";
import Page404 from "./404";
import ErrorBoundary from "./ErrorBoundary";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./lib/trpc";
import { api, TRPCProvider } from "./lib/trpc";
import { queryClient } from "./lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: api,
  queryClient
});

// Create a new router instance
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadGcTime: 1000,
  context: { queryClient, trpc },
  defaultPendingComponent: () => (
    <div className="p-2 text-2xl">
      <Spinner />
    </div>
  ),
  defaultNotFoundComponent: Page404,
  defaultErrorComponent: ErrorBoundary,
  Wrap: function WrapComponent({ children }) {
    const { loaded } = useAuth();

    if (!loaded) {
      return (
        <div className="p-2 text-2xl">
          <Spinner />
        </div>
      );
    } 

    return (
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={api} queryClient={queryClient}>
          {children}
        </TRPCProvider>
      </QueryClientProvider>
    );
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
