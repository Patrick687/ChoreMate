import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GroupDocument, GroupsDocument, type Group, type GroupFieldsFragment } from "../graphql/generated";
import client from "../apollo/apolloClient";
import { setChoresForGroup } from "./chores";

interface GroupsState {
    groups: GroupFieldsFragment[];
    loading: boolean;
    error: string | null;
}

const initialState: GroupsState = {
    groups: [],
    loading: false,
    error: null,
};

export const fetchGroups = createAsyncThunk<GroupFieldsFragment[], { userId: string; }>(
    "groups/fetchGroups",
    async ({ userId }, { dispatch }) => {
        const { data } = await client.query({
            query: GroupsDocument,
            variables: { userId },
            fetchPolicy: "network-only",
        });
        data.groups.forEach((group: GroupFieldsFragment) => {
            if (group.chores) {
                dispatch(setChoresForGroup({ groupId: group.id, chores: group.chores }));
            }
        });
        return data.groups;
    }
);

export const fetchGroupByGroupId = createAsyncThunk<GroupFieldsFragment, { groupId: string; }>(
    "groups/fetchGroupByGroupId",
    async ({ groupId }) => {
        const { data } = await client.query({
            query: GroupDocument,
            variables: { groupId },
            fetchPolicy: "network-only",
        });
        return data.group;
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
            })
            .addCase(fetchGroupByGroupId.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(fetchGroupByGroupId.fulfilled, (state, action) => {
                state.loading = false;
                const existingGroupIndex = state.groups.findIndex(group => group.id === action.payload.id);
                if (existingGroupIndex !== -1) {
                    state.groups[existingGroupIndex] = action.payload;
                } else {
                    state.groups.push(action.payload);
                }
            }).addCase(fetchGroupByGroupId.rejected, (state, action) => {
                state.loading = false;
                // Check if this was a refetch by seeing if the group already exists in state
                const groupId = action.meta.arg.groupId;
                const isRefetch = state.groups.some(group => group.id === groupId);
                state.error = action.error.message
                    ? `${isRefetch ? "Refetch" : "Fetch"} group by ID failed: ${action.error.message}`
                    : `${isRefetch ? "Refetch" : "Fetch"} group by ID failed`;
            });
    },
});

export default groupsSlice.reducer;