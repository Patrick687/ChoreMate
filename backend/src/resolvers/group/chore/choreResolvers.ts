import { ChoreAssignment as ChoreAssignmentModel } from "../../../models/ChoreAssignmentsModel";
import { Chore as ChoreModel } from "../../../models/ChoresModel";
import { User as UserModel } from "../../../models/UserModel";
import { Group as GroupModel } from "../../../models/GroupModel";

export const Chore = {
    createdBy: async (parent: ChoreModel): Promise<UserModel> => {
        return await parent.getCreator();
    },
    assignment: async (parent: ChoreModel): Promise<ChoreAssignmentModel> => {
        return await parent.getAssignment();
    },
    group: async (parent: ChoreModel): Promise<GroupModel> => {
        return await parent.getGroup();
    }
};