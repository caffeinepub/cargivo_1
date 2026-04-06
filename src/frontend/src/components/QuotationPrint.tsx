import type { SampleOrder } from "../pages/sampleData";

interface Props {
  order: SampleOrder;
  onClose: () => void;
}

export function QuotationPrint({ order, onClose }: Props) {
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 3);
  const validUntilStr = validUntil.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const quotationNumber = `CGV-QUO-${order.id.toString().padStart(5, "0")}`;
  const bd = order.quoteBreakdown;
  const totalAmount = bd ? bd.totalAmount : order.amount;
  const advance = Math.round(totalAmount / 2);
  const balance = totalAmount - advance;

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 flex items-start justify-center overflow-y-auto py-6 px-4"
      data-ocid="quotation.modal"
    >
      <style>{`
        @media print {
          body > *:not(#quotation-print-root) { display: none !important; }
          #quotation-print-root { position: fixed; inset: 0; background: white; padding: 0; margin: 0; }
          #quotation-print-root .no-print { display: none !important; }
          #quotation-print-root .quotation-sheet {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div id="quotation-print-root" className="w-full max-w-2xl">
        {/* Action bar */}
        <div className="no-print flex items-center justify-between mb-4">
          <p className="text-white text-sm font-medium">Quotation Preview</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              data-ocid="quotation.primary_button"
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
              data-ocid="quotation.close_button"
            >
              Close
            </button>
          </div>
        </div>

        {/* Quotation sheet */}
        <div
          className="quotation-sheet bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
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
                QUOTATION
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}
              >
                <div style={{ marginBottom: "2px" }}>
                  <span style={{ opacity: 0.7 }}>Quote No: </span>
                  <strong style={{ color: "white" }}>#{quotationNumber}</strong>
                </div>
                <div style={{ marginBottom: "2px" }}>
                  <span style={{ opacity: 0.7 }}>Issue Date: </span>
                  <strong style={{ color: "white" }}>{todayStr}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Valid Until: </span>
                  <strong style={{ color: "#fbbf24" }}>{validUntilStr}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "32px 40px" }}>
            {/* Quote To */}
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
                Quote To
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
              {order.customerEmail && (
                <div
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginBottom: "2px",
                  }}
                >
                  ✉ {order.customerEmail}
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

            {/* Price Breakdown */}
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
                Price Breakdown
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
                <tbody>
                  {bd ? (
                    <>
                      <tr
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          background: "#fafafa",
                        }}
                      >
                        <td style={{ padding: "11px 14px", color: "#475569" }}>
                          Price per Unit × {bd.quantity ?? order.qty} units
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            textAlign: "right",
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        >
                          ₹{(bd.pricePerUnit ?? 0).toLocaleString()} ×{" "}
                          {bd.quantity ?? order.qty} = ₹
                          {bd.basePrice.toLocaleString()}
                        </td>
                      </tr>
                      <tr
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          background: "#fafafa",
                        }}
                      >
                        <td style={{ padding: "11px 14px", color: "#475569" }}>
                          GST ({bd.gstPercent}%)
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            textAlign: "right",
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        >
                          ₹{bd.gstAmount.toLocaleString()}
                        </td>
                      </tr>
                      <tr
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          background: "#fafafa",
                        }}
                      >
                        <td style={{ padding: "11px 14px", color: "#475569" }}>
                          Delivery Charges
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            textAlign: "right",
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        >
                          ₹{bd.deliveryCharges.toLocaleString()}
                        </td>
                      </tr>
                      <tr
                        style={{
                          background:
                            "linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)",
                        }}
                      >
                        <td
                          style={{
                            padding: "14px 14px",
                            fontWeight: 800,
                            fontSize: "14px",
                            color: "#1e3a8a",
                          }}
                        >
                          Total Amount
                        </td>
                        <td
                          style={{
                            padding: "14px 14px",
                            textAlign: "right",
                            fontWeight: 900,
                            fontSize: "16px",
                            color: "#1d4ed8",
                          }}
                        >
                          ₹{bd.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr
                      style={{
                        background:
                          "linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 14px",
                          fontWeight: 800,
                          fontSize: "14px",
                          color: "#1e3a8a",
                        }}
                      >
                        Total Amount
                      </td>
                      <td
                        style={{
                          padding: "14px 14px",
                          textAlign: "right",
                          fontWeight: 900,
                          fontSize: "16px",
                          color: "#1d4ed8",
                        }}
                      >
                        ₹{order.amount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Payment Schedule */}
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
                Payment Schedule
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#1d4ed8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "6px",
                    }}
                  >
                    Advance (50%)
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "#1e3a8a",
                      marginBottom: "4px",
                    }}
                  >
                    ₹{advance.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: "#3b82f6" }}>
                    Due upon order confirmation
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#ea580c",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "6px",
                    }}
                  >
                    Balance (50%)
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "#9a3412",
                      marginBottom: "4px",
                    }}
                  >
                    ₹{balance.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: "#ea580c" }}>
                    Due upon delivery
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div
              style={{
                marginBottom: "24px",
                padding: "16px 20px",
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
                Terms &amp; Conditions
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  fontSize: "12px",
                  color: "#475569",
                  lineHeight: "1.8",
                }}
              >
                <li>
                  This quotation is valid for <strong>3 days</strong> from the
                  issue date.
                </li>
                <li>
                  A <strong>50% advance payment</strong> is required to confirm
                  the order.
                </li>
                <li>
                  The remaining <strong>50% balance</strong> is due upon
                  delivery.
                </li>
                <li>
                  All prices are <strong>GST inclusive</strong> as per the
                  breakdown above.
                </li>
                <li>
                  Delivery timelines are subject to production capacity and
                  location.
                </li>
                <li>
                  Custom specifications are non-refundable once production
                  begins.
                </li>
              </ul>
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
                Thank you for choosing Cargivo
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
