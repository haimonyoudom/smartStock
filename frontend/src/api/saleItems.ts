import { http } from './http'
import type { SaleItem } from '../types'

export const saleItemsApi = {
  list: () => http<SaleItem[]>('/saleItems'),
  listBySale: (saleId: string) => http<SaleItem[]>(`/saleItems?saleId=${saleId}`),
  create: (data: SaleItem) =>
    http<SaleItem>('/saleItems', { method: 'POST', body: JSON.stringify(data) }),
}
