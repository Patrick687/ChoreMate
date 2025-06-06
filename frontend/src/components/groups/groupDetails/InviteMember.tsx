import React from "react";
import { z } from "zod";
import Form from "../../ui/form/Form";
import FormInput from "../../ui/form/FormInput";
import FormSubmitButton from "../../ui/form/FormSubmitButton";
import { useInviteToGroupMutation, type Group } from "../../../graphql/generated";

// Zod schema for username
const inviteMemberSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(32, "Username must be at most 32 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

type InviteMemberValues = z.infer<typeof inviteMemberSchema>;

interface InviteMemberProps {
    groupId: Group['id'];
}

const InviteMember: React.FC<InviteMemberProps> = ({ groupId }) => {


    const [inviteToGroupMutation] = useInviteToGroupMutation();

    const handleSubmit = async (values: InviteMemberValues) => {
        // Call the mutation to invite a member to the group
        try {
            const response = await inviteToGroupMutation({
                variables: {
                    args: {
                        groupId: groupId,
                        invitedUserName: values.username,
                    }
                },
            });
            console.log("Inviting member with values:", values);
            console.log("Invite response:", response.data?.inviteToGroup);
        } catch (error) {
            console.error("Error inviting member:", error);
        }
    };

    return (
        <Form schema={inviteMemberSchema} onSubmit={handleSubmit}>
            <FormInput
                name="username"
                label="Username"
                placeholder="Enter username"
                autoComplete="off"
            />
            <FormSubmitButton>Invite</FormSubmitButton>
        </Form>
    );
};

export default InviteMember;