import jwt from 'jsonwebtoken';
import env from '../config/env';
import { UnauthorizedError } from '../utils/error/customErrors';
import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { UUID } from 'crypto';

export type UserContext = {
    user: { id: UUID; } | null;
};

export const context = async ({ req }: ExpressContextFunctionArgument): Promise<UserContext> => {
    const auth = req.headers.authorization || '';
    let user: { id: UUID; } | null = null;
    if (auth.startsWith('Bearer ')) {
        try {
            // jwt.verify returns the payload, which should have an id
            const payload = jwt.verify(auth.replace('Bearer ', ''), env.JWT_SECRET) as { id: string; };
            user = { id: payload.id as UUID };
        } catch (e) {
            throw new UnauthorizedError('Unauthorized access. Please log in again.');
        }
    }
    return { user };
};