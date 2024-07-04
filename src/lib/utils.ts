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

export const isNewProduct = (createdAt: string) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
