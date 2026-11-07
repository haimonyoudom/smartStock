<script setup lang="ts">
import type { Product } from '@/types'
import ProductRow from './ProductRow.vue'

defineProps<{ products: Product[]; canManage: boolean }>()
const emit = defineEmits<{ edit: [product: Product]; adjust: [product: Product]; history: [product: Product] }>()
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="table-light">
        <tr>
          <th class="text-uppercase text-muted small">Product</th>
          <th class="text-uppercase text-muted small">SKU</th>
          <th class="text-uppercase text-muted small">Price</th>
          <th class="text-uppercase text-muted small">Stock</th>
          <th class="text-uppercase text-muted small">Status</th>
          <th class="text-uppercase text-muted small">Actions</th>
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
