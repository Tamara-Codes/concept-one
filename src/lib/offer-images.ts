import "server-only";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2BucketName, getR2Client } from "@/lib/storage/r2";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const imageExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export class InvalidOfferImageError extends Error {}

export async function saveOfferImage(bytes: Uint8Array, contentType: string) {
  if (!imageExtensions[contentType]) {
    throw new InvalidOfferImageError("Slika mora biti PNG, JPEG, WebP ili GIF do 4 MB.");
  }
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) {
    throw new InvalidOfferImageError("Slika mora biti PNG, JPEG, WebP ili GIF do 4 MB.");
  }

  const key = `offers/images/${crypto.randomUUID()}.${imageExtensions[contentType]}`;
  await getR2Client().send(new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    Body: bytes,
    ContentType: contentType,
  }));
  return { key, contentType };
}
