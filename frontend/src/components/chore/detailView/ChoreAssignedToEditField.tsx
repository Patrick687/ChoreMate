import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAssignChoreMutation } from "../../../graphql/generated";
import { assignChore as assignChoreAction } from "../../../store/chores";
import InlineEditField from "../../ui/form/InlineEditField";
import type { Chore, Group, User } from "../../../graphql/generated";
import type { RootState } from "../../../store/store";

interface Props {
    chore: Chore;
    groupId: Group['id'];
    members: User[];
}

const ChoreAssignedToEditField: React.FC<Props> = ({ chore, groupId, members }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user) as User;
    const [assignChoreMutation] = useAssignChoreMutation();

    return (
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
    );
};

export default ChoreAssignedToEditField;