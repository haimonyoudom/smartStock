# SmartStock Postman Testing Guide

Start the backend from `api/`:

```bash
npm run start:dev
```

Use this base URL for every request:

```text
http://localhost:3000
```

For every request with a JSON body, select **Body → raw → JSON** and add:

```text
Content-Type: application/json
```

Login guards are planned for week 8. Until they are implemented, send these
requests without an Authorization header.

## Users

### List users

```text
GET http://localhost:3000/users
```

Expected response: `200 OK`, `User[]`.

### Get one user

```text
GET http://localhost:3000/users/u1
```

Expected response: `200 OK`, `User`.

## Authentication

### Login

```text
POST http://localhost:3000/auth/login
```

```json
{
  "email": "owner@shop.com",
  "password": "password123"
}
```

Expected response: `200 OK`, `{ "accessToken": "...", "user": {} }`.
Invalid credentials should return `401 Unauthorized`.

## Products

### List products

```text
GET http://localhost:3000/products
```

Expected response: `200 OK`, `Product[]`.

### Get one product

```text
GET http://localhost:3000/products/p1
```

Expected response: `200 OK`, `Product`.

### List low-stock products

```text
GET http://localhost:3000/products/low-stock
```

Expected response: `200 OK`, `Product[]`.

### Create product

```text
POST http://localhost:3000/products
```

```json
{
  "name": "Green Tea",
  "sku": "TEA-01",
  "sellingPrice": 1.25,
  "stockQuantity": 10,
  "lowStockThreshold": 3,
  "active": true
}
```

Expected response: `201 Created`, `Product`.

### Invalid product

```text
POST http://localhost:3000/products
```

```json
{
  "name": "X",
  "sku": "A",
  "sellingPrice": 0,
  "stockQuantity": -1,
  "lowStockThreshold": -1,
  "unknown": true
}
```

Expected response: `400 Bad Request`.

### Update product

```text
PATCH http://localhost:3000/products/p1
```

```json
{
  "sellingPrice": 0.95,
  "lowStockThreshold": 12
}
```

Expected response: `200 OK`, `Product`.

### Delete product

```text
DELETE http://localhost:3000/products/p1
```

Expected response: `204 No Content`.

## Stock

### Adjust stock

```text
POST http://localhost:3000/products/p2/adjust-stock
```

```json
{
  "quantityChange": 5,
  "reason": "RESTOCK"
}
```

Expected response: `200 OK`, updated `Product`, plus an `ADJUSTMENT`
StockMovement.

### List all stock movements

```text
GET http://localhost:3000/stockMovements
```

Expected response: `200 OK`, `StockMovement[]`.

### List movements for one product

```text
GET http://localhost:3000/stockMovements?productId=p2
```

Expected response: `200 OK`, `StockMovement[]`.

## Sales

### List sales

```text
GET http://localhost:3000/sales
```

Expected response: `200 OK`, `Sale[]`.

### Get one sale

```text
GET http://localhost:3000/sales/1042
```

Expected response: `200 OK`, `Sale`.

### Create sale

```text
POST http://localhost:3000/sales
```

```json
{
  "items": [
    {
      "productId": "p1",
      "quantity": 2
    },
    {
      "productId": "p3",
      "quantity": 5
    }
  ]
}
```

Expected response: `201 Created`, `Sale`. The server calculates prices,
subtotals, total amount, and stock deductions.

### Insufficient-stock sale

```text
POST http://localhost:3000/sales
```

```json
{
  "items": [
    {
      "productId": "p2",
      "quantity": 100
    }
  ]
}
```

Expected response: `409 Conflict`.

## Sale items

### List all sale items

```text
GET http://localhost:3000/saleItems
```

Expected response: `200 OK`, `SaleItem[]`.

### List items for a sale

```text
GET http://localhost:3000/saleItems?saleId=1042
```

Expected response: `200 OK`, `SaleItem[]`.

## Recommended Postman order

1. List products.
2. Create a product.
3. Adjust its stock.
4. List stock movements.
5. Create a sale.
6. List sales.
7. Fetch the sale's items.
8. Try invalid input, duplicate SKU, missing IDs, and insufficient stock.
