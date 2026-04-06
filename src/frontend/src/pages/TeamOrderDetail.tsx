import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Info,
  PackageCheck,
  SendHorizonal,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/ds/StatusBadge";
import type { QuoteBreakdown } from "../utils/quoteStore";
import { sendQuotation, updateOrderStatus } from "../utils/quoteStore";
import type { SampleOrder } from "./sampleData";

interface Props {
  order: SampleOrder;
  onBack: () => void;
}

const GST_OPTIONS = [5, 12, 18, 28];

// ─── Order Status Flow ──────────────────────────────────────────────────────

type OrderStep = {
  key: string;
  label: string;
};

const ORDER_STEPS: OrderStep[] = [
  { key: "new", label: "New" },
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

function normalizeStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "new",
    inReview: "new",
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
    cancelled: "new",
  };
  return map[status] ?? status;
}

function getStepIndex(stepKey: string): number {
  return ORDER_STEPS.findIndex((s) => s.key === stepKey);
}

type StepState = "completed" | "active" | "pending";

function getStepState(stepKey: string, currentKey: string): StepState {
  const stepIdx = getStepIndex(stepKey);
  const currentIdx = getStepIndex(currentKey);
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

// ─── Action Button Config ────────────────────────────────────────────────────

type ActionConfig =
  | { type: "button"; label: string; nextStatus: string }
  | { type: "wait"; message: string }
  | { type: "quotation" }
  | { type: "done" }
  | null;

function getActionConfig(currentKey: string): ActionConfig {
  switch (currentKey) {
    case "new":
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
      return {
        type: "wait",
        message: "Awaiting Final Payment from Customer",
      };
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

function ConnectorLine({ state }: { state: "completed" | "pending" }) {
  return (
    <div
      className={`absolute left-[14px] top-8 w-0.5 h-full transition-all duration-500 ${
        state === "completed" ? "bg-emerald-400" : "bg-gray-200"
      }`}
    />
  );
}

// ─── Breakdown Display ───────────────────────────────────────────────────────

function BreakdownCard({ bd }: { bd: QuoteBreakdown }) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-3 border-b border-border">
          <p className="text-xs text-muted-foreground mb-0.5">Price per Unit</p>
          <p className="text-sm font-bold text-foreground">
            ₹{bd.pricePerUnit.toLocaleString()}
          </p>
        </div>
        <div className="p-3 border-b border-border">
          <p className="text-xs text-muted-foreground mb-0.5">Quantity</p>
          <p className="text-sm font-bold text-foreground">
            {bd.quantity.toLocaleString()} units
          </p>
        </div>
        <div className="p-3 border-b border-border">
          <p className="text-xs text-muted-foreground mb-0.5">Base Price</p>
          <p className="text-sm font-bold text-foreground">
            ₹{bd.basePrice.toLocaleString()}
          </p>
        </div>
        <div className="p-3 border-b border-border">
          <p className="text-xs text-muted-foreground mb-0.5">
            GST ({bd.gstPercent}%)
          </p>
          <p className="text-sm font-bold text-foreground">
            ₹{bd.gstAmount.toLocaleString()}
          </p>
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-0.5">
            Delivery Charges
          </p>
          <p className="text-sm font-bold text-foreground">
            ₹{bd.deliveryCharges.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-orange-50">
          <p className="text-xs text-orange-600 mb-0.5">Total Amount</p>
          <p className="text-base font-extrabold text-orange-600">
            ₹{bd.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TeamOrderDetail({ order, onBack }: Props) {
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [gstPercent, setGstPercent] = useState(18);
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [quoteSent, setQuoteSent] = useState(false);
  const [transportPartner, setTransportPartner] = useState("");
  const [trackingLink, setTrackingLink] = useState("");

  const orderQty = order.qty || 1;
  const pricePerUnitNum = Number.parseFloat(pricePerUnit) || 0;
  const basePrice = pricePerUnitNum * orderQty;
  const gstAmt = Math.round((basePrice * gstPercent) / 100);
  const deliveryNum = Number.parseFloat(deliveryCharges) || 0;
  const totalAmount = basePrice + gstAmt + deliveryNum;

  const isQuoteAlreadySent = quoteSent || !!order.quoteBreakdown;

  const currentStepKey = normalizeStatus(order.status);
  const acceptedStepIdx = ORDER_STEPS.findIndex((s) => s.key === "accepted");
  const isPostAccepted = getStepIndex(currentStepKey) >= acceptedStepIdx;
  const actionConfig = getActionConfig(currentStepKey);

  function handleSendQuotation() {
    if (!pricePerUnitNum || pricePerUnitNum <= 0) return;
    const breakdown: QuoteBreakdown = {
      pricePerUnit: pricePerUnitNum,
      quantity: orderQty,
      basePrice,
      gstPercent,
      gstAmount: gstAmt,
      deliveryCharges: deliveryNum,
      totalAmount,
    };
    sendQuotation(order.id.toString(), breakdown);
    setQuoteSent(true);
    toast.success("Quotation sent to customer!");
  }

  function handleActionButton(nextStatus: string) {
    updateOrderStatus(
      order.id.toString(),
      nextStatus as Parameters<typeof updateOrderStatus>[1],
    );
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

  const displayBreakdown: QuoteBreakdown | null = order.quoteBreakdown ?? null;

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
              Dimensions (mm)
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

      {/* Section 2: Quotation */}
      <div
        id="quotation-section"
        className="bg-white border border-border rounded-xl shadow-card p-6"
      >
        {isPostAccepted ? (
          /* Post-acceptance: locked read-only summary */
          displayBreakdown ? (
            <>
              <h2 className="text-base font-semibold text-foreground mb-4">
                Quotation Summary
              </h2>
              <BreakdownCard bd={displayBreakdown} />
            </>
          ) : null
        ) : (
          /* Pre-acceptance: full send-quotation section */
          <>
            <div className="border-l-4 border-orange-500 pl-3 mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Send Quotation
              </h2>
            </div>

            {isQuoteAlreadySent ? (
              /* Quotation already sent — show completion state */
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Quotation Sent
                    </p>
                    <p className="text-xs text-emerald-600">
                      Customer can now view and accept the quote
                    </p>
                  </div>
                </div>
                {displayBreakdown && <BreakdownCard bd={displayBreakdown} />}
              </div>
            ) : (
              /* Full quotation form */
              <div className="space-y-4">
                {/* Qty info banner */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
                  <Info size={14} className="text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    Order quantity:{" "}
                    <span className="font-bold">{orderQty} units</span>. Enter
                    price per unit — total base price will be calculated
                    automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Price per unit */}
                  <div>
                    <label
                      htmlFor="team-price-per-unit"
                      className="block text-xs font-medium text-foreground mb-1.5"
                    >
                      Price per Unit (₹)
                    </label>
                    <input
                      id="team-price-per-unit"
                      type="number"
                      min="0"
                      className="form-input w-full"
                      placeholder="e.g. 500"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value)}
                      data-ocid="team_order_detail.input"
                    />
                  </div>

                  {/* GST */}
                  <div>
                    <label
                      htmlFor="team-gst-select"
                      className="block text-xs font-medium text-foreground mb-1.5"
                    >
                      GST Rate
                    </label>
                    <select
                      id="team-gst-select"
                      className="form-input w-full"
                      value={gstPercent}
                      onChange={(e) => setGstPercent(Number(e.target.value))}
                      data-ocid="team_order_detail.select"
                    >
                      {GST_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}%
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Charges */}
                  <div>
                    <label
                      htmlFor="team-delivery"
                      className="block text-xs font-medium text-foreground mb-1.5"
                    >
                      Delivery Charges (₹)
                    </label>
                    <input
                      id="team-delivery"
                      type="number"
                      min="0"
                      className="form-input w-full"
                      placeholder="e.g. 2000"
                      value={deliveryCharges}
                      onChange={(e) => setDeliveryCharges(e.target.value)}
                    />
                  </div>
                </div>

                {/* Live Breakdown Preview */}
                {pricePerUnitNum > 0 && (
                  <div className="bg-muted/30 border border-border rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Quotation Breakdown Preview
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-border">
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Per Unit
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          ₹{pricePerUnitNum.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          × {orderQty} units = Base
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          ₹{basePrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 border-l border-border sm:border-l-0 border-t border-border sm:border-t-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          GST ({gstPercent}%)
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          ₹{gstAmt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Delivery
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          ₹{deliveryNum.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50">
                        <p className="text-xs text-orange-600 mb-0.5">Total</p>
                        <p className="text-base font-extrabold text-orange-600">
                          ₹{totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={pricePerUnitNum <= 0}
                  onClick={handleSendQuotation}
                  data-ocid="team_order_detail.submit_button"
                >
                  <SendHorizonal size={15} />
                  Send Quotation to Customer
                </button>
                {pricePerUnitNum <= 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Enter price per unit to enable sending
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Section 3: Order Progress + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Order Progress Timeline ── */}
        <div
          className="lg:col-span-3 bg-white border border-border rounded-xl shadow-card p-6"
          data-ocid="team_order_detail.panel"
        >
          <h2 className="text-base font-semibold text-foreground mb-6">
            Order Progress
          </h2>
          <div className="relative">
            {ORDER_STEPS.map((step, index) => {
              const state = getStepState(step.key, currentStepKey);
              const isLast = index === ORDER_STEPS.length - 1;
              const prevStepCompleted =
                index > 0 &&
                getStepState(ORDER_STEPS[index - 1].key, currentStepKey) ===
                  "completed";

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {!isLast && (
                    <ConnectorLine
                      state={state === "completed" ? "completed" : "pending"}
                    />
                  )}
                  <StepDot state={state} />
                  <div
                    className={`pb-7 ${isLast ? "pb-0" : ""} flex-1 min-w-0`}
                  >
                    <p
                      className={`text-sm font-semibold leading-tight transition-colors duration-300 ${
                        state === "completed"
                          ? "text-emerald-700"
                          : state === "active"
                            ? "text-blue-700"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {state === "active" && (
                      <p className="text-xs text-blue-500 mt-0.5 font-medium">
                        Current status
                      </p>
                    )}
                    {state === "completed" &&
                      prevStepCompleted === false &&
                      index > 0 && (
                        <p className="text-xs text-emerald-500 mt-0.5">
                          Completed
                        </p>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Actions Panel ── */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl shadow-card p-6 flex flex-col">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Actions
          </h2>

          {actionConfig === null && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                No actions available for this status.
              </p>
            </div>
          )}

          {actionConfig?.type === "done" && (
            <div
              className="flex-1 flex flex-col items-center justify-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-6"
              data-ocid="team_order_detail.success_state"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <PackageCheck size={28} className="text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-emerald-800">
                  Order Completed Successfully
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  This order has been fully processed.
                </p>
              </div>
            </div>
          )}

          {actionConfig?.type === "wait" && (
            <div
              className="flex-1 flex flex-col justify-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-5"
              data-ocid="team_order_detail.loading_state"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">Waiting</p>
                  <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                    {actionConfig.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-100/60 rounded-lg px-3 py-2 mt-1">
                <Info size={13} className="text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  No action required from you right now.
                </p>
              </div>
            </div>
          )}

          {actionConfig?.type === "quotation" && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Quotation Required
                    </p>
                    <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                      Fill in the quotation details in the{" "}
                      <strong>Send Quotation</strong> section above and send it
                      to the customer.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                onClick={() => {
                  const el = document.getElementById("quotation-section");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                data-ocid="team_order_detail.primary_button"
              >
                <SendHorizonal size={15} />
                Go to Send Quotation
              </button>
            </div>
          )}

          {actionConfig?.type === "button" && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                  Next Step
                </p>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Click the button below to advance this order to the next
                  stage.
                </p>
              </div>
              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
                onClick={() => handleActionButton(actionConfig.nextStatus)}
                data-ocid="team_order_detail.primary_button"
              >
                <Check size={15} strokeWidth={2.5} />
                {actionConfig.label}
              </button>
              <div className="mt-auto pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-emerald-600">
                    {getStepIndex(currentStepKey)}
                  </span>{" "}
                  of {ORDER_STEPS.length} steps completed
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completed steps: disabled button previews */}
      {currentStepKey !== "new" &&
        currentStepKey !== "assigned" &&
        currentStepKey !== "quoted" &&
        currentStepKey !== "completed" && (
          <div className="bg-white border border-border rounded-xl shadow-card p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">
              All Process Steps
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Color indicates step status. Only the current step (blue) is
              actionable.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Send Quotation", step: "assigned" },
                { label: "Start Preparing", step: "advanceVerified" },
                { label: "Mark as Order Prepared", step: "preparing" },
                { label: "Mark as In Transit", step: "orderPrepared" },
                { label: "Mark as Delivered", step: "inTransit" },
                { label: "Complete Order", step: "finalPaymentVerified" },
              ].map(({ label, step }) => {
                const btnState = getStepState(step, currentStepKey);
                const isActive = btnState === "active";
                const isCompleted = btnState === "completed";

                return (
                  <button
                    key={step}
                    type="button"
                    disabled={!isActive}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 pointer-events-none ${
                      isCompleted
                        ? "bg-emerald-500 text-white opacity-80 cursor-not-allowed"
                        : isActive
                          ? "bg-blue-600 text-white cursor-pointer pointer-events-auto"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    data-ocid={"team_order_detail.secondary_button"}
                  >
                    {isCompleted ? (
                      <Check size={13} strokeWidth={3} />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-xs text-muted-foreground">
                  Active (clickable)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-gray-200" />
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>
        )}

      {/* Section 4: Tracking */}
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
