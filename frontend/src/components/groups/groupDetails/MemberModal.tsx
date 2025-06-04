import React from "react";
import Form from "../../ui/form/Form";
import FormInput from "../../ui/form/FormInput";
import FormSubmitButton from "../../ui/form/FormSubmitButton";
import { z } from "zod";

interface InviteMemberModalProps {
    groupId: string;
}

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ groupId }) => {
    const onSubmit = async (values: z.infer<typeof schema>) => {
        // TODO: Call your invite member mutation here with values.email and groupId
    };

    return (
        <Form schema={schema} onSubmit={onSubmit}>
            <FormInput name="email" label="Email" type="email" required autoFocus />
            <FormSubmitButton>Send Invite</FormSubmitButton>
        </Form>
    );
};

export default InviteMemberModal;