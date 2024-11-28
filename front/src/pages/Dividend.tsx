import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "styled-components";
import { formatNumber } from "../utils/numberFormat";
import Button from "../components/common/Button";
import { GET_DIVIDENDS, GET_DIVIDEND_SUMMARY } from "../graphql/queries";
import AddDividendModal from "../components/AddDividendModal";
import { DELETE_DIVIDEND } from "../graphql/mutations";
import { toast } from "react-hot-toast";

const Dividend = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data: summaryData } = useQuery(GET_DIVIDEND_SUMMARY, {
    variables: { year: selectedYear },
  });
  const {
    data: dividendData,
    loading,
    error,
  } = useQuery(GET_DIVIDENDS, {
    variables: { year: selectedYear },
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [deleteDividend] = useMutation(DELETE_DIVIDEND, {
    refetchQueries: [{ query: GET_DIVIDENDS }, { query: GET_DIVIDEND_SUMMARY }],
    onCompleted: () => {
      toast.success("배당금이 삭제되었습니다");
    },
    onError: (error) => {
      console.error("Failed to delete dividend:", error);
      toast.error("배당금 삭제에 실패했습니다");
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteDividend({
        variables: { id },
      });
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <Container>
      <Header>
        <Title>배당금 관리</Title>
        <ButtonGroup>
          <YearSelect
            value={selectedYear || ""}
            onChange={(e) =>
              setSelectedYear(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            <option value="">전체</option>
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </YearSelect>
          <Button onClick={() => setIsAddModalOpen(true)}>+ 배당금 추가</Button>
        </ButtonGroup>
      </Header>

      <SummaryCard>
        <SummaryTitle>
          {selectedYear ? `${selectedYear}년 총 배당금` : "전체 기간 총 배당금"}
        </SummaryTitle>
        <SummaryAmount>
          ₩{formatNumber(summaryData?.getDividendSummary?.totalAmount || 0)}
        </SummaryAmount>
      </SummaryCard>

      <Table>
        <thead>
          <tr>
            <Th>날짜</Th>
            <Th>종목명</Th>
            <Th>통화</Th>
            <Th align="right">배당금(세후)</Th>
            <Th align="right">원화기준배당금</Th>
            <Th>삭제</Th>
          </tr>
        </thead>
        <tbody>
          {dividendData?.getDividends.map((dividend: any) => (
            <tr key={dividend.id}>
              <Td>{new Date(dividend.date).toLocaleDateString()}</Td>
              <Td>{dividend.symbol}</Td>
              <Td>{dividend.currency}</Td>
              <Td align="right">
                {dividend.currency === "USD"
                  ? dividend.amount.toFixed(2)
                  : formatNumber(dividend.amount)}
              </Td>
              <Td align="right">₩{formatNumber(dividend.amountInKRW)}</Td>
              <Td>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(dividend.id);
                  }}
                  style={{ background: "#dc3545" }}
                >
                  삭제
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isAddModalOpen && (
        <AddDividendModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const SummaryCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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

export default Dividend;
