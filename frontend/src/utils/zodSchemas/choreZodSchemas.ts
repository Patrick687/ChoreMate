import { z } from "zod";

// Title: required, max 255, custom regex
export const choreTitleSchema = z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .regex(
        /^[\w\s\-.,!?()@#&$%':";/\\[\]{}|^~`+=*<>]*$/,
        "Title contains invalid characters"
    );

// Description: optional, max 1000
export const choreDescriptionSchema = z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal(""));

// Due date: optional, must be a valid date string (YYYY-MM-DD or empty)
export const choreDueDateSchema = z.string()
    .optional()
    .nullable()
    .refine(
        val => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
        { message: "Due date must be in YYYY-MM-DD format" }
    );