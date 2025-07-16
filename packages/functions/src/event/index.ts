import { bus } from 'sst/aws/bus';
import { Actor } from '@sst-starter/core/actor';
import { Log } from '@sst-starter/core/util/log';

const log = Log.create({ namespace: "event" });

export const handler = bus.subscriber(
  [],
  async (event) => Actor.provide(event.metadata.actor.type, event.metadata.actor.properties, async () => {
    log.info(`Received:`, {
      type: event.type,
      ...event.properties
    })
    const actor = Actor.use();
    switch (event.type) {
      default: {
        break;
      }
    }
  })
)