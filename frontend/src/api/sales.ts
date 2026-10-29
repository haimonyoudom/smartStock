import { http } from './http'
import type { Sale } from '../types'

type SaleRecord = Omit<Sale, 'items'>

export const salesApi = {
  list: () => http<SaleRecord[]>('/sales'),
  get: (id: string) => http<SaleRecord>(`/sales/${id}`),
  create: (data: SaleRecord) =>
    http<SaleRecord>('/sales', { method: 'POST', body: JSON.stringify(data) }),
}
