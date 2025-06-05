import type { Chore, ChoreStatus } from "../../../../graphql/generated";
import KanbanChoreCard from "./KanbanChoreCard";
import { Droppable, Draggable } from "@hello-pangea/dnd";

interface KanbanColumnProps {
    status: ChoreStatus;
    chores: Chore[];
    onChoreClick: (choreId: Chore['id']) => void;
}

const statusLabels: Record<ChoreStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, chores, onChoreClick }) => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-h-[200px] transition">
        <h3 className="font-bold mb-2 text-center">{statusLabels[status]}</h3>
        <Droppable droppableId={status}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[150px] transition ${snapshot.isDraggingOver ? "ring-2 ring-indigo-400" : ""}`}
                >
                    {chores.length === 0 && (
                        <p className="text-gray-400 text-sm text-center">No chores</p>
                    )}
                    {chores.map((chore, idx) => (
                        <Draggable draggableId={chore.id} index={idx} key={chore.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <KanbanChoreCard
                                        chore={chore}
                                        onClick={onChoreClick}
                                        isDragging={snapshot.isDragging}
                                    />
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </div>
);

export default KanbanColumn;