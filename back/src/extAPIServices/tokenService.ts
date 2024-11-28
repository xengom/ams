import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class TokenService {
  private static instance: TokenService;
  private readonly APP_KEY: string;
  private readonly APP_SECRET: string;
  private readonly TOKEN_EXPIRY_HOURS = 23;
  private isRefreshing = false;

  private constructor() {
    this.APP_KEY = process.env.KOREA_INVESTMENT_APPKEY || '';
    this.APP_SECRET = process.env.KOREA_INVESTMENT_APPSECRET || '';
  }

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  private isTokenExpired(updatedAt: Date): boolean {
    const now = new Date();
    const diffHours = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
    console.log('Token age in hours:', diffHours);
    if (diffHours >= this.TOKEN_EXPIRY_HOURS) {
      console.log('Using existing token');
      return true;
    }
    return false;
  }

  async getToken(): Promise<string> {
    try {
      if (this.isRefreshing) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getToken();
      }

      const existingToken = await prisma.token.findFirst({
        where: { id: 1 }
      });
      
      if (!existingToken || this.isTokenExpired(existingToken.updatedAt)) {
        this.isRefreshing = true;
        try {
          console.log('Getting new token...');
          const response = await axios.post(
            'https://openapi.koreainvestment.com:9443/oauth2/tokenP',
            {
              grant_type: 'client_credentials',
              appkey: this.APP_KEY,
              appsecret: this.APP_SECRET
            }
          );

          const accessToken = response.data?.access_token;
          if (!accessToken) {
            throw new Error('Failed to get access token');
          }

          await prisma.token.upsert({
            where: { id: 1 },
            update: { accessToken },
            create: {
              id: 1,
              accessToken
            }
          });

          return accessToken;
        } finally {
          this.isRefreshing = false;
        }
      }

      return existingToken.accessToken;
    } catch (error) {
      console.error('Error in getToken:', error);
      throw error;
    }
  }
}