import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface UserInviteProps {
    groupName: string;
    invitingUserName: string;
}

const UserInvite: React.FC<UserInviteProps> = ({ groupName, invitingUserName }) => (
    <li className="flex items-center justify-between space-x-16 border-b border-gray-200 dark:border-gray-700 py-2">
        <span className="flex flex-col items-center md:flex-row">
            <span className="font-medium">{groupName}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                Invited by {invitingUserName}
            </span>
        </span>
        <span className="flex gap-2">
            <button
                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                aria-label="Accept"
            >
                <FaCheck />
            </button>
            <button
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                aria-label="Decline"
            >
                <FaTimes />
            </button>
        </span>
    </li>
);

export default UserInvite;