import { createHash } from "crypto";
import type { Context } from "hono";

export const isValidDigest = (c: Context): boolean => {
  const auth = c.req.header("Authorization");
  const timestamp = c.req.header("X-Timestamp");
  const requestId = c.req.header("X-Request-Id");

  if (
    !auth?.startsWith("Digest ") ||
    !timestamp ||
    !requestId
  ) {
    return false;
  }

  
  if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000) {
    return false;
  }

  const expectedDigest = createHash("sha256")
    .update(
      `${requestId}_${timestamp}`
    )
    .digest("hex");

  return auth.slice(7) === expectedDigest;
};


import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  scryptSync,
} from "crypto";

const ALGORITHM = "aes-256-gcm";


export function encrypt(text: string, password: string): string {
  const iv = randomBytes(16);
  const key = scryptSync(password, "salt", 32);

  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}
export function decrypt(data: string, password: string): string {
  const buffer = Buffer.from(data, "base64");

  const iv = buffer.subarray(0, 16);
  const tag = buffer.subarray(16, 32);
  const encrypted = buffer.subarray(32);

  const key = scryptSync(password, "salt", 32);

  const decipher = createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}