export interface Stock {
    id: number;
    currency: string;
    symbol: string;
    name: string;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface Portfolio {
    stocks: Stock[];
    totalValue: number;
}