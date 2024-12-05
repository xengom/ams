import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { formatNumber } from "../utils/numberFormat";
import Button from "../components/common/Button";
import {
  GET_INCOMES,
  GET_SALARIES,
  GET_SALARY_SUMMARY,
} from "../graphql/queries";
import AddIncomeModal from "../components/income/AddIncomeModal";
import AddSalaryModal from "../components/income/AddSalaryModal";
import EditIncomeModal from "../components/income/EditIncomeModal";
import EditSalaryModal from "../components/income/EditSalaryModal";

const Income = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [isAddSalaryModalOpen, setIsAddSalaryModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [editingSalary, setEditingSalary] = useState<any>(null);

  const { data: incomesData } = useQuery(GET_INCOMES);
  const { data: salariesData } = useQuery(GET_SALARIES, {
    variables: { year: selectedYear },
  });
  const { data: summaryData } = useQuery(GET_SALARY_SUMMARY, {
    variables: { year: selectedYear },
  });

  const totalInvestment =
    incomesData?.getIncomes.reduce(
      (sum: number, income: any) => sum + income.amount,
      0
    ) || 0;

  return (
    <Container>
      <SplitView>
        <LeftPanel>
          <Header>
            <Title>입금 내역</Title>
            <Button onClick={() => setIsAddIncomeModalOpen(true)}>
              + 입금 추가
            </Button>
          </Header>

          <SummaryCard>
            <SummaryTitle>총 투자금액</SummaryTitle>
            <SummaryAmount>₩{formatNumber(totalInvestment)}</SummaryAmount>
          </SummaryCard>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>날짜</Th>
                  <Th>내용</Th>
                  <Th align="right">금액</Th>
                </tr>
              </thead>
              <tbody>
                {incomesData?.getIncomes.map((income: any) => (
                  <tr
                    key={income.id}
                    onClick={() => setEditingIncome(income)}
                    style={{ cursor: "pointer" }}
                  >
                    <Td>{income.date}</Td>
                    <Td>{income.type}</Td>
                    <Td align="right">₩{formatNumber(income.amount)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </LeftPanel>

        <RightPanel>
          <Header>
            <Title>월급 내역</Title>
            <ButtonGroup>
              <YearSelect
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </YearSelect>
              <Button onClick={() => setIsAddSalaryModalOpen(true)}>
                + 월급 추가
              </Button>
            </ButtonGroup>
          </Header>

          <SummaryGrid>
            <SummaryCard>
              <SummaryTitle>세전연봉</SummaryTitle>
              <SummaryAmount>
                ₩
                {formatNumber(
                  summaryData?.getSalarySummary.totalGrossAmount || 0
                )}
              </SummaryAmount>
            </SummaryCard>
            <SummaryCard>
              <SummaryTitle>세후연봉</SummaryTitle>
              <SummaryAmount>
                ₩
                {formatNumber(
                  summaryData?.getSalarySummary.totalNetAmount || 0
                )}
              </SummaryAmount>
            </SummaryCard>
            <SummaryCard>
              <SummaryTitle>총 투자비율</SummaryTitle>
              <SummaryAmount>
                {(summaryData?.getSalarySummary.investmentRatio || 0).toFixed(
                  1
                )}
                %
              </SummaryAmount>
            </SummaryCard>
          </SummaryGrid>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>날짜</Th>
                  <Th align="right">세후월급</Th>
                  <Th align="right">세전월급</Th>
                  <Th>비고</Th>
                </tr>
              </thead>
              <tbody>
                {salariesData?.getSalaries.map((salary: any) => (
                  <tr
                    key={salary.id}
                    onClick={() => setEditingSalary(salary)}
                    style={{ cursor: "pointer" }}
                  >
                    <Td>{salary.date}</Td>
                    <Td align="right">₩{formatNumber(salary.netAmount)}</Td>
                    <Td align="right">₩{formatNumber(salary.grossAmount)}</Td>
                    <Td>{salary.note}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </RightPanel>
      </SplitView>

      {isAddIncomeModalOpen && (
        <AddIncomeModal onClose={() => setIsAddIncomeModalOpen(false)} />
      )}
      {isAddSalaryModalOpen && (
        <AddSalaryModal onClose={() => setIsAddSalaryModalOpen(false)} />
      )}
      {editingIncome && (
        <EditIncomeModal
          income={editingIncome}
          onClose={() => setEditingIncome(null)}
        />
      )}
      {editingSalary && (
        <EditSalaryModal
          salary={editingSalary}
          onClose={() => setEditingSalary(null)}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  height: calc(100vh - 40px);
`;

const SplitView = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 100%;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow: hidden;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const YearSelect = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ align?: string }>`
  padding: 12px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 2px solid #eee;
  color: #666;
  font-weight: 500;
`;

const Td = styled.td<{ align?: string }>`
  padding: 12px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 1px solid #eee;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const SummaryCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SummaryTitle = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`;

const SummaryAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

export default Income;
