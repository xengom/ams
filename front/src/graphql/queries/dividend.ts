import { gql } from '@apollo/client';

export const GET_DIVIDENDS = gql`
  query GetDividends($year: Int) {
    getDividends(year: $year) {
      id
      date
      symbol
      currency
      amount
      amountInKRW
    }
  }
`;

export const GET_DIVIDEND_SUMMARY = gql`
  query GetDividendSummary($year: Int) {
    getDividendSummary(year: $year) {
      year
      totalAmount
    }
  }
`;
