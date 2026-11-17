
# SmartStock — Multi-Tenant Database and Authentication Implementation

## 1. Project Context

I am developing SmartStock, a small-business inventory and sales management application.

Current technology stack:

**Frontend**

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Bootstrap 5

**Backend**

- NestJS
- TypeScript
- REST API

**Current project structure**

- `frontend/`
- `api/`
- `docs/`

I want to evolve SmartStock from a single-shop inventory application into a **multi-tenant platform (SaaS)** where multiple independent small businesses can register and use the same application.

### My confirmed business decisions

1. Multiple businesses use one SmartStock platform.
2. Only business owners can register publicly.
3. Each registered owner automatically receives a new business.
4. Owners can create or manage employee/cashier accounts.
5. Each business has completely separate products, sales, stock movements, and employees.
6. Users must never access another business's information.

Do not change these business decisions.

---

## 2. First: Inspect the Existing Project

Before modifying anything, inspect both `frontend/` and `api/`.

Important existing backend files include:

- `api/src/auth/`
- `api/src/users/`
- `api/src/products/`
- `api/src/sales/`
- `api/src/stock-movements/`
- `api/src/app.module.ts`

Important existing frontend files include:

- `frontend/src/stores/auth.ts`
- `frontend/src/stores/products.ts`
- `frontend/src/stores/sales.ts`
- `frontend/src/api/`
- `frontend/src/router/index.ts`
- `frontend/src/components/AppNav.vue`
- `frontend/src/pages/`
- `frontend/db.json`

Current implementation observations:

- Backend users are hardcoded in `UsersService`.
- Backend authentication currently uses a demo token.
- Passwords are currently compared as plain text.
- Products are stored in in-memory arrays.
- Sales are stored in in-memory arrays.
- Stock movements are stored in in-memory arrays.
- Frontend authentication currently uses demo user data and localStorage.
- JSON Server is currently used for mock API data.

Treat these as existing implementation details, not as requirements to preserve.

Do not assume a database, ORM, migration framework, or authentication library is already installed.

## 3. Database Architecture

Design a proper relational database for multi-tenancy.

First inspect the project configuration and determine whether a database connection already exists.

If no real database is configured, propose a suitable database and ORM/migration approach. Explain the choice and ask for my confirmation before introducing major database dependencies or creating migrations.

The target data model should include:

### Business

- id
- name
- business_type
- created_at
- updated_at

### User

- id
- business_id (FK)
- name
- email
- password_hash
- role (OWNER or CASHIER)
- active
- created_at
- updated_at

### Product

- id
- business_id (FK)
- name
- sku
- description
- selling_price
- stock_quantity
- low_stock_threshold
- active
- created_at
- updated_at

### Sale

- id
- business_id (FK)
- sale_number
- created_by (FK to User)
- sale_date
- total_amount
- payment_method
- status

### SaleItem

- id
- sale_id (FK)
- product_id (FK)
- quantity
- unit_price
- subtotal

### StockMovement

- id
- business_id (FK)
- product_id (FK)
- user_id (FK)
- movement_type
- quantity_change
- reason
- created_at

Requirements:

- Add business ownership relationships.
- Use appropriate foreign keys and indexes.
- Enforce unique email addresses for user accounts.
- Enforce SKU uniqueness within each business, not globally.
- Ensure sale items reference products belonging to the same business as their sale.
- Preserve historical sale prices.
- Use database transactions for sales and stock updates.
- Avoid unnecessary new entities unless technically justified.

Do not delete existing data or overwrite existing records without a migration and backup plan.

## 4. Backend — NestJS Implementation

Implement the backend as the authoritative source of data and business rules.

### A. Registration

Create:

`POST /auth/register`

Request example:

{
  "businessName": "My Mini Market",
  "businessType": "Retail",
  "name": "John",
  "email": "john@example.com",
  "password": "secure-password"
}

Expected behaviour:

1. Validate registration information.
2. Check whether the email already exists.
3. Hash the password securely.
4. Create a Business record.
5. Create its first User with the OWNER role.
6. Associate the owner with the newly created business.
7. Perform both creations in one database transaction.
8. Return safe user and business information.
9. Never return password hashes.

Public registration must never allow users to select their role or assign themselves to an existing business.

### B. Login

Create:

`POST /auth/login`

Requirements:

- Authenticate using email and password.
- Verify password hashes.
- Reject inactive accounts.
- Issue a secure authentication session.
- Use HttpOnly cookies for authentication.
- Configure cookie security appropriately for development and production.
- Do not expose passwords or authentication secrets.

### C. Current authenticated user

Create:

`GET /auth/me`

Return:

- User ID
- Name
- Email
- Role
- Business ID
- Business name

