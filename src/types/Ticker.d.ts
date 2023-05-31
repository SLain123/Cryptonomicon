export interface ITickerResponse {
    data_available_from: number;
    id: number;
    partner_symbol: string;
    symbol: string;
}

export interface ITickerCustome {
    tickerName: string;
    price: number;
}

export type TickerListType = { [key: string]: ITickerResponse };

export type TickerPriceType = { USD: number };

export type updateFucnType = (
    tickerName: string,
    price: number,
    isError: boolean,
) => void;
