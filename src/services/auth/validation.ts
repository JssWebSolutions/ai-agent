import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export interface ValidationResult {
  success: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  const result = emailSchema.safeParse(email);
  return {
    success: result.success,
    error: !result.success ? result.error.errors[0].message : undefined
  };
}

export function validatePassword(password: string): ValidationResult {
  const result = passwordSchema.safeParse(password);
  return {
    success: result.success,
    error: !result.success ? result.error.errors[0].message : undefined
  };
}

export function validateName(name: string): ValidationResult {
  const result = nameSchema.safeParse(name);
  return {
    success: result.success,
    error: !result.success ? result.error.errors[0].message : undefined
  };
}