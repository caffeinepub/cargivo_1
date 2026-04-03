import { CheckCircle2, ChevronLeft, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/ds/StatusBadge";
import type { QuoteBreakdown } from "../utils/quoteStore";
import { sendQuotation } from "../utils/quoteStore";
import type { SampleOrder } from "./sampleData";

interface Props {
  order: SampleOrder;
  onBack: () => void;
}

const GST_OPTIONS = [5, 12, 18, 28];

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

  const isQuoteAlreadySent = quoteSent || !!order.quoteBreakdown;

  const handleStatusUpdate = (label: string) => {
    toast.success(`Status updated to ${label}`);
  };

  function handleSendQuotation() {
    if (!basePriceNum || basePriceNum <= 0) return;
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

  const handleSaveTracking = () => {
    if (!transportPartner && !trackingLink) {
      toast.error("Please fill in tracking details");
      return;
    }
    toast.success("Tracking info saved");
  };

  // Resolve the quote breakdown to display (either from state or from order)
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

      {/* Section 2: Send Quotation */}
      <div className="bg-white border border-border rounded-xl shadow-card p-6">
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
            {displayBreakdown ? (
              <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="p-3 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Base Price
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{displayBreakdown.basePrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      GST ({displayBreakdown.gstPercent}%)
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{displayBreakdown.gstAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Delivery Charges
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{displayBreakdown.deliveryCharges.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50">
                    <p className="text-xs text-orange-600 mb-0.5">
                      Total Amount
                    </p>
                    <p className="text-base font-extrabold text-orange-600">
                      ₹{displayBreakdown.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : quoteSent && totalAmount > 0 ? (
              <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="p-3 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Base Price
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{basePriceNum.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      GST ({gstPercent}%)
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{gstAmt.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Delivery Charges
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{deliveryNum.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50">
                    <p className="text-xs text-orange-600 mb-0.5">
                      Total Amount
                    </p>
                    <p className="text-base font-extrabold text-orange-600">
                      ₹{totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* Full quotation form */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Base Price */}
              <div>
                <label
                  htmlFor="team-base-price"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  Base Price (₹)
                </label>
                <input
                  id="team-base-price"
                  type="number"
                  min="0"
                  className="form-input w-full"
                  placeholder="e.g. 50000"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
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
            {basePriceNum > 0 && (
              <div className="bg-muted/30 border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Quotation Breakdown
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Base Price
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{basePriceNum.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      GST ({gstPercent}%)
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{gstAmt.toLocaleString()}
                    </p>
                  </div>
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
                    <p className="text-sm font-extrabold text-orange-600">
                      ₹{totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={basePriceNum <= 0}
              onClick={handleSendQuotation}
              data-ocid="team_order_detail.submit_button"
            >
              <SendHorizonal size={15} />
              Send Quotation to Customer
            </button>
            {basePriceNum <= 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Enter base price to enable sending
              </p>
            )}
          </div>
        )}
      </div>

      {/* Section 3: Status Update */}
      <div className="bg-white border border-border rounded-xl shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Update Status
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleStatusUpdate("Preparing Order")}
            data-ocid="team_order_detail.secondary_button"
          >
            Preparing Order
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleStatusUpdate("Order Prepared")}
          >
            Order Prepared
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleStatusUpdate("In Transit")}
          >
            In Transit
          </button>
          <button
            type="button"
            onClick={() => handleStatusUpdate("Delivered")}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Delivered
          </button>
        </div>
      </div>

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
