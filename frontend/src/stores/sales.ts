import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sales as sampleSales } from '@/data'
import { useAuthStore } from './auth'
import { useProductsStore } from './products'
import type { CartItem, Sale, SaleItem, StockMovement } from '@/types'

export type CompleteSaleResult = { ok: true; sale: Sale } | { ok: false; error: string }

const round2 = (n: number) => Math.round(n * 100) / 100

export const useSalesStore = defineStore('sales', () => {
  const sales = ref<Sale[]>([...sampleSales])
  const productsStore = useProductsStore()
  const auth = useAuthStore()

  // All or nothing: check everything first, change data only if every line is valid.
  function completeSale(cart: CartItem[]): CompleteSaleResult {
    if (cart.length === 0) return { ok: false, error: 'The cart is empty.' }

    for (const item of cart) {
      const product = productsStore.products.find((p) => p.id === item.productId)
      if (!product || !product.active) return { ok: false, error: 'A product in the cart is not available.' }
      if (item.quantity > product.stockQuantity) {
        return { ok: false, error: `Not enough stock: ${product.name} (${product.stockQuantity} left)` }
      }
    }

    const saleId = String(Math.max(...sales.value.map((s) => Number(s.id))) + 1)
    const now = new Date().toISOString()
    const items: SaleItem[] = []
    const movements: StockMovement[] = []

    cart.forEach((item, index) => {
      const product = productsStore.products.find((p) => p.id === item.productId)!
      items.push({
        id: `${saleId}-${index + 1}`,
        saleId,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.sellingPrice,
        subtotal: round2(product.sellingPrice * item.quantity),
      })
      movements.push({
        id: `m-${saleId}-${index + 1}`,
        productId: product.id,
        userId: auth.currentUser.id,
        movementType: 'SALE',
        quantityChange: -item.quantity,
        reason: `Sale #${saleId}`,
        createdAt: now,
      })
      product.stockQuantity -= item.quantity
    })

    const sale: Sale = {
      id: saleId,
      saleDate: now,
      totalAmount: round2(items.reduce((sum, i) => sum + i.subtotal, 0)),
      createdBy: auth.currentUser.id,
      items,
    }
    sales.value.unshift(sale)
    productsStore.stockMovements.unshift(...movements)
    return { ok: true, sale }
  }

  return { sales, completeSale }
})