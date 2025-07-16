import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { LambdaFunctionURLEvent } from "aws-lambda";
import { createClient } from "@openauthjs/openauth/client";
import SuperJSON from "superjson";
import { Resource } from "sst";
import { subjects, type UserSubject } from "../auth/subjects";
import { Actor } from "@sst-starter/core/actor";
import { VisibleError } from "@sst-starter/core/error";
import { getTrpcError } from "./util";

const client = createClient({
  clientID: "trpc",
  issuer: Resource.Urls.auth,
});

// created for each request
export const createContext = async ({
  event,
  context,
}: CreateAWSLambdaContextOptions<LambdaFunctionURLEvent>) => {
  async function getSession(): Promise<UserSubject | undefined> {
    let session: UserSubject | undefined;
    // verify token
    if (event.headers["authorization"]) {
      const token = event.headers["authorization"].replace("Bearer ", "");
      if (!token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Missing token",
        });
      }

      const verifyResponse = await client.verify(subjects, token);
      if (verifyResponse.err) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      session = verifyResponse.subject.properties;
    }

    return session;
  }

  const session = await getSession();

  return {
    event,
    context,
    session,
  };
};

export type ApiRequestContext = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<ApiRequestContext>().create({
  transformer: SuperJSON,
  errorFormatter: (opts) => {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        ...(error.cause instanceof VisibleError ? error.cause.toResponse() : {})
      }
    }
  }
});

export const router = t.router;

const loggerMiddleware = t.middleware(async ({ ctx, next }) => {
  console.log(
    `PATH: ${ctx.event.rawPath}`,
    `BODY: ${ctx.event.body}`,
    `QUERY: ${ctx.event.queryStringParameters}`,
    `ACTOR: ${JSON.stringify(Actor.use())}`
  );

  const result = await next({ ctx });

  if (result.ok) {
    console.log(
      `SUCCESSFUL RESPONSE (contents omitted)`
    );
  } else {
    console.log(
      `ERROR: ${result.error.message} cause: ${JSON.stringify(result.error.cause)}`
    );
  }

  return result;
});

const errorHandlerMiddleware = t.middleware(async ({ ctx, next }) => {
  const result = await next({ ctx });
  if (!result.ok) {
    if (result.error.cause instanceof VisibleError) {
      const error = getTrpcError(result.error.cause)
      return {
        ...result,
        error: error,
      }
    }
  }
  return result;
});

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

const actorContextMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session) {
    return Actor.provide("public", {}, () => next({ ctx }));
  }
  return Actor.provide(
    "user",
    {
      userId: ctx.session.userId,
      email: ctx.session.email,
      accountId: ctx.session.accountId,
      accountName: ctx.session.accountName,
      name: ctx.session.name,
    },
    () => next({ ctx })
  );
});

export const publicProcedure = t.procedure.use(
  actorContextMiddleware.unstable_pipe(loggerMiddleware)
);

export const protectedProcedure = t.procedure.use(
  errorHandlerMiddleware.unstable_pipe(
    authMiddleware.unstable_pipe(
      actorContextMiddleware.unstable_pipe(loggerMiddleware)
    )
  )
);
