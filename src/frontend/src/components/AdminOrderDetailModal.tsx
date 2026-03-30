import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ImageIcon, UserCog, X } from "lucide-react";
import { useState } from "react";
import type { SampleOrder } from "../pages/sampleData";
import { StatusBadge } from "./StatusBadge";

interface Props {
  order: SampleOrder | null;
  open: boolean;
  onClose: () => void;
}

const TIMELINE_STEPS = [
  { key: "new", label: "New" },
  { key: "assigned", label: "Assigned" },
  { key: "quoted", label: "Quotation Sent" },
  { key: "accepted", label: "Quote Accepted" },
  { key: "advanceVerified", label: "Advance Payment Verified" },
  { key: "preparing", label: "Preparing" },
  { key: "orderPrepared", label: "Order Prepared" },
  { key: "inTransit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
  { key: "finalPaymentVerified", label: "Final Payment Verified" },
  { key: "completed", label: "Completed" },
];

const STATUS_ORDER = [
  "new",
  "assigned",
  "quoted",
  "accepted",
  "advanceVerified",
  "preparing",
  "orderPrepared",
  "inTransit",
  "delivered",
  "finalPaymentVerified",
  "finalPaymentPending",
  "completed",
];

const CUSTOMER_FIELDS = [
  { id: "company", label: "Company" },
  { id: "state", label: "State" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "gst", label: "GST Number" },
];

const ORDER_FIELDS = [
  { id: "boxType", label: "Box Type" },
  { id: "location", label: "Delivery Location" },
  { id: "dimensions", label: "Dimensions" },
  { id: "quantity", label: "Quantity" },
];

function getStepState(
  stepKey: string,
  currentStatus: string,
): "completed" | "current" | "pending" {
  const stepIdx = STATUS_ORDER.indexOf(stepKey);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus.toLowerCase());
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "current";
  return "pending";
}

export function AdminOrderDetailModal({ order, open, onClose }: Props) {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!order) return null;

  const reqId = `#CGV-00${order.id.toString()}`;

  const customerValues: Record<string, string> = {
    company: order.customerCompany ?? "—",
    state: order.state ?? "—",
    email: order.customerEmail ?? "—",
    phone: order.customerPhone ?? "—",
    gst: order.customerGST ?? "—",
  };

  const orderValues: Record<string, string> = {
    boxType: order.boxType,
    location: order.location ?? "—",
    dimensions: order.dimensions ?? "—",
    quantity: `${order.qty.toLocaleString()} units`,
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 flex flex-col overflow-hidden"
        style={{ maxHeight: "92vh" }}
        data-ocid="admin_order_detail.dialog"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
          <div className="flex items-start gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-foreground tracking-wide">
                  {reqId}
                </span>
                <StatusBadge status={order.status} />
              </div>
              {order.customerCompany && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {order.customerCompany}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            data-ocid="admin_order_detail.close_button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-6">
            {/* Section 1: Customer Info */}
            <section>
              <div className="border-l-4 border-primary pl-3 mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Customer Information
                </h3>
              </div>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-border">
                  {CUSTOMER_FIELDS.map((field, i) => (
                    <div
                      key={field.id}
                      className={`p-3 border-b border-border ${
                        i >= CUSTOMER_FIELDS.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {field.label}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {customerValues[field.id]}
                      </p>
                    </div>
                  ))}
                  {/* Filler cell for even grid */}
                  <div className="p-3" />
                </div>
              </div>
            </section>

            {/* Section 2: Order Info */}
            <section>
              <div className="border-l-4 border-orange-400 pl-3 mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Order Information
                </h3>
              </div>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-border">
                  {ORDER_FIELDS.map((field, i) => (
                    <div
                      key={field.id}
                      className={`p-3 ${
                        i < ORDER_FIELDS.length - 2
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {field.label}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {orderValues[field.id]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3: Assignment */}
            <section>
              <div className="border-l-4 border-blue-400 pl-3 mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Assignment
                </h3>
              </div>
              <div className="bg-white border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Assigned To
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        order.assignedTo
                          ? "text-foreground"
                          : "text-muted-foreground italic"
                      }`}
                    >
                      {order.assignedTo ?? "Not Assigned"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
                    data-ocid="admin_order_detail.assign.button"
                  >
                    <UserCog size={14} />
                    {order.assignedTo ? "Change Assignment" : "Assign"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">State</p>
                    <p className="text-sm font-medium">{order.state ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Area</p>
                    <p className="text-sm font-medium">{order.area ?? "—"}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Payment Verification */}
            {order.paymentSubmitted && (
              <section>
                <div className="border-l-4 border-yellow-400 pl-3 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Payment Verification
                  </h3>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
                  <div>
                    <p className="text-xs text-amber-700 font-medium mb-1">
                      Reference Code
                    </p>
                    <p className="font-mono text-base font-bold text-amber-900">
                      {order.paymentRef ?? "—"}
                    </p>
                  </div>

                  {/* Screenshot placeholder */}
                  <div className="bg-white border-2 border-dashed border-amber-200 rounded-xl h-32 flex flex-col items-center justify-center gap-2">
                    <ImageIcon size={28} className="text-amber-300" />
                    <p className="text-xs text-muted-foreground">
                      Payment screenshot
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                      data-ocid="admin_order_detail.approve.primary_button"
                    >
                      Approve Payment
                    </button>
                    <button
                      type="button"
                      className="btn-danger flex-1 py-2 text-sm"
                      onClick={() => setShowRejectReason(!showRejectReason)}
                      data-ocid="admin_order_detail.reject.delete_button"
                    >
                      Reject
                    </button>
                  </div>

                  {showRejectReason && (
                    <div className="space-y-2">
                      <label
                        htmlFor="reject-reason-textarea"
                        className="text-xs font-medium text-foreground"
                      >
                        Rejection Reason
                      </label>
                      <textarea
                        id="reject-reason-textarea"
                        className="form-input w-full text-sm min-h-20 resize-none"
                        placeholder="Enter reason for rejection..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        data-ocid="admin_order_detail.reject_reason.textarea"
                      />
                      <button
                        type="button"
                        className="btn-danger w-full py-2 text-sm"
                        data-ocid="admin_order_detail.reject_confirm.delete_button"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Section 5: Order Progress */}
            <section>
              <div className="border-l-4 border-muted pl-3 mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Order Progress
                </h3>
              </div>
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, idx) => {
                  const state = getStepState(step.key, order.status);
                  const isLast = idx === TIMELINE_STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`relative w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                            state === "completed"
                              ? "bg-primary"
                              : state === "current"
                                ? "bg-orange-500"
                                : "bg-white border-2 border-muted"
                          }`}
                        >
                          {state === "current" && (
                            <span className="absolute inset-0 rounded-full bg-orange-400 opacity-40 animate-ping" />
                          )}
                          {state === "completed" && (
                            <Check size={13} className="text-white" />
                          )}
                          {state === "current" && (
                            <span className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 min-h-6 ${
                              state === "completed" ? "bg-primary" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-4 pt-1">
                        <p
                          className={`text-sm font-medium ${
                            state === "completed"
                              ? "text-primary"
                              : state === "current"
                                ? "text-orange-600"
                                : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        {state === "current" && (
                          <p className="text-xs text-orange-500 mt-0.5">
                            Current status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Sticky Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-white">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost text-sm px-4 py-2"
            data-ocid="admin_order_detail.footer.close_button"
          >
            Close
          </button>
          <button
            type="button"
            className="btn-primary text-sm px-6 py-2"
            data-ocid="admin_order_detail.footer.save_button"
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
