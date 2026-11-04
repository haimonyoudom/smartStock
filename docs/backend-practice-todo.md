# Week 6 Practice: SmartStock REST API with NestJS

This is the SmartStock version of the Campus Events exercise. Complete the
tasks yourself in `api/`, then ask me to check your implementation.

The backend uses in-memory data this week. Do not connect PostgreSQL yet.

## Setup

From the repository root:

```bash
cd api
npm install
npm run start:dev
```

The API runs at `http://localhost:3000`.

Read [api-contract.md](./api-contract.md) before coding. It is the
specification for fields, endpoints, status codes, validation, and roles.
Use [postman-testing.md](./postman-testing.md) to test each request.

## Part A: Enable validation

Install the validation packages:

```bash
npm install class-validator class-transformer
```

Update `src/main.ts`:

- [ ] Enable a global `ValidationPipe`.
- [ ] Set `whitelist: true`.
- [ ] Set `forbidNonWhitelisted: true`.
- [ ] Set `transform: true`.

An invalid request must return `400 Bad Request` with validation messages.
An unknown property such as `"unknown": true` must be rejected.

## Part B: Users and authentication foundation

Create a Users module with an in-memory user list matching `db.json`.

- [ ] Create a User type or interface.
- [ ] Include `id`, `name`, `email`, `role`, and `active`.
- [ ] Implement `GET /users`, returning `200 OK` with `User[]`.
- [ ] Implement `GET /users/:id`, returning `200 OK` with `User`.
- [ ] Return `404 Not Found` for an unknown user ID.
- [ ] Do not return password or password hash fields.
- [ ] Create `POST /auth/login` with `LoginDto`.
- [ ] Validate email and password.
- [ ] Return `401 Unauthorized` for invalid credentials.
- [ ] Return `200 OK` with `{ accessToken, user }` for valid credentials.

Login can use simple in-memory demo credentials this week. Real password
hashing and authentication guards are planned for week 8.

## Part C: Products module

Create the module:

```bash
npx nest g module products
npx nest g controller products
npx nest g service products
```

- [ ] Register `ProductsModule` in `AppModule`.
- [ ] Create a Product type or interface matching the contract.
- [ ] Add an in-memory product array using products from `frontend/db.json`.
- [ ] Create and validate `CreateProductDto`.
- [ ] Create and validate `UpdateProductDto`.
- [ ] Implement `GET /products`, returning `200 OK` with `Product[]`.
- [ ] Implement `GET /products/:id`, returning `200 OK` with `Product`.
- [ ] Implement `GET /products/low-stock`, returning `200 OK` with `Product[]`.
- [ ] Implement `POST /products`, returning `201 Created` with `Product`.
- [ ] Implement `PATCH /products/:id`, returning `200 OK` with `Product`.
- [ ] Implement `DELETE /products/:id`, returning `204 No Content`.
- [ ] Generate string IDs for new products.
- [ ] Default `active` to `true` when omitted.
- [ ] Return `404 Not Found` for unknown IDs.
- [ ] Return `409 Conflict` for duplicate SKUs.
- [ ] Keep product business rules in `ProductsService`.

## Part D: Stock movements

Create a StockMovements module and `AdjustStockDto`.

- [ ] Create a StockMovement type matching the contract:
  `id`, `productId`, `userId`, `movementType`, `quantityChange`, `reason`,
  and `createdAt`.
- [ ] Implement `GET /stockMovements`, returning `200 OK` with
  `StockMovement[]`.
- [ ] Implement `GET /stockMovements?productId=:productId`, returning matching
  movements as `StockMovement[]`.
- [ ] Implement `POST /products/:id/adjust-stock`.
- [ ] Require a non-zero integer `quantityChange`.
- [ ] Require a `reason` from 2–100 characters.
- [ ] Reject a resulting stock below zero with `422 Unprocessable Entity`.
- [ ] Update the Product and create a related `ADJUSTMENT` movement.
- [ ] Set `userId` from the authenticated user design, or use a documented
  temporary demo user until login guards are implemented.

## Part E: Sales and sale items

Create Sales and SaleItems modules. Keep sales normalized like `db.json`:
sales and sale items are stored separately.

- [ ] Create `Sale`, `SaleItem`, and `CreateSaleDto` types.
- [ ] Validate that a sale has at least one item.
- [ ] Validate each item has an existing active `productId`.
- [ ] Validate each item quantity is an integer from `1` to `100`.
- [ ] Implement `GET /sales`, returning `200 OK` with `Sale[]`.
- [ ] Implement `GET /sales/:id`, returning `200 OK` with `Sale`.
- [ ] Implement `POST /sales`, returning `201 Created` with `Sale`.
- [ ] Calculate `unitPrice`, `subtotal`, and `totalAmount` on the server.
- [ ] Reject insufficient stock with `409 Conflict`.
- [ ] Deduct stock when a sale is created.
- [ ] Create a `SALE` stock movement for each sold product.
- [ ] Implement `GET /saleItems`, returning `200 OK` with `SaleItem[]`.
- [ ] Implement `GET /saleItems?saleId=:saleId`, returning matching items.
- [ ] Return an empty array when a collection has no matches.
- [ ] Do not allow clients to submit `unitPrice`, `subtotal`, or
  `totalAmount` as trusted values.

## Part F: Tests

### Service unit tests

- [ ] Users: list and find.
- [ ] Products: list, find, create, update, delete, duplicate SKU.
- [ ] Stock: adjust stock, create movement, reject negative result.
- [ ] Sales: calculate totals, deduct stock, reject insufficient stock.
- [ ] SaleItems: list all and filter by sale.

### HTTP or e2e tests

- [ ] Invalid DTOs return `400`.
- [ ] Unknown IDs return `404`.
- [ ] Duplicate SKU returns `409`.
- [ ] Insufficient stock returns `409`.
- [ ] Invalid stock adjustment returns `422`.
- [ ] Product collection returns `Product[]`.
- [ ] Sale creation returns `201` and calculated values.

Run from `api/`:

```bash
npm test
npm run test:e2e
npm run build
```

## Part G: Contract alignment

- [ ] Every resource in `api-contract.md` exists in the backend design.
- [ ] Every endpoint has the documented method, body, response type, and
  success status.
- [ ] Every field has the documented type and validation rule.
- [ ] `frontend/db.json` and in-memory resources use the same shape.
- [ ] Authentication and roles are documented, even if guards are deferred
  until week 8.

## Explain it

Answer these in `docs/backend-answers.md`, using 2–4 sentences each:

1. Why can a browser request be blocked by CORS while `curl` can still read
   the API response?
2. Who creates a NestJS service when the controller does not call `new`?
3. Why must sale totals and stock deductions be calculated on the server?
4. Why should insufficient-stock validation live in a service instead of only
   in the Vue form?
5. Why are `Sale` and `SaleItem` stored as separate resources in `db.json`?

## Final checkpoint

- [ ] Validation is enabled globally.
- [ ] Users and login foundation work.
- [ ] Products work.
- [ ] Stock movements and adjustments work.
- [ ] Sales and sale items work.
- [ ] Unit and e2e tests pass.
- [ ] `npm run build` passes.
- [ ] `docs/api-contract.md` matches the implementation.
- [ ] `docs/backend-answers.md` answers all five questions.

When finished, ask me to check your work and include the output of
`npm test`, `npm run test:e2e`, and `npm run build`, plus the files changed.
