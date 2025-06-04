import { UUID } from "crypto";
import { Chore, ChoreModel } from "../../../models/ChoresModel";
import { NotFoundError } from "../../../utils/error/customErrors";

const choreRepository = {
    fetchChoreByChoreId
};

async function fetchChoreByChoreId(choreId: UUID, throwError: true): Promise<Chore>;
async function fetchChoreByChoreId(choreId: UUID, throwError?: false): Promise<Chore | null>;

// Implementation
async function fetchChoreByChoreId(choreId: UUID, throwError: boolean = false): Promise<Chore | null> {
    const chore = await ChoreModel.findByPk(choreId);
    if (!chore && throwError) {
        const error = new NotFoundError(`Chore not found`);
        console.error(`Chore with ID: ${choreId} not found`, error);
        throw error;
    }
    return chore;
}

export default choreRepository;
