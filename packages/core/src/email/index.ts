import { z } from "zod/v4";
import { defineEvent } from "../event";

export module Email {
  export const Event = {
    ConfirmEmail: defineEvent('email.confirm-email', z.object({
      email: z.string(),
      code: z.string(),
    })),
    LoginCode: defineEvent('email.login-code', z.object({
      email: z.string(),
      code: z.string(),
    })),
  }
}