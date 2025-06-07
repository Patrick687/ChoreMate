import { UUID } from "crypto";
import { CreateGroupInput, DeleteGroupInput, QueryGroupArgs, UpdateGroupInput } from "../generated/graphql-types";
import { GROUP_GROUP_MEMBER_ALIAS, GROUP_MEMBER_USER_ALIAS } from "../models";
import { GroupMemberModel, GroupMemberModelAttributes, GroupMemberRole } from "../models/GroupMembersModel";
import { Group as GroupModel, GroupsModelAttributes } from "../models/GroupModel";
import { GroupInvite as GroupInviteModel } from "../models/GroupInviteModel";
import { UserModel, UserModelAttributes } from "../models/UserModel";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/error/customErrors";
import { ChoreModel } from "../models/ChoresModel";
import userRepository from "../repositories/auth/userRepository";
import groupRepository from "../repositories/group/groupRepository";
import validator from "validator";
import { UserContext } from "../middleware/context";

// Move the resolver function out of the object and give it a name
async function groupsResolver(
    _: unknown,
    __: unknown,
    context: UserContext
): Promise<GroupModel[]> {
    const userId = context.user?.id;
    if (!userId) {
        throw new UnauthorizedError(`Unauthorized. Please relog.`);
    }
    const user = await userRepository.fetchUserByUserId(userId, true);
    const groupMembers = await user.getGroupMembers();
    const groups: GroupModel[] = [];
    for (const groupMember of groupMembers) {
        const group = await groupMember.getGroup();
        groups.push(group);
    }

    return groups;
}

async function groupResolver(
    _: unknown,
    { args }: { args: QueryGroupArgs; },
    context: UserContext
): Promise<GroupModel> {
    const userId = context.user?.id;
    if (!userId) {
        throw new UnauthorizedError(`Unauthorized`);
    }

    const { id: idInput } = args;
    if (!validator.isUUID(idInput)) {
        throw new BadRequestError(`Invalid Group ID format`);
    }
    const id = idInput as UUID;
    const group = await groupRepository.fetchGroupByGroupId(id, true);
    return group;
}

const groupMutations = {
    createGroup: async (_: unknown, { args }: { args: CreateGroupInput; }, context: UserContext) => {
        const { name, createdByUserId } = args;

        const group = await GroupModel.create({
            name,
            createdBy: createdByUserId as UUID,
        });
        return group;
    },
    updateGroup: async (_: unknown, { args }: { args: UpdateGroupInput; }, context: UserContext) => {
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
    deleteGroup: async (_: unknown, { args }: { args: DeleteGroupInput; }, context: UserContext) => {
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
        groupInvites: async (parent: GroupModel): Promise<GroupInviteModel[]> => {
            const groupInvites = await parent.getGroupInvites();
            return groupInvites;
        },
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