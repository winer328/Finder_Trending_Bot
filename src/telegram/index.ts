import { Connection } from "@solana/web3.js";
import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "../constant";
import { logger } from "../helper/logger";
import { registerUser } from "./handler";
import { goToMainPage } from "./pages";

export class Bot {
    bot: TelegramBot;
    connection: Connection;

    constructor(connection: Connection) {
        this.bot = new TelegramBot(BOT_TOKEN);
        this.connection = connection;
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
                await registerUser(msg, command);
                await goToMainPage(this.bot, this.connection, msg);
            } else {

            }
        });

        // button click
        this.bot.on('callback_query', async (callBackData: TelegramBot.CallbackQuery) => {
            if (!callBackData.data || !callBackData.message) return;
        })
    }
}