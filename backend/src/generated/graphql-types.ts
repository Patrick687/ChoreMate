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

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type CreateGroupInput = {
  createdByUserId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type DeleteGroupInput = {
  id: Scalars['ID']['input'];
};

export type Group = {
  __typename?: 'Group';
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  groupMembers: Array<User>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGroup: Group;
  deleteGroup: Scalars['Boolean']['output'];
  login: AuthPayload;
  signup: AuthPayload;
  updateGroup: Group;
};


export type MutationCreateGroupArgs = {
  args?: InputMaybe<CreateGroupInput>;
};


export type MutationDeleteGroupArgs = {
  args?: InputMaybe<DeleteGroupInput>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationUpdateGroupArgs = {
  args?: InputMaybe<UpdateGroupInput>;
};

export type Query = {
  __typename?: 'Query';
  group: Group;
  groups: Array<Group>;
  me?: Maybe<User>;
};


export type QueryGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGroupsArgs = {
  userId: Scalars['ID']['input'];
};

export type UpdateGroupInput = {
  groupId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
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
