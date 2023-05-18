export const getTickerInfo = async (tickerName: string) => {
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
