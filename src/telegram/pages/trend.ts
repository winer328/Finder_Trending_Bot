import TelegramBot from "node-telegram-bot-api";
import { customSendMessage, getSolBalance, getTokenDataByDexscreenerApi } from "../../helper";
import { logger } from "../../helper/logger";
import { getUserInfo, registerUser } from "../handler";
import { Bot } from "..";
import { ADMIN_WALLET_PRV_KEY, JITO_TIP, TREND_AMOUNT_1, TREND_AMOUNT_2, TREND_AMOUNT_3, TREND_AMOUNT_4, TREND_TIME_1, TREND_TIME_2, TREND_TIME_3, TREND_TIME_4 } from "../../constant";
import { Keypair, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import bs58 from 'bs58';
import { JitoTransactionExecutor } from "../../jito-executor/jito-rpc-transaction-executor";
import { TrendModel } from "../../database/trend-list";

export const goToTrendPage = async (botClass: Bot, msg: TelegramBot.Message, isNew: boolean = true) => {
    if (!msg.text) return;
    let user = await registerUser(msg);
    logger.info(`User ${user.username} (${user.chat_id}) enter /trending the bot.`);
    const token_data = await getTokenDataByDexscreenerApi(msg.text);
    botClass.token_address = msg.text;
    if (!token_data) {
        await customSendMessage(botClass.bot, msg, `Invalid token address. Please enter a valid token address or /cancel to cancel operation.`);
        return;
    };
    const text = `🎯 Finder Trending List\n\n   Symbol: <a href="https://dexscreener.com/solana/${msg.text}" target="_blank">${token_data.symbol}</a>\n   CA: <code>${msg.text}</code>\n   Liquidity: $${Math.floor(token_data.liquidity)/1000}K\n   Market Cap: $${Math.floor(token_data.marketCap)/1000}K\n\n- Get featured on Finder Trending\n- Boost your token's visibility\n- Increase trading volume\n\n➤ Select Trending Boost below`;
    const inlineButtons = [
        [{ text: `${TREND_AMOUNT_1} SOL for ${TREND_TIME_1} hours`, callback_data: 'setSolAmountForTrend/1' }],
        [{ text: `${TREND_AMOUNT_2} SOL for ${TREND_TIME_2} hours`, callback_data: 'setSolAmountForTrend/2' }],
        [{ text: `${TREND_AMOUNT_3} SOL for ${TREND_TIME_3} hours`, callback_data: 'setSolAmountForTrend/3' }],
        [{ text: `${TREND_AMOUNT_4} SOL for ${TREND_TIME_4} hours`, callback_data: 'setSolAmountForTrend/4' }],
    ];
    await customSendMessage(botClass.bot, msg, text, inlineButtons, isNew);
    return;
}

export const goToPaymentPage = async (botClass: Bot, msg: TelegramBot.Message, isNew: boolean = true) => {
    const user = await getUserInfo(msg); if (!user || !msg.text) return;
    const token_data = await getTokenDataByDexscreenerApi(botClass.token_address);

    const text = `Each Address below is unique to you.\n\nMake sure all infomation submitted is correct, no refunds will be given for entering incorrect address, telegram, or image.\n\nEntered Token: <code>${botClass.token_address}</code> (${token_data.symbol})\n\nSend <code>${botClass.sol_for_trend}</code> SOL to the wallet below for unlock ${botClass.time_for_trend} hours\n\n<code>${user.wallet_public_key}</code>\n\nClick 'Paid' once sent to scan for transaction.`;

    const inlineButtons = [
        [{ text: 'Paid', callback_data: 'finishedPayForTrend' }]
    ];

    await customSendMessage(botClass.bot, msg, text, inlineButtons, isNew);
    return;
}

export const processTrendPayment = async (botClass: Bot, msg: TelegramBot.Message, isNew: boolean = true) => {
    const user = await getUserInfo(msg); if (!user || !msg.text) return;
    const userWallet = Keypair.fromSecretKey(bs58.decode(user.wallet_private_key));
    const solBalance = await getSolBalance(botClass.connection, userWallet.publicKey);

    if (solBalance < botClass.sol_for_trend * 10 ** 9) {
        await customSendMessage(botClass.bot, msg, `Sol balance is ${Math.floor(solBalance/10 ** 7)/100} SOL, you need ${botClass.sol_for_trend} SOL to pay.`);
        return;
    }

    const adminWalletKeyPair = Keypair.fromSecretKey(bs58.decode(ADMIN_WALLET_PRV_KEY));

    const latestBlockhash = await botClass.connection.getLatestBlockhash();
    const sendSolToMainWalletV0 = new TransactionMessage({
        payerKey: adminWalletKeyPair.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [
            SystemProgram.transfer({
                fromPubkey: userWallet.publicKey,
                toPubkey: adminWalletKeyPair.publicKey,
                lamports: botClass.sol_for_trend * 10 ** 9
            })
        ]
    }).compileToV0Message();

    const sendSolTransaction = new VersionedTransaction(sendSolToMainWalletV0);
    sendSolTransaction.sign([adminWalletKeyPair, userWallet]);

    const jitoExecutor = new JitoTransactionExecutor(JITO_TIP, botClass.connection);
    const result = await jitoExecutor.executeAndConfirm([sendSolTransaction], adminWalletKeyPair, latestBlockhash);
    if (result.confirmed) {
        logger.info('Jito Execute confirmed successfully.');
        const newTrend = new TrendModel();
        newTrend.chat_id = user.chat_id;
        newTrend.username = user.username;
        newTrend.firstname = user.firstname;
        newTrend.lastname = user.lastname;
        newTrend.token_address = botClass.token_address;
        newTrend.from_time = Math.floor(new Date().getTime()/1000);
        newTrend.to_time = newTrend.from_time + 3600 * botClass.time_for_trend;
        newTrend.duration = 3600 * botClass.time_for_trend;
        newTrend.is_owner = user.is_owner;
        await newTrend.save();
        await customSendMessage(botClass.bot, msg, `Payment Succeed.\nYou can get real time trend notification in channel now.`);
        return;
    } else {
        await customSendMessage(botClass.bot, msg, `Error during execution.\nPlease type /help to get help.`);
        return;
    }
}