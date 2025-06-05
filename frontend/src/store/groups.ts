import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Group } from "../graphql/generated";
import { GroupsDocument } from "../graphql/generated";
import client from "../apollo/apolloClient";
import { setChoresForGroup } from "./chores";

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
    async ({ userId }, { dispatch }) => {
        const { data } = await client.query({
            query: GroupsDocument,
            variables: { userId },
            fetchPolicy: "network-only",
        });
        data.groups.forEach((group: Group) => {
            if (group.chores) {
                dispatch(setChoresForGroup({ groupId: group.id, chores: group.chores }));
            }
        });
        return data.groups;
    }
);

const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        // Add group-related reducers here if needed (e.g., addGroup, updateGroup)
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

export default groupsSlice.reducer;