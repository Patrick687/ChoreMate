import { GroupInvite as GroupInviteModel } from "../../../models/GroupInviteModel";
import { Group as GroupModel } from "../../../models/GroupModel";
import { User as UserModel } from "../../../models/UserModel";

export const GroupInvite = {
    group: async (parent: GroupInviteModel): Promise<GroupModel> => {
        return await parent.getGroup();
    },
    inviterUser: async (parent: GroupInviteModel): Promise<UserModel> => {
        return await parent.getInviterUser();
    },
    invitedUser: async (parent: GroupInviteModel): Promise<UserModel> => {
        return await parent.getInvitedUser();
    },
};