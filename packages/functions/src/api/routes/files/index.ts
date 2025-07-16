import { protectedProcedure, router } from "../../trpc";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Actor } from "@sst-starter/core/actor";
import { Resource } from "sst";
import { z } from "zod";


const s3Client = new S3Client();

export const route = router({
  getUploadUrl: protectedProcedure.input(z.object({
    scope: z.enum(["user"]),
    name: z.string(),
    path: z.string(),
    contentType: z.string(),
    size: z.number(),
    metadata: z.record(z.string(), z.string()).optional(),
  })).mutation(async ({ input }) => {
    const userId = Actor.userId()

    const command = new PutObjectCommand({
      Bucket: Resource.CustomerFiles.name,
      Key: `${userId}/${input.path}/${input.name}`,
      ContentType: input.contentType,
      ContentLength: input.size,
      Metadata: input.metadata,
    });
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 5
    });
    return {
      url,
      key: command.input.Key
    };
  }),
});
