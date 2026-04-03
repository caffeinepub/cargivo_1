export type QuoteStatus =
  | "pending"
  | "inReview"
  | "quoted"
  | "accepted"
  | "inProduction"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface QuoteBreakdown {
  basePrice: number;
  gstPercent: number;
  gstAmount: number;
  deliveryCharges: number;
  totalAmount: number;
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
    requests[idx] = { ...requests[idx], assignedTo };
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
