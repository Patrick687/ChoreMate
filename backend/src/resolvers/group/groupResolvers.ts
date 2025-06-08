import { Group as GroupModel } from "../../models/GroupModel";
import { User, GroupMember } from "../../generated/graphql-types";
import { Chore as ChoreModel } from "../../models/ChoresModel";
import { GroupInvite as GroupInviteModel } from "../../models/GroupInviteModel";


export const Group = {
    createdBy: async (parent: GroupModel): Promise<User> => {
        return await parent.getCreator();
    },
    groupMembers: async (parent: GroupModel): Promise<GroupMember[]> => {
        const groupMembers = await parent.getGroupMembers();

        const gms: GroupMember[] = [];

        for (const groupMember of groupMembers) {
            const user = await groupMember.getUser();
            gms.push({
                user,
                joinedAt: groupMember.joinedAt,
            });
        }

        return gms;
    },
    chores: async (parent: GroupModel): Promise<ChoreModel[]> => {
        return await parent.getChores();
    },
    groupInvites: async (parent: GroupModel): Promise<GroupInviteModel[]> => {
        return await parent.getGroupInvites();
    }
};