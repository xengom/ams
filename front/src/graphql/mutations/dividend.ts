import { gql } from '@apollo/client';

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

export const DELETE_DIVIDEND = gql`
  mutation DeleteDividend($id: Int!) {
    deleteDividend(id: $id) {
      id
    }
  }
`; 