import { CreateGroupInput } from "../../generated/graphql-types";
import { getUserModelInstanceFromContext, UserContext } from "../../middleware/context";
import { Group as GroupModel } from "../../models/GroupModel";
import { parseOrBadRequest } from "../../utils/zod/parseOrBadRequest";
import { createGroupSchema } from "../../validation/group";

export const createGroup = async (
  _parent: unknown,
  args: { args: CreateGroupInput; },
  context: UserContext
): Promise<GroupModel> => {
  const creatingUser = await getUserModelInstanceFromContext(context);
  const parsed = parseOrBadRequest(createGroupSchema, args.args);

  const groupName = parsed.name.trim();

  const group = await GroupModel.create({
    name: groupName,
    createdBy: creatingUser.id
  });

  return group;
};