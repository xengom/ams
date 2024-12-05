import { gql } from '@apollo/client';

export const GET_ASSET_HISTORY = gql`
  query GetAssetHistory($startDate: String, $endDate: String) {
    getAssetHistory(startDate: $startDate, endDate: $endDate) {
      id
      date
      investmentAmount
      currentValue
      returnRate
      totalReturn
      dividendReturn
      pureReturn
    }
  }
`;