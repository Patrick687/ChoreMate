import { GROUP_MEMBER_GROUP_ALIAS } from "../models";
import { GroupMemberModel } from "../models/GroupMembersModel";
import { GroupModel } from "../models/GroupModel";
import { UnauthorizedError } from "../utils/error/customErrors";

interface GroupsQueryArgs {
    userId: string;
}

export const groupResolves = {
    Query: {
        async groups(_parent: unknown, _args: GroupsQueryArgs) {

            const groups = await GroupMemberModel.findAll({
                where: { userId: _args.userId }, include: [
                    {
                        model: GroupModel,
                        as: GROUP_MEMBER_GROUP_ALIAS,
                        required: true,
                    }
                ]
            });

            return groups.map((group) => {
                const groupData = group.get({ plain: true });
                return {
                    id: groupData,
                    name: groupData,
                };
            });
            return groups.map(group => group.get({ plain: true }));
        }
    },
    Mutation: {
    },
};