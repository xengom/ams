import { gql } from '@apollo/client';

export const UPDATE_STOCK = gql`
  mutation UpdateStock($id: Int!, $input: UpdateStockInput!) {
    updateStock(id: $id, input: $input) {
      id
      quantity
      avgPrice
      assetClass
      targetPct
    }
  }
`;

export const DELETE_STOCK = gql`
  mutation DeleteStock($id: Int!) {
    deleteStock(id: $id) {
      id
    }
  }
`;

export const CREATE_PORTFOLIO = gql`
  mutation CreatePortfolio($input: CreatePortfolioInput!) {
    createPortfolio(input: $input) {
      account
      description
    }
  }
`;

export const ADD_STOCK = gql`
  mutation AddStock($input: AddStockInput!) {
    addStock(input: $input) {
      id
      symbol
      name
      quantity
      avgPrice
      currency
      assetClass
      account
      excd
    }
  }
`;

export const DELETE_PORTFOLIO = gql`
  mutation DeletePortfolio($account: Account!) {
    deletePortfolio(account: $account) {
      account
    }
  }
`; 