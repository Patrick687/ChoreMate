import dotenv from 'dotenv';

dotenv.config();

// Force NODE_ENV to be 'development' or 'test', default to 'development'
let NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV !== 'development' && NODE_ENV !== 'test') {
    NODE_ENV = 'development';
}
process.env.NODE_ENV = NODE_ENV; // Ensure consistency throughout the app

const isTest = NODE_ENV === 'test';

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
const DB_NAME = isTest ? requireEnv('DB_NAME_TEST') : requireEnv('DB_NAME');
const DB_HOST = isTest ? requireEnv('DB_HOST_TEST') : requireEnv('DB_HOST');
const DB_USER = isTest ? requireEnv('DB_USER_TEST') : requireEnv('DB_USER');
const DB_PASSWORD = isTest ? requireEnv('DB_PASSWORD_TEST') : requireEnv('DB_PASSWORD');
const JWT_SECRET = requireEnv('JWT_SECRET');

// Required number variables
const PORT = requireIntEnv('PORT');
const DB_PORT = isTest ? requireIntEnv('DB_PORT_TEST') : requireIntEnv('DB_PORT');

const env = {
    NODE_ENV,
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