import { sha256HexFallback, utf8ToBytes } from "./polyfill.js";

const HAS_WEBCRYPTO =
  typeof globalThis !== "undefined" &&
  !!globalThis.crypto &&
  !!globalThis.crypto.subtle &&
  typeof globalThis.crypto.subtle.digest === "function";

const HAS_NODE =
  typeof process !== "undefined" && !!process.versions && !!process.versions.node;

let nodeCryptoPromise: Promise<typeof import("crypto")> | null = null;

export function toHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

export async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const bytes = typeof data === "string" ? utf8ToBytes(data) : data;

  if (HAS_WEBCRYPTO) {
    const webcryptoBuffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(webcryptoBuffer).set(bytes);
    const digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      webcryptoBuffer,
    );
    return toHex(new Uint8Array(digest));
  }

  if (HAS_NODE) {
    if (!nodeCryptoPromise) {
      nodeCryptoPromise = import("crypto");
    }
    const { createHash } = await nodeCryptoPromise;
    return createHash("sha256").update(bytes).digest("hex");
  }

  return sha256HexFallback(bytes);
}

export async function doubleHash(data: string | Uint8Array): Promise<string> {
  return sha256Hex(await sha256Hex(data));
}
