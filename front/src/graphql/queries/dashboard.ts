import { gql } from '@apollo/client';

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
  }
`;
