import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { GET_ASSET_HISTORY } from "../graphql/queries";
import { formatNumber } from "../utils/numberFormat";

const History = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, loading, error } = useQuery(GET_ASSET_HISTORY, {
    variables: { startDate, endDate },
  });

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <Container>
      <Header>
        <Title>자산 히스토리</Title>
        <DateFilter>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="시작일"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="종료일"
          />
        </DateFilter>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>날짜</Th>
            <Th align="right">총 투자금액</Th>
            <Th align="right">총 평가금액</Th>
            <Th align="right">수익률</Th>
            <Th align="right">총 수익금액</Th>
            <Th align="right">배당수익</Th>
            <Th align="right">배당제외수익</Th>
          </tr>
        </thead>
        <tbody>
          {data?.getAssetHistory.map((history: any) => (
            <tr key={history.id}>
              <Td>{new Date(history.date).toLocaleDateString()}</Td>
              <Td align="right">₩{formatNumber(history.investmentAmount)}</Td>
              <Td align="right">₩{formatNumber(history.currentValue)}</Td>
              <Td align="right" $positive={history.returnRate > 0}>
                {history.returnRate.toFixed(2)}%
              </Td>
              <Td align="right" $positive={history.totalReturn > 0}>
                ₩{formatNumber(history.totalReturn)}
              </Td>
              <Td align="right">₩{formatNumber(history.dividendReturn)}</Td>
              <Td align="right" $positive={history.pureReturn > 0}>
                ₩{formatNumber(history.pureReturn)}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
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

const DateFilter = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

const Td = styled.td<{ align?: string; $positive?: boolean }>`
  padding: 12px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 1px solid #eee;
  color: ${(props) =>
    props.$positive === undefined
      ? "inherit"
      : props.$positive
      ? "#e31b23"
      : "#1261c4"};
`;

export default History;
