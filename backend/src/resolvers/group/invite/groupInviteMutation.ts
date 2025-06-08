import { sequelize } from "../../../config/db";
import { GroupInviteStatus, InviteToGroupInput, RespondToGroupInviteInput } from "../../../generated/graphql-types";

import { getUserModelInstanceFromContext, UserContext } from "../../../middleware/context";
import { GroupInvite as GroupInviteModel } from "../../../models/GroupInviteModel";
import { GroupMemberRole } from "../../../models/GroupMembersModel";
import { GroupModel } from "../../../models/GroupModel";
import { UserModel } from "../../../models/UserModel";
import { InternalServerError, NotFoundError, NotImplementedError, UnauthorizedError } from "../../../utils/error/customErrors";
import { GROUP_INVITE_CREATED, GROUP_INVITE_RESPONDED } from "../../../utils/pubsub/events";
import { pubsub } from "../../../utils/pubsub/pubsub";
import { parseOrBadRequest } from "../../../utils/zod/parseOrBadRequest";
import { inviteToGroupSchema, respondToGroupInviteSchema } from "../../../validation/groupInvite";

export const inviteToGroup = async (
  _parent: unknown,
  args: { args: InviteToGroupInput; },
  context: UserContext
): Promise<GroupInviteModel> => {
  const parsed = parseOrBadRequest(inviteToGroupSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);

  const groupId = parsed.groupId;
  const invitedUserName = parsed.invitedUserName;

  const invitedUser = await UserModel.findOne({
    where: { userName: invitedUserName }
  });
  if (!invitedUser) {
    throw new NotImplementedError(`Username not found.`);
  }

  const group = await GroupModel.findByPk(groupId);
  if (!group) {
    throw new NotFoundError(`Group not found.`);
  }

  const groupInvite = await GroupInviteModel.create({
    groupId: group.id,
    invitedUserId: invitedUser.id,
    inviterUserId: user.id
  });

  await pubsub.publish(GROUP_INVITE_CREATED, {
    groupInviteAdded: groupInvite,
    userId: invitedUser.id, //The ID of the user who was invited. This is not part of your schema, but is included in the payload so your subscription resolver can filter events and only send them to the correct user.
  });

  return groupInvite;
};

export const respondToGroupInvite = async (
  _parent: unknown,
  args: { args: RespondToGroupInviteInput; },
  context: UserContext
): Promise<GroupInviteModel> => {
  const user = await getUserModelInstanceFromContext(context);
  const parsed = parseOrBadRequest(respondToGroupInviteSchema, args.args);

  const inviteId = parsed.inviteId;
  const inviteResponse = parsed.inviteResponse;

  const groupInvite = await GroupInviteModel.findByPk(inviteId);
  if (!groupInvite) {
    throw new NotFoundError(`Group invite not found.`);
  }
  if (groupInvite.invitedUserId !== user.id) {
    throw new UnauthorizedError(`You are not authorized to respond to this invite.`);
  }

  const transaction = await sequelize.transaction();
  try {
    groupInvite.set('status', inviteResponse);
    groupInvite.set('respondedAt', new Date());
    await groupInvite.save({ transaction });
    if (inviteResponse === GroupInviteStatus.Accepted) {
      const group = await groupInvite.getGroup();
      if (!group) {
        throw new InternalServerError(`Group with id ${groupInvite.groupId} not found for the invite with id ${groupInvite.id}.`);
      }

      const groupMember = await group.createGroupMember({
        userId: user.id,
        role: GroupMemberRole.MEMBER,
        groupId: group.id, // This is not needed but typescript requires it with my current setup
      }, { transaction });

    } else if (inviteResponse !== GroupInviteStatus.Declined) {
      throw new InternalServerError(`Invalid invite response: ${inviteResponse}. Expected 'Accepted' or 'Declined'.`);
    }

    await transaction.commit();

    // Publish the response event
    await pubsub.publish(GROUP_INVITE_RESPONDED, {
      groupInviteResponded: groupInvite,
      userId: user.id, // The ID of the user who responded to the invite
    });

    return groupInvite;

  } catch (error) {
    await transaction.rollback();
    throw new InternalServerError(`Failed to respond to group invite: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }



};