import axios from 'axios';

const base_url = 'https://api.dexscreener.com/latest/dex/tokens/';

export const getTokenDataByDexscreenerApi = async (mint: string): Promise<any> => {
    const params = {
    };
    const headers = {
        accept: 'application/json'
    };

    try {
        const response = await axios.get(base_url + `${mint}`, { params, headers });
        if (response.data.pairs && response.data.pairs.length > 0) {
            const pair = (response.data.pairs)[0];
            let tokenData = {
                name: pair.baseToken.address == mint? pair.baseToken.name: pair.quoteToken.name,
                symbol: pair.baseToken.address == mint? pair.baseToken.symbol: pair.quoteToken.symbol,
                priceNative: Number(pair.priceNative),
                priceUsd: Number(pair.priceUsd),
                liquidity: Number(pair.liquidity.usd),
                marketCap: Number(pair.marketCap)
            };
            
            return tokenData;
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }
}