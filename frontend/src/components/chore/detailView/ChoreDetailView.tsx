import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import type { Group, Chore } from "../../../graphql/generated";
import ChoreTitleEditView from "./ChoreTitleEditView";
import ChoreDescriptionEditView from "./ChoreDescriptionEditView";
import ChoreAssignedToEditField from "./ChoreAssignedToEditField";
import ChoreDueDateEditField from "./ChoreDueDateEditField";

interface ChoreDetailViewProps {
    groupId: Group['id'];
    choreId: Chore['id'];
}

const ChoreDetailView: React.FC<ChoreDetailViewProps> = ({ groupId, choreId }) => {
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
                <ChoreTitleEditView chore={chore} groupId={groupId} />
            </div>
            <div className="mb-3">
                <span className="font-semibold">Description:</span>{" "}
                <ChoreDescriptionEditView chore={chore} groupId={groupId} />
            </div>
            <div className="mb-3">
                <span className="font-semibold">Assigned To:</span>{" "}
                <ChoreAssignedToEditField
                    chore={chore}
                    groupId={groupId}
                    members={members}
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
                <ChoreDueDateEditField chore={chore} groupId={groupId} />
            </div>
        </div>
    );
};

export default ChoreDetailView;