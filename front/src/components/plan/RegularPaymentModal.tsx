import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { RegularPayment } from "../../types/plan";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<RegularPayment, "id">) => void;
  initialValues?: RegularPayment;
  type: "monthly" | "yearly";
}

const RegularPaymentModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  type,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={`${initialValues ? "수정" : "추가"} - ${
        type === "monthly" ? "월별" : "연별"
      } 정기 지출`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={initialValues ? "수정" : "추가"}
      cancelText="취소"
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="detail"
          label="상세"
          rules={[{ required: true, message: "상세 내용을 입력해주세요" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="method"
          label="결제수단"
          rules={[{ required: true, message: "결제수단을 입력해주세요" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="amount"
          label="금액"
          rules={[{ required: true, message: "금액을 입력해주세요" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="paymentDate"
          label={type === "monthly" ? "결제일" : "결제월"}
          rules={[
            {
              required: true,
              message: `${
                type === "monthly" ? "결제일" : "결제월"
              }을 입력해주세요`,
            },
            {
              type: "number",
              min: 1,
              max: type === "monthly" ? 31 : 12,
              message: `${
                type === "monthly" ? "1-31 사이" : "1-12 사이"
              }의 숫자를 입력해주세요`,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="currency"
          label="통화"
          rules={[{ required: true, message: "통화를 선택해주세요" }]}
        >
          <Select>
            <Select.Option value="KRW">KRW</Select.Option>
            <Select.Option value="USD">USD</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegularPaymentModal;
