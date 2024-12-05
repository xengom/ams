import { gql } from '@apollo/client';

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
