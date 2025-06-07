import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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
  assignedTo?: InputMaybe<Scalars['ID']['input']>;
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
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['Date']['output']>;
  group: Group;
  id: Scalars['ID']['output'];
  isRecurring: Scalars['Boolean']['output'];
  status: ChoreStatus;
  title: Scalars['String']['output'];
};

export type ChoreAssignment = {
  __typename?: 'ChoreAssignment';
  assignedAt: Scalars['Date']['output'];
  assignedBy?: Maybe<User>;
  assignedTo?: Maybe<User>;
  id: Scalars['ID']['output'];
};

export enum ChoreStatus {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  Todo = 'TODO'
}

export type CreateChoreInput = {
  description?: InputMaybe<Scalars['String']['input']>;
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
  respondedAt?: Maybe<Scalars['Date']['output']>;
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
  args?: InputMaybe<AssignChoreInput>;
};


export type MutationCreateChoreArgs = {
  args?: InputMaybe<CreateChoreInput>;
};


export type MutationCreateGroupArgs = {
  args?: InputMaybe<CreateGroupInput>;
};


export type MutationDeleteChoreArgs = {
  args?: InputMaybe<DeleteChoreInput>;
};


export type MutationDeleteGroupArgs = {
  args?: InputMaybe<DeleteGroupInput>;
};


export type MutationInviteToGroupArgs = {
  args?: InputMaybe<InviteToGroupInput>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRespondToGroupInviteArgs = {
  args?: InputMaybe<RespondToGroupInviteInput>;
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationUnassignChoreArgs = {
  args?: InputMaybe<UnassignChoreInput>;
};


export type MutationUpdateChoreDueDateArgs = {
  args?: InputMaybe<UpdateChoreDueDateInput>;
};


export type MutationUpdateChoreInfoArgs = {
  args?: InputMaybe<UpdateChoreInfoInput>;
};


export type MutationUpdateChoreStatusArgs = {
  args?: InputMaybe<UpdateChoreStatusInput>;
};


export type MutationUpdateGroupArgs = {
  args?: InputMaybe<UpdateGroupInput>;
};

export type Query = {
  __typename?: 'Query';
  chore: Chore;
  chores: Array<Chore>;
  group: Group;
  groupInvites: Array<GroupInvite>;
  groups: Array<Group>;
  me?: Maybe<User>;
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
  dueDate?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateChoreInfoInput = {
  choreId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChoreStatusInput = {
  choreId: Scalars['ID']['input'];
  status: ChoreStatus;
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

export type CreateChoreMutationVariables = Exact<{
  args: CreateChoreInput;
}>;


export type CreateChoreMutation = { __typename?: 'Mutation', createChore: { __typename?: 'Chore', id: string, title: string, description?: string | null, dueDate?: any | null, createdAt: any, isRecurring: boolean, status: ChoreStatus, createdBy: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string } } };

export type AssignChoreMutationVariables = Exact<{
  args?: InputMaybe<AssignChoreInput>;
}>;


export type AssignChoreMutation = { __typename?: 'Mutation', assignChore: { __typename?: 'ChoreAssignment', id: string, assignedAt: any, assignedTo?: { __typename?: 'User', email: string, firstName: string, lastName: string, userName: string, id: string } | null, assignedBy?: { __typename?: 'User', userName: string, lastName: string, id: string, firstName: string, email: string } | null } };

export type InviteToGroupMutationVariables = Exact<{
  args?: InputMaybe<InviteToGroupInput>;
}>;


export type InviteToGroupMutation = { __typename?: 'Mutation', inviteToGroup: { __typename?: 'GroupInvite', status: GroupInviteStatus, respondedAt?: any | null, id: string, inviterUser: { __typename?: 'User', userName: string, lastName: string, id: string, firstName: string, email: string }, invitedUser: { __typename?: 'User', userName: string, lastName: string, id: string, firstName: string, email: string }, group: { __typename?: 'Group', name: string, id: string } } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string } } };

export type SignupMutationVariables = Exact<{
  userName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string } } };

