import { getUserModelInstanceFromContext, UserContext } from "../../middleware/context";
import { Group as GroupModel } from "../../models/GroupModel";

export const getGroups = async (
  _parent: unknown,
  _args: unknown,
  context: UserContext
): Promise<GroupModel[]> => {
  const user = await getUserModelInstanceFromContext(context);

  const groups = await user.getGroupMembers().then(async (gms) => {
    const groups: GroupModel[] = [];
    for (const gm of gms) {
      const group = await gm.getGroup();
      groups.push(group);
    }
    return groups;
  });

  return groups ?? [];
};
