import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { ADD_DIVIDEND } from '../graphql/mutations';
import { GET_DIVIDENDS } from '../graphql/queries';
import Modal from './common/Modal';
import Button from './common/Button';

interface Props {
  onClose: () => void;
}

const AddDividendModal: React.FC<Props> = ({ onClose }) => {
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('KRW');

  const [addDividend] = useMutation(ADD_DIVIDEND, {
    refetchQueries: [{ query: GET_DIVIDENDS }],
    onCompleted: () => {
      toast.success('배당금이 추가되었습니다');
      onClose();
    },
    onError: (error) => {
      console.error('Failed to add dividend:', error);
      toast.error('배당금 추가에 실패했습니다');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDividend({
      variables: {
        input: {
          symbol,
          currency,
          amount
        }
      }
    });
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Title>배당금 추가</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>종목코드</Label>
            <Input
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              placeholder="예: AAPL"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>배당금(세후)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value))}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>통화</Label>
            <Select value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
            </Select>
          </FormGroup>
          <ButtonGroup>
            <Button type="submit">추가</Button>
            <Button type="button" onClick={onClose}>취소</Button>
          </ButtonGroup>
        </Form>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  width: 400px;
  padding: 20px;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

export default AddDividendModal; 