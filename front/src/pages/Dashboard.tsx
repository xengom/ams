import { useQuery } from "@apollo/client";
import styled from "styled-components";
import {
  GET_DASHBOARD_DATA,
  GET_EXCHANGE_RATE_FORCE,
} from "../graphql/queries";
import { formatNumber } from "../utils/numberFormat";
import { LineChart, Treemap } from "../components/charts";
import RefreshButton from "../components/common/RefreshButton";

const Dashboard = () => {
  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA);
  const { refetch: refetchExchangeRate } = useQuery(GET_EXCHANGE_RATE_FORCE);
  const dashboardData = data?.getDashboardData;

  const handleRefreshExchangeRate = async () => {
    try {
      await refetchExchangeRate();
    } catch (error) {
      console.error("Failed to refresh exchange rate:", error);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  const today = new Date().toLocaleDateString();

  return (
    <Container>
      <Header>
        <DateDisplay>{today}</DateDisplay>
      </Header>

      <SummarySection>
        <SummaryCard>
          <CardTitle>총 평가금액</CardTitle>
          <CardValue>₩{formatNumber(dashboardData.currentValue)}</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardTitle>총 투자금액</CardTitle>
          <CardValue>₩{formatNumber(dashboardData.investmentAmount)}</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardTitle>수익률</CardTitle>
          <CardValue>{dashboardData.returnRate.toFixed(2)}%</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardTitle>평가손익</CardTitle>
          <CardValue>₩{formatNumber(dashboardData.totalReturn)}</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardTitle>환율</CardTitle>
          <ExchangeRateWrapper>
            <CardValue>₩{formatNumber(dashboardData.exchangeRate)}</CardValue>
            <RefreshButton onClick={handleRefreshExchangeRate} />
          </ExchangeRateWrapper>
        </SummaryCard>
      </SummarySection>

      <ChartGrid>
        <ChartSection>
          <LineChart
            data={dashboardData.history}
            series={[
              { name: "총투자금액", key: "investmentAmount", type: "line" },
              { name: "총평가금액", key: "currentValue", type: "line" },
              { name: "수익률", key: "returnRate", type: "line", yAxis: 1 },
            ]}
            yAxis={[
              { title: "금액", format: "number" },
              { title: "수익률", format: "percentage" },
            ]}
          />
        </ChartSection>
        <ChartSection>
          <LineChart
            data={dashboardData.history}
            series={[
              { name: "총수익금액", key: "totalReturn", type: "line" },
              { name: "배당수익", key: "dividendReturn", type: "line" },
            ]}
            yAxis={[{ title: "금액", format: "number" }]}
          />
        </ChartSection>
        <ChartSection>
          <Treemap
            data={dashboardData.assetClassGroups}
            title="자산군별 분류"
            valueFormat="number"
          />
        </ChartSection>
        <ChartSection>
          <Treemap
            data={dashboardData.accountGroups}
            title="계좌별 분류"
            valueFormat="number"
          />
        </ChartSection>
      </ChartGrid>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
`;

const CardValue = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #333;
`;

const ExchangeRateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  height: calc(100vh - 250px);
`;

const ChartSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const DateDisplay = styled.h2`
  color: #333;
  font-size: 24px;
  margin: 0;
`;

export default Dashboard;
