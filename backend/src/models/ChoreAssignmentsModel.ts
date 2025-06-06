import { UUID } from "crypto";
import { User, USER_TABLE_NAME, UserModelAttributes } from "./UserModel";
import { Chore, CHORE_TABLE_NAME, ChoreModelAttributes } from "./ChoresModel";
import { BelongsToGetAssociationMixin, Model } from "sequelize";
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { InternalServerError, UnauthorizedError } from "../utils/error/customErrors";

export interface ChoreAssignmentModelAttributes {
    id: UUID;
    choreId: ChoreModelAttributes['id'];
    assignedTo: UserModelAttributes['id'] | null;
    assignedBy: UserModelAttributes['id'] | null;
    assignedAt: Date;
}

export interface ChoreAssignmentModelCreationAttributes extends Omit<ChoreAssignmentModelAttributes, 'id' | 'assignedAt' | 'isCompleted' | 'completedAt'> { }

export const CHORE_ASSIGNMENT_TABLE_NAME = "CHR_ASSIGNMENT";
export const CHORE_ASSIGNMENT_MODEL_NAME = "ChoreAssignment";

export class ChoreAssignment extends Model<ChoreAssignmentModelAttributes, ChoreAssignmentModelCreationAttributes> implements ChoreAssignmentModelAttributes {
    public id!: ChoreAssignmentModelAttributes['id'];
    public choreId!: ChoreAssignmentModelAttributes['choreId'];
    public assignedTo!: ChoreAssignmentModelAttributes['assignedTo'];
    public assignedBy!: ChoreAssignmentModelAttributes['assignedBy'];
    public assignedAt!: ChoreAssignmentModelAttributes['assignedAt'];

    public getChore!: BelongsToGetAssociationMixin<Chore>;
    // assignedToUser
    public getAssignedToUser!: BelongsToGetAssociationMixin<User>;
    // choreAssigner
    public getChoreAssigner!: BelongsToGetAssociationMixin<User>;
}
export const ChoreAssignmentModel = ChoreAssignment.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        choreId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: CHORE_TABLE_NAME,
                key: 'id',
            },
        },
        assignedTo: {
            type: DataTypes.UUID,
            defaultValue: null,
            allowNull: true,
            references: {
                model: USER_TABLE_NAME, // Assuming the UserModel is defined in the same file or imported correctly
                key: 'id',
            },
        },
        assignedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
            references: {
                model: USER_TABLE_NAME, // Assuming the UserModel is defined in the same file or imported correctly
                key: 'id',
            },
        },
        assignedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize: sequelize, // Assuming sequelize is imported from your db config
        tableName: CHORE_ASSIGNMENT_TABLE_NAME,
        modelName: CHORE_ASSIGNMENT_MODEL_NAME,
        hooks: {
            beforeCreate: async (assignment: ChoreAssignment) => {
                //Check assignedTo and assignedBy are in the group of the chore
                const chore = await assignment.getChore();
                const group = await chore.getGroup();
                const groupMembers = await group.getGroupMembers();


                //Check if assignedTo is a member of the group
                const assignedToUser = assignment.assignedTo ? await assignment.getAssignedToUser() : null;
                if (assignedToUser) {
                    const isAssignedToMember = groupMembers.some(member => member.userId === assignedToUser.id);
                    if (!isAssignedToMember) {
                        throw new UnauthorizedError(`User ${assignedToUser.id} is not a member of the group ${group.id}`);
                    }
                }
                //Check if assignedBy is a member of the group
                const assignedByUser = await assignment.getChoreAssigner();
                const isAssignedByMember = groupMembers.some(member => member.userId === assignedByUser.id);
                if (!isAssignedByMember) {
                    throw new UnauthorizedError(`User ${assignedByUser.id} is not a member of the group ${group.id}`);
                }
                assignment.assignedAt = new Date();
            },
            beforeUpdate: async (assignment: ChoreAssignment) => {
                const chore = await assignment.getChore();
                const group = await chore.getGroup();
                const groupMembers = await group.getGroupMembers();


                //Check if assignedTo is a member of the group
                const assignedToUser = assignment.assignedTo ? await assignment.getAssignedToUser() : null;
                if (assignedToUser) {
                    const isAssignedToMember = groupMembers.some(member => member.userId === assignedToUser.id);
                    if (!isAssignedToMember) {
                        throw new UnauthorizedError(`User ${assignedToUser.id} is not a member of the group ${group.id}`);
                    }
                }
                //Check if assignedBy is a member of the group
                const assignedByUser = await assignment.getChoreAssigner();
                const isAssignedByMember = groupMembers.some(member => member.userId === assignedByUser.id);
                if (!isAssignedByMember) {
                    throw new UnauthorizedError(`User ${assignedByUser.id} is not a member of the group ${group.id}`);
                }
                assignment.assignedAt = new Date();
            },
        }

    }
);