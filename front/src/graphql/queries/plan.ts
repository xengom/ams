import { gql } from '@apollo/client';

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