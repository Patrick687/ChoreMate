import { ZodSchema, ZodError } from "zod";
import { BadRequestError } from "../error/customErrors";

export function parseOrBadRequest<T>(schema: ZodSchema<T>, data: unknown): T {
    try {
        return schema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            const message = err.errors[0]?.message || "Invalid input";
            throw new BadRequestError(message);
        }
        throw err;
    }
}