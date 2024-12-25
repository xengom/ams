import axios from 'axios';
import { globalState, updateToken, updateExchangeRate } from '../resolvers';

type apiResponseTypes = string | number;

export class getGlobalStateService {
  private static instance: getGlobalStateService;
  private readonly TOKEN_EXPIRY_HOURS = 24;
  private readonly EXCHANGE_RATE_INTERVAL_MINUTES = 5;
  private readonly APP_KEY: string;
  private readonly APP_SECRET: string;
  private apiPromise: Promise<apiResponseTypes> | null = null;

  private constructor() {
    this.APP_KEY = process.env.KOREA_INVESTMENT_APPKEY!;
    this.APP_SECRET = process.env.KOREA_INVESTMENT_APPSECRET!;
  }

  static getInstance(): getGlobalStateService {
    if (!getGlobalStateService.instance) {
      getGlobalStateService.instance = new getGlobalStateService();
    }
    return getGlobalStateService.instance;
  }

  private shouldFetchNewApi(lastUpdatedAt: Date | null, type: string, force: boolean): boolean {
    const now = new Date();

    if (!lastUpdatedAt || force) {
      return true;
    }

    switch (type) {
      case 'token':
        const diffHours = (now.getTime() - lastUpdatedAt.getTime()) / (1000 * 60 * 60);
        return diffHours >= this.TOKEN_EXPIRY_HOURS;
      case 'exchangeRate':
        const diffMinutes = (now.getTime() - lastUpdatedAt.getTime()) / (1000 * 60);
        return diffMinutes >= this.EXCHANGE_RATE_INTERVAL_MINUTES;
      default:
        return false;
    }
  }

  async setParams(type: string): Promise<{url: string, params: any}> {
    let url;
    let params;
    switch (type) {
      case 'token':
        url = 'https://openapi.koreainvestment.com:9443/oauth2/tokenP';
        params = {
          grant_type: 'client_credentials',
          appkey: this.APP_KEY,
          appsecret: this.APP_SECRET
        };
        break;
      case 'exchangeRate':
        url = 'https://m.search.naver.com/p/csearch/content/qapirender.nhn';
        params = {
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
        };
        break;
      default:
        throw new Error('Invalid type');
    }
    return {url, params};
  }

  async getResponse(type: string): Promise<apiResponseTypes> {
    const { url, params } = await this.setParams(type);
    console.log(params)
    return type === 'exchangeRate' ? 
      await axios.get(url, { params, timeout: 3000 }) : 
      await axios.post(url, params, { timeout: 3000 });
  }

  async parseResponse(type: string, response: any): Promise<apiResponseTypes> {
    switch (type) {
      case 'exchangeRate':
        const rate = response.data?.country?.[1]?.value;
        if (!rate) {
          throw new Error('Failed to parse Naver response');
        }
        return parseFloat(rate.replace(',', ''));
      case 'token':
        const accessToken = response.data?.access_token;
        if (!accessToken) {
          throw new Error('Failed to get access token');
        }
        return accessToken;
      default:
        throw new Error('Failed to parse response');
    }
  }

  async getStates(type: string, force: boolean = false): Promise<apiResponseTypes> {
    let data;
    switch (type) {
      case 'token':
        data = globalState.token;
        break;
      case 'exchangeRate':
        data = globalState.exchangeRate;
        break;
      default:
        throw new Error('Invalid type');
    }
    const { rate, lastUpdatedAt } = data;

    if (!this.shouldFetchNewApi(lastUpdatedAt, type, force)) {
      console.log(`Using cached ${type}: ${type === 'exchangeRate' ? rate : data.accessToken}`);
      return type === 'exchangeRate' ? rate : data.accessToken;
    }

    if (this.apiPromise) {
      console.log('Waiting for ongoing request...');
      return this.apiPromise;
    }

    console.log('Fetching new data from API...');
    this.apiPromise = (async () => {
      try {
        const response = await this.getResponse(type);
        const newState = await this.parseResponse(type, response);
        console.log('New data fetched:', newState);
        
        type === 'exchangeRate' ? updateExchangeRate(newState as number) : updateToken(newState as string);
        return newState;
      } finally {
        this.apiPromise = null;
      }
    })();

    return this.apiPromise;
  }

  startExchangeRateTimer() {
    setInterval(async () => {
      try {
        await this.getStates('exchangeRate');
      } catch (error) {
        console.error('Failed to update exchange rate:', error);
      }
    }, this.EXCHANGE_RATE_INTERVAL_MINUTES * 60 * 1000);
  }

  startTokenTimer() {
    setInterval(async () => {
      try {
        await this.getStates('token');
      } catch (error) {
        console.error('Failed to update token:', error);
      }
    }, this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  }
} 