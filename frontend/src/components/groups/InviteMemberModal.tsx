import React from "react";
import { z } from "zod";
import Modal from "../ui/Modal";
import Form from "../ui/form/Form";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";

interface InviteMemberModalProps {
    open: boolean;
    onClose: () => void;
    groupId: string;
}

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ open, onClose, groupId }) => {
    const onSubmit = async (values: z.infer<typeof schema>) => {
        // TODO: Call your invite member mutation here with values.email and groupId
        onClose();
    };

    return (
        <Modal isOpen={open} onClose={onClose} title="Invite Member">
            <Form schema={schema} onSubmit={onSubmit}>
                <FormInput name="email" label="Email" type="email" required autoFocus />
                <FormSubmitButton>Send Invite</FormSubmitButton>
            </Form>
        </Modal>
    );
};

export default InviteMemberModal;