# Cargivo

## Current State
- The "Send Quotation" form (base price, GST rate selector, delivery charges, live breakdown, send button) lives in `AdminOrderDetailModal.tsx` under Section 4.
- `TeamOrderDetail.tsx` has a basic quote form with only a single price field and notes textarea.
- `sendQuotation()` in `quoteStore.ts` saves the full breakdown and updates status to "quoted".

## Requested Changes (Diff)

### Add
- Full quotation form (base price, GST rate, delivery charges, live breakdown preview, send button with disable-after-send behavior) to `TeamOrderDetail.tsx` Section 2, replacing the old simple form.
- After sending, show a completion state with the breakdown summary in Team order detail.

### Modify
- `AdminOrderDetailModal.tsx`: Remove the full quotation input form (Section 4). Replace it with a read-only section that shows either:
  - If quote has been sent: a green completion card with the breakdown (base price, GST, delivery, total)
  - If quote not yet sent: a neutral info notice that the assigned team member will send the quotation
- `TeamOrderDetail.tsx`: Replace the old simple quote form with the full breakdown form (same as what was in admin modal).

### Remove
- Old simple quote form (price + notes textarea) from `TeamOrderDetail.tsx`.
- Quotation input form (inputs + send button) from `AdminOrderDetailModal.tsx`.

## Implementation Plan
1. Update `TeamOrderDetail.tsx`:
   - Add state: `basePrice`, `gstPercent`, `deliveryCharges`, `quoteSent`
   - Import `sendQuotation` and `GST_OPTIONS` logic
   - Replace Section 2 with full quotation form matching the admin modal design
   - On send: call `sendQuotation(order.id.toString(), breakdown)`, set quoteSent=true
   - Show completion state with breakdown after sending
2. Update `AdminOrderDetailModal.tsx`:
   - Remove all quotation form state and inputs (basePrice, gstPercent, deliveryCharges, related handlers)
   - Replace Section 4 with read-only view: if quote sent show breakdown card, else show info note
   - Keep `isQuoteAlreadySent` check based on order.quoteBreakdown or order status
