import { UUID } from "crypto";
import { GroupInviteStatus, InviteToGroupInput, RespondToGroupInviteInput } from "../generated/graphql-types";
import { GroupInvite, GroupInvite as GroupInviteModel } from "../models/GroupInviteModel";
import { Group as GroupModel } from "../models/GroupModel";
import { User as UserModel } from "../models/UserModel";
import groupRepository from "../repositories/group/groupRepository";
import { BadRequestError, UnauthorizedError } from "../utils/error/customErrors";
import validator from "validator";
import userRepository from "../repositories/auth/userRepository";
import groupHelper from "../helpers/group/groupHelper";
import { GroupMember } from "../models/GroupMembersModel";
import { sequelize } from "../config/db";

const Query = {
    groupInvites: async function groupInvites(_: unknown, args: { groupId: string; }, context: { user?: { id: string; }; }): Promise<GroupInviteModel[]> {
        const groupIdInput = args.groupId;
        const userId = context.user?.id;
        if (!userId) {
            throw new UnauthorizedError("Not authenticated");
        }
        if (!validator.isUUID(groupIdInput)) {
            throw new BadRequestError(`Invalid group ID: ${groupIdInput}`);
        }
        const groupId = groupIdInput as UUID;
        const group = await groupRepository.fetchGroupByGroupId(groupId, true);
        const groupInvites = await group.getGroupInvites();
        return groupInvites;
    },
    myGroupInvites: async function myGroupInvites(_: unknown, __: unknown, context: { user?: { id: string; }; }): Promise<GroupInviteModel[]> {
        const userId = context.user?.id;
        if (!userId) {
            throw new UnauthorizedError("Not authenticated");
        }

        const user = await userRepository.fetchUserByUserId(userId as UUID, true);
        const receivedInvites = await user.getReceivedInvites();
        return receivedInvites;
    }

};

const Mutation = {
    inviteToGroup: async function inviteToGroup(_: unknown, args: { args: InviteToGroupInput; }, context: { user?: { id: string; }; }): Promise<GroupInviteModel> {
        //userId is the user who is inviting
        const userId = context.user?.id;
        if (!userId) {
            throw new UnauthorizedError("Not authenticated");
        }
        //Parse, validate
        const { groupId: groupIdInput, invitedUserId: invitedUserIdInput } = args.args;
        if (!validator.isUUID(groupIdInput)) {
            throw new BadRequestError(`Invalid group ID: ${groupIdInput}`);
        }
        const groupId = groupIdInput as UUID;
        if (!validator.isUUID(invitedUserIdInput)) {
            throw new BadRequestError(`Invalid invited user ID: ${invitedUserIdInput}`);
        }
        const invitedUserId = invitedUserIdInput as UUID;

        // Fetch the invited user
        const invitedUser = await userRepository.fetchUserByUserId(invitedUserId, true);

        // Fetch the group
        const group = await groupRepository.fetchGroupByGroupId(groupId, true);

        //Check if the user is in the group
        const isUserInGroup = await groupHelper.isUserIdInGroup(userId as UUID, group);
        if (!isUserInGroup) {
            throw new UnauthorizedError('You are not in this group. Cannot invite users.');
        }

        const groupInvite = await GroupInvite.create({
            groupId,
            invitedUserId: invitedUser.id,
            inviterUserId: userId as UUID
        });
        return groupInvite;
    },

    respondToGroupInvite: async function respondToGroupInvite(_: unknown, args: { args: RespondToGroupInviteInput; }, context: { user?: { id: string; }; }): Promise<GroupInviteModel> {
        const userId = context.user?.id;
        if (!userId) {
            throw new UnauthorizedError("Not authenticated");
        }

        //Parse, validate
        const { inviteId: inviteIdInput, response: responseInput } = args.args;
        if (!validator.isUUID(inviteIdInput)) {
            throw new BadRequestError(`Invalid invite ID: ${inviteIdInput}`);
        }
        const inviteId = inviteIdInput as UUID;

        //Fetch the invite
        const groupInvite = await GroupInvite.findByPk(inviteId);
        if (!groupInvite) {
            throw new BadRequestError(`Group invite with ID ${inviteId} not found`);
        }

        //Check if the user is the invited user
        if (groupInvite.invitedUserId !== userId) {
            throw new UnauthorizedError('You are not the invited user for this group invite.');
        }

        //Update the status and respondedAt
        groupInvite.status = responseInput;
        groupInvite.respondedAt = new Date();

        const transaction = await sequelize.transaction();
        try {
            await groupInvite.save({ transaction });
            if (groupInvite.status === GroupInviteStatus.Accepted) {
                // If the invite is accepted, add the user to the group
                const group = await groupInvite.getGroup();
                await GroupMember.create({
                    groupId: group.id,
                    userId: userId as UUID,
                }, { transaction });
            }
            await transaction.commit();
            return groupInvite;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

};

export const groupInviteResolvers = {
    Query: {
        groupInvites: Query.groupInvites,
        myGroupInvites: Query.myGroupInvites
    },
    Mutation: {
        inviteToGroup: Mutation.inviteToGroup,
        respondToGroupInvite: Mutation.respondToGroupInvite
    },
    GroupInvite: {
        group: async (parent: GroupInviteModel): Promise<GroupModel> => {
            return await parent.getGroup();

        },
        inviterUser: async (parent: GroupInviteModel): Promise<UserModel> => {
            return await parent.getInviterUser();
        },
        invitedUser: async (parent: GroupInviteModel): Promise<UserModel> => {
            return await parent.getInvitedUser();
        },
    }
};