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

export const GET_ACCOUNT_PORTFOLIOS = gql`
  query GetAccountPortfolios {
    getAccountPortfolios {
      account
      description
      investmentAmount
      currentValue
      returnRate
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
      }
    }
  }
`;

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

export const GET_INCOMES = gql`
  query GetIncomes {
    getIncomes {
      id
      date
      type
      amount
    }
  }
`;

export const GET_SALARIES = gql`
  query GetSalaries($year: Int) {
    getSalaries(year: $year) {
      id
      date
      netAmount
      grossAmount
      note
    }
  }
`;

export const GET_SALARY_SUMMARY = gql`
  query GetSalarySummary($year: Int) {
    getSalarySummary(year: $year) {
      year
      totalNetAmount
      totalGrossAmount
      investmentRatio
    }
  }
`;

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

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    getDashboardData {
      currentValue
      investmentAmount
      returnRate
      totalReturn
      exchangeRate
      history {
        date
        investmentAmount
        currentValue
        returnRate
        totalReturn
        dividendReturn
        value
      }
      assetClassGroups {
        id
        name
        value
        children {
          id
          name
          value
          parent
        }
      }
      accountGroups {
        id
        name
        value
        children {
          id
          name
          value
          parent
        }
      }
    }
  }`

export const GET_LATEST_SALARY = gql`
  query GetLatestSalary {
    getLatestSalary
  }
`;

export const GET_MONTHLY_PAYMENTS = gql`
  query GetMonthlyPayments {
    getMonthlyPayments {
      id
      detail
      method
      amount
      paymentDate
      currency
    }
  }
`;

export const GET_YEARLY_PAYMENTS = gql`
  query GetYearlyPayments {
    getYearlyPayments {
      id
      detail
      method
      amount
      paymentDate
      currency
    }
  }
`;

export const GET_PLAN_ITEMS = gql`
  query GetPlanItems {
    getPlanItems {
      id
      category
      detail
      amount
      ratio
      note
    }
  }
`;

export const GET_TRANSFER_PLANS = gql`
  query GetTransferPlans {
    getTransferPlans {
      id
      item
      transferDate
      amount
      bank
      note
    }
  }
`;