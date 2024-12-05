import React, { useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import { useMutation } from "@apollo/client";
import { RegularPayment } from "../../types/plan";
import RegularPaymentModal from "./RegularPaymentModal";
import {
  ADD_REGULAR_PAYMENT,
  UPDATE_REGULAR_PAYMENT,
  DELETE_REGULAR_PAYMENT,
} from "../../graphql/mutations";

interface Props {
  data: RegularPayment[];
  type: "monthly" | "yearly";
  total: number;
  exchangeRate: number;
}

const RegularPaymentTable: React.FC<Props> = ({ data, type, exchangeRate }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<RegularPayment | null>(
    null
  );

  const [addPayment] = useMutation(ADD_REGULAR_PAYMENT, {
    refetchQueries: [
      type === "monthly" ? "GetMonthlyPayments" : "GetYearlyPayments",
    ],
  });

  const [updatePayment] = useMutation(UPDATE_REGULAR_PAYMENT, {
    refetchQueries: [
      type === "monthly" ? "GetMonthlyPayments" : "GetYearlyPayments",
    ],
  });

  const [deletePayment] = useMutation(DELETE_REGULAR_PAYMENT, {
    refetchQueries: [
      type === "monthly" ? "GetMonthlyPayments" : "GetYearlyPayments",
    ],
  });

  const handleAdd = () => {
    setSelectedPayment(null);
    setModalVisible(true);
  };

  const handleEdit = (record: RegularPayment) => {
    setSelectedPayment(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePayment({ variables: { id } });
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const handleSubmit = async (values: Omit<RegularPayment, "id">) => {
    try {
      if (selectedPayment) {
        await updatePayment({
          variables: {
            id: selectedPayment.id,
            input: values,
          },
        });
      } else {
        await addPayment({
          variables: {
            type: type,
            input: values,
          },
        });
      }
    } catch (error) {
      console.error("Failed to save payment:", error);
    }
  };

  const columns = [
    {
      title: "상세",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "결제수단",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "금액",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: RegularPayment) => {
        const displayAmount =
          record.currency === "USD"
            ? `${Math.round(amount * exchangeRate)} (${amount} USD)`
            : `${Math.round(amount)}`;
        return `${displayAmount.toLocaleString()}`;
      },
    },
    {
      title: type === "monthly" ? "결제일" : "결제월",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date: number) =>
        type === "monthly" ? `${date}일` : `${date}월`,
    },
    {
      title: "통화",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "작업",
      key: "action",
      render: (_: any, record: RegularPayment) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            수정
          </Button>
          <Popconfirm
            title="정말로 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              삭제
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const totalAmount = data.reduce((sum, item) => {
    const amount =
      item.currency === "USD" ? item.amount * exchangeRate : item.amount;
    return sum + amount;
  }, 0);

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleAdd}>
        추가
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                총액
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {Math.round(totalAmount).toLocaleString()} KRW
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} colSpan={3} />
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      <RegularPaymentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={selectedPayment || undefined}
        type={type}
      />
    </div>
  );
};

export default RegularPaymentTable;
