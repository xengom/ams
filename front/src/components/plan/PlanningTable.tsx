import React, { useState } from "react";
import { Table, Button, Card, Row, Col, Statistic } from "antd";
import { useMutation } from "@apollo/client";
import { PlanItem } from "../../types/plan";
import PlanningModal from "./PlanningModal";
import {
  ADD_PLAN_ITEM,
  UPDATE_PLAN_ITEM,
  DELETE_PLAN_ITEM,
} from "../../graphql/mutations";

interface Props {
  data: PlanItem[];
  salary: number;
  fixedCost: number;
}

const PlanningTable: React.FC<Props> = ({ data, salary, fixedCost }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlanItem | null>(null);

  const [addItem] = useMutation(ADD_PLAN_ITEM, {
    refetchQueries: ["GetPlanItems"],
  });

  const [updateItem] = useMutation(UPDATE_PLAN_ITEM, {
    refetchQueries: ["GetPlanItems"],
  });

  const [deleteItem] = useMutation(DELETE_PLAN_ITEM, {
    refetchQueries: ["GetPlanItems"],
  });

  const handleAdd = () => {
    setSelectedItem(null);
    setModalVisible(true);
  };

  const handleEdit = (record: PlanItem) => {
    setSelectedItem(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem({ variables: { id } });
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleSubmit = async (values: Omit<PlanItem, "id" | "ratio">) => {
    try {
      if (selectedItem) {
        await updateItem({
          variables: {
            id: selectedItem.id,
            input: values,
          },
        });
      } else {
        await addItem({
          variables: {
            input: values,
          },
        });
      }
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const columns = [
    {
      title: "분류",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "내역",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "금액",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => Math.round(amount).toLocaleString(),
    },
    {
      title: "비중",
      dataIndex: "ratio",
      key: "ratio",
      render: (ratio: number) => `${ratio.toFixed(1)}%`,
    },
    {
      title: "비고",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "작업",
      key: "action",
      render: (_: any, record: PlanItem) =>
        record.category !== "FIXED" && record.detail !== "이달 생활비" ? (
          <span>
            <Button type="link" onClick={() => handleEdit(record)}>
              수정
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>
              삭제
            </Button>
          </span>
        ) : null,
    },
  ];

  // 분류별 소계 계산
  const subtotals = ["FIXED", "LIVING", "SAVING", "INVESTMENT"].map(
    (category) => {
      const items = data.filter((item) => item.category === category);
      let totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

      if (category === "FIXED") {
        totalAmount += fixedCost;
      }

      if (category === "LIVING") {
        totalAmount += calculateLivingExpense();
      }

      const totalRatio = salary > 0 ? (totalAmount / salary) * 100 : 0;

      return {
        category,
        amount: Math.round(totalAmount),
        ratio: totalRatio,
      };
    }
  );

  // 자동 계산 항목 추가
  const dataWithAutoCalculated = [
    {
      id: "fixed",
      category: "FIXED",
      detail: "고정비",
      amount: Math.round(fixedCost),
      ratio: (fixedCost / salary) * 100,
    },
    ...data.filter(
      (item) => item.category !== "FIXED" && item.detail !== "이달 생활비"
    ),
    {
      id: "living",
      category: "LIVING",
      detail: "이달 생활비",
      amount: Math.round(calculateLivingExpense()),
      ratio: (calculateLivingExpense() / salary) * 100,
    },
  ];

  // 생활비 자동 계산
  function calculateLivingExpense() {
    const savingAndInvestment = data
      .filter((item) => ["SAVING", "INVESTMENT"].includes(item.category))
      .reduce((sum, item) => sum + item.amount, 0);

    const reserveFund = data
      .filter((item) => item.category === "LIVING" && item.detail === "예비비")
      .reduce((sum, item) => sum + item.amount, 0);

    return salary - savingAndInvestment - reserveFund - fixedCost;
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {subtotals.map(({ category, amount, ratio }) => (
          <Col span={6} key={category}>
            <Card>
              <Statistic
                title={`${category} 소계`}
                value={amount}
                precision={0}
                suffix="원"
              />
              <div style={{ fontSize: "12px", color: "#666" }}>
                {ratio.toFixed(1)}%
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleAdd}
        disabled={!salary}
      >
        추가
      </Button>

      <Table
        columns={columns}
        dataSource={dataWithAutoCalculated as any}
        rowKey="id"
        pagination={false}
      />

      <PlanningModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={selectedItem || undefined}
        salary={salary}
      />
    </div>
  );
};

export default PlanningTable;
