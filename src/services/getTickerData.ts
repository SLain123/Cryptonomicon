import { TickerListType, updateFucnType } from '@/types/Ticker';

const headers = {
    Authorization: `Apikey ${process.env.VUE_APP_API_KEY}`,
    'Content-Type': 'application/json',
};

const socket = new WebSocket(
    `wss://streamer.cryptocompare.com/v2?api_key=${process.env.VUE_APP_API_KEY}`,
);

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

const sendMessage = (tickerName: string, subAction = 'add') => {
    const action = subAction === 'add' ? 'SubAdd' : 'SubRemove';
    const subs = [`5~CCCAGG~${tickerName}~USD`];

    socket.send(
        JSON.stringify({
            action,
            subs,
        }),
    );
};

export const subscribeToUpdate = (tickerName: string, cb: updateFucnType) => {
    if (socket.readyState === WebSocket.OPEN) {
        sendMessage(tickerName, 'add');
    } else {
        socket.addEventListener('open', () => sendMessage(tickerName, 'add'));
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event?.data);
        const { TYPE: type, PRICE: price, FROMSYMBOL: tickerName } = message;
        const returnData = type === '5' || type === '500';
        const isError = type === '500';

        returnData && cb(tickerName, price, isError);
    };
};

export const unSubscribeToUpdate = (tickerName: string) =>
    sendMessage(tickerName, 'remove');
