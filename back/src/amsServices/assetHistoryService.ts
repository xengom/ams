import { PrismaClient } from '@prisma/client';
import { PortfolioService } from './portfolioService';
import { globalState } from '../resolvers';
import cron from 'node-cron';

const prisma = new PrismaClient();

export class AssetHistoryService {
  private static instance: AssetHistoryService;
  private portfolioService: PortfolioService;

  private constructor() {
    this.portfolioService = PortfolioService.getInstance();
    this.initScheduler();
  }

  static getInstance(): AssetHistoryService {
    if (!AssetHistoryService.instance) {
      AssetHistoryService.instance = new AssetHistoryService();
    }
    return AssetHistoryService.instance;
  }

  private initScheduler() {
    // 매일 오전 5시에 실행
    cron.schedule('0 5 * * *', async () => {
      await this.createDailyHistory();
    });
  }

  private async createDailyHistory() {
    try {
      const portfolios = await this.portfolioService.getAccountPortfolios();
      const today = new Date();

      // 이미 오늘 데이터가 있는지 확인
      const existingHistory = await prisma.assetHistory.findFirst({
        where: {
          date: {
            gte: new Date(today.setHours(0, 0, 0, 0)),
            lt: new Date(today.setHours(23, 59, 59, 999))
          }
        }
      });

      if (existingHistory) return;

      // Income에서 총 투자금액 계산
      const incomes = await prisma.income.findMany();
      const investmentAmount = incomes.reduce((sum, income) => sum + income.amount, 0);

      // 총 평가금액 계산
      const currentValue = portfolios.reduce((sum, p) => sum + p.currentValue, 0);

      // 배당금 계산
      const dividendReturn = await this.calculateTotalDividendReturn();

      // 수익률 계산
      const returnRate = investmentAmount > 0 ? ((currentValue - investmentAmount) / investmentAmount) * 100 : 0;
      const totalReturn = currentValue - investmentAmount;
      const pureReturn = totalReturn - dividendReturn;

      // 히스토리 저장
      await prisma.assetHistory.create({
        data: {
          investmentAmount,
          currentValue,
          returnRate,
          totalReturn,
          dividendReturn,
          pureReturn
        }
      });
    } catch (error) {
      console.error('Failed to create daily history:', error);
    }
  }

  private async calculateTotalDividendReturn(): Promise<number> {
    const dividends = await prisma.dividend.findMany();
    return dividends.reduce((sum: number, div) => {
        const amountInKRW = div.currency === 'USD' 
          ? Number(div.amount) * globalState.exchangeRate.rate
          : Number(div.amount);
        return sum + amountInKRW;
      }, 0);
  }

  async getHistory(startDate?: string, endDate?: string) {
    const where = {};
    if (startDate) {
      where['date'] = {
        gte: new Date(startDate)
      };
    }
    if (endDate) {
      where['date'] = {
        ...where['date'],
        lte: new Date(endDate)
      };
    }

    return await prisma.assetHistory.findMany({
      where,
      orderBy: { date: 'desc' }
    });
  }
} 