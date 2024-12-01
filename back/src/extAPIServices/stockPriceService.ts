import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { globalState } from '../resolvers';

const prisma = new PrismaClient();

interface KoreaStockPriceResponse {
    output: {
      stck_prpr: string;      // 현재가
      prdy_vrss: string;      // 전일 대비
      prdy_vrss_sign: string; // 전일 대비 부호
      prdy_ctrt: string;      // 전일 대비율
      acml_vol: string;       // 거래량
      stck_oprc: string;      // 시가
      stck_hgpr: string;      // 고가
      stck_lwpr: string;      // 저가
      per: string;            // PER
      pbr: string;            // PBR
    };
    rt_cd: string;
    msg_cd: string;
    msg1: string;
  }
  
  interface ForeignStockPriceResponse {
    output: {
      last: string;           // 현재가
      diff: string;           // 전일 대비
      rate: string;           // 등락율
      tvol: string;          // 당일거래량
      base: string;          // 기준가
      pvol: string;          // 전일거래량
      zdiv: string;          // 소수점자리수
    };
    rt_cd: string;
    msg_cd: string;
    msg1: string;
  }
  
  interface StockPriceDetail {
    currentPrice: number;    // 현재가
    change: number;         // 전일 대비
    changeRate: number;     // 전일 대비율
    volume: number;         // 거래량
    openPrice: number;      // 시가
    highPrice: number;      // 고가
    lowPrice: number;       // 저가
    per: number;           // PER
    pbr: number;           // PBR
  }

export class StockPriceService {
  private static instance: StockPriceService;
  private readonly BASE_URL = 'https://openapi.koreainvestment.com:9443';

  static getInstance(): StockPriceService {
    if (!StockPriceService.instance) {
      StockPriceService.instance = new StockPriceService();
    }
    return StockPriceService.instance;
  }

  /**
   * 캐시된 주식 가격 조회
   * @param symbol 주식 심볼
   * @param excd 거래소 코드
   * @returns 주식 가격
   */
  async getStockPriceFromCache(symbol: string, excd: string): Promise<number> {
    const cachedStock = await prisma.stock.findFirst({ where: { symbol } });
    let currentPrice = 0;
    
    if (cachedStock?.currentPrice !== null && cachedStock?.currentPrice !== undefined) {
      currentPrice = cachedStock.currentPrice;
    } else {
      try {
        const priceDetail = await this.getStockPrice(symbol, excd);
        currentPrice = priceDetail.currentPrice;
        
        // DB 업데이트
        if (cachedStock) {
          await prisma.stock.update({
            where: { id: cachedStock.id },
            data: { currentPrice }
          });
        }
      } catch (error) {
        console.error(`Failed to get price for ${symbol}:`, error);
        currentPrice = 0;
      }
    }
    return currentPrice || 0;
  }

  /**
   * 주식 가격 조회
   * @param symbol 주식 심볼
   * @param excd 거래소 코드
   * @returns 주식 가격 상세 정보
   */
  async getStockPrice(symbol: string, excd: string): Promise<StockPriceDetail> {
    const exchangeRate = globalState.exchangeRate.rate;

    if (symbol.endsWith('-KRW') || symbol.endsWith('-USD')) {
      return {
        currentPrice: symbol.endsWith('-USD') ? exchangeRate: 1,
        change: 0,
        changeRate: 0,
        volume: 0,
        openPrice: 1,
        highPrice: 1,
        lowPrice: 1,
        per: 0,
        pbr: 0
      };
    }

    if (excd === 'KRX') {
      return this.getKoreanStockPrice(symbol);
    }
    return this.getForeignStockPrice(symbol, excd);
  }

  /**
   * 국내 주식 가격 조회
   * @param symbol 주식 심볼
   * @returns 주식 가격 상세 정보
   */
  private async getKoreanStockPrice(symbol: string): Promise<StockPriceDetail> {
    try {
      const token = globalState.token.accessToken;
      
      const response = await axios.get<KoreaStockPriceResponse>(
        `${this.BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price`,
        {
          params: {
            fid_cond_mrkt_div_code: "J",
            fid_input_iscd: symbol
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'appkey': process.env.KOREA_INVESTMENT_APPKEY!,
            'appsecret': process.env.KOREA_INVESTMENT_APPSECRET!,
            'tr_id': 'FHKST01010100',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.rt_cd !== '0') {
        throw new Error(`API Error: ${response.data.msg1}`);
      }

      const { output } = response.data;
      
      return {
        currentPrice: parseInt(output.stck_prpr, 10),
        change: parseInt(output.prdy_vrss, 10),
        changeRate: parseFloat(output.prdy_ctrt),
        volume: parseInt(output.acml_vol, 10),
        openPrice: parseInt(output.stck_oprc, 10),
        highPrice: parseInt(output.stck_hgpr, 10),
        lowPrice: parseInt(output.stck_lwpr, 10),
        per: parseFloat(output.per || '0'),
        pbr: parseFloat(output.pbr || '0')
      };
    } catch (error) {
      console.error(`Failed to get Korean stock price for symbol ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * 해외 주식 가격 조회
   * @param symbol 주식 심볼
   * @param excd 거래소 코드
   * @returns 주식 가격 상세 정보
   */
  private async getForeignStockPrice(symbol: string, excd: string): Promise<StockPriceDetail> {
    try {
      const token = globalState.token.accessToken;
      
      const response = await axios.get<ForeignStockPriceResponse>(
        `${this.BASE_URL}/uapi/overseas-price/v1/quotations/price`,
        {
          params: {
            AUTH: "",
            EXCD: excd,
            SYMB: symbol
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'appkey': process.env.KOREA_INVESTMENT_APPKEY!,
            'appsecret': process.env.KOREA_INVESTMENT_APPSECRET!,
            'tr_id': 'HHDFS00000300',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.rt_cd !== '0') {
        throw new Error(`API Error: ${response.data.msg1}`);
      }

      const { output } = response.data;
      const currentPrice = parseFloat(output.last);
      
      return {
        currentPrice,
        change: parseFloat(output.diff),
        changeRate: parseFloat(output.rate.trim()),
        volume: parseInt(output.tvol, 10) || parseInt(output.pvol, 10),
        openPrice: parseFloat(output.base),
        highPrice: currentPrice,
        lowPrice: currentPrice,
        per: 0,
        pbr: 0
      };
    } catch (error) {
      console.error(`Failed to get foreign stock price for symbol ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * 주식 가격 조회
   * @param stocks 주식 심볼과 거래소 코드 배열
   * @returns 주식 가격 레코드
   */
  async getStockPrices(stocks: Array<{ symbol: string, excd: string }>): Promise<Record<string, StockPriceDetail>> {
    try {
      const prices: Record<string, StockPriceDetail> = {};
      
      await Promise.all(
        stocks.map(async ({ symbol, excd }) => {
          try {
            prices[symbol] = await this.getStockPrice(symbol, excd);
          } catch (error) {
            console.error(`Failed to get price for ${symbol}:`, error);
            prices[symbol] = {
              currentPrice: 0,
              change: 0,
              changeRate: 0,
              volume: 0,
              openPrice: 0,
              highPrice: 0,
              lowPrice: 0,
              per: 0,
              pbr: 0
            };
          }
        })
      );

      return prices;
    } catch (error) {
      console.error('Failed to get stock prices:', error);
      throw error;
    }
  }

}