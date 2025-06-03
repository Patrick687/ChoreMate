import { Chore, CreateChoreInput } from "../generated/graphql-types";
import { ChoreModel, ChoreModelAttributes } from "../models/ChoresModel";
import { GroupModel } from "../models/GroupModel";
import { UserModel } from "../models/UserModel";
import { NotFoundError } from "../utils/error/customErrors";
import { UUID } from "crypto";

const Query = {
    chore: async function chore(_: unknown, args: { id: string; }): Promise<ChoreModelAttributes> {
        const { id } = args;
        const chore = await ChoreModel.findByPk(id);
        if (!chore) {
            throw new NotFoundError(`Chore with ID ${id} not found`);
        }
        return chore;
    },

    chores: async function chores(_: unknown, args: { groupId: string; }): Promise<ChoreModelAttributes[]> {
        const { groupId } = args;
        const chores = await ChoreModel.findAll({
            where: { groupId },
        });
        return chores;
    }
};


export const choreResolvers = {
    Query: {
        chore: Query.chore,
        chores: Query.chores,
    },
    ChoreMutation: {
        createChore: async function createChore(_: unknown, args: { input: CreateChoreInput; }): Promise<ChoreModelAttributes> {
            const { input } = args;
            const { createdByUserId, groupId, title, description, isRecurring } = input;

            // Validate that the group exists
            const group = await GroupModel.findByPk(groupId);
            if (!group) {
                throw new NotFoundError(`Group with ID ${groupId} not found`);
            }

            // Validate that the user exists
            const user = await UserModel.findByPk(createdByUserId);
            if (!user) {
                throw new NotFoundError(`User with ID ${createdByUserId} not found`);
            }

            // Create the chore
            const chore = await ChoreModel.create({
                groupId: groupId as UUID,
                title,
                description: description || null,
                isRecurring,
                createdBy: createdByUserId as UUID,
            });

            return chore;
        },

        updateChoreInfo: async function updateChoreInfo(_: unknown, args: { id: string; input: Partial<CreateChoreInput>; }): Promise<ChoreModelAttributes> {
            const { id, input } = args;
            const chore = await ChoreModel.findByPk(id);
            if (!chore) {
                throw new NotFoundError(`Chore with ID ${id} not found`);
            }
            const { groupId, title, description, isRecurring } = input;
            // Validate that the group exists if groupId is provided
            if (groupId) {
                const group = await GroupModel.findByPk(groupId);
                if (!group) {
                    throw new NotFoundError(`Group with ID ${groupId} not found`);
                }
            }
            // Validate that the user exists if createdByUserId is provided
            if (input.createdByUserId) {
                const user = await UserModel.findByPk(input.createdByUserId);
                if (!user) {

                }
                throw new NotFoundError(`User with ID ${input.createdByUserId} not found`);
            }
            // Update the chore
            await chore.update({
                title: title ? title : chore.title,
                description: description ? description : chore.description,
            });
            return chore;
        },
    },
    Chore: {
        group: async (parent: ChoreModelAttributes) => {
            const group = await GroupModel.findByPk(parent.groupId);
            if (!group) {
                throw new NotFoundError(`Group with ID ${parent.groupId} not found`);
            }
            return group;
        },
        createdBy: async (parent: ChoreModelAttributes) => {
            const user = await UserModel.findByPk(parent.createdBy);
            if (!user) {
                throw new NotFoundError(`User with ID ${parent.createdBy} not found`);
            }
            return user;
        }
    }

};