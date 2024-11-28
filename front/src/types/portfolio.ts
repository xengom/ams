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
}

export interface Portfolio {
  account: string;
  investmentAmount: number;
  currentValue: number;
  returnRate: number;
  stocks: Stock[];
} 