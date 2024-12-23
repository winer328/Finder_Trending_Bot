import express from 'express';
import bodyParser from 'body-parser';
import { Bot } from '../telegram';
import { Connection } from '@solana/web3.js';
import { WEBHOOK_IP, WEBHOOK_PORT, WEBHOOK_URI } from '../constant';
import { logger } from '../helper/logger';
import { TrendModel } from '../database/trend-list';
import { customSendMessage, getTokenDataByDexscreenerApi } from '../helper';
import { ChannelBot } from '../telegram/channel';
import fs from 'fs';

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
                const token_data = (swap_event.tokenOutputs)[0];

                const dbToken = await TrendModel.findOne({
                    $and: [
                        {
                            $or: [
                                { to_time: -1 },
                                { to_time: { $gt: Math.floor(new Date().getTime() / 1000) } }
                            ]
                        },
                        { token_address: token_data.mint }
                    ]
                });
                if (!dbToken) return res.json({});

                const native_data = swap_event.nativeInput;
                const tokenDescription = await getTokenDataByDexscreenerApi(token_data.mint);
                if (!tokenDescription) return res.json({});
                const tokenOutputAmount = token_data.rawTokenAmount.tokenAmount;
                const tokenDecimals = token_data.rawTokenAmount.decimals;
                let description = ` ✳️ ${(tokenOutputAmount / 10 ** tokenDecimals).toFixed(4)} <a href="https://dexscreener.com/solana/${token_data.mint}" target="_blank">${tokenDescription.symbol}</a> were <a href="https://solscan.io/tx/${response_data[0].signature}" target="_blank">sold</a> for ${(native_data.amount / 10 ** 9).toFixed(4)} SOL\n\n`;
                
                if (Number(dbToken.initial_price) < tokenDescription.priceNative) {
                    const upPercent = Math.floor(tokenDescription.priceNative/Number(dbToken.initial_price) * 100) - 100;
                    if (upPercent > 0) {
                        description += `${token_data.symbol} is up ${upPercent}$ from Finder Trending`;
                    }
                }

                description += `🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`;
                const channelBot = new ChannelBot(botClass.bot, botClass.connection);
                await channelBot.refreshTrendList();
                const content = fs.readFileSync("./sent_message.txt", "utf8");

                await customSendMessage(botClass.bot, JSON.parse(content), description, [], false);
                return res.json({});
            }
        }
    });

    app.listen(WEBHOOK_PORT, () => {
        logger.info(`Webhook server is running at http://${WEBHOOK_IP}:${WEBHOOK_PORT}`);
    });
}