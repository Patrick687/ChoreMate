import jwt from 'jsonwebtoken';
import env from '../config/env';

export const context = ({ req }: { req: any; }) => {
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