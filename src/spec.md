# Specification

## Summary
**Goal:** Add backend admin authentication with hardcoded credentials.

**Planned changes:**
- Add hardcoded admin user (username: 'admin', password: 'admin') in the backend
- Create admin login endpoint in backend to validate credentials
- Update frontend admin authentication to call backend endpoint instead of using hardcoded frontend validation

**User-visible outcome:** Admin can log in using 'admin'/'admin' credentials, with authentication handled by the backend.
