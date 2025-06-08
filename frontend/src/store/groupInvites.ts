import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GroupInviteStatus, ReceivedGroupInvitesDocument, SentGroupInvitesDocument, type GroupInviteFieldsFragment, type GroupInviteAddedSubscription } from "../graphql/generated";
import client from "../apollo/apolloClient";

interface InviteStatusMap {
    pending: GroupInviteFieldsFragment[];
    accepted: GroupInviteFieldsFragment[];
    declined: GroupInviteFieldsFragment[];
}

interface GroupInviteState {
    received: InviteStatusMap;
    sent: InviteStatusMap;
    receivedLoading: boolean;
    receivedError: string | null;
    sentLoading: boolean;
    sentError: string | null;
}

const emptyStatusMap = (): InviteStatusMap => ({
    pending: [],
    accepted: [],
    declined: [],
});

const initialState: GroupInviteState = {
    received: emptyStatusMap(),
    sent: emptyStatusMap(),
    receivedError: null,
    receivedLoading: false,
    sentError: null,
    sentLoading: false,
};

function getStatusKey(status: GroupInviteStatus): keyof InviteStatusMap {
    switch (status) {
        case GroupInviteStatus.Pending: return "pending";
        case GroupInviteStatus.Accepted: return "accepted";
        case GroupInviteStatus.Declined: return "declined";
        default: return "pending";
    }
}

export const fetchSentGroupInvites = createAsyncThunk<GroupInviteFieldsFragment[], { userId: string }>(
    "groupInvites/fetchSentGroupInvites",
    async () => {
        const { data } = await client.query({
            query: SentGroupInvitesDocument,
            fetchPolicy: "network-only",
        });
        return data.sentGroupInvites;
    }
);

export const fetchReceivedGroupInvites = createAsyncThunk<GroupInviteFieldsFragment[], { userId: string }>(
    "groupInvites/fetchReceivedGroupInvites",
    async () => {
        const { data } = await client.query({
            query: ReceivedGroupInvitesDocument,
            fetchPolicy: "network-only",
        });
        return data.receivedGroupInvites;
    }
);

const groupInvitesSlice = createSlice({
    name: "groupInvites",
    initialState,
    reducers: {
        addReceivedInvite: (state, action: { payload: GroupInviteAddedSubscription["groupInviteAdded"] }) => {
            const invite = action.payload;
            const statusKey = getStatusKey(invite.status);
            if (!state.received[statusKey].some(i => i.id === invite.id)) {
                state.received[statusKey].push(invite);
            }
        },
        removeReceivedInvite: (state, action: { payload: GroupInviteFieldsFragment['id'] }) => {
            (Object.keys(state.received) as (keyof InviteStatusMap)[]).forEach(key => {
                state.received[key] = state.received[key].filter(invite => invite.id !== action.payload);
            });
        },
        addSentInvite: (state, action: { payload: GroupInviteFieldsFragment }) => {
            const invite = action.payload;
            const statusKey = getStatusKey(invite.status);
            if (!state.sent[statusKey].some(i => i.id === invite.id)) {
                state.sent[statusKey].push(invite);
            }
        },
        removeSentInvite: (state, action: { payload: GroupInviteFieldsFragment['id'] }) => {
            (Object.keys(state.sent) as (keyof InviteStatusMap)[]).forEach(key => {
                state.sent[key] = state.sent[key].filter(invite => invite.id !== action.payload);
            });
        },
        // Optional: handle status update (move between arrays)
        updateReceivedInviteStatus: (state, action: { payload: GroupInviteFieldsFragment }) => {
            const invite = action.payload;
            // Remove from all
            (Object.keys(state.received) as (keyof InviteStatusMap)[]).forEach(key => {
                state.received[key] = state.received[key].filter(i => i.id !== invite.id);
            });
            // Add to new status
            const statusKey = getStatusKey(invite.status);
            state.received[statusKey].push(invite);
        },
        updateSentInviteStatus: (state, action: { payload: GroupInviteFieldsFragment }) => {
            const invite = action.payload;
            (Object.keys(state.sent) as (keyof InviteStatusMap)[]).forEach(key => {
                state.sent[key] = state.sent[key].filter(i => i.id !== invite.id);
            });
            const statusKey = getStatusKey(invite.status);
            state.sent[statusKey].push(invite);
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchSentGroupInvites
            .addCase(fetchSentGroupInvites.pending, (state) => {
                state.sentLoading = true;
                state.sentError = null;
            })
            .addCase(fetchSentGroupInvites.fulfilled, (state, action) => {
                state.sentLoading = false;
                state.sent = emptyStatusMap();
                action.payload.forEach(invite => {
                    const statusKey = getStatusKey(invite.status);
                    state.sent[statusKey].push(invite);
                });
            })
            .addCase(fetchSentGroupInvites.rejected, (state, action) => {
                state.sentLoading = false;
                state.sentError = action.error.message || "Failed to fetch sent invites";
            })

            // fetchReceivedGroupInvites
            .addCase(fetchReceivedGroupInvites.pending, (state) => {
                state.receivedLoading = true;
                state.receivedError = null;
            })
            .addCase(fetchReceivedGroupInvites.fulfilled, (state, action) => {
                state.receivedLoading = false;
                state.received = emptyStatusMap();
                action.payload.forEach(invite => {
                    const statusKey = getStatusKey(invite.status);
                    state.received[statusKey].push(invite);
                });
            })
            .addCase(fetchReceivedGroupInvites.rejected, (state, action) => {
                state.receivedLoading = false;
                state.receivedError = action.error.message || "Failed to fetch received invites";
            });
    },
});

export const {
    addReceivedInvite,
    removeReceivedInvite,
    addSentInvite,
    removeSentInvite,
    updateReceivedInviteStatus,
    updateSentInviteStatus,
} = groupInvitesSlice.actions;
export default groupInvitesSlice.reducer;