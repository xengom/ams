import { gql } from '@apollo/client';

export const GET_PORTFOLIO_SUMMARY = gql`
  query GetPortfolioSummary {
    getPortfolioSummary {
      totalAssets
      totalCost
      totalReturn
      totalReturnAmount
      assetHistory {
        date
        value
        return
        returnPercent
      }
      stockList {
        symbol
        name
        quantity
        currentPrice
        marketValue
        gainLoss
        gainLossPercent
      }
    }
  }
`;

export const GET_ACCOUNT_PORTFOLIOS = gql`
  query GetAccountPortfolios {
    getAccountPortfolios {
      account
      description
      investmentAmount
      currentValue
      returnRate
      exchangeRate
      stocks {
        id
        symbol
        name
        quantity
        currentPrice
        avgPrice
        returnPct
        changeRate
        assetClass
        currency
        targetPct
      }
    }
  }
`;
