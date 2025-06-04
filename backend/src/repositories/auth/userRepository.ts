import { UUID } from "crypto";
import { User } from "../../models/UserModel";
import { NotFoundError } from "../../utils/error/customErrors";
import { GroupMember } from "../../models/GroupMembersModel";

const userRepository = {
    fetchUserByUserId,
    fetchUserByGroupMember,
    fetchUserByGroupMemberId
};

async function fetchUserByUserId(userId: UUID, throwError: true): Promise<User>;
async function fetchUserByUserId(userId: UUID, throwError?: false): Promise<User | null>;
async function fetchUserByUserId(userId: UUID, throwError: boolean = false): Promise<User | null> {
    const user = await User.findByPk(userId);
    if (!user && throwError) {
        const error = new NotFoundError(`User with ID: ${userId} not found`);
        console.error(error);
        throw error;
    }
    return user;
}

async function fetchUserByGroupMember(groupMember: GroupMember, throwError: true): Promise<User>;
async function fetchUserByGroupMember(groupMember: GroupMember, throwError?: false): Promise<User | null>;
async function fetchUserByGroupMember(groupMember: GroupMember, throwError: boolean = false): Promise<User | null> {
    const user = await User.findByPk(groupMember.userId);
    if (!user && throwError) {
        const error = new NotFoundError(`User with Group Member ID: ${groupMember.id} not found`);
        console.error(error);
        throw error;
    }
    return user;
}

async function fetchUserByGroupMemberId(groupMemberId: UUID, throwError: true): Promise<User>;
async function fetchUserByGroupMemberId(groupMemberId: UUID, throwError?: false): Promise<User | null>;
async function fetchUserByGroupMemberId(groupMemberId: UUID, throwError: boolean = false): Promise<User | null> {
    const groupMember = await GroupMember.findByPk(groupMemberId);
    if (!groupMember && throwError) {
        const error = new NotFoundError(`Group member with ID: ${groupMemberId} not found`);
        console.error(error);
        throw error;
    } else if (!groupMember) {
        return null;
    }
    return throwError ? await fetchUserByGroupMember(groupMember, true) : await fetchUserByGroupMember(groupMember, false);
}

export default userRepository;