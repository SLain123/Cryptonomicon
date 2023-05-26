import { TickerListType } from '@/types/Ticker';

const headers = {
    Authorization: `Apikey ${process.env.VUE_APP_API_KEY}`,
    'Content-Type': 'application/json',
};

export const getTickerPrice = async (tickerName: string) => {
    const response = await fetch(
        `${process.env.VUE_APP_CRYPTO_URL}data/price?fsym=${tickerName}&tsyms=USD`,
        {
            headers,
        },
    );
    const result = await response.json();

    return result;
};

export const getAllTickers = async (): Promise<TickerListType> => {
    const response = await fetch(
        `${process.env.VUE_APP_CRYPTO_URL}data/blockchain/list`,
        {
            headers,
        },
    );
    const result = await response.json();

    return result.Data;
};
