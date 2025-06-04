import { UUID } from "crypto";
import { GroupMember } from "../../models/GroupMembersModel";
import groupRepository from "./groupRepository";
import { NotFoundError } from "../../utils/error/customErrors";
import { Group } from "../../models/GroupModel";
import { User } from "../../models/UserModel";

const groupMemberRepository = {
    fetchGroupMembersByGroupId,
    fetchGroupMembersByGroup,
    fetchGroupMembersByUserId,
    fetchGroupMembersByUser
};


async function fetchGroupMembersByGroup(group: Group, throwError: true): Promise<GroupMember[]>;
async function fetchGroupMembersByGroup(group: Group, throwError?: false): Promise<GroupMember[] | null>;
async function fetchGroupMembersByGroup(group: Group, throwError: boolean = false): Promise<GroupMember[] | null> {
    const groupMembers = await GroupMember.findAll({
        where: { groupId: group.id }
    });

    if (groupMembers.length === 0 && throwError) {
        const error = new NotFoundError(`No members found for group with ID: ${group.id}`);
        console.error(error);
        throw error;
    }

    return groupMembers;
}


async function fetchGroupMembersByGroupId(groupId: UUID, throwError: true): Promise<GroupMember[]>;
async function fetchGroupMembersByGroupId(groupId: UUID, throwError: false): Promise<GroupMember[] | null>;
async function fetchGroupMembersByGroupId(groupId: UUID, throwError: boolean = false): Promise<GroupMember[] | null> {
    let group = throwError ?
        await groupRepository.fetchGroupByGroupId(groupId, true) :
        await groupRepository.fetchGroupByGroupId(groupId, false);

    if (!group) {
        if (throwError) {
            const error = new NotFoundError(`Group with ID: ${groupId} not found`);
            console.error(error);
            throw error;
        } else {
            return null;
        }
    }

    return throwError ? await fetchGroupMembersByGroup(group, true) :
        await fetchGroupMembersByGroup(group, false);
}

async function fetchGroupMembersByUserId(userId: UUID, throwError: true): Promise<GroupMember[]>;
async function fetchGroupMembersByUserId(userId: UUID, throwError?: false): Promise<GroupMember[] | null>;
async function fetchGroupMembersByUserId(userId: UUID, throwError: boolean = false): Promise<GroupMember[] | null> {
    const groupMembers = await GroupMember.findAll({
        where: { userId }
    });
    if (groupMembers.length === 0) {
        if (throwError) {
            const error = new NotFoundError(`User with ID: ${userId} not found`);
            console.error(error);
            throw error;
        } else {
            return null;
        }
    }
    return groupMembers;
}

async function fetchGroupMembersByUser(user: User, throwError: true): Promise<GroupMember[]>;
async function fetchGroupMembersByUser(user: User, throwError?: false): Promise<GroupMember[] | null>;
async function fetchGroupMembersByUser(user: User, throwError: boolean = false): Promise<GroupMember[] | null> {
    return throwError ?
        await fetchGroupMembersByUserId(user.id, true) :
        await fetchGroupMembersByUserId(user.id, false);
}
export default groupMemberRepository;