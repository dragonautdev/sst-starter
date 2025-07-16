import { VisibleError } from "@sst-starter/core/error";
import { TRPCError } from "@trpc/server";

export const getTrpcError = (error: VisibleError) => {
  switch (error.type) {
    case "authentication":
      return new TRPCError({
        code: "UNAUTHORIZED",
        message: error.message,
        cause: error,
      })
    case 'validation': 
      return new TRPCError({
        code: "BAD_REQUEST",
        message: error.message,
        cause: error,
      })
    case 'forbidden': 
      return new TRPCError({
        code: "FORBIDDEN",
        message: error.message,
        cause: error,
      })
    case 'not_found':
      return new TRPCError({
        code: "NOT_FOUND",
        message: error.message,
        cause: error,
      })
    case 'internal': 
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        cause: error,
      })
    default:
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        cause: error,
      })
  }
}