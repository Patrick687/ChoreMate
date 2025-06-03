import { UUID } from "crypto";
import { USER_TABLE_NAME, UserModelAttributes } from "./UserModel";
import { GROUP_TABLE_NAME, GroupsModelAttributes } from "./GroupModel";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { BadRequestError, UnauthorizedError } from "../utils/error/customErrors";
import { GroupMemberModel } from "./GroupMembersModel";

export interface ChoreModelAttributes {
    id: UUID;
    groupId: GroupsModelAttributes['id'];
    title: string;
    description: string | null;
    isRecurring: boolean;
    createdBy: UserModelAttributes['id'];
    createdAt: Date;
}

interface ChoreModelCreationAttributes extends Omit<ChoreModelAttributes, 'id' | 'createdAt'> { }

export class Chore extends Model<ChoreModelAttributes, ChoreModelCreationAttributes> implements ChoreModelAttributes {
    public id!: ChoreModelAttributes['id'];
    public groupId!: ChoreModelAttributes['groupId'];
    public title!: ChoreModelAttributes['title'];
    public description!: ChoreModelAttributes['description'];
    public isRecurring!: ChoreModelAttributes['isRecurring'];
    public createdBy!: ChoreModelAttributes['createdBy'];
    public createdAt!: ChoreModelAttributes['createdAt'];
}

export const CHORE_TABLE_NAME = 'CHR_CHORE';
export const CHORE_MODEL_NAME = 'Chore';

export const ChoreModel = Chore.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        groupId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: GROUP_TABLE_NAME,
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                customValidator(value: string) {
                    validateChoreTitle(value);
                },
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            set(value: string) {
                this.setDataValue('description', value && value.trim() !== '' ? value : null);
            },
            validate: {
                customValidator(value: string) {
                    validateChoreDescription(value);
                },
            },
        },
        isRecurring: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: USER_TABLE_NAME,
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize, // This is the connection instance
        modelName: CHORE_MODEL_NAME,
        tableName: CHORE_TABLE_NAME,
        hooks: {
            beforeCreate: async (chore, _) => {
                const isMember = await GroupMemberModel.findOne({
                    where: {
                        groupId: chore.groupId,
                        userId: chore.createdBy,
                    }
                });
                if (!isMember) {
                    throw new UnauthorizedError("Chore creator must be a member of the group.");
                }
            },
        }
    }
);

function validateChoreTitle(value: string) {
    if (!value || value.trim().length === 0) {
        throw new BadRequestError('Chore title is required');
    }
    if (value.length > 255) {
        throw new BadRequestError('Chore title must be less than 255 characters');
    }
}

function validateChoreDescription(value: string) {
    if (value && value.length > 1000) {
        throw new BadRequestError('Chore description must be less than 1000 characters');
    }
}
