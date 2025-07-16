import { event } from "sst/event";
import { Actor } from "./actor";
import { ZodType, z } from "zod/v4";


function ZodValidator<Schema extends ZodType>(
  schema: Schema,
): (input: z.input<Schema>) => z.output<Schema> {
  return (input) => {
    return schema.parse(input);
  };
}

export const defineEvent = event.builder({
  validator: ZodValidator,
  metadata() {
    return {
      actor: Actor.use(),
    };
  },
});