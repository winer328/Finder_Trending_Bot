import { PublicKey, Connection } from "@solana/web3.js"
import { getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token"

export const getSolBalance = async (connection: Connection, walletAddress: PublicKey): Promise<number> => {
    try {
        return await connection.getBalance(walletAddress);
    } catch (error) {
        return 0;
    }
}
