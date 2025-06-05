import { User, UserModel } from './UserModel';
import { Group, GroupModel } from './GroupModel';
import { GroupMember, GroupMemberModel } from './GroupMembersModel';
import { Chore, ChoreModel } from './ChoresModel';
import { OneTimeChore, OneTimeChoreModel } from './OneTimeChoresModel';
import { ChoreAssignment, ChoreAssignmentModel } from './ChoreAssignmentsModel';
import { GroupInvite, GroupInviteModel } from './GroupInviteModel';

export const USER_GROUPS_ALIAS = 'createdGroups';
UserModel.hasMany(Group, { foreignKey: 'createdBy', sourceKey: 'id', as: USER_GROUPS_ALIAS });

export const GROUP_CREATOR_ALIAS = 'creator';
GroupModel.belongsTo(User, { foreignKey: 'createdBy', as: GROUP_CREATOR_ALIAS });

export const USER_GROUP_MEMBER_ALIAS = 'groupMembers';
UserModel.hasMany(GroupMember, { foreignKey: 'userId', sourceKey: 'id', as: USER_GROUP_MEMBER_ALIAS });

export const GROUP_GROUP_MEMBER_ALIAS = 'groupMembers';
GroupModel.hasMany(GroupMember, { foreignKey: 'groupId', sourceKey: 'id', as: GROUP_GROUP_MEMBER_ALIAS });

export const GROUP_MEMBER_GROUP_ALIAS = 'group';
GroupMemberModel.belongsTo(Group, { foreignKey: 'groupId', targetKey: 'id', as: GROUP_MEMBER_GROUP_ALIAS });

export const GROUP_MEMBER_USER_ALIAS = 'user';
GroupMemberModel.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: GROUP_MEMBER_USER_ALIAS });

export const GROUP_CHORE_ALIAS = 'chores';
GroupModel.hasMany(Chore, { foreignKey: 'groupId', sourceKey: 'id', as: GROUP_CHORE_ALIAS });

export const CHORE_GROUP_ALIAS = 'group';
ChoreModel.belongsTo(Group, { foreignKey: 'groupId', targetKey: 'id', as: CHORE_GROUP_ALIAS });

export const CHORE_CREATOR_ALIAS = 'creator';
ChoreModel.belongsTo(User, { foreignKey: 'createdBy', targetKey: 'id', as: CHORE_CREATOR_ALIAS });

export const USER_CHORES_CREATED_ALIAS = 'createdChores';
UserModel.hasMany(Chore, { foreignKey: 'createdBy', sourceKey: 'id', as: USER_CHORES_CREATED_ALIAS });

export const CHORE_ONE_TIME_CHORE_ALIAS = 'oneTimeChores';
ChoreModel.hasMany(OneTimeChore, { foreignKey: 'choreId', sourceKey: 'id', as: CHORE_ONE_TIME_CHORE_ALIAS });

export const ONE_TIME_CHORE_CHORE_ALIAS = 'chore';
OneTimeChoreModel.belongsTo(Chore, { foreignKey: 'choreId', targetKey: 'id', as: ONE_TIME_CHORE_CHORE_ALIAS });

export const CHORE_ASSIGNMENT_CHORE_ALIAS = 'chore';
ChoreAssignmentModel.belongsTo(Chore, { foreignKey: 'choreId', targetKey: 'id', as: CHORE_ASSIGNMENT_CHORE_ALIAS });

export const CHORE_CHORE_ASSIGNMENT_ALIAS = 'assignment';
ChoreModel.hasOne(ChoreAssignment, { foreignKey: 'choreId', sourceKey: 'id', as: CHORE_CHORE_ASSIGNMENT_ALIAS });

export const CHORE_ASSIGNMENT_ASSIGNED_TO_ALIAS = 'assignedToUser';
ChoreAssignmentModel.belongsTo(User, { foreignKey: 'assignedTo', targetKey: 'id', as: CHORE_ASSIGNMENT_ASSIGNED_TO_ALIAS });

export const USER_CHORE_ASSIGNED_TO_ALIAS = 'choreAssignments';
UserModel.hasMany(ChoreAssignment, { foreignKey: 'assignedTo', sourceKey: 'id', as: USER_CHORE_ASSIGNED_TO_ALIAS });

export const CHORE_ASSIGNMENT_ASSIGNER_ALIAS = 'choreAssigner';
ChoreAssignmentModel.belongsTo(User, { foreignKey: 'assignedBy', targetKey: 'id', as: CHORE_ASSIGNMENT_ASSIGNER_ALIAS });

export const USER_CHORE_ASSIGNED_BY_ALIAS = 'assignedChores';
UserModel.hasMany(ChoreAssignment, { foreignKey: 'assignedBy', sourceKey: 'id', as: USER_CHORE_ASSIGNED_BY_ALIAS });

// GroupInvite belongsTo User (inviter)
export const GROUP_INVITE_INVITER_USER_ALIAS = 'inviterUser';
GroupInviteModel.belongsTo(User, { foreignKey: 'inviterUserId', as: GROUP_INVITE_INVITER_USER_ALIAS });

// User hasMany GroupInvite (sent invites)
export const USER_SENT_INVITES_ALIAS = 'sentInvites';
UserModel.hasMany(GroupInvite, { foreignKey: 'inviterUserId', as: USER_SENT_INVITES_ALIAS });

// GroupInvite belongsTo User (invitee)
export const GROUP_INVITE_INVITED_USER_ALIAS = 'invitedUser';
GroupInviteModel.belongsTo(User, { foreignKey: 'invitedUserId', as: GROUP_INVITE_INVITED_USER_ALIAS });

// User hasMany GroupInvite (received invites)
export const USER_RECEIVED_INVITES_ALIAS = 'receivedInvites';
UserModel.hasMany(GroupInvite, { foreignKey: 'invitedUserId', as: USER_RECEIVED_INVITES_ALIAS });

// Group hasMany GroupInvite (groupInvites)
export const GROUP_GROUP_INVITES_ALIAS = 'groupInvites';
GroupModel.hasMany(GroupInvite, { foreignKey: 'groupId', sourceKey: 'id', as: GROUP_GROUP_INVITES_ALIAS });

// GroupInvite belongsTo Group (group)
export const GROUP_INVITE_GROUP_ALIAS = 'group';
GroupInviteModel.belongsTo(Group, { foreignKey: 'groupId', targetKey: 'id', as: GROUP_INVITE_GROUP_ALIAS });