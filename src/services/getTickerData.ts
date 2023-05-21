import { TickerListType } from '@/types/Ticker';

export const getTickerPrice = async (tickerName: string) => {
    const response = await fetch(
        `${process.env.VUE_APP_CRYPTO_URL}data/price?fsym=${tickerName}&tsyms=USD`,
        {
            method: 'POST',
        },
    );
    const result = await response.json();
    
    return result;
};

export const getAllTickers = async (): Promise<TickerListType> => {
    const response = await fetch(
        `${process.env.VUE_APP_CRYPTO_URL}data/blockchain/list`,
        {
            headers: {
                Authorization: `Apikey ${process.env.VUE_APP_API_KEY}`,
                'Content-Type': 'application/json',
            },
        },
    );
    const result = await response.json();

    return result.Data;
};
