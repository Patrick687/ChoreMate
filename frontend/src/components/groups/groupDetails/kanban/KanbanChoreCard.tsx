import type { Chore } from "../../../../graphql/generated";

interface KanbanChoreCardProps {
    chore: Chore;
    onClick: (choreId: Chore['id']) => void;
    isDragging?: boolean;
}

const KanbanChoreCard: React.FC<KanbanChoreCardProps> = ({ chore, onClick, isDragging }) => (
    <div
        className={`bg-white dark:bg-gray-900 rounded shadow p-3 mb-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition ${isDragging ? "ring-2 ring-indigo-400" : ""
            }`}
        onClick={() => onClick(chore.id)}
    >
        <div className="font-semibold">{chore.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
            Due: {chore.dueDate ? new Date(chore.dueDate).toLocaleDateString() : "N/A"}
        </div>
        <div className="text-xs mt-1">
            Assigned to: <span className="font-medium">Unassigned</span>
        </div>
    </div>
);

export default KanbanChoreCard;