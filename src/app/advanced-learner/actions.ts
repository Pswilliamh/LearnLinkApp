
'use server';

import { z } from 'zod';

const PasswordSchema = z.string().min(1, { message: "Password cannot be empty." });

/**
 * Verifies the provided password against the one set in environment variables.
 * @param password The password entered by the user.
 * @returns True if the password is correct, false otherwise.
 */
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    PasswordSchema.parse(password); // Basic validation
  } catch (error) {
    // Optional: log server-side if needed, e.g., console.error("Password validation failed:", error);
    return false;
  }

  const correctPassword = process.env.ADVANCED_LEARNER_PASSWORD;

  if (!correctPassword) {
    console.error("CRITICAL: ADVANCED_LEARNER_PASSWORD environment variable is not set.");
    // This is a server configuration issue.
    // For security, if the env var isn't set, no password should be considered correct.
    return false;
  }

  return password === correctPassword;
}
