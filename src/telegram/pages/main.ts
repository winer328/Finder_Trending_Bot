import TelegramBot from "node-telegram-bot-api";
import { customSendMessage, getSolBalance } from "../../helper";
import { logger } from "../../helper/logger";
import { getUserInfo } from "../handler";
import { Connection, PublicKey } from "@solana/web3.js";

export const goToMainPage = async (bot:TelegramBot, connection: Connection, msg: TelegramBot.Message, isNew: boolean = true) => {
    const user = await getUserInfo(msg); if (!user) return;
    logger.info(`User ${user.username} (${user.chat_id}) started the bot.`);
    const text = `🎯 Finder Trending List\n\n   📌 type /trending to get started.\n\n   📌 type /notify to get notified when the next slot is available.\n\n   📌 type /unregister tp stop receiving notifications.\n\n\n 👥 Official channel\n\n   📎 https://t.me/+bweET4_9XfY0ZjU0`;
    const inlineButtons = [
    ];
    if (user.is_owner) inlineButtons.push([{ text: ' ⚙️ Settings', callback_data: 'goToSettingPage' }]);
    await customSendMessage(bot, msg, text, inlineButtons, isNew);
    return;
}