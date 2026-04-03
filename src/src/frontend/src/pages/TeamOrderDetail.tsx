import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/ds/StatusBadge";
import type { SampleOrder } from "./sampleData";

interface Props {
  order: SampleOrder;
  onBack: () => void;
}

export function TeamOrderDetail({ order, onBack }: Props) {
  const [transportPartner, setTransportPartner] = useState("");
  const [trackingLink, setTrackingLink] = useState("");

  const handleStatusUpdate = (label: string) => {
    toast.success(`Status updated to ${label}`);
  };

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

      {/* Section 2: Quotation Breakdown (read-only, set by Admin) */}
      <div className="bg-white border border-border rounded-xl shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Quotation
        </h2>
        {order.quoteBreakdown ? (
          <>
            <div className="space-y-2 mb-4">
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
              <p className="text-xs text-muted-foreground">
                Sent by Admin on {order.quoteSentAt}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No quotation sent yet. Admin will send the quotation after reviewing
            this order.
          </p>
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
            <Label
              htmlFor="transport-partner"
              className="text-sm font-medium text-foreground mb-1 block"
            >
              Transport Partner
            </Label>
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
            <Label
              htmlFor="tracking-link"
              className="text-sm font-medium text-foreground mb-1 block"
            >
              Tracking Link
            </Label>
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
