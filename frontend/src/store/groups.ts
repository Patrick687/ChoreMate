import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Chore, Group, UpdateChoreDueDateInput, UpdateChoreInfoInput } from "../graphql/generated";
import { GroupsDocument } from "../graphql/generated";
import client from "../apollo/apolloClient";

interface GroupsState {
    groups: Group[];
    loading: boolean;
    error: string | null;
}

const initialState: GroupsState = {
    groups: [],
    loading: false,
    error: null,
};

export const fetchGroups = createAsyncThunk<Group[], { userId: string; }>(
    "groups/fetchGroups",
    async ({ userId }) => {
        const { data } = await client.query({
            query: GroupsDocument,
            variables: { userId },
            fetchPolicy: "network-only",
        });
        return data.groups;
    }
);

const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        addChore: (state, action: { payload: { groupId: string; chore: Chore; }; }) => {
            const { groupId, chore } = action.payload;
            const group = state.groups.find(g => g.id === groupId);
            if (group) {
                if (Array.isArray(group.chores)) {
                    group.chores.push(chore);
                } else {
                    group.chores = [chore];
                }
            } else {
                console.warn(`Group with id ${groupId} not found when trying to add a chore.`);
            }
        },
        updateChoreInfo: (state, action: { payload: Omit<UpdateChoreInfoInput, 'userId'>; }) => {
            const { choreId, title, description } = action.payload;
            const group = state.groups.find(g => g.chores?.some(c => c.id === choreId));
            if (group) {
                const chore = group.chores?.find(c => c.id === choreId);
                if (chore) {
                    if (title) chore.title = title;
                    if (description) chore.description = description;
                } else {
                    console.warn(`Chore with id ${choreId} not found in group ${group.id}.`);
                }
            } else {
                console.warn(`Group with chore id ${choreId} not found when trying to update chore info.`);
            }
        },
        updateChoreDueDate: (state, action: { payload: UpdateChoreDueDateInput; }) => {
            const { dueDate, choreId: id } = action.payload;
            const group = state.groups.find(g => g.chores?.some(c => c.id === id));
            if (group) {
                const chore = group.chores?.find(c => c.id === id);
                if (chore) {
                    chore.dueDate = dueDate || null;
                } else {
                    console.warn(`Chore with id ${id} not found in group ${group.id}.`);
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch groups";
            });
    },
});

export const { addChore, updateChoreInfo, updateChoreDueDate } = groupsSlice.actions;
export default groupsSlice.reducer;