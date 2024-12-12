import TelegramBot from "node-telegram-bot-api"
import bs58 from 'bs58';
import { Keypair, PublicKey } from "@solana/web3.js";
import { UserModel } from "../../database/user";
import { customSendMessageWithChatId } from "../../helper";

export const registerUser = async (msg: TelegramBot.Message, command: string) => {
    const user = await getUserInfo(msg);
    if(user) return;

    const newWallet = new Keypair();
    const newUser = new UserModel();
    newUser.chat_id = msg.chat.id;
    newUser.username = msg.chat.username || '';
    newUser.firstname = msg.chat.first_name || '';
    newUser.lastname = msg.chat.last_name || '';
    newUser.wallet_private_key = bs58.encode(newWallet.secretKey);
    newUser.wallet_public_key = newWallet.publicKey.toString();
    await newUser.save();
    return;
}

export const getUserInfo = async (msg: TelegramBot.Message) => {
    const user = await UserModel.findOne({chat_id: msg.chat.id});
    return user;
}