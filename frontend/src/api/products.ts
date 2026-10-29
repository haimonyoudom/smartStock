import { http } from './http'
import type { Product } from '../types'

export const productsApi = {
  list: () => http<Product[]>('/products'),
  get: (id: string) => http<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id'>) =>
    http<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Product>) =>
    http<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
}