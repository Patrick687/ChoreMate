import { Sequelize } from 'sequelize';
import env from './env';

export const sequelize = new Sequelize(
    env.DB_NAME,
    env.DB_USER,
    env.DB_PASSWORD,
    {
        host: env.DB_HOST,
        port: env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    }
);

export async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log(`✅ Database connection to ${sequelize.getDatabaseName()} has been established successfully.`);
    } catch (error) {
        console.error(`❌ Unable to connect to the database ${sequelize.getDatabaseName()}:`, error);
        process.exit(1);
    }
}