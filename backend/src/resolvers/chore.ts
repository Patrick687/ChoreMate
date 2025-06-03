console.log("CHORE RESOLVER LOADED");

import { ChoreModel, ChoreModelAttributes } from "../models/ChoresModel";
import { GroupModel } from "../models/GroupModel";
import { UserModel } from "../models/UserModel";
import { NotFoundError } from "../utils/error/customErrors";

const Query = {
    chore: async function chore(_: unknown, args: { id: string; }) {
        const { id } = args;
        const chore = await ChoreModel.findByPk(id);
        if (!chore) {
            throw new NotFoundError(`Chore with ID ${id} not found`);
        }
        return chore;
    },

    chores: async function chores(_: unknown, args: { groupId: string; }) {
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
    Mutation: {

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