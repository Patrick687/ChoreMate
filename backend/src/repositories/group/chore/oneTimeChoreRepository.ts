import { UUID } from "crypto";
import { OneTimeChore } from "../../../models/OneTimeChoresModel";
import { NotFoundError } from "../../../utils/error/customErrors";
import { Chore } from "../../../models/ChoresModel";

const oneTimeChoreRepository = {
    fetchOneTimeChoreByChoreId,
    fetchOneTimeChoreByChore,
};

async function fetchOneTimeChoreByChore(chore: Chore, throwError: true): Promise<OneTimeChore>;
async function fetchOneTimeChoreByChore(chore: Chore, throwError?: false): Promise<OneTimeChore | null>;
async function fetchOneTimeChoreByChore(chore: Chore, throwError: boolean = false): Promise<OneTimeChore | null> {
    return throwError ? await fetchOneTimeChoreByChoreId(chore.id, true) : fetchOneTimeChoreByChoreId(chore.id, false);
}

async function fetchOneTimeChoreByChoreId(choreId: UUID, throwError: true): Promise<OneTimeChore>;
async function fetchOneTimeChoreByChoreId(choreId: UUID, throwError?: false): Promise<OneTimeChore | null>;
async function fetchOneTimeChoreByChoreId(choreId: UUID, throwError: boolean = false): Promise<OneTimeChore | null> {
    const oneTimeChore = await OneTimeChore.findOne({
        where: {
            choreId: choreId
        }
    });
    if (!oneTimeChore) {
        if (throwError) {
            const error = new NotFoundError(`One-time chore with chore ID: ${choreId} not found`);
            console.error(error);
            throw error;
        } else {
            return null;
        }
    }
    return oneTimeChore;
}

export default oneTimeChoreRepository;