import { ZodType, z } from "zod/v4";

export function fn<
  Schema extends ZodType,
  Output,
  InputType = z.input<Schema>,
  ParsedType = z.output<Schema>
>(
  schema: Schema,
  cb: (arg: ParsedType) => Output
): (input: InputType) => Output {
  return (input: InputType): Output => {
    const parsed = schema.parse(input);
    return cb(parsed as ParsedType);
  };
}
