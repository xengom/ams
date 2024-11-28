import axios from 'axios';
import { PrismaClient } from '@prisma/client';

interface NaverExchangeRateResponse {
  pkid: number;
  count: number;
  country: Array<{
    value: string;
    subValue: string;
    currencyUnit: string;
  }>;
  calculatorMessage: string;
}

const prisma = new PrismaClient();

export class ExchangeRateService {
  private static instance: ExchangeRateService;
  private readonly UPDATE_INTERVAL_MINUTES = 10; 

  static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService();
    }
    return ExchangeRateService.instance;
  }

  private shouldFetchNewRate(lastUpdatedAt: Date | null): boolean {
    const now = new Date();

    // 마지막 업데이트가 없으면 true
    if (!lastUpdatedAt) {
      return true;
    }

    const diffMinutes = (now.getTime() - lastUpdatedAt.getTime()) / (1000 * 60);
    return diffMinutes >= this.UPDATE_INTERVAL_MINUTES;
  }

  async getExchangeRate(): Promise<number> {
    try {
      const latestRate = await prisma.exchangeRate.findFirst({
        orderBy: { updatedAt: 'desc' }
      });

      if (!this.shouldFetchNewRate(latestRate?.updatedAt || null)) {
        console.log('Using cached exchange rate:', latestRate?.rate);
        return latestRate?.rate || 1300;
      }

      console.log('Fetching new exchange rate from Naver...');
      const response = await axios.get<NaverExchangeRateResponse>(
        'https://m.search.naver.com/p/csearch/content/qapirender.nhn',
        {
          params: {
            key: 'calculator',
            pkid: '141',
            q: '환율',
            where: 'm',
            u1: 'keb',
            u6: 'standardUnit',
            u7: '0',
            u3: 'USD',
            u4: 'KRW',
            u8: 'down',
            u2: '1'
          },
          timeout: 5000
        }
      );
      console.log(response.data);
      if (!response.data?.country?.[1]?.value) {
        console.log('Failed to parse Naver response, using fallback rate:', latestRate?.rate);
        return latestRate?.rate || 1300;
      }

      const rate = parseFloat(response.data.country[1].value.replace(',', ''));
      console.log('New exchange rate fetched:', rate);
      
      await prisma.exchangeRate.upsert({
        where: { currency: 'USD' },
        update: { rate },
        create: {
          currency: 'USD',
          rate
        }
      });
      console.log('Exchange rate updated in database:', rate);
      return rate;

    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      const latestRate = await prisma.exchangeRate.findFirst({
        orderBy: { updatedAt: 'desc' }
      });
      console.log('Using fallback rate due to error:', latestRate?.rate);
      return latestRate?.rate || 1300;
    }
  }

  async getCurrentRate(): Promise<number> {
    const rate = await this.getExchangeRate();
    return rate;
  }
} 