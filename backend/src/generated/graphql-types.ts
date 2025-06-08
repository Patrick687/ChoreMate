export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type AssignChoreInput = {
  assignedToUserId: InputMaybe<Scalars['ID']['input']>;
  choreId: Scalars['ID']['input'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Chore = {
  __typename?: 'Chore';
  assignment: ChoreAssignment;
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  description: Maybe<Scalars['String']['output']>;
  dueDate: Maybe<Scalars['Date']['output']>;
  group: Group;
  id: Scalars['ID']['output'];
  isRecurring: Scalars['Boolean']['output'];
  status: ChoreStatus;
  title: Scalars['String']['output'];
};

export type ChoreAssignment = {
  __typename?: 'ChoreAssignment';
  assignedAt: Scalars['Date']['output'];
  assignedBy: Maybe<User>;
  assignedTo: Maybe<User>;
  id: Scalars['ID']['output'];
};

export enum ChoreStatus {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  Todo = 'TODO'
}

export type CreateChoreInput = {
  description: InputMaybe<Scalars['String']['input']>;
  dueDate: InputMaybe<Scalars['Date']['input']>;
  groupId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateGroupInput = {
  name: Scalars['String']['input'];
};

export type GetChoreByChoreIdInput = {
  choreId: Scalars['ID']['input'];
  groupId: Scalars['ID']['input'];
};

export type GetChoresByGroupIdInput = {
  groupId: Scalars['ID']['input'];
};

export type GetGroupInvitesByGroupIdInput = {
  groupId: Scalars['ID']['input'];
};

export type Group = {
  __typename?: 'Group';
  chores: Array<Chore>;
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  groupInvites: Array<GroupInvite>;
  groupMembers: Array<GroupMember>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GroupInvite = {
  __typename?: 'GroupInvite';
  createdAt: Scalars['Date']['output'];
  group: Group;
  id: Scalars['ID']['output'];
  invitedUser: User;
  inviterUser: User;
  respondedAt: Maybe<Scalars['Date']['output']>;
  status: GroupInviteStatus;
};

export enum GroupInviteStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type GroupMember = {
  __typename?: 'GroupMember';
  joinedAt: Scalars['Date']['output'];
  user: User;
};

export type InviteToGroupInput = {
  groupId: Scalars['ID']['input'];
  invitedUserName: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignChore: ChoreAssignment;
  createChore: Chore;
  createGroup: Group;
  inviteToGroup: GroupInvite;
  login: AuthPayload;
  respondToGroupInvite: GroupInvite;
  signup: AuthPayload;
  updateChoreDescription: Chore;
  updateChoreDueDate: Chore;
  updateChoreStatus: Chore;
  updateChoreTitle: Chore;
};


export type MutationAssignChoreArgs = {
  args: InputMaybe<AssignChoreInput>;
};


export type MutationCreateChoreArgs = {
  args: InputMaybe<CreateChoreInput>;
};


export type MutationCreateGroupArgs = {
  args: InputMaybe<CreateGroupInput>;
};


export type MutationInviteToGroupArgs = {
  args: InputMaybe<InviteToGroupInput>;
};


export type MutationLoginArgs = {
  args: InputMaybe<LoginInput>;
};


export type MutationRespondToGroupInviteArgs = {
  args: InputMaybe<RespondToGroupInviteInput>;
};


export type MutationSignupArgs = {
  args: InputMaybe<SignupInput>;
};


export type MutationUpdateChoreDescriptionArgs = {
  args: InputMaybe<UpdateChoreDescriptionInput>;
};


export type MutationUpdateChoreDueDateArgs = {
  args: InputMaybe<UpdateChoreDueDateInput>;
};


export type MutationUpdateChoreStatusArgs = {
  args: InputMaybe<UpdateChoreStatusInput>;
};


export type MutationUpdateChoreTitleArgs = {
  args: InputMaybe<UpdateChoreTitleInput>;
};

export type Query = {
  __typename?: 'Query';
  getChoreByChoreId: Chore;
  getChoresByGroupId: Array<Chore>;
  getGroupInvitesByGroupId: Array<GroupInvite>;
  getGroups: Array<Group>;
  getMyReceivedGroupInvites: Array<GroupInvite>;
  getMySentGroupInvites: Array<GroupInvite>;
};


export type QueryGetChoreByChoreIdArgs = {
  args: InputMaybe<GetChoreByChoreIdInput>;
};


export type QueryGetChoresByGroupIdArgs = {
  args: InputMaybe<GetChoresByGroupIdInput>;
};


export type QueryGetGroupInvitesByGroupIdArgs = {
  args: InputMaybe<GetGroupInvitesByGroupIdInput>;
};

export type RespondToGroupInviteInput = {
  inviteId: Scalars['ID']['input'];
  inviteStatus: GroupInviteStatus;
};

export type SignupInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  groupInviteCreated: GroupInvite;
  groupInviteResponded: GroupInvite;
};

export type UpdateChoreDescriptionInput = {
  choreId: Scalars['ID']['input'];
  description: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChoreDueDateInput = {
  choreId: Scalars['ID']['input'];
  dueDate: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateChoreStatusInput = {
  choreId: Scalars['ID']['input'];
  status: ChoreStatus;
};

export type UpdateChoreTitleInput = {
  choreId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};
