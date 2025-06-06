import React, { useState } from "react";
import { z } from "zod";
import { type Chore, type User } from "../../graphql/generated";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import EditChoreDetail from "./EditChoreDetailBackup";

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
        .or(z.literal("")),
    hasDueDate: z.boolean(),
    dueDate: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
    if (data.hasDueDate && !data.dueDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dueDate"],
            message: "Due date is required if enabled.",
        });
    }
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
                        <span className="font-semibold">Due:</span> {chore.dueDate ? new Date(chore.dueDate).toLocaleDateString() : "N/A"}
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

