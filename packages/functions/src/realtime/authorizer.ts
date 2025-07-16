import { createClient } from "@openauthjs/openauth/client";
import { Resource } from "sst";
import { realtime } from "sst/aws/realtime";
import { subjects } from "../auth/subjects";

const client = createClient({
  clientID: "realtime",
  issuer: Resource.Urls.auth,
});

export const handler = realtime.authorizer(async (token) => {
  const prefix = `${Resource.App.name}/${Resource.App.stage}`;

  try {
    const verifyResponse = await client.verify(subjects, token);
    if (verifyResponse.err) {
      return {
        publish: [],
        subscribe: [],
      };
    } else {
      return {
        publish: [`${prefix}/${verifyResponse.subject.properties.userId}/*`],
        subscribe: [`${prefix}/${verifyResponse.subject.properties.userId}/*`],
      };
    }
  } catch (error: any) {
    return {
      publish: [],
      subscribe: [],
    };
  }
});
