import { UUID } from "crypto";
import { CreateGroupInput, DeleteGroupInput, QueryGroupArgs, UpdateGroupInput } from "../generated/graphql-types";
import { GROUP_GROUP_MEMBER_ALIAS, GROUP_MEMBER_USER_ALIAS } from "../models";
import { GroupMemberModel, GroupMemberModelAttributes, GroupMemberRole } from "../models/GroupMembersModel";
import { Group, GroupModel, GroupsModelAttributes } from "../models/GroupModel";
import { UserModel, UserModelAttributes } from "../models/UserModel";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/error/customErrors";
import { ChoreModel } from "../models/ChoresModel";
import userRepository from "../repositories/auth/userRepository";
import groupRepository from "../repositories/group/groupRepository";
import validator from "validator";

// Move the resolver function out of the object and give it a name
async function groupsResolver(
    _: unknown,
    __: unknown,
    context: { user: { id: UUID; }; }
): Promise<Group[]> {

    const user = await userRepository.fetchUserByUserId(context.user.id, true);
    if (!user) {
        throw new UnauthorizedError(`Unauthorized. Please relog.`);
    }

    const userAsGroupMembers = await user.getGroupMembers();

    const groups: Group[] = [];
    for (const gm of userAsGroupMembers) {
        const group = await gm.getGroup();
        groups.push(group);
    }

    return groups;
}

async function groupResolver(
    _: unknown,
    { args }: { args: QueryGroupArgs; },
    context: { user: { id: UUID; }; }
): Promise<Group> {
    if (!context.user.id) {
        throw new UnauthorizedError(`Unauthorized`);
    }

    const { id: idInput } = args;
    if (!idInput) {
        throw new BadRequestError(`Group ID is required`);
    }
    if (!validator.isUUID(idInput)) {
        throw new BadRequestError(`Invalid Group ID format`);
    }
    const id = idInput as UUID;
    const group = await groupRepository.fetchGroupByGroupId(id, true);
    return group;
}

const groupMutations = {
    createGroup: async (_: unknown, { args }: { args: CreateGroupInput; }) => {
        const { name, createdByUserId } = args;

        const group = await GroupModel.create({
            name,
            createdBy: createdByUserId as UUID,
        });
        return group;
    },
    updateGroup: async (_: unknown, { args }: { args: UpdateGroupInput; }) => {
        const group = await GroupModel.findByPk(args.groupId);
        if (!group) {
            throw new NotFoundError(`Group with ID ${args.groupId} not found`);
        }
        const groupMember = await GroupMemberModel.findOne({
            where: {
                groupId: args.groupId,
                userId: args.userId,
            },
        });
        if (!groupMember) {
            throw new UnauthorizedError(`User is not a member of the group`);
        }

        if (groupMember.role !== GroupMemberRole.ADMIN) {
            throw new UnauthorizedError(`User does not have permission to update the group`);
        }

        if (args.name) {
            group.name = args.name;
        }
        await group.save();
        return group;
    },
    deleteGroup: async (_: unknown, { args }: { args: DeleteGroupInput; }) => {
        const group = await GroupModel.findByPk(args.id);
        if (!group) {
            throw new NotFoundError(`Group with ID ${args.id} not found`);
        }
        await group.destroy();
        return true;
    },
};



export const groupResolvers = {
    Query: {
        groups: groupsResolver,
        group: groupResolver
    },
    Mutation: {
        createGroup: groupMutations.createGroup,
        updateGroup: groupMutations.updateGroup,
        deleteGroup: groupMutations.deleteGroup,
    },
    Group: {
        groupMembers: async (parent: GroupsModelAttributes) => {
            // parent.id is the groupId
            const groupMembers = await GroupMemberModel.findAll({
                where: { groupId: parent.id },
                include: [
                    {
                        model: UserModel,
                        as: GROUP_MEMBER_USER_ALIAS,
                        required: true,
                    },
                ],
            });

            // Return just the user objects
            return groupMembers.map((gm: any) => gm[GROUP_MEMBER_USER_ALIAS]);
        },
        createdBy: async (parent: GroupsModelAttributes & { [GROUP_GROUP_MEMBER_ALIAS]?: GroupMemberModelAttributes[]; }) => {
            const user = await UserModel.findByPk(parent.createdBy);
            if (!user) {
                throw new NotFoundError(`User with ID ${parent.createdBy} not found`);
            }
            return user;
        },
        chores: async (parent: GroupsModelAttributes) => {
            const chores = await ChoreModel.findAll({
                where: {
                    groupId: parent.id
                }
            });
            return chores;
        },
    },

};