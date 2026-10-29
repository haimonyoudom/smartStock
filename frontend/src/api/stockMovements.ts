import { http } from './http'
import type { StockMovement } from '../types'

export const stockMovementsApi = {
  list: () => http<StockMovement[]>('/stockMovements'),
  listByProduct: (productId: string) =>
    http<StockMovement[]>(`/stockMovements?productId=${productId}`),
  create: (data: StockMovement) =>
    http<StockMovement>('/stockMovements', { method: 'POST', body: JSON.stringify(data) }),
}
