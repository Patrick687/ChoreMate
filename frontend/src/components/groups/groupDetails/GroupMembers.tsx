import React from "react";
import type { User } from "../../../graphql/generated";

interface GroupMembersProps {
    members: User[];
}

const GroupMembers: React.FC<GroupMembersProps> = ({ members }) => (
    <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Group Members</h2>
        <div className="flex flex-wrap gap-3">
            {members.map(member => (
                <div
                    key={member.id}
                    className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-3 py-2 rounded shadow text-sm"
                >
                    <span className="font-bold">{member.userName}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{member.email}</span>
                </div>
            ))}
        </div>
    </section>
);

export default GroupMembers;