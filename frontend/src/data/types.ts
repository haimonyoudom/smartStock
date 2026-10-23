// ---------- Entities (saved data) ----------

export type Role = 'OWNER' | 'CASHIER'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  // passwordHash is not here: the backend never sends it to the frontend
}

export interface Product {
  id: string
  name: string
  sku: string
  sellingPrice: number // USD
  stockQuantity: number
  lowStockThreshold: number
  active: boolean
}

export interface Sale {
  id: string
  saleDate: string // ISO date-time
  totalAmount: number // USD
  createdBy: string // User id
  items: SaleItem[]
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  quantity: number
  unitPrice: number // copied from the product at sale time
  subtotal: number
}

export type MovementType = 'SALE' | 'ADJUSTMENT'

export interface StockMovement {
  id: string
  productId: string
  userId: string
  movementType: MovementType
  quantityChange: number // negative for a sale
  reason: string
  createdAt: string // ISO date-time
}

// ---------- UI types (screen helpers, not saved) ----------

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartLine {
  productId: string
  name: string
  unitPrice: number
  quantity: number
  stockQuantity: number
}