export type UnassignChoreMutationVariables = Exact<{
  args?: InputMaybe<UnassignChoreInput>;
}>;


export type UnassignChoreMutation = { __typename?: 'Mutation', unassignChore: { __typename?: 'ChoreAssignment', id: string, assignedAt: any, assignedBy?: { __typename?: 'User', email: string, firstName: string, id: string, lastName: string, userName: string } | null, assignedTo?: { __typename?: 'User', userName: string, lastName: string, id: string, firstName: string, email: string } | null } };

export type UpdateChoreDueDateMutationVariables = Exact<{
  args?: InputMaybe<UpdateChoreDueDateInput>;
}>;


export type UpdateChoreDueDateMutation = { __typename?: 'Mutation', updateChoreDueDate: { __typename?: 'Chore', id: string, dueDate?: any | null } };

export type UpdateChoreInfoMutationVariables = Exact<{
  args?: InputMaybe<UpdateChoreInfoInput>;
}>;


export type UpdateChoreInfoMutation = { __typename?: 'Mutation', updateChoreInfo: { __typename?: 'Chore', id: string, title: string, description?: string | null } };

export type UpdateChoreStatusMutationVariables = Exact<{
  args?: InputMaybe<UpdateChoreStatusInput>;
}>;


export type UpdateChoreStatusMutation = { __typename?: 'Mutation', updateChoreStatus: { __typename?: 'Chore', id: string, status: ChoreStatus } };

export type MyGroupInvitesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyGroupInvitesQuery = { __typename?: 'Query', myGroupInvites: Array<{ __typename?: 'GroupInvite', id: string, status: GroupInviteStatus, createdAt: any, respondedAt?: any | null, group: { __typename?: 'Group', id: string, name: string, createdAt: any, createdBy: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string }, groupMembers: Array<{ __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string }> }, inviterUser: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string }, invitedUser: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string } }> };

export type GroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupsQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'Group', id: string, name: string, createdAt: any, createdBy: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string }, groupMembers: Array<{ __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string }>, chores: Array<{ __typename?: 'Chore', id: string, title: string, description?: string | null, createdAt: any, isRecurring: boolean, dueDate?: any | null, status: ChoreStatus, group: { __typename?: 'Group', id: string, name: string, createdAt: any }, createdBy: { __typename?: 'User', userName: string, lastName: string, id: string, firstName: string, email: string }, assignment: { __typename?: 'ChoreAssignment', id: string, assignedAt: any, assignedTo?: { __typename?: 'User', userName: string, lastName: string, id: string, firstName: string, email: string } | null, assignedBy?: { __typename?: 'User', userName: string, lastName: string, id: string, firstName: string, email: string } | null } }>, groupInvites: Array<{ __typename?: 'GroupInvite', id: string, status: GroupInviteStatus, createdAt: any, respondedAt?: any | null, inviterUser: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string }, invitedUser: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string } }> }> };


export const CreateChoreDocument = gql`
    mutation createChore($args: CreateChoreInput!) {
  createChore(args: $args) {
    id
    title
    description
    createdBy {
      id
      userName
      email
      firstName
      lastName
    }
    dueDate
    createdAt
    isRecurring
    status
  }
}
    `;
export type CreateChoreMutationFn = Apollo.MutationFunction<CreateChoreMutation, CreateChoreMutationVariables>;

