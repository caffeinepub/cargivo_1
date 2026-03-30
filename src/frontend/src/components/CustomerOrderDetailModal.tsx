import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Lock,
  Shield,
  Truck,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { SampleOrder } from "../pages/sampleData";
import { StatusBadge } from "./StatusBadge";

interface Props {
  order: SampleOrder | null;
  open: boolean;
  onClose: () => void;
}

const TIMELINE_STEPS = [
  { key: "new", label: "New Order" },
  { key: "assigned", label: "Assigned" },
  { key: "quoted", label: "Quotation Sent" },
  { key: "accepted", label: "Quote Accepted" },
  { key: "advanceVerified", label: "Advance Payment Verified" },
  { key: "preparing", label: "Preparing" },
  { key: "inTransit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
  { key: "finalPaymentPending", label: "Final Payment Pending" },
  { key: "completed", label: "Completed" },
];

const STATUS_ORDER = [
  "new",
  "assigned",
  "quoted",
  "accepted",
  "advanceVerified",
  "preparing",
  "inTransit",
  "delivered",
  "finalPaymentPending",
  "completed",
];

const BANK_DETAILS = [
  { label: "Bank", value: "HDFC Bank" },
  { label: "Account Name", value: "Cargivo Logistics Pvt Ltd" },
  { label: "Account No.", value: "50200094178901", copyable: true },
  { label: "IFSC Code", value: "HDFC0001234" },
  { label: "Branch", value: "Andheri East, Mumbai" },
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

function PaymentForm({
  refValue,
  onRefChange,
  fileName,
  onFileChange,
  submitLabel,
  submitOcid,
}: {
  refValue: string;
  onRefChange: (v: string) => void;
  fileName: string | null;
  onFileChange: (name: string | null) => void;
  submitLabel: string;
  submitOcid: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="utr-ref-input"
          className="block text-xs font-medium text-foreground mb-1.5"
        >
          UTR / Reference Number
        </label>
        <input
          id="utr-ref-input"
          type="text"
          className="form-input w-full"
          placeholder="Enter UTR or reference number"
          value={refValue}
          onChange={(e) => onRefChange(e.target.value)}
          data-ocid="customer_order_detail.input"
        />
      </div>
      <div>
        <p className="block text-xs font-medium text-foreground mb-1.5">
          Payment Screenshot
        </p>
        <label
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-5 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
          data-ocid="customer_order_detail.upload_button"
        >
          <Upload size={20} className="text-muted-foreground" />
          {fileName ? (
            <span className="text-sm font-medium text-primary">{fileName}</span>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                Click to upload screenshot
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG — max 5MB
              </span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>
      <button
        type="button"
        className="btn-primary w-full py-3 text-sm font-semibold"
        data-ocid={submitOcid}
      >
        {submitLabel}
      </button>
      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Lock size={11} />
        Your payment will be verified within 2 business hours
      </p>
    </div>
  );
}

export function CustomerOrderDetailModal({ order, open, onClose }: Props) {
  const [advanceRef, setAdvanceRef] = useState("");
  const [finalRef, setFinalRef] = useState("");
  const [advanceFile, setAdvanceFile] = useState<string | null>(null);
  const [finalFile, setFinalFile] = useState<string | null>(null);

  if (!order) return null;

  const status = order.status.toLowerCase();
  const statusIdx = STATUS_ORDER.indexOf(status);
  const acceptedIdx = STATUS_ORDER.indexOf("accepted");
  const advanceVerifiedIdx = STATUS_ORDER.indexOf("advanceVerified");
  const finalPaymentIdx = STATUS_ORDER.indexOf("finalPaymentPending");
  const deliveredIdx = STATUS_ORDER.indexOf("delivered");

  const isQuoted = status === "quoted";
  const isAdvanceStage = status === "accepted";
  const isAdvanceVerified =
    statusIdx >= advanceVerifiedIdx &&
    statusIdx < finalPaymentIdx &&
    statusIdx < deliveredIdx;
  const isFinalStage =
    status === "finalpaymentpending" ||
    status === "finalPaymentPending" ||
    status === "delivered" ||
    status === "completed";
  const isInTransit =
    status === "intransit" || status === "inTransit" || status === "shipped";
  const showDocs = statusIdx >= acceptedIdx;
  const showInvoice = isFinalStage;

  const reqId = `#CGV-00${order.id.toString()}`;
  const advance = Math.round(order.amount / 2);
  const remaining = order.amount - advance;

  const orderDetails = [
    { label: "Box Type", value: order.boxType },
    { label: "Location", value: order.location ?? "—" },
    { label: "Dimensions", value: order.dimensions ?? "—" },
    { label: "Submitted Date", value: order.date },
    { label: "Quantity", value: `${order.qty.toLocaleString()} units` },
    {
      label: "Assigned",
      value: order.assignedTo ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
          <Check size={12} /> Yes
        </span>
      ) : (
        <span className="text-muted-foreground">No</span>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-xl p-0 gap-0 overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
        data-ocid="customer_order_detail.dialog"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold text-primary tracking-wide">
              {reqId}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            data-ocid="customer_order_detail.close_button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-6">
            {/* Section 1: Order Details */}
            <section>
              <h3 className="section-title mb-3">Order Details</h3>
              <div className="bg-muted/30 rounded-xl border border-border grid grid-cols-2 gap-0 overflow-hidden">
                {orderDetails.map((item, i) => (
                  <div
                    key={item.label}
                    className={`p-3.5 border-b border-border last:border-b-0 ${
                      i % 2 === 1 ? "border-l border-border" : ""
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Documents Section */}
            {showDocs && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="section-title mb-3">Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Quotation PDF */}
                  <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Quotation PDF
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Issued quotation
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                      data-ocid="customer_order_detail.download_button"
                    >
                      <Download size={13} />
                      Download
                    </button>
                  </div>

                  {/* Invoice PDF */}
                  {showInvoice && (
                    <div className="bg-white border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Invoice PDF
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Final tax invoice
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium transition-colors"
                      >
                        <Download size={13} />
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Quote Section */}
            {isQuoted && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="section-title mb-3">Quote</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-orange-600 font-medium mb-1">
                        Quote Amount
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        ₹{order.amount.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Valid for 3 days
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      className="btn-primary flex-1 py-2 text-sm"
                      data-ocid="customer_order_detail.confirm_button"
                    >
                      Accept Quote
                    </button>
                    <button
                      type="button"
                      className="btn-danger flex-1 py-2 text-sm"
                      data-ocid="customer_order_detail.cancel_button"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Advance Payment Stage */}
            {isAdvanceStage && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="section-title">Advance Payment</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                    <Shield size={11} />
                    50% of total
                  </span>
                </div>

                {/* Amount cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted/40 border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Quote
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      ₹{order.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-primary/8 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs text-primary/80 mb-1">
                      Advance Payable
                    </p>
                    <p className="text-xl font-bold text-primary">
                      ₹{advance.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Bank details */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-3">
                    Bank Details
                  </p>
                  <div className="space-y-2">
                    {BANK_DETAILS.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-blue-700/70">{row.label}</span>
                        <span className="font-medium text-blue-900 font-mono flex items-center gap-2">
                          {row.value}
                          {row.copyable && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(row.value);
                                toast.success("Copied!");
                              }}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              aria-label="Copy account number"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <PaymentForm
                  refValue={advanceRef}
                  onRefChange={setAdvanceRef}
                  fileName={advanceFile}
                  onFileChange={setAdvanceFile}
                  submitLabel="Submit Advance Payment"
                  submitOcid="customer_order_detail.submit_advance.button"
                />
              </motion.section>
            )}

            {/* Advance Verified */}
            {isAdvanceVerified && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2
                    size={22}
                    className="text-emerald-600 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Advance Payment Verified
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      ₹{advance.toLocaleString()} received. Your order is being
                      processed.
                    </p>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Final Payment Stage */}
            {isFinalStage && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="section-title">Final Payment</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={11} />
                    Advance verified
                  </span>
                </div>

                {/* Invoice download card */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FileText size={18} className="text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">
                        Invoice PDF Ready
                      </p>
                      <p className="text-xs text-emerald-600">
                        Final tax invoice
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>

                {/* Remaining balance */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted/40 border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Amount Paid
                    </p>
                    <p className="text-xl font-bold text-emerald-600">
                      ₹{advance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-xs text-orange-700/80 mb-1">
                      Remaining Balance
                    </p>
                    <p className="text-xl font-bold text-orange-600">
                      ₹{remaining.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Make Final Payment
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Bank details */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-3">
                    Bank Details
                  </p>
                  <div className="space-y-2">
                    {BANK_DETAILS.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-blue-700/70">{row.label}</span>
                        <span className="font-medium text-blue-900 font-mono flex items-center gap-2">
                          {row.value}
                          {row.copyable && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(row.value);
                                toast.success("Copied!");
                              }}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              aria-label="Copy account number"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <PaymentForm
                  refValue={finalRef}
                  onRefChange={setFinalRef}
                  fileName={finalFile}
                  onFileChange={setFinalFile}
                  submitLabel="Submit Final Payment"
                  submitOcid="customer_order_detail.submit_final.button"
                />
              </motion.section>
            )}

            {/* Status Timeline */}
            <section>
              <h3 className="section-title mb-4">Order Progress</h3>
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
                      <div className="pb-5 pt-1">
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

            {/* Tracking */}
            {isInTransit && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Truck size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Your order is on the way!
                      </p>
                      <p className="text-xs text-blue-600">
                        Real-time tracking available
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary text-sm px-4 py-2"
                    data-ocid="customer_order_detail.track_order.button"
                  >
                    Track Order
                  </button>
                </div>
              </motion.section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
