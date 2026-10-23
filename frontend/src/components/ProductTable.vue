<script setup lang="ts">
import type { Product } from '@/types'
import ProductRow from './ProductRow.vue'

defineProps<{ products: Product[]; canManage: boolean }>()
const emit = defineEmits<{ edit: [product: Product]; adjust: [product: Product]; history: [product: Product] }>()
</script>

<template>
  <table>
    <thead>
      <tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
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
th, td { text-align: left; padding: 0.6rem; border-bottom: 1px solid #ddd; }
th { background: #ddd; }
</style>