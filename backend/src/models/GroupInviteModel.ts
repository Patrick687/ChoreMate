import { UUID } from "crypto";
import { Group, GROUP_TABLE_NAME, GroupsModelAttributes } from "./GroupModel";
import { User, USER_TABLE_NAME, UserModelAttributes } from "./UserModel";
import { GroupInviteStatus } from "../generated/graphql-types";
import { BelongsToGetAssociationMixin, DataTypes, Model, Op } from "sequelize";
import { sequelize } from "../config/db";
import { ConflictError, UnauthorizedError } from "../utils/error/customErrors";

interface GroupInviteModelAttributes {
    id: UUID;
    groupId: GroupsModelAttributes['id'];
    invitedUserId: UserModelAttributes['id'];
    inviterUserId: UserModelAttributes['id'];
    status: GroupInviteStatus;
    createdAt: Date;
    respondedAt: Date | null;
}

interface GroupInviteModelCreationAttributes extends Omit<GroupInviteModelAttributes, 'id' | 'createdAt' | 'respondedAt' | 'status'> { }

export class GroupInvite extends Model<GroupInviteModelAttributes, GroupInviteModelCreationAttributes> implements GroupInviteModelAttributes {
    public id!: GroupInviteModelAttributes['id'];
    public groupId!: GroupInviteModelAttributes['groupId'];
    public invitedUserId!: GroupInviteModelAttributes['invitedUserId'];
    public inviterUserId!: GroupInviteModelAttributes['inviterUserId'];
    public status!: GroupInviteModelAttributes['status'];
    public createdAt!: GroupInviteModelAttributes['createdAt'];
    public respondedAt!: GroupInviteModelAttributes['respondedAt'];

    // inviterUser
    public getInviterUser!: BelongsToGetAssociationMixin<User>;
    // invitedUser
    public getInvitedUser!: BelongsToGetAssociationMixin<User>;
    // group
    public getGroup!: BelongsToGetAssociationMixin<Group>;
}

export const GROUP_Invite_TABLE_NAME = 'GRP_INVITE';
export const GROUP_Invite_MODEL_NAME = "GroupInvite";

export const GroupInviteModel = GroupInvite.init(
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
        invitedUserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: USER_TABLE_NAME,
                key: 'id',
            },
        },
        inviterUserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: USER_TABLE_NAME,
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM(...Object.values(GroupInviteStatus)),
            defaultValue: GroupInviteStatus.Pending,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        respondedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize, // This is the connection instance
        tableName: GROUP_Invite_TABLE_NAME,
        modelName: GROUP_Invite_MODEL_NAME,
        hooks: {
            beforeCreate: async (Invite: GroupInvite, _) => {
                //Ensure that the inviter is a member of the group
                const groupMembers = await Invite.getGroup().then((group: Group) => group.getGroupMembers());
                const isInviterMember = groupMembers.some(member => member.userId === Invite.inviterUserId);
                if (!isInviterMember) {
                    throw new UnauthorizedError("Failed to invite. You are not a member of this group.");
                }

                //Ensure that invitedUser is not already a member of the group
                const group = await Invite.getGroup();
                const isInvitedUserMember = await group.getGroupMembers().then(members => members.some(member => member.userId === Invite.invitedUserId));
                if (isInvitedUserMember) {
                    const user = await Invite.getInvitedUser();
                    throw new ConflictError(`${user.userName} is already a member of this group.`);
                }

                //Ensure that there are no other pending Invite from inviter to invitee in the same group
                const existingInvite = await GroupInvite.findOne({
                    where: {
                        groupId: Invite.groupId,
                        invitedUserId: Invite.invitedUserId,
                        status: { [Op.in]: [GroupInviteStatus.Pending, GroupInviteStatus.Accepted] },
                        inviterUserId: Invite.inviterUserId,
                    }
                });

                if (existingInvite) {
                    const user = await existingInvite.getInvitedUser();
                    if (existingInvite.status === GroupInviteStatus.Pending) {
                        throw new ConflictError(`You have already invited ${user.userName} to this group.`);
                    }
                    else {
                        throw new ConflictError(`${user.userName} is already a member of this group.`);
                    }
                }
            },
            beforeUpdate: async (invite: GroupInvite, { transaction }) => {
                //Ensure that if the status is being changed to accepted, the invited user is not already a member of the group
                if (invite.status === GroupInviteStatus.Accepted) {
                    const group = await invite.getGroup();
                    const isInvitedUserMember = await group.getGroupMembers().then(members => members.some(member => member.userId === invite.invitedUserId));
                    if (isInvitedUserMember) {
                        const user = await invite.getInvitedUser();
                        throw new ConflictError(`${user.userName} is already a member of this group.`);
                    }
                }
            }
        }
    }
);