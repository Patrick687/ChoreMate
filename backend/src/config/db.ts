import { Sequelize } from 'sequelize';
import env from './env';
import { fileURLToPath } from 'url';

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
        console.log('✅ Database connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
    connectToDatabase()
        .finally(async () => {
            await sequelize.close();
            console.log('🔌 Database connection closed.');
            process.exit(0);
        });
}