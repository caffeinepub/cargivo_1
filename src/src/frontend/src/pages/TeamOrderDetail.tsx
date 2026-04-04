import { Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/ds/StatusBadge";
import type { QuoteBreakdown } from "../utils/quoteStore";
import { sendQuotation, updateQuoteStatus } from "../utils/quoteStore";
import type { SampleOrder } from "./sampleData";

interface Props {
  order: SampleOrder;
  onBack: () => void;
}

const GST_OPTIONS = [5, 12, 18, 28];

// ─── Order Status Flow ──────────────────────────────────────────────────────

type OrderStep = { key: string; label: string };

const ORDER_STEPS: OrderStep[] = [
  { key: "pending", label: "New" },
  { key: "assigned", label: "Assigned" },
  { key: "quoted", label: "Quotation Sent" },
  { key: "accepted", label: "Quote Accepted" },
  { key: "advancePending", label: "Advance Payment Submitted" },
  { key: "advanceVerified", label: "Advance Payment Verified" },
  { key: "preparing", label: "Preparing" },
  { key: "orderPrepared", label: "Order Prepared" },
  { key: "inTransit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
  { key: "finalPaymentPending", label: "Final Payment Submitted" },
  { key: "finalPaymentVerified", label: "Final Payment Verified" },
  { key: "completed", label: "Completed" },
];

type StatusKey =
  | "pending"
  | "inReview"
  | "assigned"
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

function normalizeStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "pending",
    inReview: "pending",
    assigned: "assigned",
    quoted: "quoted",
    accepted: "accepted",
    advancePending: "advancePending",
    advanceVerified: "advanceVerified",
    preparing: "preparing",
    orderPrepared: "orderPrepared",
    inProduction: "preparing",
    inTransit: "inTransit",
    shipped: "inTransit",
    delivered: "delivered",
    finalPaymentPending: "finalPaymentPending",
    finalPaymentVerified: "finalPaymentVerified",
    completed: "completed",
    cancelled: "pending",
  };
  return map[status] ?? status;
}

function getStepIndex(key: string): number {
  return ORDER_STEPS.findIndex((s) => s.key === key);
}

type StepState = "completed" | "active" | "pending";

function getStepState(stepKey: string, currentKey: string): StepState {
  const si = getStepIndex(stepKey);
  const ci = getStepIndex(currentKey);
  if (si < ci) return "completed";
  if (si === ci) return "active";
  return "pending";
}

// ─── Action Config ──────────────────────────────────────────────────────────

type ActionConfig =
  | { type: "button"; label: string; nextStatus: StatusKey }
  | { type: "wait"; message: string }
  | { type: "quotation" }
  | { type: "done" }
  | null;

