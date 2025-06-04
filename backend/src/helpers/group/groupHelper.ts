import { UUID } from "crypto";
import { Group } from "../../models/GroupModel";
import { User } from "../../models/UserModel";
import groupMemberRepository from "../../repositories/group/groupMemberRepository";

const groupHelper = {
    isUserInGroup,
    isUserIdInGroup
};


async function isUserIdInGroup(userId: UUID, group: Group): Promise<boolean> {
    const groupMembers = await group.getGroupMembers();
    return groupMembers.some(member => member.userId === userId);
}


async function isUserInGroup(user: User, group: Group, throwError: boolean = false): Promise<boolean> {
    const groupMembers = throwError ?
        await groupMemberRepository.fetchGroupMembersByGroup(group, true) :
        await groupMemberRepository.fetchGroupMembersByGroup(group, false);
    if (!groupMembers) {
        if (throwError) {
            const error = new Error(`No members found for group with ID: ${group.id}`);
            console.error(error);
            throw error;
        }
        return false;
    }
    return groupMembers.some(member => member.userId === user.id);
}

export default groupHelper;