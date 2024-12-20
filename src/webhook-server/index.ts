import express from 'express';
import bodyParser from 'body-parser';
import { Bot } from '../telegram';
import { Connection } from '@solana/web3.js';
import { WEBHOOK_IP, WEBHOOK_PORT, WEBHOOK_URI } from '../constant';
import { logger } from '../helper/logger';

export const runWebhookserver = async (botClass: Bot, connection: Connection) => {
    const app = express();

    app.use(bodyParser.json());

    app.post(WEBHOOK_URI, async (req, res): Promise<any> => {
        if (Object.keys(req.body).length == 0) {
            return res.json({});
        }
        logger.info('received webhook');

        const response_data = req.body;
        if (response_data[0].type == "SWAP") {
            const swap_event = response_data[0].events.swap;

            if (swap_event.nativeInput == null) {
                // SELL

            } else {
                // BUY
            }
        }
    });

    app.listen(WEBHOOK_PORT, () => {
        logger.info(`Webhook server is running at http://${WEBHOOK_IP}:${WEBHOOK_PORT}`);
    });
}