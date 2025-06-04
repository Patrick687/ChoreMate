import React, { useEffect } from "react";
import GroupList from "../components/groups/GroupList";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { fetchGroups } from "../store/groups";

const GroupsPage: React.FC = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const { groups, loading, error } = useSelector((state: RootState) => state.groups);

    useEffect(() => {
        if (userId) {
            dispatch(fetchGroups({ userId }) as any);
        }
    }, [userId, dispatch]);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Your Groups</h1>
            {loading && <p>Loading groups...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && groups.length === 0 && (
                <p className="text-gray-500">You are not in any groups yet.</p>
            )}
            {!loading && !error && groups.length > 0 && (
                <GroupList groups={groups} />
            )}
        </div>
    );
};

export default GroupsPage;