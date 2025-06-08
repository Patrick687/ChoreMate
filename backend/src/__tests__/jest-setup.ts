import { connectToDatabase, sequelize } from "../config/db";
import { startApolloServer } from "../utils/apollo/apolloServer";
import "../models";

let serverHandles: { httpServer: { close: (cb: (err?: Error) => void) => void; }; } | undefined;

beforeAll(async () => {
    console.log("🔌 Connecting to the test database...");
    await connectToDatabase();
    console.log("✅ Database connection established successfully.");
    console.log("🚀 Starting Apollo Server for tests...");
    serverHandles = await startApolloServer();
    console.log("✅ Apollo Server started successfully.");
});

afterAll(async () => {
    if (serverHandles?.httpServer) {
        console.log("🛑 Closing Apollo Server...");
        await new Promise<void>((resolve, reject) => {
            serverHandles!.httpServer.close((err?: Error) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log("✅ Apollo Server closed successfully.");
    } else {
        console.warn("⚠️ No Apollo Server instance found to close.");
    }
    console.log("🛑 Closing database connection...");
    await sequelize.close();
    console.log(`✅ Database connection to ${sequelize.getDatabaseName()} closed successfully.`);
});