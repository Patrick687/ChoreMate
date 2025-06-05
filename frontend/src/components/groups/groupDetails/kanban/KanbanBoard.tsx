import React from "react";
import type { Chore, ChoreStatus, Group } from "../../../../graphql/generated";
import { openModal } from "../../../../store/modal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import KanbanColumns from "./KanbanColumns";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

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

    async function onDragEnd(result: DropResult) {
        const { source, destination, draggableId } = result;
        if (!destination) {
            console.log("Dropped outside of any droppable area");
            return;
        }
        const sourceStatus = source.droppableId as ChoreStatus;
        const destStatus = destination.droppableId as ChoreStatus;
        if (sourceStatus !== destStatus) {

            console.log(`Moving chore ${draggableId} from ${sourceStatus} to ${destStatus}`);
        } else {
            console.log("Dropped in the same column, no action taken");
        }
    }

    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Chores</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <KanbanColumns columns={columns} onChoreClick={handleChoreClick} />
            </DragDropContext>
        </section>
    );
};


export default KanbanBoard;