import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GroupInviteStatus, ReceivedGroupInvitesDocument, SentGroupInvitesDocument, type GroupInvite, type GroupInviteAddedSubscription, type GroupInviteFieldsFragment } from "../graphql/generated";
import client from "../apollo/apolloClient";

interface GroupInviteState {
    received: GroupInviteFieldsFragment[];
    sent: GroupInviteFieldsFragment[];
    receivedLoading: boolean;
    receivedError: string | null;
    sentLoading: boolean;
    sentError: string | null;
}

const initialState: GroupInviteState = {
    received: [],
    sent: [],
    receivedError: null,
    receivedLoading: false,
    sentError: null,
    sentLoading: false,
}

export const fetchSentGroupInvites = createAsyncThunk<GroupInviteFieldsFragment[], { userId: string}>(
    "groupInvites/fetchSentGroupInvites",
    async () => {
        const { data } = await client.query({
            query: SentGroupInvitesDocument,
            fetchPolicy: "network-only",
        });

        // For now, I am going to filter out all non-pending invites
        data.sentGroupInvites = data.sentGroupInvites.filter((invite: GroupInviteFieldsFragment) => {
            return invite.status === GroupInviteStatus.Pending;
        });
        return data.sentGroupInvites;
    }
)

export const fetchReceivedGroupInvites = createAsyncThunk<GroupInviteFieldsFragment[], { userId: string}>(
    "groupInvites/fetchReceivedGroupInvites",
    async () => {

        const { data } = await client.query({
            query: ReceivedGroupInvitesDocument,
            fetchPolicy: "network-only",
        });

        //For now, I am going to filter out all non-pending invites
        data.receivedGroupInvites = data.receivedGroupInvites.filter((invite: GroupInviteFieldsFragment) => {
            return invite.status === GroupInviteStatus.Pending;
        });

        return data.receivedGroupInvites;
    }
);



const groupInvitesSlice = createSlice({
    name: "groupInvites",
    initialState,
    reducers: {
        addReceivedInvite: (state, action: { payload: GroupInviteAddedSubscription["groupInviteAdded"] }) => {
            if(!state.received.some(invite => invite.id === action.payload.id)) {
                state.received.push(action.payload);    
            }
        },
        removeReceivedInvite: (state, action: { payload: GroupInviteFieldsFragment['id'] }) => {
            state.received = state.received.filter(invite => invite.id !== action.payload);
        },
        addSentInvite: (state, action: { payload: GroupInviteFieldsFragment }) => {
            if(!state.sent.some(invite => invite.id === action.payload.id)) {
                state.sent.push(action.payload);
            }
        },
        removeSentInvite: (state, action: { payload: GroupInviteFieldsFragment['id'] }) => {
            state.sent = state.sent.filter(invite => invite.id !== action.payload);
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
                state.sent = action.payload;
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
                state.received = action.payload;
            })
            .addCase(fetchReceivedGroupInvites.rejected, (state, action) => {
                state.receivedLoading = false;
                state.receivedError = action.error.message || "Failed to fetch received invites";
            });
    },
})

export const {
    addReceivedInvite,
    removeReceivedInvite,
    addSentInvite,
    removeSentInvite,
} = groupInvitesSlice.actions;
export default groupInvitesSlice.reducer;