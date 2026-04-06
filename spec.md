# Cargivo

## Current State
- Quote request form (`QuoteRequestModal.tsx`) collects dimensions labeled as "Dimensions (cm)" with inputs stored as `length`, `width`, `height` in cm.
- Dimensions are displayed throughout the app (Admin modal, Team order detail, Customer dashboard) with a " cm" suffix.
- The `QuoteRequest` store stores dimensions as raw strings and formats them as `${q.length} × ${q.width} × ${q.height} cm` in `TeamDashboard.tsx`.
- No invoice generation exists — customers see payment/breakdown info in a modal but cannot download any document.

## Requested Changes (Diff)

### Add
- **Invoice download button** on the Customer dashboard order modal, visible once order status reaches `delivered` or beyond.
- **`InvoicePDF` component** (`src/frontend/src/components/InvoicePDF.tsx`) that renders a printable invoice using `window.print()` in a hidden iframe or a pop-up print window.
  - Invoice content: Cargivo logo/name, invoice number (order ID), date, customer name + company, order details (box type, dimensions, qty), quotation breakdown (per unit price, base price, GST%, GST amount, delivery, total), payment status, and a footer.
  - Triggered by a "Download Invoice" (or "Print Invoice") button.
  - Uses `window.print()` approach — no external PDF library needed.

### Modify
- **`QuoteRequestModal.tsx`**: Change dimension label from `Dimensions (cm)` to `Dimensions (mm)`. Change `placeholder` text of inputs accordingly. Change the stored description string from `${length}x${width}x${height}cm` to `${length}x${width}x${height}mm`.
- **`TeamDashboard.tsx`**: Change dimension format string from `${q.length} × ${q.width} × ${q.height} cm` to `${q.length} × ${q.width} × ${q.height} mm`.
- **`TeamOrderDetail.tsx`** and **`AdminOrderDetailModal.tsx`**: Dimensions label text currently says "Dimensions" — add " (mm)" to the label to clarify units.
- **`CustomerOrderDetailModal.tsx`** / **`CustomerDashboard.tsx`**: Add "Download Invoice" button in the order modal when status is `delivered`, `finalPaymentPending`, `finalPaymentVerified`, or `completed`. Button opens the print/invoice view.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `QuoteRequestModal.tsx`: change label to mm, update placeholder and stored description string.
2. Update `TeamDashboard.tsx`: change dimensions format string to mm.
3. Update `TeamOrderDetail.tsx`: append " (mm)" to the Dimensions label in Order Details section.
4. Update `AdminOrderDetailModal.tsx`: append " (mm)" to the Dimensions field label.
5. Create `InvoicePDF.tsx` component that accepts order + breakdown data and renders a print-ready invoice layout, with a `handlePrint` function using `window.print()`.
6. Update `CustomerOrderDetailModal.tsx` (or equivalent customer modal) to show "Download Invoice" button for qualifying statuses, wiring it to `InvoicePDF`.
