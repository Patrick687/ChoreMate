import { userResolvers } from './user';
import { authResolvers } from './auth';
import { mergeResolvers } from '@graphql-tools/merge';

export const resolvers = mergeResolvers([userResolvers, authResolvers]);