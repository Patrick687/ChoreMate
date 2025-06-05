import React, { useEffect } from "react";
import { useUpdateChoreStatusMutation, type Chore, type ChoreStatus, type Group } from "../../../../graphql/generated";
import { openModal } from "../../../../store/modal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import KanbanColumns from "./KanbanColumns";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { updateChoreStatus } from "../../../../store/groups";

interface KanbanBoardProps {
    groupId: Group['id'];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ groupId }) => {

    const [updateChoreStatusMutation] = useUpdateChoreStatusMutation();

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
        if (!destination) return;

        const sourceStatus = source.droppableId as ChoreStatus;
        const destStatus = destination.droppableId as ChoreStatus;

        if (sourceStatus !== destStatus) {
            // Optimistically update
            dispatch(updateChoreStatus({
                choreId: draggableId,
                status: destStatus
            }));

            try {
                await updateChoreStatusMutation({
                    variables: {
                        args: {
                            choreId: draggableId,
                            status: destStatus
                        }
                    }
                });
            } catch (error) {
                // Revert on error
                dispatch(updateChoreStatus({
                    choreId: draggableId,
                    status: sourceStatus
                }));
                // Optionally show an error message to the user
                alert("Failed to update chore status. Please try again.");
            }
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