import jwt from 'jsonwebtoken';
import env from '../config/env';

export const context = ({ req }: { req: any; }) => {
    // Skip auth for Apollo Sandbox/Studio only in development
    const isDev = process.env.NODE_ENV === "development";
    const clientName = req.headers['apollographql-client-name'];
    if (
        isDev &&
        (clientName === 'Apollo Sandbox' || clientName === 'Apollo Studio Explorer')
    ) {
        return { user: { id: 'sandbox-user' } }; // or just return {} if you want no user
    }

    const auth = req.headers.authorization || '';
    let user = null;
    if (auth.startsWith('Bearer ')) {
        try {
            user = jwt.verify(auth.replace('Bearer ', ''), env.JWT_SECRET);
        } catch (e) {
            // Invalid token, user stays null
        }
    }
    return { user };
};