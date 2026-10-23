import type { StockMovement } from '../types'

export const stockMovements: StockMovement[] = [
  { id: 'm1', productId: 'p2', userId: 'u2', movementType: 'SALE', quantityChange: -3, reason: 'Sale #1042', createdAt: '2026-10-23T10:15:00' },
  { id: 'm2', productId: 'p1', userId: 'u2', movementType: 'SALE', quantityChange: -2, reason: 'Sale #1042', createdAt: '2026-10-23T10:15:00' },
  { id: 'm3', productId: 'p3', userId: 'u2', movementType: 'SALE', quantityChange: -5, reason: 'Sale #1042', createdAt: '2026-10-23T10:15:00' },
  { id: 'm4', productId: 'p5', userId: 'u1', movementType: 'ADJUSTMENT', quantityChange: -2, reason: 'Stock count correction', createdAt: '2026-10-21T08:30:00' },
]
