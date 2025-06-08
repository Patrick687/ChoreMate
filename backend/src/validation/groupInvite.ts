import { z } from 'zod';
import { userNameSchema } from './auth';
import { GroupInviteStatus } from '../generated/graphql-types';

export const inviteToGroupSchema = z.object({
    groupId: z.string().uuid("Group ID must be a valid UUID"),
    invitedUserName: userNameSchema,
});

// RespondToGroupInviteInput validation
export const respondToGroupInviteSchema = z.object({
    inviteId: z.string().uuid("Invite ID must be a valid UUID"),
    inviteResponse: z.enum(
        [GroupInviteStatus.Accepted, GroupInviteStatus.Declined],
        { errorMap: () => ({ message: "Response must be ACCEPTED or DECLINED" }) }
    ),
});

export const getGroupInvitesByGroupIdSchema = z.object({
    groupId: z.string().uuid("Group ID must be a valid UUID"),
});