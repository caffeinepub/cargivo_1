import type { PaymentInfo, QuoteBreakdown } from "../utils/quoteStore";

export interface SampleOrder {
  id: string | bigint | number;
  status: string;
  boxType: string;
  qty: number;
  amount: number;
  date: string;
  customer: string;
  dimensions?: string;
  location?: string;
  customerCompany?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerGST?: string;
  assignedTo?: string;
  state?: string;
  area?: string;
  paymentSubmitted?: boolean;
  paymentRef?: string;
  paymentInfo?: PaymentInfo;
  quoteBreakdown?: QuoteBreakdown;
  quoteSentAt?: string;
}

export const SAMPLE_ORDERS: SampleOrder[] = [];
