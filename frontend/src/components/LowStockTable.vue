<script setup lang="ts">
import type { Product } from '@/types'

defineProps<{ products: Product[] }>()
const emit = defineEmits<{ adjust: [product: Product] }>()
</script>

<template>
  <table>
    <thead>
      <tr><th>Product</th><th>Stock</th><th>Threshold</th><th>Action</th></tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id" class="low">
        <td>{{ product.name }}</td>
        <td>{{ product.stockQuantity }}</td>
        <td>{{ product.lowStockThreshold }}</td>
        <td><button type="button" @click="emit('adjust', product)">Adjust stock</button></td>
      </tr>
      <tr v-if="products.length === 0">
        <td colspan="4" class="empty">No products are low on stock.</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 0.6rem; border-bottom: 1px solid #ddd; }
th { background: #ddd; }
.low { background: #ffe3e3; }
.empty { color: #777; background: #fff; }
</style>