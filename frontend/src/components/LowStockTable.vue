<script setup lang="ts">
import type { Product } from '@/types'

defineProps<{ products: Product[] }>()
const emit = defineEmits<{ adjust: [product: Product] }>()
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th class="text-uppercase text-muted small">Product</th>
          <th class="text-uppercase text-muted small d-none d-md-table-cell">SKU</th>
          <th class="text-uppercase text-muted small">Current stock</th>
          <th class="text-uppercase text-muted small d-none d-sm-table-cell">Threshold</th>
          <th class="text-uppercase text-muted small">Status</th>
          <th class="text-uppercase text-muted small text-end text-sm-start">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td style="font-size: 13px"><strong class="text-dark">{{ product.name }}</strong></td>
          <td class="d-none d-md-table-cell" style="font-size: 13px">{{ product.sku }}</td>
          <td style="font-size: 13px" class="fw-bold text-danger">{{ product.stockQuantity }}</td>
          <td class="d-none d-sm-table-cell" style="font-size: 13px">{{ product.lowStockThreshold }}</td>
          <td><span class="badge bg-danger">Low stock</span></td>
          <td class="text-end text-sm-start">
            <button
              type="button"
              class="btn btn-primary btn-sm py-1 px-2 text-nowrap"
              @click="emit('adjust', product)"
            >Adjust stock</button>
          </td>
        </tr>
        <tr v-if="products.length === 0">
          <td colspan="6" class="text-center text-muted py-3">No products are low on stock.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th, td {
  padding: 12px 10px;
}
</style>
