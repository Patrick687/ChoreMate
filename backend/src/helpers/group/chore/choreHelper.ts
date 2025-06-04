import { UUID } from "crypto";
import validator from "validator";
import { BadRequestError } from "../../../utils/error/customErrors";


const choreHelper = {
    validateChoreId,
};

function validateChoreId(choreId: string): UUID {
    if (!validator.isUUID(choreId)) {
        const error = new BadRequestError("Invalid chore ID");
        console.error(`Chore ID: ${choreId} is not a valid UUID`, error);
        throw error;
    }
    return choreId as UUID;
}

export default choreHelper;