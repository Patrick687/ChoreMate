import {
  CreateChoreInput,
  UpdateChoreDueDateInput,
  UpdateChoreStatusInput,
  UpdateChoreTitleInput,
  UpdateChoreDescriptionInput,
  ChoreStatus
} from "../../../generated/graphql-types";
import { Chore as ChoreModel } from "../../../models/ChoresModel";
import { getUserModelInstanceFromContext, UserContext } from "../../../middleware/context";
import { InternalServerError, NotFoundError, NotImplementedError, UnauthorizedError } from "../../../utils/error/customErrors";
import { parseOrBadRequest } from "../../../utils/zod/parseOrBadRequest";
import { createChoreInputSchema, updateChoreDescriptionInputSchema, updateChoreDueDateInputSchema, updateChoreStatusInputSchema, updateChoreTitleInputSchema } from "../../../validation/chore";
import { GroupMemberModel } from "../../../models/GroupMembersModel";
import { sequelize } from "../../../config/db";

export const createChore = async (
  _parent: unknown,
  args: { args: CreateChoreInput; },
  context: UserContext
): Promise<ChoreModel> => {
  const parsed = parseOrBadRequest(createChoreInputSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);
  const groupId = parsed.groupId;

  const groupMember = await GroupMemberModel.findOne({
    where: {
      userId: user.id,
      groupId: groupId
    }
  });
  if (!groupMember) {
    throw new UnauthorizedError("You are not a member of this group");
  }
  const group = await groupMember.getGroup();

  const transaction = await sequelize.transaction();
  try {
    const chore = await group.createChore({
      title: parsed.title,
      description: parsed.description,
      createdBy: user.id,
      isRecurring: false, // Default to false, can be updated later
      groupId: group.id, // This is redundant since we already have groupId in the GroupMemberModel
    }, { transaction });

    const oneTimeChore = await chore.createOneTimeChore({
      choreId: chore.id,
      dueDate: parsed.dueDate,
      status: ChoreStatus.Todo
    }, { transaction });

    const choreAssignment = await chore.createAssignment({
      choreId: chore.id,
      assignedTo: null,
      assignedBy: null,
    });

    await transaction.commit();
    return chore;

  } catch (error) {
    await transaction.rollback();
    console.error("Error creating chore:", error);
    throw new InternalServerError("Failed to create chore. Please try again later.");
  }
};

export const updateChoreTitle = async (
  _parent: unknown,
  args: { args: UpdateChoreTitleInput; },
  context: UserContext
): Promise<ChoreModel> => {
  const parsed = parseOrBadRequest(updateChoreTitleInputSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);

  const chore = await ChoreModel.findByPk(parsed.choreId);
  if (!chore) {
    throw new NotFoundError('Chore not found');
  }

  const groupMember = await GroupMemberModel.findOne({
    where: {
      userId: user.id,
      groupId: chore.groupId
    }
  });

  if (!groupMember) {
    throw new UnauthorizedError("You are not a member of this group");
  }

  await chore.update({
    title: parsed.title
  });

  return chore;
};

export const updateChoreDescription = async (
  _parent: unknown,
  args: { args: UpdateChoreDescriptionInput; },
  context: UserContext
): Promise<ChoreModel> => {
  const parsed = parseOrBadRequest(updateChoreDescriptionInputSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);

  const chore = await ChoreModel.findByPk(parsed.choreId);
  if (!chore) {
    throw new NotFoundError('Chore not found');
  }

  const groupMember = await GroupMemberModel.findOne({
    where: {
      userId: user.id,
      groupId: chore.groupId
    }
  });

  if (!groupMember) {
    throw new UnauthorizedError("You are not a member of this group");
  }

  await chore.update({
    description: parsed.description
  });

  return chore;
};

export const updateChoreDueDate = async (
  _parent: unknown,
  args: { args: UpdateChoreDueDateInput; },
  context: UserContext
): Promise<ChoreModel> => {
  const parsed = parseOrBadRequest(updateChoreDueDateInputSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);

  const chore = await ChoreModel.findByPk(parsed.choreId);
  if (!chore) {
    throw new NotFoundError('Chore not found');
  }

  const groupMember = await GroupMemberModel.findOne({
    where: {
      userId: user.id,
      groupId: chore.groupId
    }
  });

  if (!groupMember) {
    throw new UnauthorizedError("You are not a member of this group");
  }

  const oneTimeChore = await chore.getOneTimeChore();
  oneTimeChore.update({
    dueDate: parsed.dueDate
  });

  return chore;
};

export const updateChoreStatus = async (
  _parent: unknown,
  args: { args: UpdateChoreStatusInput; },
  context: UserContext
): Promise<ChoreModel> => {
  const parsed = parseOrBadRequest(updateChoreStatusInputSchema, args.args);
  const user = await getUserModelInstanceFromContext(context);

  const chore = await ChoreModel.findByPk(parsed.choreId);
  if (!chore) {
    throw new NotFoundError('Chore not found');
  }

  const groupMember = await GroupMemberModel.findOne({
    where: {
      userId: user.id,
      groupId: chore.groupId
    }
  });

  if (!groupMember) {
    throw new UnauthorizedError("You are not a member of this group");
  }

  const oneTimeChore = await chore.getOneTimeChore();

  await oneTimeChore.update({
    status: parsed.status
  });

  return chore;
};