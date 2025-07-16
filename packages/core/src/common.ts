import { z } from "zod/v4";

export module Common {
  export const IdDescription = `Unique object identifier.
The format and length of IDs may change over time.`;

  export const LimitDescription = "Number of items to return. Minimum 1. Maximum 200.";
  export const OffsetDescription = "Number of items to skip. Minimum 0.";
  export const SortDescription = "Sort order. desc or asc. Default is desc for descending.";
  export const SortByDescription = "Sort by field. Default is id.";

  export const BaseListParams = z.object({
    limit: z.number().int().nonnegative().max(200).optional().default(25).describe(LimitDescription),
    offset: z.number().int().nonnegative().optional().default(0).describe(OffsetDescription),
    sort: z.enum(["asc", "desc"]).optional().default("desc").describe(SortDescription),
    sort_by: z.string().optional().default("id").describe(SortByDescription),
  })

  export const DateField = z.date().transform((date) => date.toISOString());

  export const IdField = z.number().int().nonnegative()

  export const AddressField = z.object({
    name: z.string().optional().default(""),
    email: z.string().optional().default(""),
    first_name: z.string().optional().default(""),
    last_name: z.string().optional().default(""),
    address1: z.string().optional().default(""),
    address2: z.string().optional().default(""),
    city: z.string().optional().default(""),
    state: z.string().optional().default(""),
    zip: z.string().optional().default(""),
    country: z.string().optional().default(""),
    phone: z.string().optional().default(""),
  })
}
