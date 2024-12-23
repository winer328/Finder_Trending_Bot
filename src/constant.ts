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

// Admin Wallet
export const ADMIN_WALLET_PRV_KEY = retrieveEnvVariable('ADMIN_WALLET_PRV_KEY', logger);

// Transaction
export const JITO_TIP = 0.0001;

// Database Connection
export const MONGO_URL = retrieveEnvVariable('MONGO_URL', logger);

// Webhook server
export const WEBHOOK_PORT = retrieveEnvVariable('WEBHOOK_PORT', logger);
export const WEBHOOK_IP = retrieveEnvVariable('WEBHOOK_IP', logger);
export const WEBHOOK_URI = retrieveEnvVariable('WEBHOOK_URI', logger);
export const HELIUS_API_KEY = retrieveEnvVariable('HELIUS_API_KEY', logger);

// Solana Connection
export const RPC_ENDPOINT = retrieveEnvVariable('RPC_ENDPOINT', logger);
export const RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable('RPC_WEBSOCKET_ENDPOINT', logger);

// Telegram Bot
export const BOT_TOKEN = retrieveEnvVariable('BOT_TOKEN', logger);
export const BOT_NAME = retrieveEnvVariable('BOT_NAME', logger);

// Channel Id
export const CHANNEL_ID = retrieveEnvVariable('CHANNEL_ID', logger);

// Telegram Bot State
export const MAIN_PAGE = "MAIN_PAGE";
export const ENTER_CA = "ENTER_CA";

// Trend Constant
export const TREND_AMOUNT_1 = 0.1;
export const TREND_AMOUNT_2 = 6.5;
export const TREND_AMOUNT_3 = 8.5;
export const TREND_AMOUNT_4 = 17;

export const TREND_TIME_1 = 3;
export const TREND_TIME_2 = 6;
export const TREND_TIME_3 = 12;
export const TREND_TIME_4 = 24;