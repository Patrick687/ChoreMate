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
  assignedTo: InputMaybe<Scalars['ID']['input']>;
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
  groupId: Scalars['ID']['input'];
  isRecurring: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type CreateGroupInput = {
  createdByUserId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type DeleteChoreInput = {
  choreId: Scalars['ID']['input'];
};

export type DeleteGroupInput = {
  id: Scalars['ID']['input'];
};

export type Group = {
  __typename?: 'Group';
  chores: Array<Chore>;
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  groupInvites: Array<GroupInvite>;
  groupMembers: Array<User>;
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

export type InviteToGroupInput = {
  groupId: Scalars['ID']['input'];
  invitedUserName: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignChore: ChoreAssignment;
  createChore: Chore;
  createGroup: Group;
  deleteChore: Scalars['Boolean']['output'];
  deleteGroup: Scalars['Boolean']['output'];
  inviteToGroup: GroupInvite;
  login: AuthPayload;
  respondToGroupInvite: GroupInvite;
  signup: AuthPayload;
  unassignChore: ChoreAssignment;
  updateChoreDueDate: Chore;
  updateChoreInfo: Chore;
  updateChoreStatus: Chore;
  updateGroup: Group;
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


export type MutationDeleteChoreArgs = {
  args: InputMaybe<DeleteChoreInput>;
};


export type MutationDeleteGroupArgs = {
  args: InputMaybe<DeleteGroupInput>;
};


export type MutationInviteToGroupArgs = {
  args: InputMaybe<InviteToGroupInput>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRespondToGroupInviteArgs = {
  args: InputMaybe<RespondToGroupInviteInput>;
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationUnassignChoreArgs = {
  args: InputMaybe<UnassignChoreInput>;
};


export type MutationUpdateChoreDueDateArgs = {
  args: InputMaybe<UpdateChoreDueDateInput>;
};


export type MutationUpdateChoreInfoArgs = {
  args: InputMaybe<UpdateChoreInfoInput>;
};


export type MutationUpdateChoreStatusArgs = {
  args: InputMaybe<UpdateChoreStatusInput>;
};


export type MutationUpdateGroupArgs = {
  args: InputMaybe<UpdateGroupInput>;
};

export type Query = {
  __typename?: 'Query';
  chore: Chore;
  chores: Array<Chore>;
  group: Group;
  groupInvites: Array<GroupInvite>;
  groups: Array<Group>;
  me: Maybe<User>;
  myGroupInvites: Array<GroupInvite>;
};


export type QueryChoreArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChoresArgs = {
  groupId: Scalars['ID']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGroupInvitesArgs = {
  groupId: Scalars['ID']['input'];
};

export type RespondToGroupInviteInput = {
  inviteId: Scalars['ID']['input'];
  response: GroupInviteStatus;
};

export type UnassignChoreInput = {
  choreId: Scalars['ID']['input'];
};

export type UpdateChoreDueDateInput = {
  choreId: Scalars['ID']['input'];
  dueDate: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateChoreInfoInput = {
  choreId: Scalars['ID']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChoreStatusInput = {
  choreId: Scalars['ID']['input'];
  status: ChoreStatus;
};

export type UpdateGroupInput = {
  groupId: Scalars['ID']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};
