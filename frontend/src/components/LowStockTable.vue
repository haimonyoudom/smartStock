<script setup lang="ts">
import type { Product } from '@/types'

defineProps<{ products: Product[] }>()
const emit = defineEmits<{ adjust: [product: Product] }>()
</script>

<template>
  <table>
    <thead>
      <tr><th>Product</th><th>SKU</th><th>Current stock</th><th>Threshold</th><th>Status</th><th>Action</th></tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id" class="low">
        <td>{{ product.name }}</td>
        <td>{{ product.sku }}</td>
        <td>{{ product.stockQuantity }}</td>
        <td>{{ product.lowStockThreshold }}</td>
        <td><span class="badge">Low stock</span></td>
        <td><button type="button" class="btn btn-primary" @click="emit('adjust', product)">Adjust stock</button></td>
      </tr>
      <tr v-if="products.length === 0">
        <td colspan="6" class="empty">No products are low on stock.</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px 10px; border-bottom: 1px solid #edf1f7; text-align: left; white-space: nowrap; }
th { background: #f6f8fc; color: #73839f; font-size: 11px; text-transform: uppercase; }
td { color: #172b4d; font-size: 13px; }
.badge { padding: 4px 9px; border-radius: 12px; background: #fff0f1; color: #d9364f; font-size: 11px; font-weight: 700; }
.empty { color: #777; background: #fff; }
</style>