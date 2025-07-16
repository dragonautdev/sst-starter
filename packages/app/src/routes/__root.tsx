import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../lib/trpc";
import { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RealtimeProvider } from "@/RealtimeContext";

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>;
  queryClient: QueryClient;
  getTitle?: () => string;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  beforeLoad: async ({ context }) => {
    const { trpc, queryClient } = context;
    const userProfile = await queryClient.ensureQueryData(trpc.user.get.queryOptions(undefined, {
      staleTime: Infinity
    }))

    return {
      userProfile,
    }
  },
});

function RootComponent() {
  return (
    <React.Fragment>
      <RealtimeProvider>
        <Outlet />
      </RealtimeProvider>
      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools position="bottom" buttonPosition="bottom-left" />
        </>
      )}
    </React.Fragment>
  );
}
