export interface RegularPayment {
  id: number;
  detail: string;        // 정기결제 상세
  method: string;        // 결제수단
  amount: number;        // 금액
  paymentDate: number;   // 결제일 (월별) 또는 결제월 (연별)
  currency: 'KRW' | 'USD'; // 통화
}

export interface PlanItem {
  id: number;
  category: 'FIXED' | 'LIVING' | 'SAVING' | 'INVESTMENT';  // 분류
  detail: string;        // 내역
  amount: number;        // 금액
  ratio: number;         // 비중
  note?: string;         // 비고
}

export interface TransferPlan {
  id: number | string;
  item: string;
  transferDate: number;
  amount: number;
  bank: string;
  note: string;
} 