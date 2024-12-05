import { gql } from '@apollo/client';

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