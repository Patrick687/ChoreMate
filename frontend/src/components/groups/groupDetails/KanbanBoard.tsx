import React from "react";
import type { Chore, ChoreStatus, Group } from "../../../graphql/generated";
import { openModal } from "../../../store/modal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface KanbanBoardProps {
    groupId: Group['id'];
}

const statusLabels: Record<ChoreStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ groupId }) => {
    const dispatch = useDispatch();
    const group = useSelector((state: RootState) =>
        state.groups.groups.find(g => g.id === groupId)
    ) as Group;

    // Group chores by status
    const columns: Record<ChoreStatus, Chore[]> = {
        TODO: [],
        IN_PROGRESS: [],
        DONE: [],
    };
    group.chores.forEach(chore => {
        columns[chore.status].push(chore);
    });

    function handleChoreClick(choreId: Chore['id']) {
        dispatch(openModal({ mode: "choreDetail", props: { choreId, members: group.groupMembers } }));
    }

    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Chores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(columns).map(([status, chores]) => (
                    <div key={status} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-h-[200px]">
                        <h3 className="font-bold mb-2 text-center">{statusLabels[status as ChoreStatus]}</h3>
                        {chores.length === 0 && (
                            <p className="text-gray-400 text-sm text-center">No chores</p>
                        )}
                        {chores.map(chore => (
                            <div
                                key={chore.id}
                                className="bg-white dark:bg-gray-900 rounded shadow p-3 mb-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
                                onClick={() => handleChoreClick(chore.id)}
                            >
                                <div className="font-semibold">{chore.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Due: {chore.dueDate ? new Date(chore.dueDate).toLocaleDateString() : "N/A"}
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