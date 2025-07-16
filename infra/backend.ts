import { urls } from "./common";

export const realtimeNotifications = new sst.aws.Realtime(
  "CustomerNotifications",
  {
    authorizer: {
      handler: "packages/functions/src/realtime/authorizer.handler",
      link: [urls],
      transform: {
        logGroup: {
          retentionInDays: 1,
        },
      },
      memory: "256 MB",
      runtime: "nodejs22.x",
      timeout: "10 seconds",
      name: `${$app.name}-realtime-notifications-authorizer-${$app.stage}`,
      tags: {
        stage: $app.stage,
        service: "backend",
        project: $app.name,
      }
    },
  },
);