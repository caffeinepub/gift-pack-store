# Specification

## Summary
**Goal:** Add full gift pack management capabilities to the admin panel with create, edit, and delete operations.

**Planned changes:**
- Add Gift Pack Management section to AdminPage alongside existing management sections
- Implement backend CRUD endpoints (createGiftPack, updateGiftPack, deleteGiftPack) in main actor
- Update useGiftPackMutation hook to use new backend methods instead of placeholder product methods
- Add delete button with confirmation dialog to each gift pack card in GiftPackList

**User-visible outcome:** Admins can add, edit, and delete gift packs through a dedicated Gift Pack Management section in the admin panel, with all changes persisted to the backend.
