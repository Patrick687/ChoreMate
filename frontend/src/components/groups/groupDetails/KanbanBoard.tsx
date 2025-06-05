import React from "react";
import type { Chore, Group, User } from "../../../graphql/generated";
import { openModal } from "../../../store/modal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

type ChoreStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

interface KanbanBoardProps {
    groupId: Group['id'];
}

const statusLabels: Record<ChoreStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    REVIEW: "Review",
    DONE: "Done",
};

// For now, randomly assign statuses for demo (replace with real status field)
function getStatus(chore: Chore): ChoreStatus {
    // TODO: Replace with actual status from your schema
    return "TODO";
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ groupId }) => {

    const groupState = useSelector((state: RootState) => state.groups);
    const group = groupState.groups.find(g => g.id === groupId);
    if (!group) {
        return <div className="p-4">Group not found.</div>;
    }


    const dispatch = useDispatch();

    const handleChoreClick = (chore: Chore) => {
        dispatch(openModal({ mode: "choreDetail", props: { choreId: chore.id, members: group.groupMembers } }));
    };

    const columns: Record<ChoreStatus, Chore[]> = {
        TODO: [],
        IN_PROGRESS: [],
        REVIEW: [],
        DONE: [],
    };
    group.chores.forEach(chore => {
        const status = getStatus(chore);
        columns[status].push(chore);
    });

    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Chores</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(columns).map(([status, chores]) => (
                    <div key={status} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-h-[200px]">
                        <h3 className="font-bold mb-2 text-center">{statusLabels[status as ChoreStatus]}</h3>
                        {chores.length === 0 && (
                            <p className="text-gray-400 text-sm text-center">No chores</p>
                        )}
                        {chores.map(chore => (
                            <div
                                key={chore.id}
                                className="bg-white dark:bg-gray-900 rounded shadow p-3 mb-3"
                                onClick={() => handleChoreClick(chore)}
                            >
                                <div className="font-semibold">{chore.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Due: {chore.dueDate ? chore.dueDate : "N/A"}
                                </div>
                                <div className="text-xs mt-1">
                                    Assigned to: <span className="font-medium">Unassigned</span>
                                    {/* TODO: Show assigned member if available */}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default KanbanBoard;