import React from "react";
import GroupCard from "./GroupCard";
import type { Group } from "../../graphql/generated";

interface GroupListProps {
    groups: Group[];
}

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
    return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {groups.map(group => (
                <GroupCard key={group.id} group={group} />
            ))}
        </div>
    );
};

export default GroupList;