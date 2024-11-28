import { PrismaClient, AssetClass, Account, Currency, Exchange, IncomeType } from '@prisma/client';
import { StockPriceService } from './extAPIServices/stockPriceService';
import { PortfolioService } from './amsServices/portfolioService';
import { ExchangeRateService } from './extAPIServices/exchangeRateService';
import { AssetHistoryService } from './amsServices/assetHistoryService';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    /**
     * 주식 현재가 조회
     * @param _ 
     * @param { symbol: string, excd: string } 주식 심볼, 거래소 코드
     * @returns 주식 현재가 정보
     */
    getStockPrice: async (_: any, { symbol, excd }: { symbol: string, excd: string }) => {
      const stockPriceService = StockPriceService.getInstance();
      return await stockPriceService.getStockPrice(symbol, excd);
    },

    /**
     * 주식 현재가 복수 조회
     * @param _ 
     * @param { stocks: Array<{ symbol: string, excd: string }> } 주식 심볼, 거래소 코드 배열
     * @returns [주식 현재가 정보]
     */
    getStockPrices: async (_: any, { stocks }: { stocks: Array<{ symbol: string, excd: string }> }) => {
      const stockPriceService = StockPriceService.getInstance();
      const pricesMap = await stockPriceService.getStockPrices(stocks);
      
      return Object.entries(pricesMap).map(([symbol, price]) => ({
        symbol,
        price
      }));
    },

    /**
     * 환율 조회
     * @returns 환율
     */
    getExchangeRate: async () => {
      const exchangeRateService = ExchangeRateService.getInstance();
      return await exchangeRateService.getExchangeRate();
    },

    /**
     * 포트폴리오 조회
     * @returns 포트폴리오 정보
     */
    getAccountPortfolios: async () => {
      const portfolioService = PortfolioService.getInstance();
      return await portfolioService.getAccountPortfolios();
    },

    /**
     * 배당금 조회
     * @param { year?: number } 연도
     * @returns 배당금 정보
     */
    getDividends: async (_: any, { year }: { year?: number }) => {
      const dividends = await prisma.dividend.findMany({
        orderBy: { date: 'desc' }
      });
      const exchangeRate = await ExchangeRateService.getInstance().getExchangeRate();

      const filteredDividends = year 
        ? dividends.filter(d => new Date(d.date).getFullYear() === year)
        : dividends;

      return filteredDividends.map((dividend) => ({
        ...dividend,
        date: dividend.date.toISOString(),
        amountInKRW: dividend.currency === 'USD' ? Number(dividend.amount) * exchangeRate : dividend.amount
      }));
    },

    /**
     * 배당금 요약 조회
     * @param { year?: number } 연도
     * @returns 배당금 요약 정보(연도)
     */
    getDividendSummary: async (_: any, { year }: { year?: number }) => {
      const dividends = await prisma.dividend.findMany();
      const exchangeRate = await ExchangeRateService.getInstance().getExchangeRate();

      const filteredDividends = year 
        ? dividends.filter(d => new Date(d.date).getFullYear() === year)
        : dividends;

      const totalAmount = filteredDividends.reduce((sum: number, div) => {
        const amountInKRW = div.currency === 'USD' 
          ? Number(div.amount) * exchangeRate 
          : Number(div.amount);
        return sum + amountInKRW;
      }, 0);

      return {
        year: year || 0,
        totalAmount
      };
    },

    /**
     * 투자금액 조회
     * @returns 투자금액 정보
     */
    getIncomes: async () => {
      const incomes = await prisma.income.findMany({
        orderBy: { date: 'desc' }
      });
      return incomes;
    },

    /**
     * 소득 조회
     * @param { year?: number } 연도
     * @returns 소득 정보
     */
    getSalaries: async (_: any, { year }: { year?: number }) => {
      const salaries = await prisma.salary.findMany({
        orderBy: { date: 'desc' }
      });

      if (year) {
        return salaries.filter(salary => salary.date.startsWith(year.toString()));
      }
      return salaries;
    },

    /**
     * 소득 요약 조회
     * @param { year?: number } 연도
     * @returns 소득 요약 정보
     */
    getSalarySummary: async (_: any, { year }: { year?: number }) => {
      const salaries = await prisma.salary.findMany();
      const incomes = await prisma.income.findMany();

      const totalInvestment = incomes.reduce((sum, income) => sum + income.amount, 0);
      const allNetAmount = salaries.reduce((sum, salary) => sum + salary.netAmount, 0);

      const yearSalaries = year 
        ? salaries.filter(salary => salary.date.startsWith(year.toString()))
        : salaries;

      const totalNetAmount = yearSalaries.reduce((sum, salary) => sum + salary.netAmount, 0);
      const totalGrossAmount = yearSalaries.reduce((sum, salary) => sum + salary.grossAmount, 0);

      return {
        year,
        totalNetAmount,
        totalGrossAmount,
        investmentRatio: allNetAmount > 0 ? (totalInvestment / allNetAmount) * 100 : 0
      };
    },

    /**
     * 자산 이력 조회
     * @param { startDate?: string, endDate?: string } 시작일, 종료일
     * @returns 자산 이력 정보
     */
    getAssetHistory: async (_: any, { startDate, endDate }: { startDate?: string; endDate?: string }) => {
      const assetHistoryService = AssetHistoryService.getInstance();
      const histories = await assetHistoryService.getHistory(startDate, endDate);
      return histories.map(history => ({
        ...history,
        date: history.date.toISOString()
      }));
    },

    getDashboardData: async () => {
      const portfolioService = PortfolioService.getInstance();
      const assetHistoryService = AssetHistoryService.getInstance();
      const exchangeRateService = ExchangeRateService.getInstance();
      const stockPriceService = StockPriceService.getInstance();

      const portfolios = await portfolioService.getAccountPortfolios();
      const currentValue = portfolios.reduce((sum, p) => sum + p.currentValue, 0);

      // Income에서 총 투자금액 계산
      const incomes = await prisma.income.findMany();
      const investmentAmount = incomes.reduce((sum, income) => sum + income.amount, 0);

      const returnRate = investmentAmount > 0 ? ((currentValue - investmentAmount) / investmentAmount) * 100 : 0;
      const totalReturn = currentValue - investmentAmount;

      const history = await assetHistoryService.getHistory();

      // AssetHistory에 value 필드 추가
      const historyWithValue = history.map(h => ({
        ...h,
        date: h.date.toISOString(),
        value: h.currentValue  // value 필드를 currentValue로 설정
      }));

      // 주식 정보 조회 및 현재가 업데이트
      const stocks = await prisma.stock.findMany();
      const stocksWithPrice = await Promise.all(stocks.map(async (stock) => ({
        ...stock,
        currentPrice: await stockPriceService.getStockPriceFromCache(stock.symbol, stock.excd)
      })));
      // 환율
      const exchangeRate = await exchangeRateService.getExchangeRate();

      // 자산군별 그룹핑 (계층형)
      const assetClassGroups = Object.values(AssetClass)
        .map(assetClass => {
          const stocks = stocksWithPrice.filter(stock => stock.assetClass === assetClass);
          const groupSum = stocks.reduce((sum, stock) => {
            const value = stock.assetClass === AssetClass.CASH
              ? (stock.currency === Currency.USD ? stock.quantity * exchangeRate : stock.quantity)
              : (stock.currency === Currency.USD ? Number(stock.currentPrice) * exchangeRate * stock.quantity : Number(stock.currentPrice) * stock.quantity);
            return sum + value;
          }, 0);

          // 값이 0인 그룹은 제외
          if (groupSum === 0) return null;

          const group = {
            id: assetClass,
            name: assetClass,
            value: groupSum,
            children: stocks.map(stock => ({
              id: `${assetClass}-${stock.symbol}`,
              name: stock.name,
              value: stock.assetClass === AssetClass.CASH
                ? (stock.currency === Currency.USD ? stock.quantity * exchangeRate : stock.quantity)
                : (stock.currency === Currency.USD ? Number(stock.currentPrice) * exchangeRate * stock.quantity : Number(stock.currentPrice) * stock.quantity),
              parent: assetClass
            }))
          };
          return group;
        })
        .filter(group => group !== null);


      // 계좌별 그룹핑
      const accountGroups = Object.values(Account)
        .map(account => {
          const stocks = stocksWithPrice.filter(stock => stock.account === account);
          const groupSum = stocks.reduce((sum, stock) => {
            const value = stock.assetClass === AssetClass.CASH
              ? (stock.currency === Currency.USD ? stock.quantity * exchangeRate : stock.quantity)
              : (stock.currency === Currency.USD ? Number(stock.currentPrice) * exchangeRate * stock.quantity : Number(stock.currentPrice) * stock.quantity);
            return sum + value;
          }, 0);

          // 값이 0인 그룹은 제외
          if (groupSum === 0) return null;

          const group = {
            id: account,
            name: account,
            value: groupSum,
            children: stocks.map(stock => ({
              id: `${account}-${stock.symbol}`,
              name: stock.name,
              value: stock.assetClass === AssetClass.CASH
                ? (stock.currency === Currency.USD ? stock.quantity * exchangeRate : stock.quantity)
                : (stock.currency === Currency.USD ? Number(stock.currentPrice) * exchangeRate * stock.quantity : Number(stock.currentPrice)   * stock.quantity),
              parent: account
            }))
          };
          return group;
        })
        .filter(group => group !== null);


      return {
        currentValue,
        investmentAmount,
        returnRate,
        totalReturn,
        exchangeRate,
        history: historyWithValue,
        assetClassGroups,
        accountGroups
      };
    }
  },
  Mutation: {
    /**
     * 주식 수정
     * @param { id: number, input: { quantity: number, avgPrice: number, assetClass: string } } 주식 id, 수량, 평균가, 자산 클래스
     * @returns 주식 정보
     */
    updateStock: async (_: any, { id, input }: { id: number; input: { quantity: number; avgPrice: number; assetClass: string } }) => {
      return await prisma.stock.update({
        where: { id },
        data: {
          quantity: input.quantity,
          avgPrice: input.avgPrice,
          assetClass: input.assetClass as AssetClass
        }
      });
    },

    /**
     * 주식 삭제
     * @param { id: number } 주식 id
     * @returns 주식 정보
     */
    deleteStock: async (_: any, { id }: { id: number }) => {
      return await prisma.stock.delete({
        where: { id }
      });
    },

    /**
     * 포트폴리오 생성
     * @param { account: Account, description?: string } 계좌, 설명
     * @returns 포트폴리오 정보
     */
    createPortfolio: async (_: any, { input }: { input: { account: Account; description?: string } }) => {
      return await prisma.portfolio.create({
        data: {
          account: input.account,
          description: input.description
        }
      });
    },

    /**
     * 주식 추가
     * @param { input: { symbol: string; name: string; quantity: number; avgPrice: number; currency: Currency; assetClass: AssetClass; account: Account; excd: Exchange } } 주식 심볼, 이름, 수량, 평균가, 화폐, 자산 클래스, 계좌, 거래소 코드
     * @returns 주식 정보
     */
    addStock: async (_: any, { input }: { input: { 
      symbol: string;
      name: string;
      quantity: number;
      avgPrice: number;
      currency: Currency;
      assetClass: AssetClass;
      account: Account;
      excd: Exchange;
    }}) => {
      return await prisma.stock.create({
        data: {
          symbol: input.symbol,
          name: input.name,
          quantity: input.quantity,
          avgPrice: input.avgPrice,
          currency: input.currency,
          assetClass: input.assetClass,
          account: input.account,
          excd: input.excd
        }
      });
    },

    /**
     * 포트폴리오 삭제
     * @param { account: Account } 계좌
     * @returns 포트폴리오 정보
     */
    deletePortfolio: async (_: any, { account }: { account: string }) => {
      const portfolio = await prisma.portfolio.findFirst({
        where: { account: account as Account }
      });

      if (!portfolio) throw new Error('Portfolio not found');

      await prisma.stock.deleteMany({
        where: { account: account as Account }
      });

      return await prisma.portfolio.delete({
        where: { id: portfolio.id }
      });
    },

    /**
     * 배당금 추가
     * @param { input: { symbol: string; currency: Currency; amount: number } } 주식 심볼, 화폐, 금액
     * @returns 배당금 정보
     */
    addDividend: async (_: any, { input }: { input: { symbol: string; currency: Currency; amount: number } }) => {
      return await prisma.dividend.create({
        data: {
          symbol: input.symbol,
          currency: input.currency,
          amount: input.amount
        }
      });
    },

    /**
     * 배당금 삭제
     * @param { id: number } 배당금 id
     * @returns 배당금 정보
     */
    deleteDividend: async (_: any, { id }: { id: number }) => {
      return await prisma.dividend.delete({
        where: { id }
      });
    },

    /**
     * 투자금액 추가
     * @param { input: { date: string; type: string; amount: number } } 날짜, 유형, 금액
     * @returns 투자금액 정보
     */
    addIncome: async (_: any, { input }: { input: { date: string; type: string; amount: number } }) => {
      return await prisma.income.create({
        data: {
          date: input.date,
          type: input.type as IncomeType,
          amount: input.amount
        }
      });
    },

    /**
     * 투자금액 수정
     * @param { id: number; input: { date: string; type: string; amount: number } } 투자금액 id, 날짜, 유형, 금액
     * @returns 투자금액 정보
     */
    updateIncome: async (_: any, { id, input }: { id: number; input: { date: string; type: string; amount: number } }) => {
      return await prisma.income.update({
        where: { id },
        data: {
          date: input.date,
          type: input.type as IncomeType,
          amount: input.amount
        }
      });
    },

    /**
     * 투자금액 삭제
     * @param { id: number } 투자금액 id
     * @returns 투자금액 정보
     */
    deleteIncome: async (_: any, { id }: { id: number }) => {
      return await prisma.income.delete({
        where: { id }
      });
    },

    /**
     * 소득 추가
     * @param { input: { date: string; netAmount: number; grossAmount: number; note?: string } } 날짜, 순수액, 총액, 비고
     * @returns 소득 정보
     */
    addSalary: async (_: any, { input }: { input: { date: string; netAmount: number; grossAmount: number; note?: string } }) => {
      return await prisma.salary.create({
        data: {
          date: input.date,
          netAmount: input.netAmount,
          grossAmount: input.grossAmount,
          note: input.note
        }
      });
    },

    /**
     * 소득 수정
     * @param { id: number; input: { date: string; netAmount: number; grossAmount: number; note?: string } } 소득 id, 날짜, 순수액, 총액, 비고
     * @returns 소득 정보
     */
    updateSalary: async (_: any, { id, input }: { id: number; input: { date: string; netAmount: number; grossAmount: number; note?: string } }) => {
      return await prisma.salary.update({
        where: { id },
        data: {
          date: input.date,
          netAmount: input.netAmount,
          grossAmount: input.grossAmount,
          note: input.note
        }
      });
    },

    /**
     * 소득 삭제
     * @param { id: number } 소득 id
     * @returns 소득 정보
     */
    deleteSalary: async (_: any, { id }: { id: number }) => {
      return await prisma.salary.delete({
        where: { id }
      });
    },
  }
};