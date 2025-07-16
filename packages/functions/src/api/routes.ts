import { route as user } from "./routes/user";
import { route as files } from "./routes/files";
import { router } from "./trpc";

export const appRouter = router({
  user,
  files,
})

export type AppRouter = typeof appRouter;
