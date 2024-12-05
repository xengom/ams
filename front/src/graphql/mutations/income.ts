import { gql } from '@apollo/client';

export const ADD_INCOME = gql`
  mutation AddIncome($input: AddIncomeInput!) {
    addIncome(input: $input) {
      id
      date
      type
      amount
    }
  }
`;

export const UPDATE_INCOME = gql`
  mutation UpdateIncome($id: Int!, $input: UpdateIncomeInput!) {
    updateIncome(id: $id, input: $input) {
      id
      date
      type
      amount
    }
  }
`;

export const DELETE_INCOME = gql`
  mutation DeleteIncome($id: Int!) {
    deleteIncome(id: $id) {
      id
    }
  }
`;

export const ADD_SALARY = gql`
  mutation AddSalary($input: AddSalaryInput!) {
    addSalary(input: $input) {
      id
      date
      netAmount
      grossAmount
      note
    }
  }
`;

export const UPDATE_SALARY = gql`
  mutation UpdateSalary($id: Int!, $input: UpdateSalaryInput!) {
    updateSalary(id: $id, input: $input) {
      id
      date
      netAmount
      grossAmount
      note
    }
  }
`;

export const DELETE_SALARY = gql`
  mutation DeleteSalary($id: Int!) {
    deleteSalary(id: $id) {
      id
    }
  }
`; 