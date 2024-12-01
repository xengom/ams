import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { ADD_STOCK } from "../../graphql/mutations";
import {
  GET_ACCOUNT_PORTFOLIOS,
  GET_PORTFOLIO_SUMMARY,
  GET_EXCHANGE_RATE,
} from "../../graphql/queries";
import Modal from "../common/Modal";
import Button from "../common/Button";

interface Props {
  account: string;
  onClose: () => void;
}

const AddStockModal: React.FC<Props> = ({ account, onClose }) => {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [currency, setCurrency] = useState("KRW");
  const [assetClass, setAssetClass] = useState("KR_EQUITY");
  const [excd, setExcd] = useState("KRX");

  const isCashSymbol = symbol.endsWith("-USD") || symbol.endsWith("-KRW");
  const isCashAsset = assetClass === "CASH" || isCashSymbol;

  const { data: exchangeRateData } = useQuery(GET_EXCHANGE_RATE);

  const [addStock] = useMutation(ADD_STOCK, {
    refetchQueries: [
      { query: GET_ACCOUNT_PORTFOLIOS },
      { query: GET_PORTFOLIO_SUMMARY },
    ],
    onCompleted: () => {
      toast.success("자산이 추가되었습니다");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add stock:", error);
      toast.error("자산 추가에 실패했습니다");
    },
  });

  React.useEffect(() => {
    if (symbol.endsWith("-USD") && exchangeRateData?.getExchangeRate) {
      setAvgPrice(exchangeRateData.getExchangeRate);
    }
  }, [symbol, exchangeRateData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStock({
      variables: {
        input: {
          symbol,
          name,
          quantity,
          avgPrice: symbol.endsWith("-USD")
            ? exchangeRateData?.getExchangeRate || 0
            : avgPrice,
          currency,
          assetClass,
          account,
          excd: isCashAsset ? null : isCashSymbol ? null : excd,
        },
      },
    });
  };

  React.useEffect(() => {
    if (isCashSymbol) {
      setAssetClass("CASH");
    }
  }, [isCashSymbol]);

  return (
    <Modal onClose={onClose}>
      <Container>
        <Title>새 자산 추가</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>종목코드</Label>
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="예: 005930"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>종목명</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 삼성전자"
              required
            />
          </FormGroup>
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
            <Label>평균단가</Label>
            <Input
              type="number"
              step={currency === "USD" ? 0.01 : 1}
              value={isCashSymbol ? 1 : avgPrice}
              onChange={(e) => setAvgPrice(parseFloat(e.target.value))}
              required={!isCashSymbol}
              disabled={isCashSymbol}
            />
          </FormGroup>
          <FormGroup>
            <Label>통화</Label>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>자산구분</Label>
            <Select
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
            >
              <option value="KR_EQUITY">한국 주식</option>
              <option value="US_EQUITY">미국 주식</option>
              <option value="BOND">채권</option>
              <option value="CASH">현금</option>
              <option value="COMMODITY">원자재</option>
            </Select>
          </FormGroup>
          {!isCashSymbol && (
            <FormGroup>
              <Label>거래소</Label>
              <Select value={excd} onChange={(e) => setExcd(e.target.value)}>
                <option value="KRX">한국거래소</option>
                <option value="NYS">뉴욕</option>
                <option value="NAS">나스닥</option>
                <option value="AMS">아멕스</option>
              </Select>
            </FormGroup>
          )}
          <ButtonGroup>
            <Button type="submit">추가</Button>
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

export default AddStockModal;
