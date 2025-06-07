import { AssignChoreInput, ChoreStatus, CreateChoreInput } from "../generated/graphql-types";
import { Chore as ChoreModel } from "../models/ChoresModel";
import choreHelper from "../helpers/group/chore/choreHelper";
import { OneTimeChoreModel } from "../models/OneTimeChoresModel";
import choreRepository from "../repositories/group/chore/choreRepository";
import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from "../utils/error/customErrors";
import { UUID } from "crypto";
import validator from "validator";
import groupRepository from "../repositories/group/groupRepository";
import userRepository from "../repositories/auth/userRepository";
import groupHelper from "../helpers/group/groupHelper";
import { sequelize } from "../config/db";
import { ChoreAssignment as ChoreAssignmentModel } from "../models/ChoreAssignmentsModel";
import { UserContext } from "../middleware/context";
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
        createChore: async function createChore(_: unknown, args: { args: CreateChoreInput; }, context: UserContext): Promise<ChoreModel> {
            const userId = context.user?.id as UUID | null;
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

                const assignment = await chore.createAssignment({
                    assignedTo: null,
                    assignedBy: null,
                    choreId: chore.id,
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
            context: UserContext
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
            args: { args: { choreId: string; dueDate: string | null; }; },
            context: UserContext
        ): Promise<ChoreModel> {
            const userId = context.user?.id;
            if (!userId) {
                throw new Error("Not authenticated");
            }

            const { choreId: choreIdInput, dueDate: dueDateInput } = args.args;

            let dueDate: Date | null = null;
            try {
                dueDate = dueDateInput ? new Date(dueDateInput) : null;
            } catch (error) {
                throw new BadRequestError(`Invalid due date format: ${dueDateInput}`);
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
                    dueDate: dueDate,
                });
            } else {
                await oneTimeChore.update({ dueDate: dueDate });
            }

            return chore;
        },

        updateChoreStatus: async function updateChoreStatus(
            _: unknown,
            args: { args: { choreId: string; status: ChoreStatus; }; },
            context: UserContext
        ): Promise<ChoreModel> {
            const userId = context.user?.id;
            if (!userId) {
                throw new Error("Not authenticated");
            }

            const { choreId: choreIdInput, status: choreStatusInput } = args.args;
            if (!validator.isUUID(choreIdInput)) {
                throw new BadRequestError(`Invalid chore ID: ${choreIdInput}`);
            }
            const choreId = choreIdInput as UUID;

            //Validate status to be one of the enum values of the import ChoreStatus
            if (!Object.values(ChoreStatus).includes(choreStatusInput)) {
                throw new BadRequestError(`Invalid chore status: ${choreStatusInput}`);
            }
            const status = choreStatusInput as ChoreStatus;

            const chore = await choreRepository.fetchChoreByChoreId(choreId, true);
            const oneTimeChore = await chore.getOneTimeChores().then(otc => otc.length > 0 ? otc[0] : null);
            if (!oneTimeChore) {
                throw new NotFoundError(`One-time chore not found for chore ID: ${choreId}`);
            }

            oneTimeChore.update({ status: status });

            return chore;
        },
        assignChore: async function assignChore(_: unknown, args: { args: AssignChoreInput; }, context: UserContext): Promise<ChoreModel> {
            const userId = context.user?.id;
            if (!userId) {
                throw new Error("Not authenticated");
            }
            const assignedByUserId = userId;
            const { assignedTo: assignedToInput, choreId: choreIdInput } = args.args;
            if (assignedToInput && !validator.isUUID(assignedToInput)) {
                throw new BadRequestError(`Invalid user ID: ${assignedToInput}`);
            }
            const assignedToUserId = assignedToInput as UUID | null;
            if (!validator.isUUID(choreIdInput)) {
                throw new BadRequestError(`Invalid chore ID: ${choreIdInput}`);
            }

            const choreId = choreIdInput as UUID;
            const chore = await choreRepository.fetchChoreByChoreId(choreId, true);
            const group = await chore.getGroup();
            const groupMembers = await group.getGroupMembers();
            const isAssignedByUserInGroup = groupMembers.some(member => member.userId === assignedByUserId);
            const isAssignedToUserInGroup = assignedToUserId ? groupMembers.some(member => member.userId === assignedToUserId) : null;
            if (!isAssignedByUserInGroup) {
                throw new UnauthorizedError('You are not in this group. Cannot assign chore.');
            }
            if (isAssignedToUserInGroup === undefined) {
                throw new UnauthorizedError('The user you are trying to assign the chore to is not in this group.');
            }
            const transaction = await sequelize.transaction();
            try {
                const existingAssignment = await chore.getAssignment();
                if (existingAssignment) {
                    // If an assignment already exists, update it
                    await existingAssignment.update({
                        assignedTo: assignedToUserId,
                        assignedBy: assignedByUserId,
                    }, { transaction });
                } else {
                    // Create a new assignment
                    await chore.createAssignment({
                        assignedTo: assignedToUserId,
                        assignedBy: assignedByUserId,
                        choreId: chore.id,
                    }, { transaction });
                }
                await transaction.commit();
                return chore;
            }
            catch (error) {
                await transaction.rollback();
                console.error("Error assigning chore:", error);
                throw new InternalServerError("Failed to assign chore");
            }
        },

        unassignChore: async function unassignChore(_: unknown, args: { args: { choreId: string; }; }, context: UserContext): Promise<ChoreModel> {
            const userId = context.user?.id;
            if (!userId) {
                throw new Error("Not authenticated");
            }
            const { choreId: choreIdInput } = args.args;
            if (!validator.isUUID(choreIdInput)) {
                throw new BadRequestError(`Invalid chore ID: ${choreIdInput}`);
            }
            const choreId = choreIdInput as UUID;

            const chore = await choreRepository.fetchChoreByChoreId(choreId, true);
            const group = await chore.getGroup();
            const groupMembers = await group.getGroupMembers();
            const isUserInGroup = groupMembers.some(member => member.userId === userId);
            if (!isUserInGroup) {
                throw new UnauthorizedError('You are not in this group. Cannot unassign chore.');
            }

            const assignment = await chore.getAssignment();
            const transaction = await sequelize.transaction();
            try {
                const existingAssignment = await chore.getAssignment();
                if (existingAssignment) {
                    // If an assignment already exists, update it
                    await existingAssignment.update({
                        assignedTo: null,
                        assignedBy: userId,
                    }, { transaction });
                } else {
                    // Create a new assignment
                    await chore.createAssignment({
                        assignedTo: null,
                        assignedBy: userId,
                        choreId: chore.id,
                    }, { transaction });
                }
                await transaction.commit();
                return chore;
            }
            catch (error) {
                await transaction.rollback();
                console.error("Error unassigning chore:", error);
                throw new InternalServerError("Failed to unassign chore");
            }
        }
    },

    Chore: {
        status: async (parent: ChoreModel): Promise<ChoreStatus> => {
            return await parent.getOneTimeChores()
                .then(otc => otc.length > 0 ? otc[0].status : ChoreStatus.Todo);
        },
        dueDate: async (parent: ChoreModel): Promise<Date | null> => {
            return await parent.getOneTimeChores()
                .then(otc => otc.length > 0 ? otc[0].dueDate : null);
        },
        group: async (parent: ChoreModel) => await parent.getGroup(),
        createdBy: async (parent: ChoreModel) => await parent.getCreator(),
        assignment: async (parent: ChoreModel) => {
            return await parent.getAssignment();
        }
    },
    ChoreAssignment: {
        assignedBy: async (parent: ChoreAssignmentModel) => {
            if (!parent.assignedBy) return null;
            return await parent.getChoreAssigner();
        },
        assignedTo: async (parent: ChoreAssignmentModel) => {
            if (!parent.assignedTo) return null;
            return await parent.getAssignedToUser();
        },
        assignedAt: async (parent: ChoreAssignmentModel): Promise<Date> => {
            return new Date(parent.assignedAt);
        }
    }

};