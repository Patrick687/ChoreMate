import { Chore, CreateChoreInput } from "../generated/graphql-types";
import { Chore as ChoreModel } from "../models/ChoresModel";
import choreHelper from "../helpers/group/chore/choreHelper";
import { GROUP_GROUP_MEMBER_ALIAS, GROUP_MEMBER_USER_ALIAS } from "../models";
import { ChoreModelAttributes } from "../models/ChoresModel";
import { GroupMemberModel } from "../models/GroupMembersModel";
import { GroupModel } from "../models/GroupModel";
import { OneTimeChoreModel } from "../models/OneTimeChoresModel";
import { User, UserModel } from "../models/UserModel";
import choreRepository from "../repositories/group/chore/choreRepository";
import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from "../utils/error/customErrors";
import { UUID } from "crypto";
import validator from "validator";
import groupRepository from "../repositories/group/groupRepository";
import userRepository from "../repositories/auth/userRepository";
import groupHelper from "../helpers/group/groupHelper";
import oneTimeChoreRepository from "../repositories/group/chore/oneTimeChoreRepository";
import { sequelize } from "../config/db";

const Query = {
    chore: async function chore(_: unknown, args: { id: string; }, context: { user?: { id: UUID; }; }): Promise<ChoreModel> {
        const { id: idInput } = args;
        const userId = context.user?.id;
        if (!userId) {
            throw new UnauthorizedError("Not authenticated");
        }
        if (!validator.isUUID(idInput)) {
            throw new BadRequestError(`Invalid chore ID: ${idInput}`);
        }
        const id = idInput as UUID;

        return await choreRepository.fetchChoreByChoreId(id, true);
    },

    chores: async function chores(_: unknown, args: { groupId: string; }, context: { user?: { id: UUID; }; }): Promise<ChoreModel[]> {
        const { groupId: groupIdInput } = args;
        const userId = context.user?.id;
        if (!userId) {
            throw new UnauthorizedError("Not authenticated");
        }

        if (!validator.isUUID(groupIdInput)) {
            throw new BadRequestError(`Invalid group ID: ${groupIdInput}`);
        }
        const groupId = groupIdInput as UUID;

        const group = await groupRepository.fetchGroupByGroupId(groupId, true);
        const isUserInGroup = await groupHelper.isUserIdInGroup(userId, group);
        if (!isUserInGroup) {
            throw new UnauthorizedError('You are not in this group. Cannot fetch chores.');
        }

        const chores = await group.getChores();
        return chores;
    }
};


export const choreResolvers = {
    Query: {
        chore: Query.chore,
        chores: Query.chores,
    },
    Mutation: {
        createChore: async function createChore(_: unknown, args: { args: CreateChoreInput; }, context: { user?: { id: UUID; }; }): Promise<ChoreModel> {
            const userId = context.user?.id;
            if (!userId) {
                throw new UnauthorizedError("Not authenticated");
            }
            const { groupId: groupIdInput, title: titleInput, description: descriptionInput, isRecurring: isRecurringInput } = args.args;

            if (!validator.isUUID(groupIdInput)) {
                throw new BadRequestError(`Invalid group ID: ${groupIdInput}`);
            }
            const groupId = groupIdInput as UUID;
            const group = await groupRepository.fetchGroupByGroupId(groupId, true);

            const isUserInGroup = await groupHelper.isUserIdInGroup(userId, group);
            if (!isUserInGroup) {
                throw new UnauthorizedError('You are not in this group. Cannot create chore.');
            }

            const title = titleInput ? titleInput.trim() : '';
            const description = descriptionInput ? descriptionInput.trim() : null;
            const isRecurring = isRecurringInput !== undefined ? isRecurringInput : false;

            const transaction = await sequelize.transaction();

            try {
                const chore = await ChoreModel.create({
                    groupId: group.id,
                    title,
                    description,
                    isRecurring,
                    createdBy: userId
                });

                const oneTimeChore = await OneTimeChoreModel.create({
                    choreId: chore.id,
                    dueDate: null,
                });
                await transaction.commit();
                return chore;
            } catch (error) {
                await transaction.rollback();
                console.error("Error creating chore:", error);
                throw new InternalServerError("Failed to create chore");
            }
        },

        updateChoreInfo: async function updateChoreInfo(
            _: unknown,
            args: { args: { choreId: string; userId: string; title?: string; description?: string; }; },
            context: { user?: { id: UUID; }; }
        ): Promise<ChoreModel> {
            const userId = context.user?.id;
            if (!userId) {
                throw new Error("Not authenticated");
            }

            const { choreId: choreIdInput, title: titleInput, description: descriptionInput } = args.args;
            const choreId = choreHelper.validateChoreId(choreIdInput);

            const chore = await choreRepository.fetchChoreByChoreId(choreId, true);
            const group = await groupRepository.fetchGroupByChore(chore, true);
            const user = await userRepository.fetchUserByUserId(userId, true);
            const isUserInGroup = await groupHelper.isUserInGroup(user, group);
            if (!isUserInGroup) {
                throw new UnauthorizedError('You are not in this group. Cannot update chore info.');
            }

            await chore.update({
                title: titleInput ? titleInput.trim() : chore.title,
                description: descriptionInput ? descriptionInput.trim() : chore.description,
            });

            return chore;
        },

        updateChoreDueDate: async function updateChoreDueDate(
            _: unknown,
            args: { args: { choreId: string; dueDate: Date | null; userId: string; }; },
            context: { user?: { id: UUID; }; }
        ): Promise<ChoreModel> {
            const userId = context.user?.id;
            if (!userId) {
                throw new Error("Not authenticated");
            }

            const { choreId: choreIdInput, dueDate: dueDateInput } = args.args;

            if (dueDateInput && !(dueDateInput instanceof Date)) {
                throw new BadRequestError("Invalid due date format. Must be a Date object or null.");
            }
            if (!validator.isUUID(choreIdInput)) {
                throw new BadRequestError(`Invalid chore ID: ${choreIdInput}`);
            }
            const choreId = choreIdInput as UUID;

            const chore = await choreRepository.fetchChoreByChoreId(choreId, true);
            const group = await chore.getGroup();
            const isUserInGroup = await groupHelper.isUserIdInGroup(userId, group);
            if (!isUserInGroup) {
                throw new UnauthorizedError('You are not in this group. Cannot update chore due date.');
            }

            const oneTimeChore = await chore.getOneTimeChores()
                .then(otc => otc.length > 0 ? otc[0] : null);

            if (!oneTimeChore) {
                await OneTimeChoreModel.create({
                    choreId: chore.id,
                    dueDate: dueDateInput,
                });
            } else {
                await oneTimeChore.update({ dueDate: dueDateInput });
            }

            return chore;
        }
    },

    Chore: {
        dueDate: async (parent: ChoreModel): Promise<Date | null> => {
            return await parent.getOneTimeChores()
                .then(otc => otc.length > 0 ? otc[0].dueDate : null);
        },
        group: async (parent: ChoreModel) => await parent.getGroup(),
        createdBy: async (parent: ChoreModel) => await parent.getCreator(),
    }

};