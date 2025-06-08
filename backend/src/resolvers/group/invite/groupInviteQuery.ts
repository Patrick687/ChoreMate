import { GetGroupInvitesByGroupIdInput } from "../../../generated/graphql-types";
import { getUserModelInstanceFromContext, UserContext } from "../../../middleware/context";
import { GroupInvite as GroupInviteModel } from "../../../models/GroupInviteModel";
import { GroupModel } from "../../../models/GroupModel";
import { NotFoundError } from "../../../utils/error/customErrors";
import { parseOrBadRequest } from "../../../utils/zod/parseOrBadRequest";
import { getGroupInvitesByGroupIdSchema } from "../../../validation/groupInvite";


export const getGroupInvitesByGroupId = async (
    _parent: unknown,
    args: { args: GetGroupInvitesByGroupIdInput; },
    context: UserContext
): Promise<GroupInviteModel[]> => {

    const parsed = parseOrBadRequest(getGroupInvitesByGroupIdSchema, args.args);
    const user = await getUserModelInstanceFromContext(context);

    const group = await GroupModel.findByPk(parsed.groupId);
    if (!group) {
        throw new NotFoundError(`Group not found.`);
    }

    const groupInvites = await group.getGroupInvites();

    return groupInvites;

};

export const getMySentGroupInvites = async (
    _parent: unknown,
    _args: unknown,
    context: UserContext
): Promise<GroupInviteModel[]> => {
    const user = await getUserModelInstanceFromContext(context);

    const receivedInvites = await user.getSentInvites();

    return receivedInvites ?? [];
};

export const getMyReceivedGroupInvites = async (
    _parent: unknown,
    _args: unknown,
    context: UserContext
): Promise<GroupInviteModel[]> => {

    const user = await getUserModelInstanceFromContext(context);

    const receivedInvites = await user.getReceivedInvites();

    return receivedInvites ?? [];

};