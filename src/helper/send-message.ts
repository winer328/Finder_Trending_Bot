import TelegramBot from "node-telegram-bot-api";

export const customSendMessage = async (bot: TelegramBot, msg: TelegramBot.Message, text: string, inlineButtons: { text: string; callback_data: string; }[][] = [], isNew: boolean = true): Promise<boolean> => {
    try {
        if (isNew) {
            await bot.sendMessage(msg.chat.id, text, { reply_markup: { inline_keyboard: inlineButtons }, parse_mode: 'HTML' });
        } else {
            await bot.editMessageText(text, {
                chat_id: msg.chat.id,
                message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: inlineButtons
                },
                parse_mode: 'HTML'
            });
        }
        return true;
    } catch (error) {
        return false;
    }
}

export const customSendMessageWithChatId = async (bot: TelegramBot, chatId: TelegramBot.ChatId, text: string, inlineButtons: { text: string; callback_data: string; }[][] = []): Promise<boolean> => {
    try {
        await bot.sendMessage(chatId, text, { reply_markup: { inline_keyboard: inlineButtons }, parse_mode: 'HTML' });
        return true;
    } catch (error) {
        return false;
    }
}

export const customSendVideoMessage = async (name: string, bot: TelegramBot, msg: TelegramBot.Message, text: string, inlineButtons: { text: string; callback_data: string; }[][] = [], isNew: boolean = true) => {
    try {
        if (isNew) {
            await bot.sendVideo(msg.chat.id, `./images/${name}`, { caption: text, reply_markup: { inline_keyboard: inlineButtons }, parse_mode: 'HTML' });
        } else {
            await bot.editMessageCaption(text, {
                message_id: msg.message_id,
                chat_id: msg.chat.id,
                reply_markup: {
                    inline_keyboard: inlineButtons
                }
            })
        }
        return;
    } catch (error) {
        return;
    }
}

export const customSendPhotoMessage = async (name: string, bot: TelegramBot, msg: TelegramBot.Message, text: string, inlineButtons: { text: string; callback_data: string; }[][] = [], isNew: boolean = true) => {
    try {
        if (isNew) {
            await bot.sendPhoto(msg.chat.id, `./images/${name}`, { caption: text, reply_markup: { inline_keyboard: inlineButtons }, parse_mode: 'HTML' });
        } else {
            await bot.editMessageCaption(text, {
                chat_id: msg.chat.id,
                message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: inlineButtons
                },
                parse_mode: 'HTML'
            });
        }
        return;
    } catch (error) {
        return;
    }
}

export const customSendImageMessageWithChatId = async (bot: TelegramBot, chatId: TelegramBot.ChatId, image: string, text: string, inlineButtons: { text: string; callback_data: string; }[][] = []): Promise<boolean> => {
    try {
        await bot.sendPhoto(chatId, `./images/${image}`, { caption: text, reply_markup: { inline_keyboard: inlineButtons }, parse_mode: 'HTML' });
        return true;
    } catch (error) {
        return false;
    }
}

export const deleteTelegramMessage = (bot: TelegramBot, msg: TelegramBot.Message) => {
    try {
        bot.deleteMessage(msg.chat.id, msg.message_id);
        return;
    } catch (error) {
        return;
    }
}