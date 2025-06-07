import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import './models';
import { connectToDatabase, sequelize } from './config/db';
import { context, UserContext } from './middleware/context';
import env from './config/env';

// Add these imports for subscriptions:
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

const app = express();
app.use(cors());
app.use(express.json());

async function start() {
    await connectToDatabase();

    // Create executable schema for graphql-ws
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const apolloServer = new ApolloServer<UserContext>({
        schema,
        formatError: (err) => {
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

    // Create HTTP server
    const httpServer = createServer(app);

    // Set up WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    // Use graphql-ws to handle subscriptions
    useServer({ schema }, wsServer);

    app.use('/graphql', expressMiddleware(apolloServer, { context }));

    await sequelize.sync();
    httpServer.listen(env.PORT, () =>
        console.log(`🚀 Server running at http://${env.DOMAIN}:${env.PORT}/graphql`)
    );
}
start();