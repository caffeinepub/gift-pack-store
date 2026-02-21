# Specification

## Summary
**Goal:** Fix the catalog/browse page so that gift pack tiles load and display correctly.

**Planned changes:**
- Debug and fix the issue preventing gift pack tiles from rendering on CatalogPage.tsx
- Verify useGiftPacks hook is correctly fetching and passing data to ProductGrid component
- Check backend main.mo actor is returning gift pack data correctly and that gift packs exist in storage
- Ensure filtering, search, loading states, and error states work properly with the tiles

**User-visible outcome:** Users can browse and view all available gift packs as tiles on the catalog page, with working search and filter functionality.
