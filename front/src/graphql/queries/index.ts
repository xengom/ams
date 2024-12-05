import { gql } from '@apollo/client';

// 공통으로 사용되는 환율 관련 쿼리
export const GET_EXCHANGE_RATE = gql`
  query GetExchangeRate {
    getExchangeRate
  }
`;

export const GET_EXCHANGE_RATE_FORCE = gql`
  query GetExchangeRateForce {
    getExchangeRate(force: true)
  }
`;

// 각 도메인별 쿼리 export
export * from './portfolio';
export * from './dividend';
export * from './income';
export * from './plan';
export * from './dashboard';
export * from './history'; 