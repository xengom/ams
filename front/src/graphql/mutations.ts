import { gql } from '@apollo/client';

export const UPDATE_STOCK = gql`
  mutation UpdateStock($id: Int!, $input: UpdateStockInput!) {
    updateStock(id: $id, input: $input) {
      id
      quantity
      avgPrice
      assetClass
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

export const ADD_DIVIDEND = gql`
  mutation AddDividend($input: AddDividendInput!) {
    addDividend(input: $input) {
      id
      date
      symbol
      currency
      amount
      amountInKRW
    }
  }
`;

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

export const DELETE_DIVIDEND = gql`
  mutation DeleteDividend($id: Int!) {
    deleteDividend(id: $id) {
      id
    }
  }
`;

export const ADD_REGULAR_PAYMENT = gql`
  mutation AddRegularPayment($type: String!, $input: RegularPaymentInput!) {
    addRegularPayment(type: $type, input: $input) {
      id
      detail
      method
      amount
      paymentDate
      currency
    }
  }
`;

export const UPDATE_REGULAR_PAYMENT = gql`
  mutation UpdateRegularPayment($id: ID!, $input: RegularPaymentInput!) {
    updateRegularPayment(id: $id, input: $input) {
      id
      detail
      method
      amount
      paymentDate
      currency
    }
  }
`;

export const DELETE_REGULAR_PAYMENT = gql`
  mutation DeleteRegularPayment($id: ID!) {
    deleteRegularPayment(id: $id)
  }
`;

export const ADD_PLAN_ITEM = gql`
  mutation AddPlanItem($input: PlanItemInput!) {
    addPlanItem(input: $input) {
      id
      category
      detail
      amount
      ratio
      note
    }
  }
`;

export const UPDATE_PLAN_ITEM = gql`
  mutation UpdatePlanItem($id: ID!, $input: PlanItemInput!) {
    updatePlanItem(id: $id, input: $input) {
      id
      category
      detail
      amount
      ratio
      note
    }
  }
`;

export const DELETE_PLAN_ITEM = gql`
  mutation DeletePlanItem($id: ID!) {
    deletePlanItem(id: $id)
  }
`;

export const ADD_TRANSFER_PLAN = gql`
  mutation AddTransferPlan($input: TransferPlanInput!) {
    addTransferPlan(input: $input) {
      id
      item
      transferDate
      amount
      bank
      note
    }
  }
`;

export const UPDATE_TRANSFER_PLAN = gql`
  mutation UpdateTransferPlan($item: String!, $input: UpdateTransferPlanInput!) {
    updateTransferPlan(item: $item, input: $input) {
      id
      item
      transferDate
      amount
      bank
      note
    }
  }
`;

