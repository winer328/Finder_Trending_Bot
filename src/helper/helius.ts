import { Helius, TransactionType, WebhookType } from "helius-sdk";
import { HELIUS_API_KEY, WEBHOOK_IP, WEBHOOK_PORT, WEBHOOK_URI } from "../constant";
import { logger } from "./logger";

const helius = new Helius(HELIUS_API_KEY);
const webhookURL = `http://${WEBHOOK_IP}:${WEBHOOK_PORT}${WEBHOOK_URI}`;

export const createWebhook = async (addresses: string[], transactionTypes = [TransactionType.SWAP, TransactionType.TRANSFER]) => {
    if (addresses.length == 0) return { flag: false, message: `You should add more than 1 wallets for create webhook.` }
    try {
        const webhookResult = await helius.createWebhook({
            accountAddresses: addresses,
            transactionTypes: transactionTypes,
            webhookURL: webhookURL,
            webhookType: WebhookType.ENHANCED
        });
        return { flag: true, message: webhookResult.webhookID };
    } catch (error) {
        return { flag: false, message: String(error) };
    }
}

export const editWebhook = async (webhookId: string, addresses: string[], transactionTypes = [TransactionType.SWAP, TransactionType.TRANSFER]) => {
    if (addresses.length == 0) return { flag: false, message: `You should add more than 1 wallets for create webhook.` }
    try {
        const webhookResult = await helius.editWebhook(
            webhookId, { accountAddresses: addresses, transactionTypes: transactionTypes }
        );
        return { flag: true, message: webhookResult.webhookID };
    } catch (error) {
        return { flag: false, message: String(error) };
    }
}

export const appendAddressesInWebhook = async (webhookId: string, addresses: string[]) => {
    if (addresses.length == 0) return { flag: true, message: webhookId };
    try {
        const webhookResult = await helius.appendAddressesToWebhook(webhookId, addresses);
        return { flag: true, message: webhookResult.webhookID, addresses: webhookResult.accountAddresses };
    } catch (error) {
        return { flag: false, message: String(error), addresses: [] };
    }
}

export const removeAddressesInWebhook = async (webhookId: string, addresses: string[]) => {
    const existWebhookData = await getWebhookDataById(webhookId);
    if (!existWebhookData) return { flag: false, message: `Does not exist webhook`, addresses: [] };
    if (addresses.length == 0) return { flag: true, message: webhookId };
    try {
        const webhookResult = await helius.removeAddressesFromWebhook(webhookId, addresses);
        return { flag: true, message: webhookResult.webhookID, addresses: webhookResult.accountAddresses };
    } catch (error) {
        if (existWebhookData.accountAddresses.length == addresses.length) {
            const webhookResult = await helius.deleteWebhook(webhookId);
        }
        return { flag: false, message: String(error), addresses: [] };
    }
}

export const getWebhookDataById = async (webhookId: string) => {
    try {
        const webhookResult = await helius.getWebhookByID(webhookId);
        return webhookResult;
        // {
        //     webhookID: '5692133e-05f4-4c6a-91fd-f1d85dececf7',
        //     project: '8f7355a7-1fe1-4996-a9a4-5106d69feee6',
        //     wallet: 'rexdev328@gmail.com',
        //     webhookURL: 'http://172.92.16.7:8080/webhook',
        //     accountAddresses: [
        //       'FdZA2dvLbBSjZ8sWKNpnBWgY6o3qQPv26mkrDDAyi55L',
        //       '7DY9fEwtNLxQfc3SEUQwWvUou7fVWk8mRwZazXSgpump'
        //     ],
        //     transactionTypes: [ 'SWAP', 'TRANSFER' ],
        //     webhookType: 'enhanced'
        // }
    } catch (error) {
        logger.error(`Error during get webhook data by id. - ${HELIUS_API_KEY}, ${webhookId}`);
        return null;
    }
}
