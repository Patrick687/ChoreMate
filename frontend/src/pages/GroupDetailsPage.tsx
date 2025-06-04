import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import GroupMembers from "../components/groups/groupDetails/GroupMembers";
import KanbanBoard from "../components/groups/groupDetails/KanbanBoard";
import { openModal } from "../store/modal";

const GroupDetailsPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string; }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inviteOpen, setInviteOpen] = useState(false);
    const [addChoreOpen, setAddChoreOpen] = useState(false);

    const { groups, loading, error } = useSelector((state: RootState) => state.groups);
    const group = groups.find(g => g.id === groupId);

    // Handle loading state
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-8">
                <p>Loading group details...</p>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="max-w-6xl mx-auto py-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Handle group not found
    if (!group) {
        return (
            <div className="max-w-6xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
                <p className="mb-4">The group you are looking for does not exist or you do not have access.</p>
                <button
                    onClick={() => navigate("/groups")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                    Back to Groups
                </button>
            </div>
        );
    }

    // Normal render
    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                <div>
                    <button
                        onClick={() => dispatch(openModal({ mode: "inviteMember", props: { groupId } }))}
                        className="mr-2 px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                        Invite Member
                    </button>
                    <button
                        onClick={() => dispatch(openModal({ mode: "addChore" }))}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Add Chore
                    </button>
                </div>
            </div>
            {/* Members Section */}
            <GroupMembers members={group.groupMembers} />

            {/* Kanban Board for Chores */}
            <KanbanBoard chores={group.chores} members={group.groupMembers} />

            {/* Modals */}
            {/* <InviteMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} groupId={groupId!} /> */}
            {/* <AddChoreModal open={addChoreOpen} onClose={() => setAddChoreOpen(false)} groupId={groupId!} /> */}
        </div>
    );
};

export default GroupDetailsPage;