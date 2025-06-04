import { UUID } from "crypto";
import { Group, GroupModel } from "../../models/GroupModel";

import { NotFoundError } from "../../utils/error/customErrors";
import { GroupMember } from "../../models/GroupMembersModel";
import { Chore, ChoreModel } from "../../models/ChoresModel";
import groupMemberRepository from "./groupMemberRepository";

const groupRepository = {
    fetchGroupByGroupId,
    fetchGroupByGroupMember,
    fetchGroupByGroupMemberId,
    fetchGroupByChoreId,
    fetchGroupByChore,
    fetchGroupsByUserId
};

async function fetchGroupsByUserId(userId: UUID, throwError: true): Promise<Group[]>;
async function fetchGroupsByUserId(userId: UUID, throwError?: false): Promise<Group[] | null>;
async function fetchGroupsByUserId(userId: UUID, throwError: boolean = false): Promise<Group[] | null> {
    const groupMembers = throwError ? await groupMemberRepository.fetchGroupMembersByUserId(userId, true) :
        await groupMemberRepository.fetchGroupMembersByUserId(userId, false);

    if (!groupMembers) {
        if (throwError) {
            const error = new NotFoundError(`No groups found for user with ID: ${userId}`);
            console.error(error);
            throw error;
        } else {
            return null;
        }
    }
    const groups: Group[] = [];
    for (const groupMember of groupMembers) {
        const group = await fetchGroupByGroupMemberId(groupMember.id, false);
        if (group) {
            groups.push(group);
        } else if (throwError) {
            const error = new NotFoundError(`Group not found for group member with ID: ${groupMember.id}`);
            console.error(error);
            throw error;
        } else {
            console.warn(`Group not found for group member with ID: ${groupMember.id}`);
        }
    }
    return groups;

}

async function fetchGroupByGroupId(groupId: UUID, throwError: true): Promise<Group>;
async function fetchGroupByGroupId(groupId: UUID, throwError?: false): Promise<Group | null>;
async function fetchGroupByGroupId(groupId: UUID, throwError: boolean = false): Promise<Group | null> {
    const groupAttributes = await GroupModel.findByPk(groupId);
    if (!groupAttributes && throwError) {
        const error = new NotFoundError(`Group not found`);
        console.error(`Chore with ID: ${groupId} not found`, error);
        throw error;
    }
    return groupAttributes;
}


async function fetchGroupByGroupMember(groupMember: GroupMember, throwError: true): Promise<Group>;
async function fetchGroupByGroupMember(groupMember: GroupMember, throwError?: false): Promise<Group | null>;
async function fetchGroupByGroupMember(groupMember: GroupMember, throwError: boolean = false): Promise<Group | null> {
    const group = await GroupModel.findByPk(groupMember.groupId);
    if (!group && throwError) {
        const error = new NotFoundError(`Group with ID: ${groupMember.groupId} not found`);
        console.error(error);
        throw error;
    }
    return group;
}

async function fetchGroupByGroupMemberId(groupMemberId: UUID, throwError: true): Promise<Group>;
async function fetchGroupByGroupMemberId(groupMemberId: UUID, throwError?: false): Promise<Group | null>;
async function fetchGroupByGroupMemberId(groupMemberId: UUID, throwError: boolean = false): Promise<Group | null> {
    const groupMember = await GroupMember.findByPk(groupMemberId);
    if (!groupMember && throwError) {
        const error = new NotFoundError(`Group member with ID: ${groupMemberId} not found`);
        console.error(error);
        throw error;
    } else if (!groupMember) {
        return null;
    }
    return throwError ? await fetchGroupByGroupMember(groupMember, true) : await fetchGroupByGroupMember(groupMember, false);
}

async function fetchGroupByChoreId(choreId: UUID, throwError: true): Promise<Group>;
async function fetchGroupByChoreId(choreId: UUID, throwError?: false): Promise<Group | null>;
async function fetchGroupByChoreId(choreId: UUID, throwError: boolean = false): Promise<Group | null> {
    const chore = await ChoreModel.findByPk(choreId);
    if (!chore && throwError) {
        const error = new NotFoundError(`Chore with ID: ${choreId} not found`);
        console.error(error);
        throw error;
    } else if (!chore) {
        return null;
    }
    return throwError ? await fetchGroupByGroupId(chore.groupId, true) : await fetchGroupByGroupId(chore.groupId, false);
}

async function fetchGroupByChore(chore: Chore, throwError: true): Promise<Group>;
async function fetchGroupByChore(chore: Chore, throwError?: false): Promise<Group | null>;
async function fetchGroupByChore(chore: Chore, throwError: boolean = false): Promise<Group | null> {
    return throwError ? await fetchGroupByGroupId(chore.groupId, true) :
        await fetchGroupByGroupId(chore.groupId, false);
}


export default groupRepository;