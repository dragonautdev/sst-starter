import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { inferRouterOutputs } from '@trpc/server'

import type { AppRouter } from '../../../functions/src/api/routes'
import { createTRPCClient, httpBatchLink, httpLink, splitLink } from '@trpc/client';
import SuperJSON from 'superjson';
import * as auth from './auth';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export const api = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        // check for context property `skipBatch`
        return Boolean(op.context.skipBatch)
      },
      true: httpLink({
        transformer: SuperJSON,
        url: `${import.meta.env.VITE_API_URL}`,
        headers: async () => {
          const token = await auth.getToken()
          if (token) {
            return {
              Authorization: `Bearer ${token}`,
            }
          } else {
            return {}
          }
        },
      }),
      false: httpBatchLink({
        transformer: SuperJSON,
        url: `${import.meta.env.VITE_API_URL}`,
        headers: async () => {
          const token = await auth.getToken()
          if (token) {
            return {
              Authorization: `Bearer ${token}`,
            }
          } else {
            return {}
          }
        },
      }),
    }),
  ],
})

//type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>
export type UserInfo = RouterOutputs['user']['get']
export type { AppRouter }