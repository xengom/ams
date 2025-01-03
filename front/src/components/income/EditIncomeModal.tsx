import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { UPDATE_INCOME, DELETE_INCOME } from "../../graphql/mutations";
import { GET_INCOMES, GET_SALARY_SUMMARY } from "../../graphql/queries";
import Modal from "../common/Modal";
import Button from "../common/Button";

interface Props {
  income: {
    id: number;
    date: string;
    type: string;
    amount: number;
  };
  onClose: () => void;
}

const EditIncomeModal: React.FC<Props> = ({ income, onClose }) => {
  const [date, setDate] = useState(
    income.date.slice(0, 4) + "-" + income.date.slice(4)
  ); // YYYY-MM
  const [type, setType] = useState(income.type);
  const [amount, setAmount] = useState(income.amount);

  const [updateIncome] = useMutation(UPDATE_INCOME, {
    refetchQueries: [
      { query: GET_INCOMES },
      {
        query: GET_SALARY_SUMMARY,
        variables: { year: new Date().getFullYear() },
      },
    ],
    onCompleted: () => {
      toast.success("입금 내역이 수정되었습니다");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to update income:", error);
      toast.error("입금 내역 수정에 실패했습니다");
    },
  });

  const [deleteIncome] = useMutation(DELETE_INCOME, {
    refetchQueries: [
      { query: GET_INCOMES },
      {
        query: GET_SALARY_SUMMARY,
        variables: { year: new Date().getFullYear() },
      },
    ],
    onCompleted: () => {
      toast.success("입금 내역이 삭제되었습니다");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to delete income:", error);
      toast.error("입금 내역 삭제에 실패했습니다");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateIncome({
      variables: {
        id: income.id,
        input: {
          date: date.replace("-", ""),
          type,
          amount: parseInt(amount.toString()),
        },
      },
    });
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteIncome({
        variables: { id: income.id },
      });
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Title>입금 내역 수정</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>날짜</Label>
            <Input
              type="month"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>내용</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="INVESTMENT">투자</option>
              <option value="PENSION">연금</option>
              <option value="SAVINGS">저축</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>금액</Label>
            <Input
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              required
            />
          </FormGroup>
          <ButtonGroup>
            <Button type="submit">저장</Button>
            <Button
              type="button"
              onClick={handleDelete}
              style={{ background: "#dc3545" }}
            >
              삭제
            </Button>
            <Button type="button" onClick={onClose}>
              취소
            </Button>
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

export default EditIncomeModal;
