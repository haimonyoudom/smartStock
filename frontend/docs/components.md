# SmartStock: component trees

## Where state lives

| State | Owner | Why |
|---|---|---|
| `currentUser` (name, role) | `useAuthStore` (Pinia) | Needed by the menu, the router guard, and every page |
| `products` | `useProductsStore` (Pinia) | Shared by Products, New Sale, and Alerts; stock must be the same everywhere |
| `sales` | `useSalesStore` (Pinia) | Shared by New Sale (creates) and Sales (reads) |
| `stockMovements` | `useProductsStore` (Pinia) | Written by sales and adjustments, read by the history panel |
| Form inputs, open modals, selected row | The page or component that shows them | Only that screen cares, so it stays local |

For Part E the stores start from the hard-coded data in `src/data/`. Pages read from a store, pass data to children as props, and call store actions when a child emits an event.

Types used below (`Product`, `Sale`, `SaleItem`, `StockMovement`, `User`) are in `src/types.ts`. `Role` is `'OWNER' | 'CASHIER'`.

---

## Shared components

### AppNav
- **Props:** `userName: string`, `role: Role`
- **Events:** `logout`
- **State:** none
- Shows Products and New Sale for everyone, and Alerts and Sales only when `role === 'OWNER'`. The active item comes from the router.

### QuantityStepper
- **Props:** `modelValue: number`, `min: number` (default 1), `max: number`
- **Events:** `update:modelValue(value: number)`
- **State:** none
- The `-` button is disabled at `min` and the `+` button at `max`. It only emits the new number, and the parent decides what to do with it.

### ErrorBanner
- **Props:** `message: string | null`
- **Events:** none
- **State:** none
- Renders nothing when `message` is empty.

### StockAdjustModal (used by Products and Alerts)
- **Props:** `product: Product`
- **Events:** `save({ change: number, reason: string })`, `cancel`
- **State:** `change` and `reason` inputs (local to the modal)
- Shows an error if the change would make stock negative.

---

## Screen 1: Login

```
LoginPage
└── LoginForm
```

### LoginPage
- **Props:** none
- **Events:** none
- **State owned:** `errorMessage`
- Calls `useAuthStore.login()` on `submit`, shows the error if it fails, and redirects to Products if it works.

### LoginForm
- **Props:** `errorMessage: string | null`
- **Events:** `submit({ email, password })`
- **State owned:** `email`, `password` (local inputs)

---

## Screen 2: Products

```
ProductsPage
├── ProductTable
│   └── ProductRow (many)
│       └── LowStockBadge
├── ProductFormModal
├── StockAdjustModal
└── StockMovementPanel
```

### ProductsPage
- **Props:** none
- **Events:** none
- **State owned:** `editingProduct: Product | null`, `showAddForm: boolean`, `adjustingProduct: Product | null`, `historyProductId: string | null`
- Reads `products` from the store and `role` from the auth store. Handles every event from its children by opening a modal or calling a store action.

### ProductTable
- **Props:** `products: Product[]`, `canManage: boolean`
- **Events:** `edit(product)`, `adjust(product)`, `history(product)` (passed up from rows)
- **State:** none

### ProductRow
- **Props:** `product: Product`, `canManage: boolean`
- **Events:** `edit`, `adjust`, `history`
- **State:** none
- Highlights the row when `product.stockQuantity <= product.lowStockThreshold`, and marks inactive products. Edit and Adjust are hidden when `canManage` is false.

### LowStockBadge
- **Props:** `stock: number`, `threshold: number`
- **Events:** none
- **State:** none

### ProductFormModal
- **Props:** `product: Product | null` (null means add)
- **Events:** `save(productData)`, `cancel`
- **State owned:** the form fields (name, SKU, price, quantity, threshold, active), copied from `product` when opened
- Validates required fields, price, and duplicate SKU before emitting `save`.

### StockMovementPanel
- **Props:** `product: Product`, `movements: StockMovement[]`
- **Events:** `close`
- **State:** none
- Shows quantity change, type, reason, user, and time for one product (story 8).

---

## Screen 3: New Sale

```
NewSalePage
├── ProductSelect
├── CartTable
│   └── CartRow (many)
│       └── QuantityStepper
├── SaleSummary
└── ErrorBanner
```

### NewSalePage
- **Props:** none
- **Events:** none
- **State owned:** `cart: { productId: string, quantity: number }[]`, `errorMessage: string | null`
- **Computed:** `cartLines` (cart joined with product name, price, stock), `total`
- Handles `add`, `update-quantity`, `remove`, and `complete`. On `complete` it calls the sales store, which saves the sale and reduces stock in one step. If that fails, it shows the message in `ErrorBanner` and changes nothing.

### ProductSelect
- **Props:** `products: Product[]` (only active products; out-of-stock ones are disabled)
- **Events:** `add(productId: string)`
- **State owned:** `selectedId` (local; reset after Add)
- Each option shows name, price, and stock left.

### CartTable
- **Props:** `lines: CartLine[]`
- **Events:** `update-quantity(productId, quantity)`, `remove(productId)`
- **State:** none

### CartRow
- **Props:** `line: CartLine` (productId, name, unitPrice, quantity, stockQuantity)
- **Events:** `update-quantity(quantity)`, `remove`
- **State:** none
- Passes `quantity` and `max = stockQuantity` to `QuantityStepper`. Subtotal is `unitPrice * quantity`.

### SaleSummary
- **Props:** `total: number`, `canComplete: boolean` (false when the cart is empty)
- **Events:** `complete`
- **State:** none

---

## Screen 4: Low-stock alerts (owner only)

```
AlertsPage
├── LowStockTable
└── StockAdjustModal
```

### AlertsPage
- **Props:** none
- **Events:** none
- **State owned:** `adjustingProduct: Product | null`
- **Computed:** `lowStockProducts` = active products where `stockQuantity <= lowStockThreshold`
- Because it is computed from the store, a product leaves the list as soon as its stock goes above the threshold.

### LowStockTable
- **Props:** `products: Product[]`
- **Events:** `adjust(product)`
- **State:** none

---

## Screen 5: Sales (owner only)

```
SalesPage
├── DateRangeFilter
├── SalesSummaryCards
├── SalesTable
└── SaleDetailPanel
```

### SalesPage
- **Props:** none
- **Events:** none
- **State owned:** `fromDate`, `toDate`, `selectedSaleId`
- **Computed:** `filteredSales`, `salesCount`, `totalRevenue`, `selectedSale`

### DateRangeFilter
- **Props:** `from: string`, `to: string`
- **Events:** `apply({ from, to })`
- **State owned:** the two inputs (local until Apply is clicked)

### SalesSummaryCards
- **Props:** `count: number`, `revenue: number`
- **Events:** none
- **State:** none

### SalesTable
- **Props:** `sales: Sale[]`, `selectedId: string | null`
- **Events:** `select(saleId)`
- **State:** none

### SaleDetailPanel
- **Props:** `sale: Sale | null`
- **Events:** none
- **State:** none
- Shows items, quantities, unit prices, total, and who recorded the sale.

---