function getActionConfig(currentKey: string): ActionConfig {
  switch (currentKey) {
    case "pending":
      return { type: "wait", message: "Waiting for Assignment" };
    case "assigned":
      return { type: "quotation" };
    case "quoted":
      return { type: "wait", message: "Waiting for Customer to Accept" };
    case "accepted":
      return { type: "wait", message: "Waiting for Advance Payment" };
    case "advancePending":
      return {
        type: "wait",
        message: "Payment Submitted — Awaiting Admin Verification",
      };
    case "advanceVerified":
      return {
        type: "button",
        label: "Start Preparing",
        nextStatus: "preparing",
      };
    case "preparing":
      return {
        type: "button",
        label: "Mark as Order Prepared",
        nextStatus: "orderPrepared",
      };
    case "orderPrepared":
      return {
        type: "button",
        label: "Mark as In Transit",
        nextStatus: "inTransit",
      };
    case "inTransit":
      return {
        type: "button",
        label: "Mark as Delivered",
        nextStatus: "delivered",
      };
    case "delivered":
      return { type: "wait", message: "Awaiting Final Payment from Customer" };
    case "finalPaymentPending":
      return {
        type: "wait",
        message: "Final Payment Submitted — Awaiting Admin Verification",
      };
    case "finalPaymentVerified":
      return {
        type: "button",
        label: "Complete Order",
        nextStatus: "completed",
      };
    case "completed":
      return { type: "done" };
    default:
      return null;
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepDot({ state }: { state: StepState }) {
  if (state === "completed") {
    return (
      <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
        <Check size={14} strokeWidth={3} className="text-white" />
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
        <span className="absolute inline-flex w-8 h-8 rounded-full bg-blue-400 opacity-60 animate-ping" />
        <span className="relative inline-flex w-3 h-3 rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
      <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TeamOrderDetail({ order, onBack }: Props) {
  const [basePrice, setBasePrice] = useState("");
  const [gstPercent, setGstPercent] = useState(18);
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [quoteSent, setQuoteSent] = useState(false);
  const [transportPartner, setTransportPartner] = useState("");
  const [trackingLink, setTrackingLink] = useState("");

  const basePriceNum = Number.parseFloat(basePrice) || 0;
  const gstAmt = Math.round((basePriceNum * gstPercent) / 100);
  const deliveryNum = Number.parseFloat(deliveryCharges) || 0;
  const totalAmount = basePriceNum + gstAmt + deliveryNum;

  // Quote is already sent if the order already has a breakdown OR we just sent it
  const isQuoteAlreadySent = quoteSent || !!order.quoteBreakdown;

  const currentStepKey = normalizeStatus(order.status);
  const actionConfig = getActionConfig(currentStepKey);

  function handleSendQuotation() {
    if (!basePriceNum || basePriceNum <= 0) {
      toast.error("Please enter a valid base price.");
      return;
    }
    const breakdown: QuoteBreakdown = {
      basePrice: basePriceNum,
      gstPercent,
      gstAmount: gstAmt,
      deliveryCharges: deliveryNum,
      totalAmount,
    };
    sendQuotation(order.id.toString(), breakdown);
    setQuoteSent(true);
    toast.success("Quotation sent to customer!");
  }

  function handleActionButton(nextStatus: StatusKey) {
    updateQuoteStatus(order.id.toString(), nextStatus);
    toast.success("Status updated successfully");
    onBack();
  }

  const handleSaveTracking = () => {
    if (!transportPartner && !trackingLink) {
      toast.error("Please fill in tracking details");
      return;
    }
    toast.success("Tracking info saved");
  };

  return (
    <div
      className="max-w-4xl mx-auto space-y-6"
      data-ocid="team_order_detail.panel"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          data-ocid="team_order_detail.close_button"
        >
          <ChevronLeft size={16} />
          Back to Orders
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold font-mono text-primary">
          #{order.id.toString()}
        </h1>
        <StatusBadge status={order.status} />
        <span className="text-muted-foreground text-sm">{order.customer}</span>
        {order.customerCompany && (
          <span className="text-muted-foreground text-sm">
            — {order.customerCompany}
          </span>
        )}
      </div>

      {/* Section 1: Order Details */}
      <div className="bg-white border border-border rounded-xl shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Order Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Box Type
            </p>
            <p className="text-sm font-medium text-foreground">
              {order.boxType}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Dimensions
            </p>
            <p className="text-sm font-medium text-foreground">
              {order.dimensions ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Quantity
            </p>
            <p className="text-sm font-medium text-foreground">
              {order.qty} units
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Delivery Location
            </p>
            <p className="text-sm font-medium text-foreground">
              {order.location ?? order.state ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Order Date
            </p>
            <p className="text-sm font-medium text-foreground">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Assigned To
            </p>
            <p className="text-sm font-medium text-foreground">
              {order.assignedTo ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Order Progress Timeline */}
      <div className="bg-white border border-border rounded-xl shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground mb-5">
          Order Progress
        </h2>
        <div className="space-y-0">
          {ORDER_STEPS.map((step, idx) => {
            const state = getStepState(step.key, currentStepKey);
            const isLast = idx === ORDER_STEPS.length - 1;
            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <StepDot state={state} />
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[24px] transition-all duration-500 ${
                        state === "completed" ? "bg-emerald-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-4 pt-1">
                  <p
                    className={`text-sm font-medium ${
                      state === "completed"
                        ? "text-emerald-700"
                        : state === "active"
                          ? "text-blue-700"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {state === "active" && (
                    <p className="text-xs text-blue-500 mt-0.5">Current step</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Quotation — only shown when status is "assigned" */}
      {actionConfig?.type === "quotation" && (
        <div className="bg-white border border-border rounded-xl shadow-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Send Quotation
          </h2>

          {isQuoteAlreadySent ? (
            /* ── Already sent: show read-only summary ── */
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Check size={16} className="text-emerald-600 flex-shrink-0" />
                <p className="text-sm font-medium text-emerald-800">
                  Quotation sent to customer.
                </p>
              </div>
              {order.quoteBreakdown && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">
                      ₹{order.quoteBreakdown.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      GST ({order.quoteBreakdown.gstPercent}%)
                    </span>
                    <span className="font-medium">
                      ₹{order.quoteBreakdown.gstAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Delivery Charges
                    </span>
                    <span className="font-medium">
                      ₹{order.quoteBreakdown.deliveryCharges.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">
                      ₹{order.quoteBreakdown.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Not yet sent: show the form ── */
            <div className="space-y-4">
              <div>
                <label
                  className="block text-xs font-medium text-foreground mb-1"
                  htmlFor="base-price"
                >
                  Base Price (₹)
                </label>
                <input
                  id="base-price"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 50000"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  data-ocid="team_order_detail.base_price_input"
                />
              </div>

              <div>
                <p className="block text-xs font-medium text-foreground mb-1">
                  GST Rate
                </p>
                <div className="flex gap-2">
                  {GST_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGstPercent(g)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        gstPercent === g
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {g}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="block text-xs font-medium text-foreground mb-1"
                  htmlFor="delivery-charges"
                >
                  Delivery Charges (₹)
                </label>
                <input
                  id="delivery-charges"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 2000"
                  value={deliveryCharges}
                  onChange={(e) => setDeliveryCharges(e.target.value)}
                  data-ocid="team_order_detail.delivery_input"
                />
              </div>

              {/* Live Total Preview */}
              {basePriceNum > 0 && (
                <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">
                      ₹{basePriceNum.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      GST ({gstPercent}%)
                    </span>
                    <span className="font-medium">
                      ₹{gstAmt.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Delivery Charges
                    </span>
                    <span className="font-medium">
                      ₹{deliveryNum.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn-primary w-full"
                onClick={handleSendQuotation}
                disabled={basePriceNum <= 0}
                data-ocid="team_order_detail.send_quotation_button"
              >
                Send Quotation to Customer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Section 4: Read-only Quotation (after quotation sent) */}
      {actionConfig?.type !== "quotation" && order.quoteBreakdown && (
        <div className="bg-white border border-border rounded-xl shadow-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Quotation
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Price</span>
              <span className="font-medium">
                ₹{order.quoteBreakdown.basePrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                GST ({order.quoteBreakdown.gstPercent}%)
              </span>
              <span className="font-medium">
                ₹{order.quoteBreakdown.gstAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Charges</span>
              <span className="font-medium">
                ₹{order.quoteBreakdown.deliveryCharges.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
              <span>Total Amount</span>
              <span className="text-primary">
                ₹{order.quoteBreakdown.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          {order.quoteSentAt && (
            <p className="text-xs text-muted-foreground mt-3">
              Sent on {new Date(order.quoteSentAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Section 5: Dynamic Action Button */}
      {actionConfig && actionConfig.type !== "quotation" && (
        <div className="bg-white border border-border rounded-xl shadow-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Action
          </h2>

          {actionConfig.type === "button" && (
            <button
              type="button"
              className="btn-primary px-6 py-3 text-sm font-semibold"
              onClick={() => handleActionButton(actionConfig.nextStatus)}
              data-ocid="team_order_detail.action_button"
            >
              {actionConfig.label}
            </button>
          )}

          {actionConfig.type === "wait" && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-sm text-blue-700 font-medium">
                {actionConfig.message}
              </p>
            </div>
          )}

          {actionConfig.type === "done" && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <Check size={18} className="text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800 font-semibold">
                Order Completed
              </p>
            </div>
          )}
        </div>
      )}

      {/* Section 6: Tracking */}
      <div className="bg-white border border-border rounded-xl shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Tracking
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="transport-partner"
              className="text-sm font-medium text-foreground mb-1 block"
            >
              Transport Partner
            </label>
            <input
              id="transport-partner"
              type="text"
              className="form-input"
              placeholder="e.g. Blue Dart, Delhivery"
              value={transportPartner}
              onChange={(e) => setTransportPartner(e.target.value)}
              data-ocid="team_order_detail.input"
            />
          </div>
          <div>
            <label
              htmlFor="tracking-link"
              className="text-sm font-medium text-foreground mb-1 block"
            >
              Tracking Link
            </label>
            <input
              id="tracking-link"
              type="text"
              className="form-input"
              placeholder="https://track.example.com/..."
              value={trackingLink}
              onChange={(e) => setTrackingLink(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveTracking}
            data-ocid="team_order_detail.save_button"
          >
            Save Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
