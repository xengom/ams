import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_LATEST_SALARY,
  GET_MONTHLY_PAYMENTS,
  GET_YEARLY_PAYMENTS,
  GET_PLAN_ITEMS,
  GET_TRANSFER_PLANS,
  GET_EXCHANGE_RATE_FORCE,
} from "../graphql/queries";
import RegularPaymentTable from "../components/plan/RegularPaymentTable";
import PlanningTable from "../components/plan/PlanningTable";
import TransferTable from "../components/plan/TransferTable";

export const Plan: React.FC = () => {
  const { data: salaryData } = useQuery(GET_LATEST_SALARY);
  const { data: monthlyData } = useQuery(GET_MONTHLY_PAYMENTS);
  const { data: yearlyData } = useQuery(GET_YEARLY_PAYMENTS);
  const { data: planData } = useQuery(GET_PLAN_ITEMS);
  const { data: transferData } = useQuery(GET_TRANSFER_PLANS);
  const { data: exchangeRateData } = useQuery(GET_EXCHANGE_RATE_FORCE);

  const [monthlyCost, setMonthlyCost] = useState(0);
  const [yearlyCost, setYearlyCost] = useState(0);
  const [salary, setSalary] = useState(0);

  useEffect(() => {
    if (salaryData?.getLatestSalary) {
      setSalary(salaryData.getLatestSalary);
    }
  }, [salaryData]);

  // 월별/연별 정기지출 총액 계산
  useEffect(() => {
    if (exchangeRateData?.getExchangeRate && monthlyData?.getMonthlyPayments) {
      const total = monthlyData.getMonthlyPayments.reduce(
        (sum, item) =>
          sum +
          (item.currency === "USD"
            ? item.amount * exchangeRateData.getExchangeRate
            : item.amount),
        0
      );
      setMonthlyCost(total);
    }

    if (exchangeRateData?.getExchangeRate && yearlyData?.getYearlyPayments) {
      const total = yearlyData.getYearlyPayments.reduce(
        (sum, item) =>
          sum +
          (item.currency === "USD"
            ? item.amount * exchangeRateData.getExchangeRate
            : item.amount),
        0
      );
      setYearlyCost(total);
    }
  }, [monthlyData, yearlyData, exchangeRateData]);

  const calculateLivingExpense = () => {
    const savingAndInvestment = (planData?.getPlanItems || [])
      .filter((item) => ["SAVING", "INVESTMENT"].includes(item.category))
      .reduce((sum, item) => sum + item.amount, 0);

    const reserveFund = (planData?.getPlanItems || [])
      .filter((item) => item.category === "LIVING" && item.detail === "예비비")
      .reduce((sum, item) => sum + item.amount, 0);

    return (
      salary -
      savingAndInvestment -
      reserveFund -
      (monthlyCost + yearlyCost / 12)
    );
  };

  // 환율 데이터가 없으면 로딩 표시
  if (!exchangeRateData?.getExchangeRate) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>지출 계획</h2>
      <div>
        <h3>월 급여: {salary.toLocaleString()}원</h3>
      </div>

      <div>
        <h3>지출 계획표</h3>
        <PlanningTable
          data={planData?.getPlanItems || []}
          salary={salary}
          fixedCost={monthlyCost + yearlyCost / 12}
        />
      </div>

      <div>
        <h3>월별 정기 지출</h3>
        <RegularPaymentTable
          data={monthlyData?.getMonthlyPayments || []}
          type="monthly"
          total={monthlyCost}
          exchangeRate={exchangeRateData.getExchangeRate}
        />
      </div>

      <div>
        <h3>연별 정기 지출</h3>
        <RegularPaymentTable
          data={yearlyData?.getYearlyPayments || []}
          type="yearly"
          total={yearlyCost}
          exchangeRate={exchangeRateData.getExchangeRate}
        />
      </div>

      <div>
        <h3>이체 계획표</h3>
        <TransferTable
          data={transferData?.getTransferPlans || []}
          planItems={planData?.getPlanItems || []}
          fixedCost={monthlyCost + yearlyCost / 12}
          livingExpense={calculateLivingExpense()}
        />
      </div>
    </div>
  );
};

export default Plan;
