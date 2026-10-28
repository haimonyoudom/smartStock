<script setup lang="ts">
import type { Product } from '@/types'
import ProductRow from './ProductRow.vue'

defineProps<{ products: Product[]; canManage: boolean }>()
const emit = defineEmits<{ edit: [product: Product]; adjust: [product: Product]; history: [product: Product] }>()
</script>

<template>
  <table>
    <thead>
      <tr><th>Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
    </thead>
    <tbody>
      <ProductRow
        v-for="product in products"
        :key="product.id"
        :product="product"
        :can-manage="canManage"
        @edit="emit('edit', product)"
        @adjust="emit('adjust', product)"
        @history="emit('history', product)"
      />
    </tbody>
  </table>
</template>

<style scoped>
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px 10px; border-bottom: 1px solid #edf1f7; text-align: left; white-space: nowrap; }
th { background: #f6f8fc; color: #73839f; font-size: 11px; font-weight: 600; text-transform: uppercase; }
td { color: #172b4d; font-size: 13px; }
th:first-child, td:first-child { padding-left: 16px; }
</style>