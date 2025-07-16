import { ulid } from "ulid";

export const prefixes = {
  user: "usr",
  account: "acc",
  contract: "ctr",
  review: "rev",
  submission: 'sub',
  agreement: 'agr'
} as const;

export function createID(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], ulid()].join("_");
}