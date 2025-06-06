import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store/store";
import type { Group, Chore, User } from "../../../graphql/generated";
import { useUpdateChoreInfoMutation, useUpdateChoreDueDateMutation, useAssignChoreMutation } from "../../../graphql/generated";
import { updateChoreInfo as updateChoreInfoAction, updateChoreDueDate as updateChoreDueDateAction, assignChore as assignChoreAction } from "../../../store/chores";
import InlineEditField from "../../ui/form/InlineEditField";
import { choreDescriptionSchema, choreTitleSchema } from "../../../utils/zodSchemas/choreZodSchemas";


interface ChoreDetailViewProps {
    groupId: Group['id'];
    choreId: Chore['id'];
}

const ChoreDetailView: React.FC<ChoreDetailViewProps> = ({ groupId, choreId }) => {
    const user = useSelector((state: RootState) => state.auth.user) as User;

    const dispatch = useDispatch();
    const [updateChoreInfo] = useUpdateChoreInfoMutation();
    const [updateChoreDueDate] = useUpdateChoreDueDateMutation();
    const [assignChoreMutation] = useAssignChoreMutation();

    const chore = useSelector((state: RootState) =>
        state.chores.byGroupId[groupId]?.find(c => c.id === choreId)
    );
    const members = useSelector((state: RootState) =>
        state.groups.groups.find(g => g.id === groupId)?.groupMembers || []
    );

    if (!chore) return <div>Chore not found.</div>;

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded shadow max-w-lg w-full">
            <div className="mb-3">
                <span className="font-semibold">Title:</span>{" "}
                <InlineEditField
                    value={chore.title}
                    schema={choreTitleSchema}
                    onSave={async (val) => {
                        await updateChoreInfo({ variables: { args: { choreId: chore.id, title: val } } });
                        dispatch(updateChoreInfoAction({ choreId: chore.id, title: val }));
                    }}
                />
            </div>
            <div className="mb-3">
                <span className="font-semibold">Description:</span>{" "}
                <InlineEditField
                    value={chore.description || ""}
                    type="textarea"
                    schema={choreDescriptionSchema}
                    onSave={async (val) => {
                        await updateChoreInfo({ variables: { args: { choreId: chore.id, description: val } } });
                        dispatch(updateChoreInfoAction({ choreId: chore.id, description: val }));
                    }}
                />
            </div>
            <div className="mb-3">
                <span className="font-semibold">Assigned To:</span>{" "}
                <InlineEditField
                    value={chore.assignment?.assignedTo?.id || ""}
                    type="select"
                    options={[
                        { value: "", label: "Unassigned" },
                        ...members.map(m => ({
                            value: m.id,
                            label: m.userName || m.firstName || m.email
                        }))
                    ]}
                    display={chore.assignment?.assignedTo?.userName || "Unassigned"}
                    onSave={async (val) => {
                        try {
                            const result = await assignChoreMutation({
                                variables: {
                                    args: {
                                        choreId: chore.id,
                                        assignedTo: val ? val : null,
                                    }
                                }
                            });
                            const assignedToUser = members.find(m => m.id === val);
                            if (!assignedToUser && val) {
                                throw new Error("Assigned user not found in group members.");
                            }
                            const id = result.data?.assignChore?.id || "";
                            if (!id) {
                                throw new Error("Failed to assign chore: No ID returned from mutation.");
                            }
                            dispatch(assignChoreAction({
                                groupId,
                                choreId: chore.id,
                                assignment: {
                                    id: id,
                                    assignedAt: result.data?.assignChore?.assignedAt || new Date(),
                                    assignedBy: user,
                                    assignedTo: assignedToUser

                                }
                            }));

                        } catch (error) {
                            console.error("Error:", error);
                        }
                    }}
                />
            </div>
            <div className="mb-3">
                <span className="font-semibold">Assigned By:</span>{" "}
                <span className="ml-2">{chore.assignment?.assignedBy?.userName || "N/A"}</span>
            </div>
            <div className="mb-3">
                <span className="font-semibold">Created By:</span>{" "}
                <span className="ml-2">{chore.createdBy?.userName || "N/A"}</span>
            </div>
            <div className="mb-3">
                <span className="font-semibold">Due Date:</span>{" "}
                <InlineEditField
                    value={chore.dueDate ? chore.dueDate.split("T")[0] : ""}
                    type="date"
                    schema={chore.dueDate ? choreDescriptionSchema : undefined}
                    onSave={async (val) => {
                        await updateChoreDueDate({
                            variables: { args: { choreId: chore.id, dueDate: val ? new Date(val + "T00:00:00") : null } }
                        });
                        dispatch(updateChoreDueDateAction({
                            choreId: chore.id,
                            dueDate: val ? new Date(val + "T00:00:00").toISOString() : null,
                        }));
                    }}
                />
            </div>
        </div>
    );
};

export default ChoreDetailView;