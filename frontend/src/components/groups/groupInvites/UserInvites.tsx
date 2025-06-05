import React from "react";
import UserInvite from "./UserInvite";

const UserInvites: React.FC = () => {
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