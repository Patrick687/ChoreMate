import { z } from "zod";

// Group name: required, 1-120 chars, alphanumeric and spaces only
export const groupNameSchema = z
    .string()
    .min(1, "Group name must be at least 1 character long")
    .max(120, "Group name must be at most 120 characters long")
    .regex(/^[a-zA-Z0-9\s]+$/, "Group name can only contain alphanumeric characters and spaces");

// CreateGroupInput schema
export const createGroupSchema = z.object({
    name: groupNameSchema,
});

export const groupIdSchema = z.string().uuid("Invalid group ID format");

export const getChoresByGroupIdInputSchema = z.object({
    groupId: groupIdSchema,
});