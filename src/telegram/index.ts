import { Connection } from "@solana/web3.js";
import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN, ENTER_CA, MAIN_PAGE, TREND_AMOUNT_1, TREND_AMOUNT_2, TREND_AMOUNT_3, TREND_AMOUNT_4, TREND_TIME_1, TREND_TIME_2, TREND_TIME_3, TREND_TIME_4 } from "../constant";
import { logger } from "../helper/logger";
import { registerUser } from "./handler";
import { goToMainPage, goToPaymentPage, goToTrendPage, processTrendPayment } from "./pages";
import { customSendMessage } from "../helper";

export class Bot {
    bot: TelegramBot;
    connection: Connection;
    bot_state: string;
    token_address: string;
    sol_for_trend: number;
    time_for_trend: number;

    constructor(connection: Connection) {
        this.bot = new TelegramBot(BOT_TOKEN);
        this.connection = connection;
        this.bot_state = MAIN_PAGE;
        this.token_address = "";
        this.sol_for_trend = TREND_AMOUNT_1;
        this.time_for_trend = TREND_TIME_1;
    }

    start = () => {
        this.botInitialize();
        this.bot.startPolling();
    }

    botInitialize = () => {
        this.bot.on('polling_error', err => {
            logger.error(err.name);
        });

        // command 
        this.bot.onText(/.*/, async (msg: TelegramBot.Message) => {
            const command = msg.text; if (!command) return;

            if (command == '/start') {
                await registerUser(msg);
                await goToMainPage(this.bot, this.connection, msg);
                return;
            } else if (command == '/trending') {
                this.bot_state = ENTER_CA;
                await customSendMessage(this.bot, msg, `Enter token address that has hit to start trending.\nFor ex. <code>6BY4bFK6yuP6tqoxhZEXe2Y2Yxfj72JXN4DvPZtepump</code>`);
                return;
            } else {
                // Enter default input
                switch (this.bot_state) {
                    case ENTER_CA:
                        await goToTrendPage(this, msg, true);
                        break;
                    default:
                        break;
                }
                return;
            }
        });

        // button click
        this.bot.on('callback_query', async (callBackData: TelegramBot.CallbackQuery) => {
            if (!callBackData.data || !callBackData.message) return;

            const command = callBackData.data;

            switch (command) {
                case 'finishedPayForTrend':
                    processTrendPayment(this, callBackData.message, true);
                    break;
                default:
                    break;
            }

            if (command.startsWith('setSolAmountForTrend')) {
                const serviceNum = command.replace('setSolAmountForTrend/', '');
                switch (serviceNum) {
                    case '1':
                        this.sol_for_trend = TREND_AMOUNT_1;
                        this.time_for_trend = TREND_TIME_1;
                        break;
                    case '2':
                        this.sol_for_trend = TREND_AMOUNT_2;
                        this.time_for_trend = TREND_TIME_2;
                        break;
                    case '3':
                        this.sol_for_trend = TREND_AMOUNT_3;
                        this.time_for_trend = TREND_TIME_3;
                        break;
                    case '4':
                        this.sol_for_trend = TREND_AMOUNT_4;
                        this.time_for_trend = TREND_TIME_4;
                        break;
                    default:
                        break;
                }
                await goToPaymentPage(this, callBackData.message, true);
            }
        })
    }
}