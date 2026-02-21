# Specification

## Summary
**Goal:** Enable admins to create and view gift packs through the admin dashboard.

**Planned changes:**
- Add GiftPackForm component with fields for pack ID, title, description, price, discount, category, image URL, basket type, and size
- Add GiftPackList component to display all existing gift packs in a grid layout
- Add GiftPackManagement component that combines the form and list with creation handling
- Update AdminPage to include a fourth management section for Gift Packs

**User-visible outcome:** Admins can create new gift packs through a dedicated form and view all existing gift packs in the admin dashboard alongside categories, products, and coupons.
