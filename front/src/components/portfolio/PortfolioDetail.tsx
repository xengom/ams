import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_STOCK,
  DELETE_STOCK,
  DELETE_PORTFOLIO,
} from "../../graphql/mutations";
import { GET_ACCOUNT_PORTFOLIOS } from "../../graphql/queries";
import { formatNumber } from "../../utils/numberFormat";
import Modal from "../common/Modal";
import Button from "../common/Button";
import StockCard from "../common/StockCard";
import EditStockModal from "./EditStockModal";
import AddStockModal from "./AddStockModal";
import { toast } from "react-hot-toast";
import DonutChart from "../charts/DonutChart";
import { Stock } from "../../types/portfolio";
import { Portfolio } from "../../types/portfolio";

interface Props {
  portfolio: Portfolio;
  onClose: () => void;
}

const PortfolioDetail: React.FC<Props> = ({
  portfolio: initialPortfolio,
  onClose,
}) => {
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete";
    stock: Stock;
  } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [updateStock] = useMutation(UPDATE_STOCK, {
    refetchQueries: [{ query: GET_ACCOUNT_PORTFOLIOS }],
  });

  const [deleteStock] = useMutation(DELETE_STOCK, {
    refetchQueries: [{ query: GET_ACCOUNT_PORTFOLIOS }],
  });

  const [deletePortfolio] = useMutation(DELETE_PORTFOLIO, {
    refetchQueries: [{ query: GET_ACCOUNT_PORTFOLIOS }],
  });

  const { data, refetch } = useQuery(GET_ACCOUNT_PORTFOLIOS);

  const portfolio =
    data?.getAccountPortfolios.find(
      (p: any) => p.account === initialPortfolio.account
    ) || initialPortfolio;

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
  };

  const handleSave = async (values: {
    quantity: number;
    avgPrice: number;
    assetClass: string;
  }) => {
    if (!editingStock) return;

    try {
      await updateStock({
        variables: {
          id: editingStock.id,
          input: values,
        },
      });
      setEditingStock(null);
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  const handleDelete = (stock: Stock) => {
    setConfirmAction({ type: "delete", stock });
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      await deleteStock({
        variables: { id: confirmAction.stock.id },
      });
      toast.success("자산이 삭제되었습니다");
      setConfirmAction(null);
      setEditingStock(null);
    } catch (error) {
      console.error("Failed to delete stock:", error);
      toast.error("자산 삭제에 실패했습니다");
    }
  };

  const handlePortfolioDelete = async () => {
    try {
      await deletePortfolio({
        variables: { account: portfolio.account },
      });
      toast.success("포트폴리오가 삭제되었습니다");
      onClose();
    } catch (error) {
      console.error("Failed to delete portfolio:", error);
      toast.error("포트폴리오 삭제에 실패했습니다");
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const stockDistributionData = portfolio.stocks
    .map((stock: Stock) => {
      const value =
        stock.assetClass === "CASH"
          ? stock.quantity * (stock.currency === "USD" ? stock.currentPrice : 1)
          : stock.quantity *
            stock.currentPrice *
            (stock.currency === "USD" ? portfolio.exchangeRate : 1);

      return {
        id: stock.name,
        label: `${stock.name} (${stock.symbol})`,
        value: value,
      };
    })
    .filter((item: any) => item.value > 0);

  return (
    <Modal onClose={onClose}>
      <Container>
        <Header>
          <Title>{portfolio.description || portfolio.account} 포트폴리오</Title>
          <ButtonGroup>
            <Button onClick={() => setIsAddModalOpen(true)}>자산 추가</Button>
            <Button onClick={handleRefresh}>
              <RefreshIcon>🔄</RefreshIcon>
              새로고침
            </Button>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              style={{ background: "#dc3545" }}
            >
              포트폴리오 삭제
            </Button>
            <Button onClick={onClose}>닫기</Button>
          </ButtonGroup>
        </Header>

        <SummaryInfo>
          <InfoItem>
            <Label>투자금액</Label>
            <Value>₩{formatNumber(portfolio.investmentAmount)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>평가금액</Label>
            <Value>₩{formatNumber(portfolio.currentValue)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>수익률</Label>
            <ReturnValue positive={portfolio.returnRate > 0}>
              {portfolio.returnRate.toFixed(2)}%
            </ReturnValue>
          </InfoItem>
        </SummaryInfo>

        <ChartSection>
          <ChartTitle>자산 분포</ChartTitle>
          <DonutChart
            data={stockDistributionData}
            valueFormat={(value) => {
              const percentage = (
                (value / portfolio.currentValue) *
                100
              ).toFixed(1);
              return `₩${Number(value)
                .toFixed(0)
                .toLocaleString()} (${percentage}%)`;
            }}
          />
        </ChartSection>

        <StockGrid>
          {portfolio.stocks.map((stock: Stock) => (
            <StockCard
              key={stock.id}
              {...stock}
              onClick={() => handleEdit(stock)}
            />
          ))}
        </StockGrid>

        {editingStock && (
          <EditStockModal
            stock={editingStock}
            onSave={handleSave}
            onDelete={() => handleDelete(editingStock)}
            onClose={() => setEditingStock(null)}
          />
        )}

        {confirmAction && (
          <ConfirmDialog>
            <p>정말 삭제하시겠습니까?</p>
            <ButtonGroup>
              <Button onClick={handleConfirm}>확인</Button>
              <Button onClick={() => setConfirmAction(null)}>취소</Button>
            </ButtonGroup>
          </ConfirmDialog>
        )}

        {isAddModalOpen && (
          <AddStockModal
            account={portfolio.account}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}

        {isDeleteModalOpen && (
          <ConfirmDialog>
            <p>
              정말 이 포트폴리오를 삭제하시겠습니까?
              <br />
              포트폴리오의 모든 자산이 함께 삭제됩니다.
            </p>
            <ButtonGroup>
              <Button onClick={handlePortfolioDelete}>확인</Button>
              <Button onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
            </ButtonGroup>
          </ConfirmDialog>
        )}
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  min-width: 800px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
`;

const StockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 1100;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SummaryInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.span`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const Value = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const ReturnValue = styled.span<{ positive: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => (props.positive ? "#e31b23" : "#1261c4")};
`;

const RefreshIcon = styled.span`
  margin-right: 4px;
`;

const ChartSection = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #666;
`;

export default PortfolioDetail;
