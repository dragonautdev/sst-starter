import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export module S3 {
  const s3Client = new S3Client();

  export const downloadFileAsBase64 = async (
    bucket: string,
    key: string,
  ): Promise<string> => {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const response = await s3Client.send(command);

      if (!response.Body) {
        throw new Error(`No body found in S3 object: ${bucket}/${key}`);
      }

      // Convert the readable stream to a buffer
      const chunks: Uint8Array[] = [];
      const reader = response.Body.transformToWebStream().getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const buffer = Buffer.concat(chunks);
      return buffer.toString("base64");
    } catch (error) {
      console.error(`Error downloading file from S3: ${bucket}/${key}`, error);
      throw new Error(`Failed to download file from S3: ${bucket}/${key}`);
    }
  };

  export const getFileExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) return "";
    return filename.substring(lastDotIndex + 1).toLowerCase();
  };

  export const getMimeType = (filename: string): string => {
    const extension = getFileExtension(filename);
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      rtf: "application/rtf",
      odt: "application/vnd.oasis.opendocument.text",
      pages: "application/x-iwork-pages-sffpages",
      md: "text/markdown",
      html: "text/html",
      htm: "text/html",
    };
    return mimeTypes[extension] || "application/octet-stream";
  };

  export const getS3Url = async (
    bucket: string,
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> => {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expiresIn,
    });
    return url;
  };
}
