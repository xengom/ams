import type { stock } from '@prisma/client';

export interface StockWithPrice extends stock {
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
  changeRate?: number;
}
