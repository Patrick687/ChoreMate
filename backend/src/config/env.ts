import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required but was not provided.`);
    }
    return value;
}

function requireIntEnv(name: string): number {
    const value = requireEnv(name);
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
        throw new Error(`Environment variable ${name} must be a valid integer, got "${value}".`);
    }
    return intValue;
}

// Required string variables
const DOMAIN = requireEnv('DOMAIN');
const DB_NAME = requireEnv('DB_NAME');
const DB_HOST = requireEnv('DB_HOST');
const DB_USER = requireEnv('DB_USER');
const DB_PASSWORD = requireEnv('DB_PASSWORD');
const JWT_SECRET = requireEnv('JWT_SECRET');

// Required number variables
const PORT = requireIntEnv('PORT');
const DB_PORT = requireIntEnv('DB_PORT');

const env = {
    DOMAIN,
    PORT,
    DB_NAME,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    JWT_SECRET,
};

export default env;