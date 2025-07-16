import {
  awsLambdaRequestHandler,
} from "@trpc/server/adapters/aws-lambda";
import { appRouter } from "./routes";
import { createContext } from "./trpc";

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});

export { t } from './trpc'

export type AppRouter = typeof appRouter