This endpoint will allow Vue to restore authentication after refreshing the browser.

### D. Logout

Create:

`POST /auth/logout`

Clear the authentication session properly.

### E. Employee management

Allow an authenticated OWNER to:

- Create cashier accounts.
- View employees belonging to their business.
- Deactivate employee accounts.
- Prevent employees from creating owner accounts.

An owner must never create employees for another business.

### F. Multi-Tenant Data Isolation

This is one of the most important requirements.

Every protected request must identify the authenticated user and their business.

Apply business ownership restrictions to:

- Products
- Sales
- Sale items
- Stock movements
- Employee accounts
- Reports

Never trust a business ID supplied by the frontend to determine authorization.

Obtain the business ID from the authenticated user/session.

Examples:

- GET products returns only products belonging to the current business.
- POST product automatically assigns the authenticated user's business.
- GET sales returns only the current business's sales.
- Stock adjustments must verify product ownership.
- A cashier cannot access owner-only functionality.

Enforce authorization in the backend, not only in Vue Router.

Use NestJS guards and appropriate role-based authorization.

### G. Preserve Existing Business Logic

Keep existing functionality working:

- Product CRUD
- Product search and filtering
- Low-stock alerts
- Sales checkout
- Sale items
- Stock adjustments
- Stock movement history
- Sales reports

Sales must remain consistent:

- Validate all requested products.
- Reject inactive products.
- Reject insufficient stock.
- Calculate totals on the backend.
- Update stock and create movements atomically.
- Prevent partial sales if any operation fails.

---

## 5. Frontend — Vue 3 Implementation

Integrate the new backend authentication into the existing Vue application.

Do not rebuild the entire frontend.

Preserve existing components, layouts, styling, responsive design, and business functionality wherever possible.

### A. Registration page

Create a registration page for business owners.

Fields:

- Business name
- Business type
- Owner name
- Email
- Password
- Confirm password

Requirements:

- Form validation.
- Clear validation messages.
- Loading state.
- API error handling.
- Successful registration should establish the authenticated session and navigate to the dashboard.

### B. Login page

Create a real login page.

Requirements:

- Email
- Password
- Validation
- Loading indicator
- Error messages
- Connect to `POST /auth/login`.

Remove the automatic demo-owner login behaviour.

### C. Authentication Store

Refactor:

`frontend/src/stores/auth.ts`

Requirements:

- Use Pinia.
- Store the authenticated user and business information in reactive state.
- Implement login.
- Implement registration.
- Implement logout.
- Implement session restoration.
- Implement an authentication initialization/loading state.

Do not store passwords, JWTs, or sensitive authentication credentials in localStorage.

Authentication should rely on secure HttpOnly cookies.

### D. HTTP Client

Refactor:

`frontend/src/api/http.ts`

Requirements:

- Use one centralized HTTP client.
- Configure the API base URL using environment variables.
- Include credentials for cookie-based authentication.
- Handle HTTP 401 responses.
- Handle HTTP 403 responses.
- Provide consistent API error handling.
- Avoid duplicating authentication logic across API files.

Also configure appropriate CORS settings in NestJS.

### E. Vue Router

Refactor:

`frontend/src/router/index.ts`

Requirements:

- Public routes: login and registration.
- Protected routes: authenticated application pages.
- Owner-only routes: alerts, reports, employee management, and other administrative functionality where appropriate.
- Cashier routes: permitted sales and product functionality.

Restore the session before deciding whether a protected route is accessible.

Avoid redirect loops during authentication initialization.

### F. Existing Pages and Stores

Review and integrate:

- ProductsPage
- ProductDetailPage
- NewSalePage
- AlertsPage
- SalesPage
- AppNav.vue
- Products store
- Sales store

Remove dependencies on hardcoded frontend demo users and static mock data where the real API replaces them.

Do not remove components that are still needed.

Display the current business name and authenticated user's information in the navigation.

---

## 6. Frontend and Backend Responsibilities

Follow this architecture:

Vue 3
  |
  | HTTP requests + secure cookies
  v
NestJS REST API
  |
  | Authentication and authorization
  v
Business and User context
  |
  | Business-scoped queries
  v
Relational Database

Important:

- Vue handles presentation and user interaction.
- NestJS handles authentication, authorization, validation, and business rules.
- The database stores persistent information.
- The backend determines business ownership.
- The frontend must never be trusted to enforce data isolation.

Do not make the frontend connect directly to the production database.

JSON Server should no longer be the source of truth once the NestJS database integration is implemented.

---

## 7. Existing Data Migration

Inspect existing demo data in:

- `frontend/db.json`
- `frontend/src/data/`
- Existing backend hardcoded arrays.

Prepare a migration strategy.

Requirements:

