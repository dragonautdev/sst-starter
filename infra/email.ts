import { emailSender, urls } from "./common";

export const emailsBus = new sst.aws.Bus("EmailsBus");

emailsBus.subscribe("Emails", {
  name: `${$app.name}-emails-${$app.stage}`,
  handler: 'packages/emails/src/send.handler',
  transform: {
    function: {
      name: `${$app.name}-emails-${$app.stage}`,
      tags: {
        stage: $app.stage,
        service: "emails",
        project: $app.name,
      }
    }
  },
  runtime: 'nodejs22.x',
  link: [emailSender, urls],
  nodejs: {
    install: ['sharp'],
  },
  permissions: [{
    actions: ["ses:*"],
    resources: ["*"],
  }],
  timeout: "10 minutes",
  tags: {
    stage: $app.stage,
    service: 'email',
    project: $app.name
  }
})