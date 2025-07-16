import { Actor } from "@sst-starter/core/actor";
import { protectedProcedure, router } from "../trpc";
import { User } from "@sst-starter/core/user";
import { ErrorCodes, VisibleError } from "@sst-starter/core/error";

export const route = router({
  me: protectedProcedure.query(async () => {
    const actor = Actor.use();
    return actor;
  }),
  get: protectedProcedure.query(
    async (): Promise<User.Info> => {
      console.log("me");
      const user = await User.fromId(Actor.userId());
      if (!user) {
        throw new VisibleError(
          "not_found",
          ErrorCodes.NotFound.RESOURCE_NOT_FOUND,
          `User not found`,
          undefined,
          {
            id: Actor.userId(),
          }
        );
      }
      return user;
    }
  ),
  update: protectedProcedure.input(User.Update).mutation(async ({ input }) => {
    const user = await User.update(input);
    return user;
  }),
});
