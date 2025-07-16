//import { eq } from "drizzle-orm";
import { createContext } from "./context";
import { ErrorCodes, VisibleError } from "./error";
import { Log } from "./util/log";

export namespace Actor {
  export interface UserActor {
    type: "user";
    properties: {
      accountId: string;
      accountName: string;
      userId: string;
      email: string;
      name: string;
    };
  }

  export interface PublicActor {
    type: "public";
    properties: {};
  }

  export interface ProcessActor {
    type: "process";
    properties: {
      accountId: number;
      accountName: string;
    };
  }

  type Info = UserActor | PublicActor | ProcessActor;
  export const Context = createContext<Info>();

  export function userId() {
    const actor = Context.use();
    if (actor.type === "user") return actor.properties.userId;
    throw new VisibleError(
      "authentication",
      ErrorCodes.Authentication.UNAUTHORIZED,
      `You don't have permission to access this resource`,
    );
  }

  export function accountId() {
    const actor = Context.use();
    if (actor.type === "user" || actor.type === "process")
      return actor.properties.accountId;
    throw new VisibleError(
      "authentication",
      ErrorCodes.Authentication.UNAUTHORIZED,
      `You don't have permission to access this resource`,
    );
  }

  export function use() {
    try {
      return Context.use();
    } catch {
      return { type: "public", properties: {} } as PublicActor;
    }
  }

  export function assert<T extends Info["type"]>(type: T) {
    const actor = use();
    if (actor.type !== type)
      throw new VisibleError(
        "authentication",
        ErrorCodes.Authentication.UNAUTHORIZED,
        `Actor is not "${type}"`,
      );
    return actor as Extract<Info, { type: T }>;
  }

  export function provide<
    T extends Info["type"],
    Next extends (...args: any) => any,
  >(type: T, properties: Extract<Info, { type: T }>["properties"], fn: Next) {
    return Context.provide({ type, properties } as any, () =>
      Log.provide(
        {
          actor: type,
          ...properties,
        },
        fn,
      ),
    );
  }
}
