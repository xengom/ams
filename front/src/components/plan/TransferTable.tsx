import React, { useState } from "react";
import { Table, Button } from "antd";
import { TransferPlan, PlanItem } from "../../types/plan";
import { useMutation } from "@apollo/client";
import {
  UPDATE_TRANSFER_PLAN,
  ADD_TRANSFER_PLAN,
} from "../../graphql/mutations";

interface Props {
  data: TransferPlan[];
  planItems: PlanItem[];
  fixedCost: number;
  livingExpense: number;
}

const TransferTable: React.FC<Props> = ({ data, planItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlans, setEditedPlans] = useState<TransferPlan[]>([]);

  const [updatePlan] = useMutation(UPDATE_TRANSFER_PLAN, {
    refetchQueries: ["GetTransferPlans"],
  });

  const [addPlan] = useMutation(ADD_TRANSFER_PLAN, {
    refetchQueries: ["GetTransferPlans"],
  });

  const transferPlans = [
    data.find((plan) => plan.item === "고정비"),
    data.find((plan) => plan.item === "이달 생활비"),
    ...planItems.map((planItem) => {
      const existingPlan = data.find((plan) => plan.item === planItem.detail);
      return {
        id: existingPlan?.id || planItem.id,
        item: planItem.detail,
        transferDate: existingPlan?.transferDate || 1,
        amount: planItem.amount,
        bank: existingPlan?.bank || "",
        note: existingPlan?.note || "",
      };
    }),
  ];

  // 편집 모드 시작 시 현재 데이터로 초기화
  const handleEdit = () => {
    setEditedPlans(transferPlans);
    setIsEditing(true);
  };

  // 저장 버튼 클릭 시 변경사항 DB에 반영
  const handleSave = async () => {
    try {
      await Promise.all(
        editedPlans.map(async (plan) => {
          const existingPlan = data.find((p) => p.item === plan.item);
          if (existingPlan) {
            return updatePlan({
              variables: {
                item: plan.item,
                input: {
                  transferDate: plan.transferDate,
                  bank: plan.bank,
                  note: plan.note || "",
                },
              },
            });
          } else {
            return addPlan({
              variables: {
                input: {
                  item: plan.item,
                  transferDate: plan.transferDate,
                  amount: plan.amount,
                  bank: plan.bank || "",
                  note: plan.note || "",
                },
              },
            });
          }
        })
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const handleChange = (
    id: number | string,
    field: "bank" | "note" | "transferDate",
    value: string | number
  ) => {
    setEditedPlans(
      editedPlans.map((plan) =>
        plan.item === editedPlans.find((p) => p.id === id)?.item
          ? {
              ...plan,
              [field]:
                field === "transferDate"
                  ? Math.min(Math.max(1, Number(value)), 31)
                  : value,
            }
          : plan
      )
    );
  };

  const columns = [
    {
      title: "항목",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "이체일",
      dataIndex: "transferDate",
      key: "transferDate",
      render: (date: number, record: TransferPlan) =>
        isEditing ? (
          <input
            type="number"
            value={
              editedPlans.find((p) => p.id === record.id)?.transferDate || 1
            }
            onChange={(e) =>
              handleChange(
                record.id,
                "transferDate",
                parseInt(e.target.value) || 1
              )
            }
            min={1}
            max={31}
            style={{ width: "60px" }}
          />
        ) : (
          `${date}일`
        ),
    },
    {
      title: "금액",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toLocaleString(),
    },
    {
      title: "은행",
      dataIndex: "bank",
      key: "bank",
      render: (bank: string, record: TransferPlan) =>
        isEditing ? (
          <input
            value={editedPlans.find((p) => p.item === record.item)?.bank || ""}
            onChange={(e) => handleChange(record.id, "bank", e.target.value)}
            style={{ width: "100%" }}
          />
        ) : (
          bank
        ),
    },
    {
      title: "비고",
      dataIndex: "note",
      key: "note",
      render: (note: string, record: TransferPlan) =>
        isEditing ? (
          <input
            value={editedPlans.find((p) => p.item === record.item)?.note || ""}
            onChange={(e) => handleChange(record.id, "note", e.target.value)}
            style={{ width: "100%" }}
          />
        ) : (
          note
        ),
    },
  ];

  const totalAmount = transferPlans.reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      <div style={{ marginTop: 16, textAlign: "left" }}>
        <Button type="primary" onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? "저장" : "편집"}
        </Button>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={isEditing ? editedPlans : transferPlans}
          rowKey="item"
          pagination={false}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  총액
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {totalAmount.toLocaleString()}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={2} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </>
  );
};

export default TransferTable;
