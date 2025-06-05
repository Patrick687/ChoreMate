import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useUpdateChoreInfoMutation, type Chore, type User } from "../../graphql/generated";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";
import Form from "../ui/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { updateChoreInfo as updateChoreInfoAction } from "../../store/groups";
import type { RootState } from "../../store/store";

interface ChoreDetailModalProps {
    choreId: Chore['id'];
    members: User[];
}

const schema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(255, "Title must be less than 255 characters")
        .regex(
            /^[\w\s\-.,!?()@#&$%':";/\\[\]{}|^~`+=*<>]*$/,
            "Title contains invalid characters"
        ),
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional()
        .or(z.literal("")), // allow empty string as optional
    // hasDueDate: z.boolean(),
    // dueDate: z.string().optional(),
});


const ChoreDetailModal: React.FC<ChoreDetailModalProps> = ({ choreId, members }) => {
    const groups = useSelector((state: RootState) => state.groups);
    const group = groups.groups.find(g => g.chores.find(c => c.id === choreId));
    const chore = group?.chores.find(c => c.id === choreId);

    if (!chore) {
        return <div className="p-4">Chore not found.</div>;
    }


    const [editMode, setEditMode] = useState(false);

    const assignedUser = members.length > 0 ? members[Math.floor(Math.random() * members.length)] : null;

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => setEditMode(false);

    return (
        <>
            {!editMode ? (
                <div>
                    <div className="mb-2">
                        <span className="font-semibold">Title:</span> {chore.title}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Description:</span> {chore.description}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Due:</span> {chore.createdAt ? new Date(chore.createdAt).toLocaleDateString() : "N/A"}
                    </div>
                    <div className="mb-2 flex items-center">
                        <span className="font-semibold">Assigned to:</span>
                        {assignedUser ? (
                            <span className="flex items-center ml-2">
                                <span className="text-gray-700 dark:text-gray-300">
                                    <i className="fas fa-user-circle mr-2"></i>
                                </span>
                                {assignedUser.userName}
                            </span>
                        ) : (
                            <span className="ml-2">Unassigned</span>
                        )}
                    </div>
                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleEdit}>
                        Edit
                    </button>
                </div>
            ) : (
                <EditChoreDetail
                    chore={chore}
                    schema={schema}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
};

export default ChoreDetailModal;

interface EditChoreDetailProps {
    chore: Chore;
    schema: typeof schema;
    onCancel: () => void;
}

const EditChoreDetail: React.FC<EditChoreDetailProps> = ({ chore, schema, onCancel }) => {
    const dispatch = useDispatch();
    const [updateChoreInfo, { loading, data }] = useUpdateChoreInfoMutation();

    useEffect(() => {
        if (data?.updateChoreInfo) {
            dispatch(updateChoreInfoAction({
                choreId: chore.id,
                description: data.updateChoreInfo.description,
                title: data.updateChoreInfo.title,
            }));
            onCancel();
        }
    }, [data, dispatch, chore.id, onCancel]);

    const handleSubmit = (values: z.infer<typeof schema>) => {
        updateChoreInfo({
            variables: {
                args: {
                    choreId: chore.id,
                    title: values.title,
                    description: values.description,
                }
            }
        });
    };

    return (
        <Form schema={schema} onSubmit={handleSubmit}>
            <FormInput name="title" label="Title" defaultValue={chore.title} />
            <FormInput name="description" label="Description" type="textarea" defaultValue={chore.description || ''} />
            {/* <FormInput
                name="dueDate"
                label="Due Date"
                type="date"
                defaultValue={chore.createdAt ? new Date(chore.createdAt).toISOString().split("T")[0] : ""}
            /> */}
            <div className="flex gap-2 mt-4">
                <FormSubmitButton>
                    {loading ? 'Saving...' : 'Save'}
                </FormSubmitButton>
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </Form>
    );
};