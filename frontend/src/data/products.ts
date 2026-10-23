import type { Product } from './types'

export const products: Product[] = [
  { id: 'p1', name: 'Coca-Cola 330ml', sku: 'CC-330', sellingPrice: 0.8, stockQuantity: 48, lowStockThreshold: 10, active: true },
  { id: 'p2', name: 'Milk 1L', sku: 'MK-1L', sellingPrice: 1.5, stockQuantity: 2, lowStockThreshold: 5, active: true },
  { id: 'p3', name: 'Instant noodles', sku: 'NO-01', sellingPrice: 0.4, stockQuantity: 120, lowStockThreshold: 20, active: true },
  { id: 'p4', name: 'Rice 5kg', sku: 'RC-5', sellingPrice: 6, stockQuantity: 15, lowStockThreshold: 5, active: false },
  { id: 'p5', name: 'Sugar 1kg', sku: 'SG-1', sellingPrice: 1.2, stockQuantity: 4, lowStockThreshold: 10, active: true },
]
