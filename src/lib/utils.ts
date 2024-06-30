import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const hashPassword = async (pswd: string) => {
  const encoder = new TextEncoder();
  const saltedPassword = encoder.encode(pswd + process.env.SALT);
  const hashedPasswordBuffer = await crypto.subtle.digest(
    "SHA-512",
    saltedPassword
  );
  return getStringFromBuffer(hashedPasswordBuffer);
};
