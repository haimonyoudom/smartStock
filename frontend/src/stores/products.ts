import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { stockMovements as sampleMovements } from '@/data'
import { productsApi } from '@/api/products'
import { useAuthStore } from './auth'
import type { Product, StockMovement } from '@/types'

export type AdjustResult = { ok: true } | { ok: false; error: string }

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const stockMovements = ref<StockMovement[]>([...sampleMovements])
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const error = ref<string | null>(null)
  const auth = useAuthStore()

  const byId = computed(() => (id: string) => products.value.find((p) => p.id === id))

  const lowStock = computed(() =>
    products.value.filter((p) => p.active && p.stockQuantity <= p.lowStockThreshold),
  )

  async function fetchAll() {
    status.value = 'loading'
    error.value = null
    try {
      products.value = await productsApi.list()
      status.value = 'success'
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong'
      status.value = 'error'
    }
  }

  function replace(product: Product) {
    const i = products.value.findIndex((p) => p.id === product.id)
    if (i === -1) products.value.push(product)
    else products.value[i] = product
  }

  async function adjustStock(productId: string, change: number, reason: string): Promise<AdjustResult> {
    const product = products.value.find((p) => p.id === productId)
    if (!product) return { ok: false, error: 'Product not found.' }
    if (!Number.isInteger(change) || change === 0) return { ok: false, error: 'Enter a whole number that is not 0.' }
    if (!reason.trim()) return { ok: false, error: 'A reason is required.' }
    if (product.stockQuantity + change < 0) {
      return { ok: false, error: `Stock cannot go below 0 (${product.name} has ${product.stockQuantity}).` }
    }

    const stockQuantity = product.stockQuantity + change
    try {
      await productsApi.update(productId, { stockQuantity })
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? `Could not save stock changes: ${e.message}` : 'Could not save stock changes.',
      }
    }

    product.stockQuantity = stockQuantity
    stockMovements.value.unshift({
      id: `m-adj-${Date.now()}`,
      productId,
      userId: auth.currentUser.id,
      movementType: 'ADJUSTMENT',
      quantityChange: change,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    })
    return { ok: true }
  }
  async function load() {
  if (status.value === 'idle' || status.value === 'error') await fetchAll()
}
  return { products, stockMovements, status, error, byId, lowStock, fetchAll, replace, adjustStock,load }
})