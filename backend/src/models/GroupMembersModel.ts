import { UUID } from "crypto";
import { Group, GROUP_TABLE_NAME, GroupsModelAttributes } from "./GroupModel";
import { User, USER_TABLE_NAME, UserModelAttributes } from "./UserModel";
import { BelongsToGetAssociationMixin, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

export enum GroupMemberRole {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export interface GroupMemberModelAttributes {
    id: UUID;
    groupId: GroupsModelAttributes['id'];
    userId: UserModelAttributes['id'];
    role: GroupMemberRole;
    joinedAt: Date;
}

export interface GroupMemberModelCreationAttributes extends Omit<GroupMemberModelAttributes, 'id' | 'joinedAt'> { }

export const GROUP_MEMBER_TABLE_NAME = "GRP_MEMBER";
export const GROUP_MEMBER_MODEL_NAME = "GroupMember";

export class GroupMember extends Model<GroupMemberModelAttributes, GroupMemberModelCreationAttributes> implements GroupMemberModelAttributes {
    public id!: GroupMemberModelAttributes['id'];
    public groupId!: GroupMemberModelAttributes['groupId'];
    public userId!: GroupMemberModelAttributes['userId'];
    public role!: GroupMemberModelAttributes['role'];
    public joinedAt!: Date;

    // group
    public getGroup!: BelongsToGetAssociationMixin<Group>;
    // user
    public getUser!: BelongsToGetAssociationMixin<User>;
}

export const GroupMemberModel = GroupMember.init(
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
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: USER_TABLE_NAME,
                key: 'id',
            },
        },
        role: {
            type: DataTypes.ENUM(...Object.values(GroupMemberRole)),
            allowNull: false,
        },
        joinedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize, // This is the connection instance
        modelName: GROUP_MEMBER_MODEL_NAME,
        tableName: GROUP_MEMBER_TABLE_NAME,
        indexes: [
            {
                unique: true,
                fields: ['groupId', 'userId']
            }
        ],
    }
);