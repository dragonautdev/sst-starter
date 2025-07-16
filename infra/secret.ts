import { BUILD_ID } from "./common";

export const secret = {
  buildId: new sst.Secret('BuildId', BUILD_ID),
  googleClientId: new sst.Secret('GoogleClientId'),
  googleClientSecret: new sst.Secret('GoogleClientSecret'),
}
export const allSecrets = Object.values(secret);