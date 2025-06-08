import * as authMutation from "./auth/authMutation";
import * as groupMutation from "./group/groupMutation";
import * as groupQuery from "./group/groupQuery";
import * as choreMutation from "./group/chore/choreMutation";
import * as choreQuery from "./group/chore/choreQuery";
import * as groupInviteMutation from "./group/invite/groupInviteMutation";
import * as groupInviteQuery from "./group/invite/groupInviteQuery";
import * as groupInviteSubscription from "./group/invite/groupInviteSubscription";

// If you have field resolvers (e.g., Group, Chore, GroupInvite), import and add them here as well

export const resolvers = {
    Query: {
        ...groupQuery,
        ...choreQuery,
        ...groupInviteQuery,
    },
    Mutation: {
        ...authMutation,
        ...groupMutation,
        ...choreMutation,
        ...groupInviteMutation,
    },
    Subscription: {
        ...groupInviteSubscription,
    },
    // Add type field resolvers here if you have them, e.g.:
    // Group: { ... },
    // Chore: { ... },
    // GroupInvite: { ... },
};