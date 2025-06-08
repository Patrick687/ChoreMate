import { connectToDatabase, sequelize } from "../../config/db";


async function main() {
    await connectToDatabase();
    await sequelize.close();
    console.log(`🔌 Database connection to ${sequelize.getDatabaseName()} closed.`);
}

main();