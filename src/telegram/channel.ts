import { Connection } from "@solana/web3.js";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import { customSendMessage, customSendMessageWithChatId, getTokenDataByDexscreenerApi } from "../helper";
import { BOT_NAME, CHANNEL_ID } from "../constant";
import { TrendModel } from "../database/trend-list";


export class ChannelBot {
    bot: TelegramBot;
    connection: Connection;

    constructor(bot: TelegramBot, connection: Connection) {
        this.bot = bot;
        this.connection = connection;
    }

    start = async () => {
        await this.startChannelAction();
    }

    startChannelAction = async () => {
        let content = '';
        content = fs.readFileSync("./sent_message.txt", 'utf8');
        const trendList = await TrendModel.find();
        let tokenList = [];
        for (let trendData of trendList) {
            const tokenData = await getTokenDataByDexscreenerApi(trendData.token_address);
            tokenList.push({
                tokenName: tokenData.name,
                tokenAddress: trendData.token_address,
                marketCap: tokenData.marketCap,
                liquidity: tokenData.liquidity
            });
        }
        tokenList.sort((a, b) => b.marketCap - a.marketCap);
        let text = `Finder Trending\n`;
        if (tokenList.length > 0) {
            for (let index in tokenList) {
                const tokenMarketCap = tokenList[index].marketCap/1000 > 1000? `${Math.floor(tokenList[index].marketCap/10000)/100}M`: `${Math.floor(tokenList[index].marketCap/10)/100}K`;
                const tokenLiquidity = tokenList[index].liquidity/1000 > 1000? `${Math.floor(tokenList[index].liquidity/10000)/100}M`: `${Math.floor(tokenList[index].liquidity/10)/100}K`;
                switch (index) {
                    case '0':
                        text += `\n🥇 <a href="https://dexscreener.com/solana/${tokenList[index].tokenAddress}" target="_blank">${tokenList[index].tokenName}</a> | ${tokenMarketCap} | ${tokenLiquidity}`;
                        break;
                    
                    case '1':
                        text += `\n🥈 <a href="https://dexscreener.com/solana/${tokenList[index].tokenAddress}" target="_blank">${tokenList[index].tokenName}</a> | ${tokenMarketCap} | ${tokenLiquidity}`;
                        break;

                    case '2':
                        text += `\n🥉 <a href="https://dexscreener.com/solana/${tokenList[index].tokenAddress}" target="_blank">${tokenList[index].tokenName}</a> | ${tokenMarketCap} | ${tokenLiquidity}\n`;
                        break;
                    
                    default:
                        text += `\n ${Number(index)+1}. <a href="https://dexscreener.com/solana/${tokenList[index].tokenAddress}" target="_blank">${tokenList[index].tokenName}</a> | ${tokenMarketCap} | ${tokenLiquidity}`;
                        break;
                }
            }
        } else {
            text += `\nThere isn't any token in token list.\nYou can start the trend list bot and add your token to trend list.\n\n${BOT_NAME}`;
        }
        const inlineButtons = [
            [{ text: '♻️ Refresh Trend List', callback_data: 'goToRefreshTrendList' }]
        ]
        if (content.length == 0) {
            const sentMessage = await customSendMessageWithChatId(this.bot, CHANNEL_ID, text, inlineButtons); if (!sentMessage) return;
            await this.bot.pinChatMessage(sentMessage.chat.id, sentMessage.message_id);
            content = JSON.stringify(sentMessage);
            fs.writeFileSync("./sent_message.txt", content);
        } else await customSendMessage(this.bot, JSON.parse(content), text, inlineButtons, false);
    }

    refreshTrendList = async () => {
        let content = '';
        content = fs.readFileSync("./sent_message.txt", 'utf8');
        const trendList = await TrendModel.find();
        let tokenList = [];
        for (let trendData of trendList) {
            const tokenData = await getTokenDataByDexscreenerApi(trendData.token_address);
            tokenList.push({
                tokenName: tokenData.name,
                tokenAddress: trendData.token_address,
                marketCap: tokenData.marketCap,
                liquidity: tokenData.liquidity
            });
        }
        tokenList.sort((a, b) => b.marketCap - a.marketCap);
        const inlineButtons = [
            [{ text: '♻️ Refresh Trend List', callback_data: 'goToRefreshTrendList' }]
        ]
        let text = `Finder Trending\n`;
        if (tokenList.length > 0) {
            for (let index in tokenList) {
                const tokenMarketCap = tokenList[index].marketCap/1000 > 1000? `${Math.floor(tokenList[index].marketCap/10000)/100}M`: `${Math.floor(tokenList[index].marketCap/10)/100}K`;
                const tokenLiquidity = tokenList[index].liquidity/1000 > 1000? `${Math.floor(tokenList[index].liquidity/10000)/100}M`: `${Math.floor(tokenList[index].liquidity/10)/100}K`;
                switch (index) {
                    case '0':
                        text += `\n🥇 <a href="https://dexscreener.com/solana/${tokenList[index].tokenAddress}" target="_blank">${tokenList[index].tokenName}</a> | ${tokenMarketCap} | ${tokenLiquidity}`;
                        break;
                    
                    case '1':
                        text += `\n🥈 <a href="https://dexscreener.com/solana/${tokenList[index].tokenAddress}" target="_blank">${tokenList[index].tokenName}</a> | ${tokenMarketCap} | ${tokenLiquidity}`;
                        break;

                    case '2':
                        text += `\n🥉 <a href="https://dexscreener.com/solana/${tokenList[index].tokenAddress}" target="_blank">${tokenList[index].tokenName}</a> | ${tokenMarketCap} | ${tokenLiquidity}\n`;
                        break;
                    
                    default:
                        text += `\n ${Number(index)+1}. <a href="https://dexscreener.com/solana/${tokenList[index].tokenAddress}" target="_blank">${tokenList[index].tokenName}</a> | ${tokenMarketCap} | ${tokenLiquidity}`;
                        break;
                }
            }
        } else {
            text += `\nThere isn't any token in token list.\nYou can start the trend list bot and add your token to trend list.\n\n${BOT_NAME}`;
        }
        await customSendMessage(this.bot, JSON.parse(content), text, inlineButtons, false);
    }
}