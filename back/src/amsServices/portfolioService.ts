import { PrismaClient } from '@prisma/client';
import { StockPriceService } from '../extAPIServices/stockPriceService';
import { ExchangeRateService } from '../extAPIServices/exchangeRateService';

const prisma = new PrismaClient();

export class PortfolioService {
  private static instance: PortfolioService;
  private stockPriceService: StockPriceService;
  private exchangeRateService: ExchangeRateService;
  private constructor() {
    this.stockPriceService = StockPriceService.getInstance();
    this.exchangeRateService = ExchangeRateService.getInstance();
  }

  static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  async getAccountPortfolios() {
    try {
      const portfolios = await prisma.portfolio.findMany();
      const exchangeRate = await this.exchangeRateService.getExchangeRate();

      const result = await Promise.all(portfolios.map(async (portfolio) => {
        const stocks = await prisma.stock.findMany({
          where: { account: portfolio.account }
        });

        const stocksWithPrices = await Promise.all(stocks.map(async (stock) => {
          const price = await this.stockPriceService.getStockPrice(stock.symbol, stock.excd);
          
          // 현금성 자산은 수익률 0%
          const returnPct = stock.symbol.endsWith('-USD') || stock.symbol.endsWith('-KRW') ? 0 : (
            stock.avgPrice > 0 ? ((price.currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0
          );

          return {
            ...stock,
            currentPrice: price.currentPrice || 0,
            returnPct,
            changeRate: price.changeRate || 0
          };
        }));

        const investmentAmount = stocksWithPrices.reduce((sum, stock) => {
          // 총 투자금액 계산
          let cost;
          if (stock.symbol.endsWith('-USD')) {
            cost = stock.quantity * stock.currentPrice;  // USD는 수량 * 현재가로 계산
          } else if (stock.symbol.endsWith('-KRW')) {
            cost = stock.quantity * 1;  // KRW은 수량 * 1로 계산
          } else {
            cost = stock.quantity * stock.avgPrice;  // 원화자산투자금액 = 수량 * 평균단가
            if (stock.currency === 'USD') {
              cost *= exchangeRate;  // 달러자산투자금액 = 수량 * 평균단가 * 환율
            }
          }
          return sum + cost;
        }, 0);

        const currentValue = stocksWithPrices.reduce((sum, stock) => {
          // 총 평가금액 계산
          let value = stock.quantity * stock.currentPrice; // 원화자산평가금액 = 수량 * 현재가  
          if (!stock.symbol.endsWith('-USD') && stock.currency === 'USD') {
            value *= exchangeRate;  // 달러자산평가금액 = 수량 * 현재가 * 환율
          }
          return sum + value;
        }, 0);

        const returnRate = investmentAmount > 0 ? ((currentValue - investmentAmount) / investmentAmount) * 100 : 0;

        return {
          account: portfolio.account,
          description: portfolio.description,
          investmentAmount,
          currentValue,
          returnRate,
          stocks: stocksWithPrices
        };
      }));

      return result;
    } catch (error) {
      console.error('Error in getAccountPortfolios:', error);
      throw error;
    }
  }
}