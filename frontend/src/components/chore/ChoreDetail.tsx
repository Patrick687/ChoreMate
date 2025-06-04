import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useUpdateChoreInfoMutation, type Chore, type User } from "../../graphql/generated";
import FormInput from "../ui/form/FormInput";
import FormSubmitButton from "../ui/form/FormSubmitButton";
import Form from "../ui/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { updateChoreInfo as updateChoreInfoAction } from "../../store/groups";
import { openModal } from "../../store/modal";
import { useFormContext } from "react-hook-form";

interface ChoreDetailModalProps {
    chore: Chore;
    members: User[];
}

const schema = z.object({
    title: z.string(),
    description: z.string(),
    hasDueDate: z.boolean(),
    dueDate: z.string().optional(),
});

const ChoreDetailModal: React.FC<ChoreDetailModalProps> = ({ chore, members }) => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);

    const [updateChoreInfo, { loading, data, error }] = useUpdateChoreInfoMutation();

    const userId = useSelector((state: any) => state.auth.user?.id);
    if (!userId) {
        console.error("User ID is not available in the Redux store.");
        dispatch(openModal({ mode: "relogError" }));
    }

    const assignedUser = members.length > 0 ? members[Math.floor(Math.random() * members.length)] : null;

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setEditMode(false);
    };

    useEffect(() => {
        if (data?.updateChoreInfo) {
            dispatch(updateChoreInfoAction({
                choreId: chore.id,
                description: data.updateChoreInfo.description,
                title: data.updateChoreInfo.title,
            }));
        }
    });

    const handleSubmit = (values: z.infer<typeof schema>) => {
        updateChoreInfo({
            variables: {
                args: {
                    choreId: chore.id,
                    title: values.title,
                    description: values.description,
                    userId: userId
                }
            }
        });


        if (error) {

        }
        setEditMode(false);
    };

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
                                {/* <img src={assignedUser.avatarUrl || "/default-avatar.png"} alt={assignedUser.userName} className="w-6 h-6 rounded-full mr-2" /> */}
                                {/* Placeholder for avatar. Lets just use a person face React Fa Icon for now*/}
                                <span className="text-gray-700 dark:text-gray-300">
                                    {/* <FaUserCircle className="w-6 h-6 mr-2" /> */}
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
                <Form schema={schema} onSubmit={handleSubmit}>
                    <FormInputsWithDueDate chore={chore} />
                    <div className="flex gap-2 mt-4">
                        <FormSubmitButton>Save</FormSubmitButton>
                        <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </Form>
            )}
        </>
    );
};
const FormInputsWithDueDate: React.FC<{ chore: Chore; }> = ({ chore }) => {
    const { watch } = useFormContext();
    const hasDueDate = watch("hasDueDate");

    return (
        <>
            <FormInput name="title" label="Title" value={chore.title} required />
            <FormInput name="description" label="Description" type="textarea" value={chore.description || ''} required />

            <FormInput
                name="dueDate"
                label="Due Date"
                type="date"
                defaultValue={chore.createdAt ? new Date(chore.createdAt).toISOString().split("T")[0] : ""}
            />

        </>
    );
};

export default ChoreDetailModal;