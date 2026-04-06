import type { SampleOrder } from "../pages/sampleData";

interface Props {
  order: SampleOrder;
  onClose: () => void;
}

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

export function InvoicePrint({ order, onClose }: Props) {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const invoiceNumber = `CGV-INV-${order.id.toString().padStart(5, "0")}`;
  const statusIdx = STATUS_ORDER.indexOf(order.status.toLowerCase());
  const finalVerifiedIdx = STATUS_ORDER.indexOf("finalPaymentVerified");

  const isAdvanceVerified =
    statusIdx >= STATUS_ORDER.indexOf("advanceVerified");
  const isFinalVerified = statusIdx >= finalVerifiedIdx;

  const bd = order.quoteBreakdown;

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto py-6 px-4"
      data-ocid="invoice.modal"
    >
      <style>{`
        @media print {
          body > *:not(#invoice-print-root) { display: none !important; }
          #invoice-print-root { position: fixed; inset: 0; background: white; padding: 0; margin: 0; }
          #invoice-print-root .no-print { display: none !important; }
          #invoice-print-root .invoice-sheet {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div id="invoice-print-root" className="w-full max-w-2xl">
        {/* Action bar */}
        <div className="no-print flex items-center justify-between mb-4">
          <p className="text-white text-sm font-medium">Invoice Preview</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              data-ocid="invoice.primary_button"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print / Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
              data-ocid="invoice.close_button"
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice sheet */}
        <div
          className="invoice-sheet bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: "#111" }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
              padding: "32px 40px 28px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.5px",
                  marginBottom: "4px",
                }}
              >
                CARGIVO
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                Fast. Reliable. Custom Cargo Solutions.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "8px",
                  padding: "6px 16px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  marginBottom: "10px",
                }}
              >
                TAX INVOICE
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}
              >
                <div style={{ marginBottom: "2px" }}>
                  <span style={{ opacity: 0.7 }}>Invoice No: </span>
                  <strong style={{ color: "white" }}>#{invoiceNumber}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Date: </span>
                  <strong style={{ color: "white" }}>{today}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "32px 40px" }}>
            {/* Bill To */}
            <div
              style={{
                marginBottom: "28px",
                padding: "18px 20px",
                background: "#f8fafc",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#1d4ed8",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Bill To
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  marginBottom: "4px",
                }}
              >
                {order.customer || "—"}
              </div>
              {order.customerCompany && (
                <div
                  style={{
                    fontSize: "13px",
                    color: "#475569",
                    marginBottom: "2px",
                  }}
                >
                  {order.customerCompany}
                </div>
              )}
              {order.location && (
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  📍 {order.location}
                </div>
              )}
            </div>

            {/* Order Details table */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#1d4ed8",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Order Details
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    {["Box Type", "Dimensions (mm)", "Quantity"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 14px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "12px",
                          color: "#374151",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: 500,
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {order.boxType}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#374151",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {order.dimensions ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#374151",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {order.qty.toLocaleString()} units
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quotation Breakdown */}
            {bd && (
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#1d4ed8",
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Quotation Breakdown
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      {[
                        "Price per Unit",
                        "Qty",
                        "Base Price",
                        `GST (${bd.gstPercent}%)`,
                        "Delivery",
                        "Total",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: "12px",
                            color: "#374151",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "12px 14px", color: "#374151" }}>
                        ₹{bd.pricePerUnit.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#374151" }}>
                        {bd.quantity}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#374151" }}>
                        ₹{bd.basePrice.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#374151" }}>
                        ₹{bd.gstAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#374151" }}>
                        ₹{bd.deliveryCharges.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontWeight: 800,
                          fontSize: "14px",
                          color: "#1d4ed8",
                          background: "#eff6ff",
                        }}
                      >
                        ₹{bd.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Payment Status */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#1d4ed8",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Payment Status
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {isAdvanceVerified && (
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "#f0fdf4",
                      border: "1px solid #86efac",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "#16a34a", fontSize: "16px" }}>
                      ✓
                    </span>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "12px",
                          color: "#15803d",
                        }}
                      >
                        Advance Payment
                      </div>
                      <div style={{ fontSize: "11px", color: "#16a34a" }}>
                        Verified
                      </div>
                    </div>
                  </div>
                )}
                <div
                  style={{
                    padding: "12px 16px",
                    background: isFinalVerified ? "#f0fdf4" : "#fff7ed",
                    border: `1px solid ${isFinalVerified ? "#86efac" : "#fed7aa"}`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      color: isFinalVerified ? "#16a34a" : "#ea580c",
                      fontSize: "16px",
                    }}
                  >
                    {isFinalVerified ? "✓" : "⏳"}
                  </span>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "12px",
                        color: isFinalVerified ? "#15803d" : "#c2410c",
                      }}
                    >
                      Final Payment
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: isFinalVerified ? "#16a34a" : "#ea580c",
                      }}
                    >
                      {isFinalVerified ? "Verified" : "Pending"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                borderTop: "1px dashed #e2e8f0",
                margin: "24px 0",
              }}
            />

            {/* Footer */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1d4ed8",
                  marginBottom: "4px",
                }}
              >
                Thank you for your business — Cargivo
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                For any queries, contact us at support@cargivo.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
