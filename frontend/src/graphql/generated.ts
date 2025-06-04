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

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Chore = {
  __typename?: 'Chore';
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  description?: Maybe<Scalars['String']['output']>;
  group: Group;
  id: Scalars['ID']['output'];
  isRecurring: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type ChoreMutation = {
  __typename?: 'ChoreMutation';
  createChore: Chore;
  deleteChore: Scalars['Boolean']['output'];
  updateChoreInfo: Chore;
};


export type ChoreMutationCreateChoreArgs = {
  args?: InputMaybe<CreateChoreInput>;
};


export type ChoreMutationDeleteChoreArgs = {
  args?: InputMaybe<DeleteChoreInput>;
};


export type ChoreMutationUpdateChoreInfoArgs = {
  args?: InputMaybe<UpdateChoreInfoInput>;
};

export type CreateChoreInput = {
  createdByUserId: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type DeleteGroupInput = {
  id: Scalars['ID']['input'];
};

export type Group = {
  __typename?: 'Group';
  chores: Array<Chore>;
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
  chore: Chore;
  chores: Array<Chore>;
  group: Group;
  groups: Array<Group>;
  me?: Maybe<User>;
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


export type QueryGroupsArgs = {
  userId: Scalars['ID']['input'];
};

export type UpdateChoreInfoInput = {
  choreId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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

export type GroupsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GroupsQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'Group', id: string, name: string, createdAt: any, createdBy: { __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string }, groupMembers: Array<{ __typename?: 'User', id: string, userName: string, email: string, firstName: string, lastName: string }>, chores: Array<{ __typename?: 'Chore', id: string, title: string, description?: string | null, createdAt: any, isRecurring: boolean }> }> };


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
export const GroupsDocument = gql`
    query Groups($userId: ID!) {
  groups(userId: $userId) {
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
      createdAt
      isRecurring
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
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGroupsQuery(baseOptions: Apollo.QueryHookOptions<GroupsQuery, GroupsQueryVariables> & ({ variables: GroupsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
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