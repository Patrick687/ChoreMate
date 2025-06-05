import type { Chore, ChoreStatus } from "../../../../graphql/generated";
import KanbanColumn from "./KanbanColumn";

interface KanbanColumnsProps {
    columns: Record<ChoreStatus, Chore[]>;
    onChoreClick: (choreId: Chore['id']) => void;
}

const KanbanColumns: React.FC<KanbanColumnsProps> = ({ columns, onChoreClick }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, chores]) => (
            <KanbanColumn
                key={status}
                status={status as ChoreStatus}
                chores={chores}
                onChoreClick={onChoreClick}
            />
        ))}
    </div>
);

export default KanbanColumns;