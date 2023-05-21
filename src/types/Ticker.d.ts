export interface ITickerResponse {
    data_available_from: number;
    id: number;
    partner_symbol: string;
    symbol: string;
}

export interface ITickerCustome {
    id: number;
    name: string;
    usd: number;
    interval?: number;
}

export type TickerListType = { [key: string]: ITickerResponse };

export type TickerPriceType = { USD: number };
