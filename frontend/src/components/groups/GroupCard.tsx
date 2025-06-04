import React from "react";
import { useNavigate } from "react-router-dom";
import type { Group } from "../../graphql/generated";

interface GroupCardProps {
    group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
    const navigate = useNavigate();
    return (
        <div
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/groups/${group.id}`)}
        >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {group.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
                Created by: {group.createdBy.userName}
            </p>
            <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {group.groupMembers.length} member{group.groupMembers.length !== 1 ? "s" : ""}
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                    {group.groupMembers.map(member => (
                        <span
                            key={member.id}
                            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded text-xs"
                        >
                            {member.userName}
                        </span>
                    ))}
                </div>
            </div>
            <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-300"
                onClick={e => {
                    e.stopPropagation();
                    navigate(`/groups/${group.id}`);
                }}
            >
                View Details
            </button>
        </div>
    );
};

export default GroupCard;