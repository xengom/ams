import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { Stock } from "../../types/portfolio";

interface Props {
  stock: Stock;
  totalInvestment: number;
  exchangeRate: number;
  onSave: (values: {
    quantity: number;
    avgPrice: number;
    assetClass: string;
    targetPct: number;
  }) => void;
  onDelete: () => void;
  onClose: () => void;
}

const EditStockModal: React.FC<Props> = ({
  stock,
  totalInvestment,
  exchangeRate,
  onSave,
  onDelete,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(stock.quantity);
  const [avgPrice, setAvgPrice] = useState(stock.avgPrice);
  const [assetClass, setAssetClass] = useState(stock.assetClass);
  const [targetPct, setTargetPct] = useState(stock.targetPct);

  const isCashSymbol =
    stock.symbol.endsWith("-USD") || stock.symbol.endsWith("-KRW");
  const isCashAsset = assetClass === "CASH" || isCashSymbol;

  const targetAmount = (totalInvestment * targetPct) / 100;
  const targetQuantity =
    stock.currency === "USD"
      ? targetAmount / (stock.currentPrice * exchangeRate)
      : targetAmount / stock.currentPrice;
  const additionalShares = Math.ceil(targetQuantity) - quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ quantity, avgPrice, assetClass, targetPct });
  };

  return (
    <Modal onClose={onClose}>
      <Container>
        <Title>주식 정보 수정</Title>
        <StockInfo>
          <Symbol>{stock.symbol}</Symbol>
          <Name>{stock.name}</Name>
        </StockInfo>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>수량</Label>
            <Input
              type="number"
              step={isCashAsset ? "0.01" : "1"}
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>평균단가 ({stock.currency})</Label>
            <Input
              type="number"
              step={stock.currency === "USD" ? 0.01 : 1}
              value={isCashSymbol ? 1 : avgPrice}
              onChange={(e) => setAvgPrice(parseFloat(e.target.value))}
              required={!isCashSymbol}
              disabled={isCashSymbol}
            />
          </FormGroup>
          <FormGroup>
            <Label>자산 구분</Label>
            <Select
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
              required
            >
              <option value="US_EQUITY">미국 주식</option>
              <option value="KR_EQUITY">한국 주식</option>
              <option value="BOND">채권</option>
              <option value="CASH">현금</option>
              <option value="COMMODITY">원자재</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>목표비율 (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={targetPct}
              onChange={(e) => setTargetPct(parseFloat(e.target.value))}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>추가 구매 필요 수량</Label>
            <Value>{additionalShares}주</Value>
          </FormGroup>
          <ButtonGroup>
            <Button type="submit">저장</Button>
            <Button
              type="button"
              onClick={onDelete}
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

const StockInfo = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const Symbol = styled.div`
  font-size: 14px;
  color: #666;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
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

const Value = styled.span`
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

export default EditStockModal;
