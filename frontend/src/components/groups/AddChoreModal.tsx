import React from "react";
import { z } from "zod";
import Modal from "../ui/Modal";
import Form from "../ui/form/Form";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";

interface AddChoreModalProps {
    open: boolean;
    onClose: () => void;
    groupId: string;
}

const schema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().optional(),
});

const AddChoreModal: React.FC<AddChoreModalProps> = ({ open, onClose, groupId }) => {
    const onSubmit = async (values: z.infer<typeof schema>) => {
        // TODO: Call your add chore mutation here with values and groupId
        onClose();
    };

    return (
        <Modal isOpen={open} onClose={onClose} title="Add Chore">
            <Form schema={schema} onSubmit={onSubmit}>
                <FormInput name="title" label="Title" required autoFocus />
                <FormInput name="description" label="Description" />
                <FormInput name="dueDate" label="Due Date" type="date" />
                <FormSubmitButton>Add Chore</FormSubmitButton>
            </Form>
        </Modal>
    );
};

export default AddChoreModal;