# Specification

## Summary
**Goal:** Sync cart state with backend on login and clear cart on logout.

**Planned changes:**
- Fetch cart data from backend immediately after successful Internet Identity login
- Replace local cart state with backend cart data after login
- Clear cart state completely when user logs out
- Update cart icon badge to reflect correct item count after login/logout

**User-visible outcome:** When users log in, their cart automatically syncs with saved items from the backend. When they log out, the cart is cleared and shows 0 items.
