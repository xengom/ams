import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { PlanItem } from "../../types/plan";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<PlanItem, "id" | "ratio">) => void;
  initialValues?: PlanItem;
  salary: number;
}

const PlanningModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  salary,
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
      title={`${initialValues ? "수정" : "추가"} - 지출 계획`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={initialValues ? "수정" : "추가"}
      cancelText="취소"
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="category"
          label="분류"
          rules={[{ required: true, message: "분류를 선택해주세요" }]}
        >
          <Select>
            <Select.Option value="LIVING">생활비</Select.Option>
            <Select.Option value="SAVING">저축</Select.Option>
            <Select.Option value="INVESTMENT">투자</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="detail"
          label="내역"
          rules={[{ required: true, message: "내역을 입력해주세요" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="amount"
          label="금액"
          rules={[
            { required: true, message: "금액을 입력해주세요" },
            {
              type: "number",
              transform: (value) => Number(value),
              validator: (_, value) => {
                if (value <= 0) {
                  return Promise.reject("금액은 0보다 커야 합니다");
                }
                if (value > salary) {
                  return Promise.reject("금액이 월급보다 클 수 없습니다");
                }
                if (!Number.isInteger(value)) {
                  return Promise.reject("소수점은 입력할 수 없습니다");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item name="note" label="비고">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlanningModal;
