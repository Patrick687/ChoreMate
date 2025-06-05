import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Chore, UpdateChoreDueDateInput, UpdateChoreInfoInput, UpdateChoreStatusInput } from "../graphql/generated";

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
    },
});

export const {
    setChoresForGroup,
    addChore,
    updateChoreInfo,
    updateChoreDueDate,
    updateChoreStatus,
} = choresSlice.actions;

export default choresSlice.reducer;