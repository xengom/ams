import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { UPDATE_SALARY, DELETE_SALARY } from "../graphql/mutations";
import { GET_SALARIES, GET_SALARY_SUMMARY } from "../graphql/queries";
import Modal from "./common/Modal";
import Button from "./common/Button";

interface Props {
  salary: {
    id: number;
    date: string;
    netAmount: number;
    grossAmount: number;
    note?: string;
  };
  onClose: () => void;
}

const EditSalaryModal: React.FC<Props> = ({ salary, onClose }) => {
  const [date, setDate] = useState(
    salary.date.slice(0, 4) + "-" + salary.date.slice(4)
  ); // YYYY-MM
  const [netAmount, setNetAmount] = useState(salary.netAmount);
  const [grossAmount, setGrossAmount] = useState(salary.grossAmount);
  const [note, setNote] = useState(salary.note || "");

  const [updateSalary] = useMutation(UPDATE_SALARY, {
    refetchQueries: [
      { query: GET_SALARIES },
      {
        query: GET_SALARY_SUMMARY,
        variables: { year: new Date().getFullYear() },
      },
    ],
    onCompleted: () => {
      toast.success("월급 내역이 수정되었습니다");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to update salary:", error);
      toast.error("월급 내역 수정에 실패했습니다");
    },
  });

  const [deleteSalary] = useMutation(DELETE_SALARY, {
    refetchQueries: [
      { query: GET_SALARIES },
      {
        query: GET_SALARY_SUMMARY,
        variables: { year: new Date().getFullYear() },
      },
    ],
    onCompleted: () => {
      toast.success("월급 내역이 삭제되었습니다");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to delete salary:", error);
      toast.error("월급 내역 삭제에 실패했습니다");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSalary({
      variables: {
        id: salary.id,
        input: {
          date: date.replace("-", ""),
          netAmount: parseInt(netAmount.toString()),
          grossAmount: parseInt(grossAmount.toString()),
          note: note || undefined,
        },
      },
    });
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteSalary({
        variables: { id: salary.id },
      });
    }
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Title>월급 내역 수정</Title>
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
            <Label>세후월급</Label>
            <Input
              type="number"
              min="0"
              step="1"
              value={netAmount}
              onChange={(e) => setNetAmount(parseInt(e.target.value))}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>세전월급</Label>
            <Input
              type="number"
              min="0"
              step="1"
              value={grossAmount}
              onChange={(e) => setGrossAmount(parseInt(e.target.value))}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>비고</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="특이사항이 있다면 입력하세요"
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

export default EditSalaryModal;
