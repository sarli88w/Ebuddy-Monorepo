import crypto from "node:crypto";

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

export const verifyPassword = (inputPassword: string, storedHash: string): Boolean => {
  const [salt, originalHash] = storedHash.split(":");
  const hash = crypto.pbkdf2Sync(inputPassword, salt, 100000, 64, "sha256").toString("hex");
  return hash === originalHash;
}