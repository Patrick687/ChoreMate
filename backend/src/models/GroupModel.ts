import { UUID } from "crypto";
import { USER_TABLE_NAME, UserModelAttributes } from "./UserModel";
import { sequelize } from "../config/db";
import { DataTypes, Model, Optional } from "sequelize";
import { BadRequestError } from "../utils/error/customErrors";

export interface GroupsModelAttributes {
    id: UUID;
    name: string;
    createdBy: UserModelAttributes['id'];
    createdAt: Date;
}

export interface GroupsModelCreationAttributes extends Optional<GroupsModelAttributes, 'id' | 'createdAt'> {
}

export const GROUP_TABLE_NAME = 'GRP_GROUP';
export const GROUP_MODEL_NAME = 'Group';

export class Group extends Model<GroupsModelAttributes, GroupsModelCreationAttributes> implements GroupsModelAttributes {
    public id!: GroupsModelAttributes['id'];
    public name!: GroupsModelAttributes['name'];
    public createdBy!: GroupsModelAttributes['createdBy'];
    public createdAt!: GroupsModelAttributes['createdAt'];
}

export const GroupModel = Group.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                customValidator(value: string) {
                    validateGroupName(value);
                }
            },
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: USER_TABLE_NAME,
                key: 'id',
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize, // This is the connection instance
        modelName: 'Group',
        tableName: 'GRP_GROUP'
    }
);

function validateGroupName(value: string) {
    if (!value) {
        throw new BadRequestError('Group name is required');
    }
    if (value.length < 1) {
        throw new BadRequestError('Group name must be at least 1 character long');
    }
    if (value.length > 120) {
        throw new BadRequestError('Group name must be at most 120 characters long');
    }
    if (!/^[a-zA-Z0-9 \s]+$/.test(value)) {
        throw new BadRequestError('Group name can only contain alphanumeric characters and spaces');
    }
}
