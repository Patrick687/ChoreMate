import { AssignChoreInput, UnassignChoreInput } from "../../../../generated/graphql-types";
import { getUserModelInstanceFromContext, UserContext } from "../../../../middleware/context";
import { Chore as ChoreModel } from "../../../../models/ChoresModel";
import { GroupMemberModel } from "../../../../models/GroupMembersModel";
import { NotFoundError, UnauthorizedError } from "../../../../utils/error/customErrors";
import { parseOrBadRequest } from "../../../../utils/zod/parseOrBadRequest";
import { assignChoreInputSchema } from "../../../../validation/chore";

export const assignChore = async (
  _parent: unknown,
  args: { args: AssignChoreInput; },
  context: UserContext
): Promise<ChoreModel> => {
  const parsed = parseOrBadRequest(assignChoreInputSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);

  const chore = await ChoreModel.findByPk(parsed.choreId);
  if (!chore) {
    throw new NotFoundError("Chore not found");
  }

  const assignedToUser = await GroupMemberModel.findOne({
    where: {
      userId: parsed.assignedTo,
      groupId: chore.groupId,
    }
  });
  if (!assignedToUser) {
    throw new UnauthorizedError("Cannot assign chore to user who is not a member of the group");
  }

  const choreAssignment = await chore.getAssignment();

  await choreAssignment.update({
    assignedTo: assignedToUser.userId,
    assignedBy: user.id,
  });
  return chore;
};