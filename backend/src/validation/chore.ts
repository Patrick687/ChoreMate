import { z } from "zod";
import { groupIdSchema } from "./group";
import { ChoreStatus } from "../generated/graphql-types";
import { userIdSchema } from "./auth";

export const choreIdSchema = z.string().uuid("Invalid chore ID format");

export const choreTitleSchema = z.string().trim().min(1, "Chore Title is required").max(255, "Chore title cannot exceed 255 characters");
export const choreDescriptionSchema = z.string().max(1000, "Chore description cannot exceed 1000 characters");
export const choreDueDateSchema = z.date();
export const choreStatusSchema = z.enum([ChoreStatus.Todo, ChoreStatus.InProgress, ChoreStatus.Done], {
    errorMap: () => ({ message: "Chore status must be one of TODO, IN_PROGRESS, or DONE" }),
});

export const getChoreByChoreIdInputSchema = z.object({
    choreId: choreIdSchema,
});

export const createChoreInputSchema = z.object({
    title: choreTitleSchema,
    description: choreDescriptionSchema.nullable().transform(val => val ?? null),
    groupId: groupIdSchema,
    dueDate: choreDueDateSchema.nullable().transform(val => val ?? null),
});

export const updateChoreTitleInputSchema = z.object({
    choreId: choreIdSchema,
    title: choreTitleSchema,
});

export const updateChoreDescriptionInputSchema = z.object({
    choreId: choreIdSchema,
    description: choreDescriptionSchema.trim().nullable().transform(val => val ?? null),
});

export const updateChoreDueDateInputSchema = z.object({
    choreId: choreIdSchema,
    dueDate: choreDueDateSchema.nullable().transform(val => val ?? null),
});

export const updateChoreStatusInputSchema = z.object({
    choreId: choreIdSchema,
    status: choreStatusSchema,
});

export const assignChoreInputSchema = z.object({
    choreId: choreIdSchema,
    assignedTo: userIdSchema,
})


