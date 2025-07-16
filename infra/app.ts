import { appTable } from "./database";
import { allSecrets, secret } from "./secret";
import { eventBus } from "./bus";
import { emailSender, urls } from "./common";
import { customerFilesBucket } from "./storage";
import { realtimeNotifications } from "./backend";
import { dns, domain } from "./dns";
import { emailsBus } from "./email";

export const appRouter = new sst.aws.Router("AppRouter", {
  transform: {
    cdn: {
      tags: {
        project: $app.name,
        stage: $app.stage,
      },
      transform: {
        distribution: {
          priceClass: "PriceClass_100",
          comment: "SST Starter",
          tags: {
            project: $app.name,
            stage: $app.stage,
            service: "app",
          },
        },
      },
    },
  },
  domain: {
    name: domain,
    aliases: [`*.${domain}`],
    dns: dns
  }
});

export const auth = new sst.aws.Auth("Auth", {
  issuer: {
    handler: "packages/functions/src/auth/index.handler",
    link: [urls, appTable, eventBus, emailSender, emailsBus, ...allSecrets],
    url: true,
    name: `${$app.name}-auth-${$app.stage}`,
    tags: {
      project: $app.name,
      stage: $app.stage,
      service: "auth",
    },
    runtime: "nodejs22.x",
    timeout: "10 minutes",
    memory: "1024 MB",
  },
});

appRouter.route(`auth.${domain}`, auth.url);

export const apiFunction = new sst.aws.Function("TrpcApiFunction", {
  handler: "packages/functions/src/api/index.handler",
  link: [
    urls,
    appTable,
    eventBus,
    auth,
    customerFilesBucket,
    emailSender,
    emailsBus,
    realtimeNotifications,
    ...allSecrets,
  ],
  memory: "2048 MB",
  url: {
    router: {
      instance: appRouter,
      domain: `trpc.${domain}`
    },
  },
  timeout: "10 minutes",
  runtime: "nodejs22.x",
  name: `${$app.name}-trpc-api-${$app.stage}`,
  tags: {
    project: $app.name,
    stage: $app.stage,
    service: "api",
  },

});

export const app = new sst.aws.StaticSite("WebApp", {
  path: "packages/app",
  indexPage: "index.html",
  router: {
    instance: appRouter,
    domain: `app.${domain}`,
  },
  build: {
    output: "dist",
    command: "CI= pnpm build",
  },
  environment: {
    VITE_API_URL: urls.properties.api,
    VITE_AUTH_URL: urls.properties.auth,
    VITE_STAGE: $app.stage,
    VITE_APP: $app.name,
    VITE_REALTIME_NOTIFICATIONS_AUTHORIZER:
      realtimeNotifications.authorizer.apply((v) => v.toString()),
    VITE_REALTIME_NOTIFICATIONS_ENDPOINT: realtimeNotifications.endpoint.apply(
      (v) => v.toString(),
    ),
    VITE_BUILD_ID: secret.buildId.value.apply((v) => v.toString()),
  },
});
