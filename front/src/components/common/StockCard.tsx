import React from "react";
import styled from "styled-components";
import { formatNumber } from "../../utils/numberFormat";

interface Props {
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  avgPrice: number;
  returnPct: number;
  changeRate: number;
  currency: string;
  assetClass: string;
  targetPct: number;
  totalInvestment: number;
  exchangeRate: number;
  onClick?: () => void;
}

const StockCard: React.FC<Props> = ({
  symbol,
  name,
  quantity,
  currentPrice,
  avgPrice,
  returnPct,
  changeRate,
  currency,
  assetClass,
  targetPct,
  totalInvestment,
  exchangeRate,
  onClick,
}) => {
  const targetAmount = (totalInvestment * targetPct) / 100;
  const targetQuantity =
    currency === "USD"
      ? targetAmount / (currentPrice * exchangeRate)
      : targetAmount / currentPrice;
  const additionalShares = Math.ceil(targetQuantity) - quantity;
  return (
    <Container onClick={onClick}>
      <Header>
        <Symbol>{symbol}</Symbol>
        <Name>{name}</Name>
      </Header>
      <Content>
        <Row>
          <Label>수량</Label>
          <Value>{formatNumber(quantity)}</Value>
        </Row>
        <Row>
          <Label>현재가</Label>
          <Value>
            {currency === "USD" ? "$" : "₩"}
            {formatNumber(currentPrice, currency === "USD" ? 2 : 0)}
          </Value>
        </Row>
        <Row>
          <Label>평균단가</Label>
          <Value>
            {currency === "USD" ? "$" : "₩"}
            {formatNumber(avgPrice, currency === "USD" ? 2 : 0)}
          </Value>
        </Row>
        <Row>
          <Label>수익률</Label>
          <ReturnValue positive={returnPct > 0}>
            {returnPct.toFixed(2)}%
          </ReturnValue>
        </Row>
        <Row>
          <Label>전일대비</Label>
          <ReturnValue positive={changeRate > 0}>
            {changeRate.toFixed(2)}%
          </ReturnValue>
        </Row>
        <Row>
          <Label>목표비율</Label>
          <Value>{targetPct}%</Value>
        </Row>
        <Row>
          <Label>추매 필요 수량</Label>
          <Value>{additionalShares}</Value>
        </Row>
      </Content>
      <Footer>
        <AssetClass>{assetClass}</AssetClass>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  margin-bottom: 15px;
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 14px;
  color: #666;
`;

const Value = styled.span`
  font-weight: 500;
`;

const ReturnValue = styled.span<{ positive: boolean }>`
  font-weight: 500;
  color: ${(props) => (props.positive ? "#e31b23" : "#1261c4")};
`;

const Footer = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const AssetClass = styled.div`
  font-size: 14px;
  color: #666;
  text-align: right;
`;

export default StockCard;
