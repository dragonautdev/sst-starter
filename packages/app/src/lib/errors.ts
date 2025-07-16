import { TRPCError } from "@trpc/server";

export const handleError = (error: any) => {
  console.error(error);
  if (error instanceof TRPCError) {
    
  }
}