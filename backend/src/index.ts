import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { connectToDatabase, sequelize } from './config/db';
import { context } from './middleware/context';
import env from './config/env';

const app = express();
app.use(cors());
app.use(express.json());

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    formatError: (err) => {
        console.error('GraphQL Error:', {
            message: err.message,
            path: err.path,
            locations: err.locations,
            extensions: err.extensions,
            stack: err.originalError?.stack,
        });
        const errorCode = (err.originalError as any)?.code || null;
        return {
            message: errorCode ? err.message : 'Something went wrong',
            code: errorCode || 500,
            path: err.path,
            locations: err.locations,
        };
    }
});

async function start() {
    await connectToDatabase();
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    await sequelize.sync();
    app.listen(env.PORT, () =>
        console.log(`🚀 Server running at http://${env.DOMAIN}:${env.PORT}${apolloServer.graphqlPath}`)
    );
}
start();