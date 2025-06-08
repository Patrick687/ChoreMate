import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../../schema";
import { resolvers } from "../../resolvers";
import { context, UserContext } from "../../middleware/context";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import env from "../../config/env";
import { sequelize } from "../../config/db";
import express, { Express } from "express";
import cors from "cors";

export let apolloServer: ApolloServer<UserContext>;
export let expressApp: Express;

export async function startApolloServer() {
    // If no app is provided, create a new one
    expressApp = express();
    expressApp.use(cors());
    expressApp.use(express.json());

    // Create executable schema for graphql-ws
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    apolloServer = new ApolloServer<UserContext>({
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
    const httpServer = createServer(expressApp);

    // Set up WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    // Use graphql-ws to handle subscriptions
    useServer({ schema }, wsServer);

    expressApp.use('/graphql', expressMiddleware(apolloServer, { context }));

    await sequelize.sync();

    httpServer.listen(env.PORT, () =>
        console.log(`🚀 Server running at http://${env.DOMAIN}:${env.PORT}/graphql`)
    );

    return { apolloServer, httpServer, wsServer, expressApp };
}