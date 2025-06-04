import { UUID } from "crypto";
import { User, USER_TABLE_NAME, UserModelAttributes } from "./UserModel";
import { Chore, CHORE_TABLE_NAME, ChoreModelAttributes } from "./ChoresModel";
import { BelongsToGetAssociationMixin, Model } from "sequelize";
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export interface ChoreAssignmentModelAttributes {
    id: UUID;
    choreId: ChoreModelAttributes['id'];
    assignedTo: UserModelAttributes['id'];
    assignedBy: UserModelAttributes['id'];
    assignedAt: Date;
    isCompleted: boolean;
    completedAt: Date | null;
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
    public isCompleted!: ChoreAssignmentModelAttributes['isCompleted'];
    public completedAt!: ChoreAssignmentModelAttributes['completedAt'];

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
            allowNull: false,
            references: {
                model: USER_TABLE_NAME, // Assuming the UserModel is defined in the same file or imported correctly
                key: 'id',
            },
        },
        assignedBy: {
            type: DataTypes.UUID,
            allowNull: false,
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
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize: sequelize, // Assuming sequelize is imported from your db config
        tableName: CHORE_ASSIGNMENT_TABLE_NAME,
        modelName: CHORE_ASSIGNMENT_MODEL_NAME,

    }
);