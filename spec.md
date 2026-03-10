# Specification

## Summary
**Goal:** Fix the CartSummary component to correctly display item count and total price calculations.

**Planned changes:**
- Debug and fix CartSummary component to display accurate item count, subtotal, GST (18%), and total price
- Verify useCart hook correctly manages cart state and provides accurate data to CartSummary
- Ensure CartItemRow components correctly pass pricing and quantity data for summary calculations
- Ensure cart summary updates immediately when items are added, removed, or quantities changed

**User-visible outcome:** Users will see accurate cart totals, item counts, and price breakdowns in the cart summary that update correctly when cart contents change.
