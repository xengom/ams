import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { GET_ACCOUNT_PORTFOLIOS } from "../graphql/queries";
import { formatNumber } from "../utils/numberFormat";
import PortfolioDetail from "../components/PortfolioDetail";
import AddPortfolioModal from "../components/AddPortfolioModal";

interface Stock {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  avgPrice: number;
  returnPct: number;
  changeRate: number;
  assetClass: string;
  currency: string;
}

interface Portfolio {
  account: string;
  description?: string;
  investmentAmount: number;
  currentValue: number;
  returnRate: number;
  stocks: Stock[];
}

const Portfolios = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_ACCOUNT_PORTFOLIOS);

  const handleRefresh = () => {
    refetch();
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <Container>
      <Header>
        <Title>포트폴리오 관리</Title>
        <ButtonGroup>
          <Button onClick={handleRefresh}>
            <RefreshIcon>🔄</RefreshIcon>
            새로고침
          </Button>
          <AddButton onClick={() => setIsAddModalOpen(true)}>
            + 포트폴리오 추가
          </AddButton>
        </ButtonGroup>
      </Header>

      <PortfolioGrid>
        {data?.getAccountPortfolios?.length ? (
          data.getAccountPortfolios.map((portfolio: Portfolio) => (
            <PortfolioCard
              key={portfolio.account}
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              <AccountName>
                {portfolio.description || portfolio.account}
              </AccountName>
              <ValueRow>
                <Label>투자금액</Label>
                <Value>₩{formatNumber(portfolio.investmentAmount)}</Value>
              </ValueRow>
              <ValueRow>
                <Label>평가금액</Label>
                <Value>₩{formatNumber(portfolio.currentValue)}</Value>
              </ValueRow>
              <ReturnRate positive={portfolio.returnRate > 0}>
                {portfolio.returnRate.toFixed(2)}%
              </ReturnRate>
            </PortfolioCard>
          ))
        ) : (
          <EmptyState>
            <p>등록된 포트폴리오가 없습니다.</p>
            <AddButton onClick={() => setIsAddModalOpen(true)}>
              포트폴리오 추가하기
            </AddButton>
          </EmptyState>
        )}
      </PortfolioGrid>

      {selectedPortfolio && (
        <PortfolioDetail
          portfolio={selectedPortfolio}
          onClose={() => setSelectedPortfolio(null)}
        />
      )}

      {isAddModalOpen && (
        <AddPortfolioModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const PortfolioCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AccountName = styled.h2`
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
`;

const ValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  color: #666;
`;

const Value = styled.span`
  font-weight: 500;
`;

const ReturnRate = styled.div<{ positive: boolean }>`
  text-align: right;
  font-weight: bold;
  font-size: 18px;
  color: ${(props) => (props.positive ? "#e31b23" : "#1261c4")};
  margin-top: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #333;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1557b0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  grid-column: 1 / -1;

  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const RefreshIcon = styled.span`
  margin-right: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1557b0;
  }
`;

export default Portfolios;