- Preserve existing demo products, sales, users, and stock movements where possible.
- Assign existing demo records to one initial demo business.
- Preserve existing user IDs and record relationships where practical.
- Hash existing demo passwords rather than storing plain text.
- Do not automatically expose demo accounts in production.
- Explain how the initial owner account will be created securely.

Never silently discard existing records.

---

## 8. Security Requirements

Implement and test:

- Password hashing using a suitable secure password-hashing library.
- HttpOnly authentication cookies.
- Secure cookie settings in production.
- Appropriate SameSite configuration.
- CORS restricted to configured frontend origins.
- CSRF protection appropriate to the cookie authentication design.
- Authentication guards.
- Role-based authorization.
- Business-level data isolation.
- Input validation.
- Safe error responses.
- Protection against insecure direct object references.
- No passwords or tokens in logs.

A user must not be able to access another business's information by changing a URL parameter, request body, or product ID.

---

## 9. Testing Requirements

Create or update automated tests.

At minimum, test these scenarios:

### Authentication

1. Owner can register a business.
2. Duplicate email registration is rejected.
3. Owner can log in.
4. Incorrect password is rejected.
5. Inactive account cannot log in.
6. GET `/auth/me` returns the current authenticated user.
7. Logout invalidates the session.
8. Refreshing the browser preserves a valid session.

### Multi-Tenant Isolation

Create Business A and Business B.

Test:

1. Owner A can view Business A products.
2. Owner B can view Business B products.
3. Owner A cannot access Business B products.
4. Owner A cannot modify Business B products.
5. Owner A cannot view Business B sales.
6. Owner A cannot access Business B stock movements.
7. Cashier A cannot access Business B information.
8. Cashier A cannot access owner-only endpoints.
9. Changing business IDs in request bodies does not bypass authorization.

### Existing Functionality

Ensure:

- Product CRUD still works.
- Sales still work.
- Stock updates correctly.
- Low-stock alerts work.
- Sales reports work.
- Historical sale items remain correct.

---

## 10. Development Workflow — IMPORTANT

I do not want the entire project rewritten blindly.

Follow these steps:

### Phase 1 — Audit and Plan

1. Inspect the existing project.
2. Identify current architecture and dependencies.
3. Identify all files requiring changes.
4. Identify missing database infrastructure.
5. Propose the database technology and ORM.
6. Explain the proposed schema and relationships.
7. Identify risks to existing functionality.
8. Present an implementation plan.

**STOP after Phase 1 and wait for my approval.**

### Phase 2 — Database Foundation

After approval:

1. Install only necessary dependencies.
2. Configure database connection.
3. Create entities/models.
4. Create versioned migrations.
5. Implement data migration.
6. Verify persistence after restarting the backend.

Run relevant tests before continuing.

### Phase 3 — Backend Authentication

Implement registration, login, logout, current-user endpoint, authentication guards, and employee management.

Test each endpoint.

### Phase 4 — Multi-Tenant Isolation

Add business-scoped queries to every relevant module.

Test with at least two independent businesses.

### Phase 5 — Vue Integration

Implement registration, login, authentication restoration, route guards, logout, and current business information.

Connect existing pages to the real API.

### Phase 6 — Final Verification

Run:

- Backend build.
- Backend unit tests.
- Backend integration/e2e tests.
- Frontend type checking.
- Frontend unit tests.
- Frontend production build.

Fix regressions without unnecessarily rewriting existing components.

---

## 11. Rules for the Coding Agent

1. Do not rewrite the project from scratch.
2. Do not replace Vue with another framework.
3. Do not replace NestJS.
4. Do not redesign the existing UI unless required.
5. Do not delete working features.
6. Do not introduce unnecessary dependencies.
7. Do not assume existing database technology.
8. Do not use hardcoded business IDs or user IDs for authorization.
9. Do not trust frontend-supplied ownership information.
10. Do not skip database migrations.
11. Do not silently remove existing demo data.
12. Do not claim tests passed without actually running them.
13. Explain important architectural changes in simple English.
14. Keep the implementation modular and maintainable.

If an important decision is unclear, ask me before making a potentially destructive change.

## 12. Expected Final Result

SmartStock should support:

- Multiple businesses using one application.
- Public owner registration.
- Automatic business creation during registration.
- Secure login and logout.
- Persistent authentication after browser refresh.
- Owner-managed cashier accounts.
- Separate inventory for each business.
- Separate sales and stock history for each business.
- Secure business-level authorization.
- Persistent database storage.
- Existing inventory and sales functionality.

The existing SmartStock application should remain recognizable and functional after the migration.

**Start with Phase 1 only. Inspect the actual source code and present your findings, proposed database design, dependencies, migration strategy, and implementation plan. Do not modify files until I approve the plan.**
