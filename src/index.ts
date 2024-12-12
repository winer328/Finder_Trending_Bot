import { Connection } from "@solana/web3.js";
import { createMongoConnection } from "./helper";
import { RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT } from "./constant";
import { Bot } from "./telegram";
// import { Bot } from "./telegram";

const connection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT
});

const telegramBot = new Bot(connection);

createMongoConnection(() => {
    telegramBot.start();
})