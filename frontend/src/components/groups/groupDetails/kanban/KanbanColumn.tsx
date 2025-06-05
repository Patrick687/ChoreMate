import type { Chore, ChoreStatus } from "../../../../graphql/generated";
import KanbanChoreCard from "./KanbanChoreCard";

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
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-h-[200px]">
        <h3 className="font-bold mb-2 text-center">{statusLabels[status]}</h3>
        {chores.length === 0 && (
            <p className="text-gray-400 text-sm text-center">No chores</p>
        )}
        {chores.map(chore => (
            <KanbanChoreCard key={chore.id} chore={chore} onClick={onChoreClick} />
        ))}
    </div>
);

export default KanbanColumn;