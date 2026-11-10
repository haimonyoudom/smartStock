<script setup lang="ts">
import type { Product } from '@/types'
import ProductRow from './ProductRow.vue'

defineProps<{ products: Product[]; canManage: boolean }>()
const emit = defineEmits<{ edit: [product: Product]; adjust: [product: Product]; history: [product: Product] }>()
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th class="text-uppercase text-muted small">Product</th>
          <th class="text-uppercase text-muted small d-none d-md-table-cell">SKU</th>
          <th class="text-uppercase text-muted small">Price</th>
          <th class="text-uppercase text-muted small">Stock</th>
          <th class="text-uppercase text-muted small">Status</th>
          <th class="text-uppercase text-muted small text-end text-md-start">Actions</th>
        </tr>
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
  </div>
</template>

<style scoped>
th {
  padding: 12px 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
}
</style>
