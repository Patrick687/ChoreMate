import { GetChoreByChoreIdInput, GetChoresByGroupIdInput } from "../../../generated/graphql-types";
import { getUserModelInstanceFromContext, UserContext } from "../../../middleware/context";
import { Chore as ChoreModel } from "../../../models/ChoresModel";
import { GroupMemberModel } from "../../../models/GroupMembersModel";
import { NotFoundError, NotImplementedError, UnauthorizedError } from "../../../utils/error/customErrors";
import { parseOrBadRequest } from "../../../utils/zod/parseOrBadRequest";
import { getChoreByChoreIdInputSchema } from "../../../validation/chore";
import { getChoresByGroupIdInputSchema } from "../../../validation/group";

export const getChoresByGroupId = async (
  _parent: unknown,
  args: { args: GetChoresByGroupIdInput; },
  context: UserContext
): Promise<ChoreModel[]> => {
  const parsed = parseOrBadRequest(getChoresByGroupIdInputSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);
  const group = await user.getGroupMembers().then(async (gms) => {
    for (const gm of gms) {
      if (gm.groupId === parsed.groupId) {
        return await gm.getGroup(); // User is a member of the group
      }
    }
  });
  if (!group) {
    throw new UnauthorizedError("You are not a member of this group");
  }

  const chores = await group.getChores();
  return chores ?? [];
};

export const getChoreByChoreId = async (
  _parent: unknown,
  args: { args: GetChoreByChoreIdInput; },
  context: UserContext
): Promise<ChoreModel> => {
  const parsed = parseOrBadRequest(getChoreByChoreIdInputSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);

  const chore = await ChoreModel.findOne({
    where: {
      id: parsed.choreId,
    }
  });

  if (!chore) {
    throw new NotFoundError("Chore not found");
  }

  const isUserInGroup = await GroupMemberModel.findOne({
    where: {
      userId: user.id,
      groupId: chore.groupId
    }
  }).then((gm) => !!gm);

  if (!isUserInGroup) {
    throw new UnauthorizedError("You are not a member of this group");
  }

  return chore;
};