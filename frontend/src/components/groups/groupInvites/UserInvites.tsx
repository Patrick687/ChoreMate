import React from "react";
import UserInvite from "./UserInvite";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

const UserInvites: React.FC = () => {

    const user = useSelector((state: RootState) => state.auth.user);
    if (!user) {
        alert("You must be logged in to view your invites.");
        return <p>ERROR</p>;
    }


    const groupInvites = useSelector((state: RootState) => state.groups.groups.flatMap(group => group.groupInvites));
    if (!groupInvites || groupInvites.length === 0) {
        return (
            <section className="w-full md:max-w-4xl mx-auto my-10 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl text-center font-semibold mb-4">Your Group Invites</h2>
                <p className="text-gray-500">You have no invites.</p>
            </section>
        );
    }


    // Skeleton data for now
    const invites = [
        { groupName: "Chore League", invitingUserName: "Alice" },
        { groupName: "Chore League", invitingUserName: "Alice" },
    ];
    //const invites: any[] = [];

    return (
        <section className="w-full md:max-w-4xl mx-auto my-10 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl text-center font-semibold mb-4">Your Group Invites</h2>
            {invites.length === 0 ? (
                <p className="text-gray-500">You have no invites.</p>
            ) : (
                <ul>
                    {invites.map((invite, idx) => (
                        <UserInvite
                            key={idx}
                            groupName={invite.groupName}
                            invitingUserName={invite.invitingUserName}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default UserInvites;