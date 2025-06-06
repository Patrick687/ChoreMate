import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Chore, UpdateChoreDueDateInput, UpdateChoreInfoInput, UpdateChoreStatusInput, Group, ChoreAssignment } from "../graphql/generated";

interface ChoresState {
    byGroupId: Record<string, Chore[]>;

}

const initialState: ChoresState = {
    byGroupId: {},
};

const choresSlice = createSlice({
    name: "chores",
    initialState,
    reducers: {
        setChoresForGroup: (state, action: PayloadAction<{ groupId: string; chores: Chore[]; }>) => {
            state.byGroupId[action.payload.groupId] = action.payload.chores;
        },
        addChore: (state, action: PayloadAction<{ groupId: string; chore: Chore; }>) => {
            const { groupId, chore } = action.payload;
            if (!state.byGroupId[groupId]) {
                state.byGroupId[groupId] = [];
            }
            state.byGroupId[groupId].push(chore);
        },
        updateChoreInfo: (state, action: PayloadAction<UpdateChoreInfoInput>) => {
            const { choreId, title, description } = action.payload;
            for (const chores of Object.values(state.byGroupId)) {
                const chore = chores.find((c) => c.id === choreId);
                if (chore) {
                    if (title) chore.title = title;
                    if (description) chore.description = description;
                }
            }
        },
        updateChoreDueDate: (state, action: PayloadAction<UpdateChoreDueDateInput>) => {
            const { choreId, dueDate } = action.payload;
            for (const chores of Object.values(state.byGroupId)) {
                const chore = chores.find((c) => c.id === choreId);
                if (chore) {
                    chore.dueDate = dueDate || null;
                }
            }
        },
        updateChoreStatus: (state, action: PayloadAction<UpdateChoreStatusInput>) => {
            const { choreId, status } = action.payload;
            for (const chores of Object.values(state.byGroupId)) {
                const chore = chores.find((c) => c.id === choreId);
                if (chore) {
                    chore.status = status;
                }
            }
        },
        assignChore: (state, action: PayloadAction<{ groupId: Group['id'], choreId: Chore['id'], assignment: ChoreAssignment; }>) => {
            const { choreId, groupId } = action.payload;
            const { assignedTo, assignedBy, id: choreAssignmentId, assignedAt } = action.payload.assignment;
            const chores = state.byGroupId[groupId];
            if (!chores) {
                throw new Error(`Redux State Error: No chores found for groupId ${groupId}`);
            }
            const chore = chores.find((c) => c.id === choreId);
            if (!chore) {
                throw new Error(`Redux State Error: No chore found with choreId ${choreId} in groupId ${groupId}`);
            }
            chore.assignment = {
                assignedTo: assignedTo || null,
                assignedBy: assignedBy || null,
                id: choreAssignmentId,
                assignedAt: assignedAt || new Date(),
            };
        }
    }
});

export const {
    setChoresForGroup,
    addChore,
    updateChoreInfo,
    updateChoreDueDate,
    updateChoreStatus,
    assignChore
} = choresSlice.actions;

export default choresSlice.reducer;