import { UUID } from "crypto";
import { DataTypes, HasManyGetAssociationsMixin, Model } from "sequelize";
import { sequelize } from "../config/db";
import { BadRequestError } from "../utils/error/customErrors";
import bcrypt from "bcrypt";
import validator from "validator";
import { Group } from "./GroupModel";
import { GroupMember } from "./GroupMembersModel";
import { Chore } from "./ChoresModel";
import { ChoreAssignment } from "./ChoreAssignmentsModel";
import { GroupInvite } from "./GroupInviteModel";


export interface UserModelAttributes {
    id: UUID,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
}

interface UserModelCreationAttributes extends Omit<UserModelAttributes, 'id'> { }

export class User extends Model<UserModelAttributes, UserModelCreationAttributes> implements UserModelAttributes {
    public id!: UserModelAttributes['id'];
    public firstName!: UserModelAttributes['firstName'];
    public lastName!: UserModelAttributes['lastName'];
    public userName!: UserModelAttributes['userName'];
    public email!: UserModelAttributes['email'];
    public password!: UserModelAttributes['password'];

    // createdGroups
    public getCreatedGroups!: HasManyGetAssociationsMixin<Group>;
    // groupMembers
    public getGroupMembers!: HasManyGetAssociationsMixin<GroupMember>;
    // createdChores
    public getCreatedChores!: HasManyGetAssociationsMixin<Chore>;
    // choreAssignments (assignedTo)
    public getChoreAssignments!: HasManyGetAssociationsMixin<ChoreAssignment>;
    // assignedChores (assignedBy)
    public getAssignedChores!: HasManyGetAssociationsMixin<ChoreAssignment>;
    // sentInvites (inviterUserId)
    public getSentInvites!: HasManyGetAssociationsMixin<GroupInvite>;
    // receivedInvites (invitedUserId)
    public getReceivedInvites!: HasManyGetAssociationsMixin<GroupInvite>;
}

export const USER_TABLE_NAME = 'USR_USERS';
export const USER_MODEL_NAME = 'User';

export const UserModel = User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                customValidator(value: string) {
                    validateFistName(value);
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                customValidator(value: string) {
                    validateLastName(value);
                }
            }
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                customValidator(value: string) {
                    validateUserName(value);
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                customValidator(value: string) {
                    validateEmail(value);
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: USER_MODEL_NAME,
        tableName: USER_TABLE_NAME,
        hooks: {
            beforeCreate: async (user: User) => {
                user.password = await validateAndHashPassword(user.password);
            },
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    user.password = await validateAndHashPassword(user.password);
                }
            }
        },
        indexes: [
            {
                unique: true,
                fields: ['userName']
            },
            {
                unique: true,
                fields: ['email']
            }
        ]
    }
);

function validateName(value: string, fieldName: 'firstName' | 'lastName') {
    const firstOrLastDisplayName = fieldName === 'firstName' ? 'First' : 'Last';

    if (!value) {
        throw new BadRequestError(`${firstOrLastDisplayName} name is required.`);
    }
    if (value.length > 50) {
        throw new BadRequestError(`${firstOrLastDisplayName} name must be less than 50 characters`);
    }
    if (value.length < 2) {
        throw new BadRequestError(`${firstOrLastDisplayName} name must be at least 2 characters`);
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
        throw new BadRequestError(`${firstOrLastDisplayName} name must be alphabetic with no spaces`);
    }
};

function validateFistName(value: string) {
    validateName(value, 'firstName');
}

function validateLastName(value: string) {
    validateName(value, 'lastName');
}

function validateUserName(value: string) {
    //username must be between 7 and 20 characters, alphanumeric. No special characters or spaces.
    if (!value) {
        throw new BadRequestError("Username is required");
    }
    if (value.length < 7 || value.length > 20) {
        throw new BadRequestError("Username must be between 7 and 20 characters");
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
        throw new BadRequestError("Username must be alphanumeric with no spaces or special characters");
    }
}

function validateEmail(value: string) {
    if (!value) {
        throw new BadRequestError("Email is required");
    }
    if (!validator.isEmail(value)) {
        throw new BadRequestError("Invalid email");
    }
}

async function validateAndHashPassword(value: string): Promise<string> {
    if (!value) {
        throw new BadRequestError("Password is required");
    }
    if (value.length < 7) {
        throw new BadRequestError("Password must be at least 7 characters");
    }
    if (!/[a-z]/.test(value)) {
        throw new BadRequestError("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(value)) {
        throw new BadRequestError("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(value)) {
        throw new BadRequestError("Password must contain at least one number");
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
        throw new BadRequestError("Password must contain at least one special character");
    }
    // Hash the password
    const hashed = await bcrypt.hash(value, 10);
    return hashed;
}