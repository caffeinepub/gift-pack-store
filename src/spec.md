# Specification

## Summary
**Goal:** Enable multiple image support for products and gift packs.

**Planned changes:**
- Replace single `imageUrl` field with `images` array in Product and GiftPack types
- Update ProductForm and GiftPackForm to allow adding, removing, and managing multiple image URLs
- Display first image as thumbnail in product and gift pack lists
- Add image carousel to GiftPackCard component for navigating multiple images
- Update CartItemRow to display first image from images array
- Include migration logic to convert existing single imageUrl to single-element arrays

**User-visible outcome:** Users can add multiple images to products and gift packs, view image carousels on gift pack cards, and see the first image as thumbnails throughout the application.
