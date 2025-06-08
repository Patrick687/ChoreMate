import { ChoreAssignment as ChoreAssignmentModel } from "../../../../models/ChoreAssignmentsModel";
import { User as UserModel } from "../../../../models/UserModel";

export const ChoreAssignment = {
    assignedTo: async (parent: ChoreAssignmentModel): Promise<UserModel> => {
        return await parent.getAssignedToUser();
    },
    assignedBy: async (parent: ChoreAssignmentModel): Promise<UserModel> => {
        return await parent.getChoreAssigner();
    }
};