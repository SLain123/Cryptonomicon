export const getTickerData = async (tickerName: string) => {
    console.log(tickerName);
    const response = await fetch(
        `${process.env.VUE_APP_CRYPTO_URL}data/price?fsym=BTC&tsyms=USD`,
        {
            method: 'POST',
        },
    );
    const result = await response.json();

    return result;
};

export const getAllTickers = async () => {
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
