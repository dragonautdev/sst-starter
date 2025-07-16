import { realtimeNotifications } from "./backend"
import { appTable, billingTable } from "./database"
import { emailsBus } from "./email"
import { allSecrets } from "./secret"
import { customerFilesBucket } from "./storage"

export const eventBus = new sst.aws.Bus('EventBus')

eventBus.subscribe('Event', {
  handler: 'packages/functions/src/event/index.handler',
  link: [appTable, customerFilesBucket, eventBus, emailsBus, realtimeNotifications, ...allSecrets],
  timeout: '15 minutes',
  name: `${$app.name}-event-${$app.stage}`,
  transform: {
    function: {
      name: `${$app.name}-event-${$app.stage}`,
      tags: {
        project: $app.name,
        stage: $app.stage,
        service: 'backend',
      }
    }
  },
  tags: {
    project: $app.name,
    stage: $app.stage,
    service: 'backend',
  }
})