import type { Sale } from './types'

export const sales: Sale[] = [
  {
    id: '1042', saleDate: '2026-10-23T10:15:00', totalAmount: 8.1, createdBy: 'u2',
    items: [
      { id: 'si1', saleId: '1042', productId: 'p1', quantity: 2, unitPrice: 0.8, subtotal: 1.6 },
      { id: 'si2', saleId: '1042', productId: 'p3', quantity: 5, unitPrice: 0.4, subtotal: 2.0 },
      { id: 'si3', saleId: '1042', productId: 'p2', quantity: 3, unitPrice: 1.5, subtotal: 4.5 },
    ],
  },
  {
    id: '1041', saleDate: '2026-10-22T16:40:00', totalAmount: 3.2, createdBy: 'u2',
    items: [{ id: 'si4', saleId: '1041', productId: 'p3', quantity: 8, unitPrice: 0.4, subtotal: 3.2 }],
  },
  {
    id: '1040', saleDate: '2026-10-22T09:05:00', totalAmount: 12, createdBy: 'u1',
    items: [{ id: 'si5', saleId: '1040', productId: 'p4', quantity: 2, unitPrice: 6, subtotal: 12 }],
  },
]
