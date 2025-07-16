import { z } from "zod";

const userSubject = z.object({
  userId: z.string(),
  email: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  name: z.string(),
})

export type UserSubject = z.infer<typeof userSubject>

export const subjects = {
  user: userSubject,
}

