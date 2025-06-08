import jwt from 'jsonwebtoken';
import env from '../config/env';
import { InternalServerError, UnauthorizedError } from '../utils/error/customErrors';
import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { UUID } from 'crypto';
import { User } from '../models/UserModel';

export type UserContext = {
    user: { id: UUID; };
};

export const context = async ({ req }: ExpressContextFunctionArgument): Promise<UserContext> => {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authorization header required');
    }
    try {
        const payload = jwt.verify(auth.replace('Bearer ', ''), env.JWT_SECRET) as { id: string; };
        return { user: { id: payload.id as UUID } };
    } catch (e) {
        throw new UnauthorizedError('Unauthorized access. Please log in again.');
    }
};

export async function getUserModelInstanceFromContext(context: UserContext): Promise<User> {
    if (!context.user || !context.user.id) {
        throw new UnauthorizedError('User not authenticated');
    }

    const userModelInstance = await User.findByPk(context.user.id);
    if (!userModelInstance) {
        throw new InternalServerError('Something went wrong. Please relog in.');
    }

    return userModelInstance;
}