import { z } from "zod";

// Username: 7-20 chars, alphanumeric, no spaces/special chars
export const userNameSchema = z
    .string()
    .min(7, "Username must be between 7 and 20 characters")
    .max(20, "Username must be between 7 and 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric with no spaces or special characters");

// First/Last Name: 2-50 chars, alphabetic, no spaces
export const nameSchema = z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z]+$/, "Name must be alphabetic with no spaces");

// Email: valid email
export const emailSchema = z
    .string()
    .email("Invalid email");

// Password: at least 7 chars, 1 lowercase, 1 uppercase, 1 number, 1 special char and no spaces
export const passwordSchema = z
    .string()
    .min(7, "Password must be at least 7 characters")
    .refine((val) => /[a-z]/.test(val), "Password must contain at least one lowercase letter")
    .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter")
    .refine((val) => /[0-9]/.test(val), "Password must contain at least one number")
    .refine((val) => /[^A-Za-z0-9]/.test(val), "Password must contain at least one special character")
    .refine((val) => !/\s/.test(val), "Password must not contain spaces");

export const userIdSchema = z.string().uuid("Invalid user ID format");

export const signupSchema = z.object({
    userName: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
    firstName: nameSchema,
    lastName: nameSchema,
});

// Login schema (email and password only)
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
});