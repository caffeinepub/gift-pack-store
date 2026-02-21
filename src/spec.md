# Specification

## Summary
**Goal:** Add username and password authentication to protect the admin dashboard.

**Planned changes:**
- Create backend authentication system with secure credential storage and validation
- Build admin login page at /admin/login with username and password fields
- Protect /admin route to require authentication before access
- Hide admin navigation link from non-authenticated users

**User-visible outcome:** The admin dashboard is now protected behind a login page. Only users with valid admin credentials can access the dashboard, while regular users cannot see or access admin features.
