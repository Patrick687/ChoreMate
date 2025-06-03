import { User } from '../models/UserModel';
import { ConflictError, UnauthorizedError } from '../utils/error/customErrors';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

type SignupArgs = {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

type LoginArgs = {
    email: string;
    password: string;
};

export const authResolvers = {
    Mutation: {
        signup: async (_parent: unknown, args: SignupArgs) => {
            // Check for existing user
            const existing = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: args.email },
                        { userName: args.userName }
                    ]
                }
            });
            if (existing) {
                if (existing.email === args.email) throw new ConflictError("Email already in use");
                if (existing.userName === args.userName) throw new ConflictError("Username already in use");
            }

            // Create user (model hooks will validate and hash password)
            const user = await User.create({
                userName: args.userName,
                email: args.email,
                password: args.password,
                firstName: args.firstName,
                lastName: args.lastName,
            });

            // Generate JWT
            const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1d' });

            // Return user (omit password)
            const { password, ...userWithoutPassword } = user.get({ plain: true });
            return { user: userWithoutPassword, token };
        },

        login: async (_parent: unknown, args: LoginArgs) => {
            // Find user by email
            const user = await User.findOne({ where: { email: args.email } });
            if (!user) throw new UnauthorizedError("Invalid credentials");

            // Compare password
            const valid = await bcrypt.compare(args.password, user.password);
            if (!valid) throw new UnauthorizedError("Invalid credentials");

            // Generate JWT
            const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1d' });

            // Return user (omit password)
            const { password: pw, ...userWithoutPassword } = user.get({ plain: true });
            return { user: userWithoutPassword, token };
        },
    },
};