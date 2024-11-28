import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { CREATE_PORTFOLIO } from '../graphql/mutations';
import { GET_ACCOUNT_PORTFOLIOS } from '../graphql/queries';
import Modal from './common/Modal';
import Button from './common/Button';

interface Props {
  onClose: () => void;
}

const AddPortfolioModal: React.FC<Props> = ({ onClose }) => {
  const [account, setAccount] = useState('');
  const [description, setDescription] = useState('');

  const [createPortfolio] = useMutation(CREATE_PORTFOLIO, {
    refetchQueries: [{ query: GET_ACCOUNT_PORTFOLIOS }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPortfolio({
        variables: {
          input: {
            account,
            description
          }
        }
      });
      toast.success('포트폴리오가 추가되었습니다');
      onClose();
    } catch (error) {
      console.error('Failed to create portfolio:', error);
      toast.error('포트폴리오 추가에 실패했습니다');
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Title>새 포트폴리오 추가</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>계좌 종류</Label>
            <Select 
              value={account} 
              onChange={e => setAccount(e.target.value)}
              required
            >
              <option value="">선택하세요</option>
              <option value="KW">키움증권</option>
              <option value="MA">미래에셋증권</option>
              <option value="ISA">ISA</option>
              <option value="KRX">KRX금시장</option>
              <option value="MA_CMA">미래에셋 CMA</option>
              <option value="CASH">현금</option>
              <option value="IRA">연금저축펀드</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>설명 (선택사항)</Label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="포트폴리오에 대한 설명을 입력하세요"
            />
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

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Input = styled.input`
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

export default AddPortfolioModal; 