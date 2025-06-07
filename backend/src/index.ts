import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import './models';
import { connectToDatabase, sequelize } from './config/db';
import { context, UserContext } from './middleware/context';
import env from './config/env';

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function start() {
    await connectToDatabase();

    const apolloServer = new ApolloServer<UserContext>({
        typeDefs,
        resolvers,
        formatError: (err) => {
            // Cast to any to access originalError safely
            const originalError = (err as any).originalError;
            console.error('GraphQL Error:', {
                message: err.message,
                path: err.path,
                locations: err.locations,
                extensions: err.extensions,
                stack: originalError?.stack,
            });
            return {
                message: err.message,
                path: err.path,
                locations: err.locations,
                extensions: err.extensions,
                stack: originalError?.stack,
            };
        }
    });

    await apolloServer.start();
    app.use('/graphql', expressMiddleware(apolloServer, { context }));

    await sequelize.sync();
    app.listen(env.PORT, () =>
        console.log(`🚀 Server running at http://${env.DOMAIN}:${env.PORT}/graphql`)
    );
}
start();