import { User } from '../models/UserModel';
import { UnauthorizedError } from '../utils/error/customErrors';

export const userResolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: { user?: { id: string; }; }) => {
            if (!context.user) {
                throw new UnauthorizedError('Not authenticated');
            }
            const user = await User.findByPk(context.user.id);
            if (!user) {
                throw new UnauthorizedError('User not found');
            }
            const { password, ...userWithoutPassword } = user.get({ plain: true });
            return userWithoutPassword;
        },
    },
};