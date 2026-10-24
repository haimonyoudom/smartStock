import { defineStore } from 'pinia'
import { ref } from 'vue'
import { products as sampleProducts, stockMovements as sampleMovements } from '@/data'
import { useAuthStore } from './auth'
import type { Product, StockMovement } from '@/types'

export type AdjustResult = { ok: true } | { ok: false; error: string }

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([...sampleProducts])
  const stockMovements = ref<StockMovement[]>([...sampleMovements])
  const auth = useAuthStore()

  function adjustStock(productId: string, change: number, reason: string): AdjustResult {
    const product = products.value.find((p) => p.id === productId)
    if (!product) return { ok: false, error: 'Product not found.' }
    if (!Number.isInteger(change) || change === 0) return { ok: false, error: 'Enter a whole number that is not 0.' }
    if (!reason.trim()) return { ok: false, error: 'A reason is required.' }
    if (product.stockQuantity + change < 0) {
      return { ok: false, error: `Stock cannot go below 0 (${product.name} has ${product.stockQuantity}).` }
    }

    product.stockQuantity += change
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

  return { products, stockMovements, adjustStock }
})