/**
 * __useCreateChoreMutation__
 *
 * To run a mutation, you first call `useCreateChoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChoreMutation, { data, loading, error }] = useCreateChoreMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useCreateChoreMutation(baseOptions?: Apollo.MutationHookOptions<CreateChoreMutation, CreateChoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChoreMutation, CreateChoreMutationVariables>(CreateChoreDocument, options);
      }
export type CreateChoreMutationHookResult = ReturnType<typeof useCreateChoreMutation>;
export type CreateChoreMutationResult = Apollo.MutationResult<CreateChoreMutation>;
export type CreateChoreMutationOptions = Apollo.BaseMutationOptions<CreateChoreMutation, CreateChoreMutationVariables>;
export const AssignChoreDocument = gql`
    mutation AssignChore($args: AssignChoreInput) {
  assignChore(args: $args) {
    id
    assignedTo {
      email
      firstName
      lastName
      userName
      id
    }
    assignedBy {
      userName
      lastName
      id
      firstName
      email
    }
    assignedAt
  }
}
    `;
export type AssignChoreMutationFn = Apollo.MutationFunction<AssignChoreMutation, AssignChoreMutationVariables>;

/**
 * __useAssignChoreMutation__
 *
 * To run a mutation, you first call `useAssignChoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignChoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignChoreMutation, { data, loading, error }] = useAssignChoreMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useAssignChoreMutation(baseOptions?: Apollo.MutationHookOptions<AssignChoreMutation, AssignChoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignChoreMutation, AssignChoreMutationVariables>(AssignChoreDocument, options);
      }
export type AssignChoreMutationHookResult = ReturnType<typeof useAssignChoreMutation>;
export type AssignChoreMutationResult = Apollo.MutationResult<AssignChoreMutation>;
export type AssignChoreMutationOptions = Apollo.BaseMutationOptions<AssignChoreMutation, AssignChoreMutationVariables>;
export const InviteToGroupDocument = gql`
    mutation InviteToGroup($args: InviteToGroupInput) {
  inviteToGroup(args: $args) {
    status
    respondedAt
    inviterUser {
      userName
      lastName
      id
      firstName
      email
    }
    invitedUser {
      userName
      lastName
      id
      firstName
      email
    }
    id
    group {
      name
      id
    }
  }
}
    `;
export type InviteToGroupMutationFn = Apollo.MutationFunction<InviteToGroupMutation, InviteToGroupMutationVariables>;

/**
 * __useInviteToGroupMutation__
 *
 * To run a mutation, you first call `useInviteToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteToGroupMutation, { data, loading, error }] = useInviteToGroupMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useInviteToGroupMutation(baseOptions?: Apollo.MutationHookOptions<InviteToGroupMutation, InviteToGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteToGroupMutation, InviteToGroupMutationVariables>(InviteToGroupDocument, options);
      }
export type InviteToGroupMutationHookResult = ReturnType<typeof useInviteToGroupMutation>;
export type InviteToGroupMutationResult = Apollo.MutationResult<InviteToGroupMutation>;
export type InviteToGroupMutationOptions = Apollo.BaseMutationOptions<InviteToGroupMutation, InviteToGroupMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      userName
      email
      firstName
      lastName
    }
    token
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const SignupDocument = gql`
    mutation signup($userName: String!, $email: String!, $password: String!, $firstName: String!, $lastName: String!) {
  signup(
    userName: $userName
    email: $email
    password: $password
    firstName: $firstName
    lastName: $lastName
  ) {
    user {
      id
      userName
      email
      firstName
      lastName
    }
    token
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      userName: // value for 'userName'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const UnassignChoreDocument = gql`
    mutation UnassignChore($args: UnassignChoreInput) {
  unassignChore(args: $args) {
    id
    assignedBy {
      email
      firstName
      id
      lastName
      userName
    }
    assignedAt
    assignedTo {
      userName
      lastName
      id
      firstName
      email
    }
  }
}
    `;
export type UnassignChoreMutationFn = Apollo.MutationFunction<UnassignChoreMutation, UnassignChoreMutationVariables>;

/**
 * __useUnassignChoreMutation__
 *
 * To run a mutation, you first call `useUnassignChoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnassignChoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unassignChoreMutation, { data, loading, error }] = useUnassignChoreMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useUnassignChoreMutation(baseOptions?: Apollo.MutationHookOptions<UnassignChoreMutation, UnassignChoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnassignChoreMutation, UnassignChoreMutationVariables>(UnassignChoreDocument, options);
      }
export type UnassignChoreMutationHookResult = ReturnType<typeof useUnassignChoreMutation>;
export type UnassignChoreMutationResult = Apollo.MutationResult<UnassignChoreMutation>;
export type UnassignChoreMutationOptions = Apollo.BaseMutationOptions<UnassignChoreMutation, UnassignChoreMutationVariables>;
export const UpdateChoreDueDateDocument = gql`
    mutation UpdateChoreDueDate($args: UpdateChoreDueDateInput) {
  updateChoreDueDate(args: $args) {
    id
    dueDate
  }
}
    `;
export type UpdateChoreDueDateMutationFn = Apollo.MutationFunction<UpdateChoreDueDateMutation, UpdateChoreDueDateMutationVariables>;

/**
 * __useUpdateChoreDueDateMutation__
 *
 * To run a mutation, you first call `useUpdateChoreDueDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChoreDueDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChoreDueDateMutation, { data, loading, error }] = useUpdateChoreDueDateMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useUpdateChoreDueDateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChoreDueDateMutation, UpdateChoreDueDateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChoreDueDateMutation, UpdateChoreDueDateMutationVariables>(UpdateChoreDueDateDocument, options);
      }
export type UpdateChoreDueDateMutationHookResult = ReturnType<typeof useUpdateChoreDueDateMutation>;
export type UpdateChoreDueDateMutationResult = Apollo.MutationResult<UpdateChoreDueDateMutation>;
export type UpdateChoreDueDateMutationOptions = Apollo.BaseMutationOptions<UpdateChoreDueDateMutation, UpdateChoreDueDateMutationVariables>;
export const UpdateChoreInfoDocument = gql`
    mutation UpdateChoreInfo($args: UpdateChoreInfoInput) {
  updateChoreInfo(args: $args) {
    id
    title
    description
  }
}
    `;
export type UpdateChoreInfoMutationFn = Apollo.MutationFunction<UpdateChoreInfoMutation, UpdateChoreInfoMutationVariables>;

/**
 * __useUpdateChoreInfoMutation__
 *
 * To run a mutation, you first call `useUpdateChoreInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChoreInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChoreInfoMutation, { data, loading, error }] = useUpdateChoreInfoMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useUpdateChoreInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChoreInfoMutation, UpdateChoreInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChoreInfoMutation, UpdateChoreInfoMutationVariables>(UpdateChoreInfoDocument, options);
      }
export type UpdateChoreInfoMutationHookResult = ReturnType<typeof useUpdateChoreInfoMutation>;
export type UpdateChoreInfoMutationResult = Apollo.MutationResult<UpdateChoreInfoMutation>;
export type UpdateChoreInfoMutationOptions = Apollo.BaseMutationOptions<UpdateChoreInfoMutation, UpdateChoreInfoMutationVariables>;
export const UpdateChoreStatusDocument = gql`
    mutation UpdateChoreStatus($args: UpdateChoreStatusInput) {
  updateChoreStatus(args: $args) {
    id
    status
  }
}
    `;
export type UpdateChoreStatusMutationFn = Apollo.MutationFunction<UpdateChoreStatusMutation, UpdateChoreStatusMutationVariables>;

/**
 * __useUpdateChoreStatusMutation__
 *
 * To run a mutation, you first call `useUpdateChoreStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChoreStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChoreStatusMutation, { data, loading, error }] = useUpdateChoreStatusMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useUpdateChoreStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChoreStatusMutation, UpdateChoreStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChoreStatusMutation, UpdateChoreStatusMutationVariables>(UpdateChoreStatusDocument, options);
      }
export type UpdateChoreStatusMutationHookResult = ReturnType<typeof useUpdateChoreStatusMutation>;
export type UpdateChoreStatusMutationResult = Apollo.MutationResult<UpdateChoreStatusMutation>;
export type UpdateChoreStatusMutationOptions = Apollo.BaseMutationOptions<UpdateChoreStatusMutation, UpdateChoreStatusMutationVariables>;
export const MyGroupInvitesDocument = gql`
    query MyGroupInvites {
  myGroupInvites {
    id
    group {
      id
      name
      createdBy {
        id
        userName
        email
        firstName
        lastName
      }
      createdAt
      groupMembers {
        id
        userName
        email
        firstName
        lastName
      }
    }
    inviterUser {
      id
      userName
      email
      firstName
      lastName
    }
    invitedUser {
      id
      userName
      email
      firstName
      lastName
    }
    status
    createdAt
    respondedAt
  }
}
    `;

/**
 * __useMyGroupInvitesQuery__
 *
 * To run a query within a React component, call `useMyGroupInvitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyGroupInvitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyGroupInvitesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyGroupInvitesQuery(baseOptions?: Apollo.QueryHookOptions<MyGroupInvitesQuery, MyGroupInvitesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyGroupInvitesQuery, MyGroupInvitesQueryVariables>(MyGroupInvitesDocument, options);
      }
export function useMyGroupInvitesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyGroupInvitesQuery, MyGroupInvitesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyGroupInvitesQuery, MyGroupInvitesQueryVariables>(MyGroupInvitesDocument, options);
        }
export function useMyGroupInvitesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyGroupInvitesQuery, MyGroupInvitesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyGroupInvitesQuery, MyGroupInvitesQueryVariables>(MyGroupInvitesDocument, options);
        }
export type MyGroupInvitesQueryHookResult = ReturnType<typeof useMyGroupInvitesQuery>;
export type MyGroupInvitesLazyQueryHookResult = ReturnType<typeof useMyGroupInvitesLazyQuery>;
export type MyGroupInvitesSuspenseQueryHookResult = ReturnType<typeof useMyGroupInvitesSuspenseQuery>;
export type MyGroupInvitesQueryResult = Apollo.QueryResult<MyGroupInvitesQuery, MyGroupInvitesQueryVariables>;
export const GroupsDocument = gql`
    query Groups {
  groups {
    id
    name
    createdBy {
      id
      userName
      email
      firstName
      lastName
    }
    createdAt
    groupMembers {
      id
      userName
      email
      firstName
      lastName
    }
    chores {
      id
      title
      description
      group {
        id
        name
        createdAt
      }
      createdAt
      isRecurring
      dueDate
      status
      createdBy {
        userName
        lastName
        id
        firstName
        email
      }
      assignment {
        id
        assignedTo {
          userName
          lastName
          id
          firstName
          email
        }
        assignedBy {
          userName
          lastName
          id
          firstName
          email
        }
        assignedAt
      }
    }
    groupInvites {
      id
      inviterUser {
        id
        userName
        email
        firstName
        lastName
      }
      invitedUser {
        id
        userName
        email
        firstName
        lastName
      }
      status
      createdAt
      respondedAt
    }
  }
}
    `;

/**
 * __useGroupsQuery__
 *
 * To run a query within a React component, call `useGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GroupsQuery, GroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GroupsQuery, GroupsQueryVariables>(GroupsDocument, options);
      }
export function useGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GroupsQuery, GroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GroupsQuery, GroupsQueryVariables>(GroupsDocument, options);
        }
export function useGroupsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GroupsQuery, GroupsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GroupsQuery, GroupsQueryVariables>(GroupsDocument, options);
        }
export type GroupsQueryHookResult = ReturnType<typeof useGroupsQuery>;
export type GroupsLazyQueryHookResult = ReturnType<typeof useGroupsLazyQuery>;
export type GroupsSuspenseQueryHookResult = ReturnType<typeof useGroupsSuspenseQuery>;
export type GroupsQueryResult = Apollo.QueryResult<GroupsQuery, GroupsQueryVariables>;