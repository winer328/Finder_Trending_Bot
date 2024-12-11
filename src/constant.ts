import { Logger } from 'pino';
import dotenv from 'dotenv';
import { logger } from './helper/logger';

dotenv.config();

const retrieveEnvVariable = (variableName: string, logger: Logger) => {
    const variable = process.env[variableName] || '';
    if (!variable) {
        logger.error(`${variableName} is not set`);
        process.exit(1);
    }
    return variable;
};

// Database Connection
export const MONGO_URL = retrieveEnvVariable('MONGO_URL', logger);
// Solana Connection
export const RPC_ENDPOINT = retrieveEnvVariable('RPC_ENDPOINT', logger);
export const RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable('RPC_WEBSOCKET_ENDPOINT', logger);