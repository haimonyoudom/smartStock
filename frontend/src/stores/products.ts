import { defineStore } from 'pinia'
import { ref } from 'vue'
import { products as sampleProducts, stockMovements as sampleMovements } from '@/data'
import type { Product, StockMovement } from '@/types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([...sampleProducts])
  const stockMovements = ref<StockMovement[]>([...sampleMovements])
  return { products, stockMovements }
})