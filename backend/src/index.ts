import { connectToDatabase } from './config/db';
import { startApolloServer } from './utils/apollo/apolloServer';
import "./models";

async function start() {
    await connectToDatabase();
    await startApolloServer();
}
start();