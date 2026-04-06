import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ImageIcon,
  Info,
  UserCog,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import type { SampleOrder } from "../pages/sampleData";
import { rejectPayment, verifyPayment } from "../utils/quoteStore";
import { StatusBadge } from "./StatusBadge";

interface Props {
  order: SampleOrder | null;
  open: boolean;
  onClose: () => void;
  teamMembers?: string[];
  onAssign?: (orderId: string, memberName: string) => void;
  onQuoteSent?: (orderId: string) => void;
  onPaymentVerified?: () => void;
}

const TIMELINE_STEPS = [
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
  { key: "finalPaymentPending", label: "Final Payment Pending" },
  { key: "finalPaymentVerified", label: "Final Payment Verified" },
  { key: "completed", label: "Completed" },
];

const STATUS_ORDER = [
  "new",
  "assigned",
  "quoted",
  "accepted",
  "advancePending",
  "advanceVerified",
  "preparing",
  "orderPrepared",
  "inTransit",
  "delivered",
  "finalPaymentPending",
  "finalPaymentVerified",
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
  { id: "dimensions", label: "Dimensions (mm)" },
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

export function AdminOrderDetailModal({
  order,
  open,
  onClose,
  teamMembers = [],
  onAssign,
  onPaymentVerified,
}: Props) {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const assignRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  // Payment verification logic based on status
  const isAdvancePaymentPending =
    order.status === "advancePending" ||
    order.status.toLowerCase() === "advancepending";
  const isFinalPaymentPending =
    order.status === "finalPaymentPending" ||
    order.status.toLowerCase() === "finalpaymentpending";
  const showPaymentVerification =
    isAdvancePaymentPending || isFinalPaymentPending;

  // Determine if quote has already been sent (status is quoted or beyond)
  const isQuoteAlreadySent =
    !!order.quoteBreakdown ||
    STATUS_ORDER.indexOf(order.status.toLowerCase()) >=
      STATUS_ORDER.indexOf("quoted");

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

  function handleAssignMember(name: string) {
    if (onAssign) {
      onAssign(order!.id.toString(), name);
    }
    setShowAssignDropdown(false);
  }

  function handleApprovePayment() {
    verifyPayment(
      order!.id.toString(),
      order!.paymentInfo?.type ??
        (isAdvancePaymentPending ? "advance" : "final"),
    );
    onPaymentVerified?.();
    onClose();
  }

  function handleRejectPayment() {
    rejectPayment(order!.id.toString());
    onPaymentVerified?.();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          setShowAssignDropdown(false);
        }
      }}
    >
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
        <div className="flex-1 overflow-y-auto min-h-0">
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
                  <div className="relative" ref={assignRef}>
                    <button
                      type="button"
                      className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
                      onClick={() => setShowAssignDropdown((v) => !v)}
                      data-ocid="admin_order_detail.assign.button"
                    >
                      <UserCog size={14} />
                      {order.assignedTo ? "Change Assignment" : "Assign"}
                      <ChevronDown
                        size={13}
                        className={`transition-transform ${showAssignDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Assignment Dropdown */}
                    {showAssignDropdown && (
                      <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                        {teamMembers.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-muted-foreground">
                            No team members available. Add team members first.
                          </div>
                        ) : (
                          <>
                            <div className="px-3 py-2 border-b border-border">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Select Team Member
                              </p>
                            </div>
                            <ul className="py-1">
                              {teamMembers.map((name) => (
                                <li key={name}>
                                  <button
                                    type="button"
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                                      order.assignedTo === name
                                        ? "bg-blue-50 text-primary font-medium"
                                        : "text-foreground"
                                    }`}
                                    onClick={() => handleAssignMember(name)}
                                    data-ocid="admin_order_detail.assign.secondary_button"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-primary">
                                        {name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    {name}
                                    {order.assignedTo === name && (
                                      <Check
                                        size={13}
                                        className="ml-auto text-primary"
                                      />
                                    )}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
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

            {/* Section 4: Quotation Status (read-only) */}
            <section>
              <div className="border-l-4 border-orange-500 pl-3 mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Quotation
                </h3>
              </div>

              {isQuoteAlreadySent ? (
                /* Quote already sent — show read-only completion card */
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
                  {order.quoteBreakdown && (
                    <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-2 divide-x divide-border">
                        <div className="p-3 border-b border-border">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Base Price
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            ₹{order.quoteBreakdown.basePrice.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 border-b border-border">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            GST ({order.quoteBreakdown.gstPercent}%)
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            ₹{order.quoteBreakdown.gstAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Delivery Charges
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            ₹
                            {order.quoteBreakdown.deliveryCharges.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-orange-50">
                          <p className="text-xs text-orange-600 mb-0.5">
                            Total Amount
                          </p>
                          <p className="text-base font-extrabold text-orange-600">
                            ₹{order.quoteBreakdown.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Quote not yet sent — info notice */
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-0.5">
                      Awaiting Quotation
                    </p>
                    <p className="text-xs text-blue-600">
                      The assigned team member will send the quotation once the
                      order has been reviewed.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Section 5: Payment Verification */}
            {showPaymentVerification && (
              <section>
                <div className="border-l-4 border-yellow-400 pl-3 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {isAdvancePaymentPending ? "Advance" : "Final"} Payment
                    Verification
                  </h3>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-amber-700 font-medium mb-1">
                        UTR / Reference Number
                      </p>
                      <p className="font-mono text-base font-bold text-amber-900">
                        {order.paymentInfo?.ref ?? "—"}
                      </p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                      Pending Verification
                    </span>
                  </div>

                  {/* Screenshot placeholder */}
                  <div className="bg-white border-2 border-dashed border-amber-200 rounded-xl h-24 flex flex-col items-center justify-center gap-2">
                    <ImageIcon size={24} className="text-amber-300" />
                    <p className="text-xs text-muted-foreground">
                      Payment screenshot (submitted by customer)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                      onClick={handleApprovePayment}
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
                        onClick={handleRejectPayment}
                        data-ocid="admin_order_detail.reject_confirm.delete_button"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Section 6: Order Progress */}
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
        </div>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
