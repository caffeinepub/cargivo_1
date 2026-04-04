export type QuoteStatus =
  | "pending"
  | "inReview"
  | "quoted"
  | "accepted"
  | "advancePending"
  | "advanceVerified"
  | "preparing"
  | "orderPrepared"
  | "inProduction"
  | "inTransit"
  | "shipped"
  | "delivered"
  | "finalPaymentPending"
  | "finalPaymentVerified"
  | "completed"
  | "cancelled";

export interface QuoteBreakdown {
  pricePerUnit: number;
  quantity: number;
  basePrice: number; // pricePerUnit * quantity
  gstPercent: number;
  gstAmount: number;
  deliveryCharges: number;
  totalAmount: number;
}

export interface PaymentInfo {
  type: "advance" | "final";
  ref: string;
  submittedAt: string;
}

export interface QuoteRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  boxType: string;
  length: string;
  width: string;
  height: string;
  quantity: number;
  deliveryState: string;
  deliveryCity: string;
  fileName?: string;
  status: QuoteStatus;
  submittedAt: string;
  assignedTo?: string;
  quoteBreakdown?: QuoteBreakdown;
  quoteSentAt?: string;
  paymentInfo?: PaymentInfo;
}

const STORE_KEY = "cargivo_quote_requests";

export function getQuoteRequests(): QuoteRequest[] {
  try {
    const stored = localStorage.getItem(STORE_KEY);
    return stored ? (JSON.parse(stored) as QuoteRequest[]) : [];
  } catch {
    return [];
  }
}

export function addQuoteRequest(
  req: Omit<QuoteRequest, "id" | "status" | "submittedAt">,
): QuoteRequest {
  const requests = getQuoteRequests();
  const newReq: QuoteRequest = {
    ...req,
    id: `CGV-${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  requests.unshift(newReq);
  localStorage.setItem(STORE_KEY, JSON.stringify(requests));
  return newReq;
}

export function updateQuoteStatus(id: string, status: QuoteStatus): void {
  const requests = getQuoteRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    requests[idx] = { ...requests[idx], status };
    localStorage.setItem(STORE_KEY, JSON.stringify(requests));
  }
}

export function updateAssignment(id: string, assignedTo: string): void {
  const requests = getQuoteRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    requests[idx] = {
      ...requests[idx],
      assignedTo,
      status: "assigned" as QuoteStatus,
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(requests));
  }
}

export function sendQuotation(id: string, breakdown: QuoteBreakdown): void {
  const requests = getQuoteRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    requests[idx] = {
      ...requests[idx],
      status: "quoted",
      quoteBreakdown: breakdown,
      quoteSentAt: new Date().toISOString(),
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(requests));
  }
}

export function submitPayment(
  id: string,
  type: "advance" | "final",
  ref: string,
): void {
  const requests = getQuoteRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    const newStatus: QuoteStatus =
      type === "advance" ? "advancePending" : "finalPaymentPending";
    requests[idx] = {
      ...requests[idx],
      status: newStatus,
      paymentInfo: {
        type,
        ref,
        submittedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(requests));
  }
}

export function verifyPayment(id: string, type: "advance" | "final"): void {
  const requests = getQuoteRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    const newStatus: QuoteStatus =
      type === "advance" ? "advanceVerified" : "completed";
    requests[idx] = {
      ...requests[idx],
      status: newStatus,
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(requests));
  }
}

export function rejectPayment(id: string): void {
  const requests = getQuoteRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    const prevStatus: QuoteStatus =
      requests[idx].paymentInfo?.type === "advance" ? "accepted" : "delivered";
    requests[idx] = {
      ...requests[idx],
      status: prevStatus,
      paymentInfo: undefined,
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(requests));
  }
}

export function updateOrderStatus(id: string, status: QuoteStatus): void {
  const requests = getQuoteRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    requests[idx] = { ...requests[idx], status };
    localStorage.setItem(STORE_KEY, JSON.stringify(requests));
  }
}
