import { GroupInviteStatus } from "../../../generated/graphql-types";
import { UserContext } from "../../../middleware/context";
import { GroupInvite as GroupInviteModel } from "../../../models/GroupInviteModel";
import { User as UserModel } from "../../../models/UserModel";
import { InternalServerError } from "../../../utils/error/customErrors";
import { GROUP_INVITE_CREATED, GROUP_INVITE_RESPONDED } from "../../../utils/pubsub/events";
import { pubsub } from "../../../utils/pubsub/pubsub";



export type GroupInviteCreatedPayload = {
    groupInviteAdded: GroupInviteModel;
    userId: UserModel['id'];
};

export type GroupInviteRespondedPayload = {
    groupInviteResponded: GroupInviteModel;
};

export const groupInviteCreated = {
    subscribe: (_parent: unknown, _args: unknown, context: UserContext) => {
        return pubsub.asyncIterableIterator(GROUP_INVITE_CREATED);
    },
    resolve: (
        payload: GroupInviteCreatedPayload,
        _args: unknown,
        context: UserContext,
        _info: unknown
    ) => {
        if (context.user && payload.userId === context.user.id) {
            return payload.groupInviteAdded;
        }
        return null;
    }
};

export const groupInviteResponded = {
    subscribe: (_parent: unknown, _args: unknown, context: UserContext) => {
        return pubsub.asyncIterableIterator(GROUP_INVITE_RESPONDED);
    },
    resolve: (
        payload: GroupInviteRespondedPayload,
        _args: unknown,
        context: UserContext,
        _info: unknown
    ) => {
        if (payload.groupInviteResponded.status === GroupInviteStatus.Pending) {
            throw new InternalServerError("Cannot resolve a pending invite in the subscription.");
        }
        if (context.user && payload.groupInviteResponded.inviterUserId === context.user.id) {
            return payload.groupInviteResponded;
        }
        return null;
    }
};