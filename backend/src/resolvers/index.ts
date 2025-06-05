import { userResolvers } from './user';
import { authResolvers } from './auth';
import { mergeResolvers } from '@graphql-tools/merge';
import { groupResolvers } from './group';
import { choreResolvers } from './chore';
import { groupInviteResolvers } from './groupInvite';

export const resolvers = mergeResolvers([userResolvers, authResolvers, groupResolvers, choreResolvers, groupInviteResolvers]);