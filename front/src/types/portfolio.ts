export interface Stock {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  avgPrice: number;
  returnPct: number;
  changeRate: number;
  assetClass: string;
  currency: string;
  targetPct: number;
}

export interface Portfolio {
  account: string;
  description?: string;
  investmentAmount: number;
  currentValue: number;
  returnRate: number;
  stocks: Stock[];
  exchangeRate: number;
}