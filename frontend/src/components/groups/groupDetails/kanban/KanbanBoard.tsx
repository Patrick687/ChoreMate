import React from "react";
import type { Chore, ChoreStatus, Group } from "../../../../graphql/generated";
import { openModal } from "../../../../store/modal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import KanbanColumns from "./KanbanColumns";

interface KanbanBoardProps {
    groupId: Group['id'];
}

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
            <KanbanColumns columns={columns} onChoreClick={handleChoreClick} />
        </section>
    );
};


export default KanbanBoard;