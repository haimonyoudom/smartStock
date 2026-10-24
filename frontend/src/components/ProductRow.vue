<script setup lang="ts">
import type { Product } from '@/types'
import LowStockBadge from './LowStockBadge.vue'

defineProps<{ product: Product; canManage: boolean }>()
const emit = defineEmits<{ edit: []; adjust: []; history: [] }>()
</script>

<template>
  <tr
    :class="{ low: product.stockQuantity <= product.lowStockThreshold, inactive: !product.active }"
  >
    <td>{{ product.name }}<span v-if="!product.active"> (inactive)</span></td>
    <td>{{ product.sku }}</td>
    <td>${{ product.sellingPrice.toFixed(2) }}</td>
    <td>
      {{ product.stockQuantity }}
      <LowStockBadge :stock="product.stockQuantity" :threshold="product.lowStockThreshold" />
    </td>
    <td>
      <div class="actions">
        <template v-if="canManage">
          <button type="button" @click="emit('edit')">Edit</button>
          <button type="button" @click="emit('adjust')">Adjust</button>
        </template>
        <button type="button" @click="emit('history')">History</button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.low {
  background: #ffe3e3;
}
.inactive {
  color: #888;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
