import { z } from "zod/v4";
import { fn } from "../util/fn";
import { Actor } from "../actor";
import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";
import { Resource } from "sst";

export module Realtime {
  export const RealtimeTopic = z.enum(["notification"]);
  export type RealtimeTopic = z.infer<typeof RealtimeTopic>;

  export const send = fn(
    z.object({
      payload: z.any(),
      topic: RealtimeTopic,
    }),
    async (input) => {
      const userId = Actor.userId();
      try {
        const iotDataClient = new IoTDataPlaneClient();
        await iotDataClient.send(
          new PublishCommand({
            payload: Buffer.from(JSON.stringify(input.payload)),
            topic: `${Resource.App.name}/${Resource.App.stage}/${userId}/${input.topic}`,
          }),
        );
      } catch (error) {
        console.error(error);
      }
    },
  );
}
