<script setup lang="ts">
import type { Product } from '@/types'
import LowStockBadge from './LowStockBadge.vue'

defineProps<{ product: Product; canManage: boolean }>()
const emit = defineEmits<{ edit: []; adjust: []; history: [] }>()
</script>

<template>
  <tr :class="{ 'text-muted': !product.active }">
    <td style="font-size: 13px">
      <strong>{{ product.name }}</strong>
      <span v-if="!product.active" class="text-muted"> (inactive)</span>
    </td>
    <td style="font-size: 13px">{{ product.sku }}</td>
    <td style="font-size: 13px">${{ product.sellingPrice.toFixed(2) }}</td>
    <td style="font-size: 13px">{{ product.stockQuantity }}</td>
    <td>
      <LowStockBadge :stock="product.stockQuantity" :threshold="product.lowStockThreshold" />
    </td>
    <td>
      <div class="d-flex gap-2">
        <template v-if="canManage">
          <button
            type="button"
            class="btn btn-link btn-sm p-0 text-primary"
            style="font-size: 12px"
            @click="emit('edit')"
          >Edit</button>
          <button
            type="button"
            class="btn btn-link btn-sm p-0 text-primary"
            style="font-size: 12px"
            @click="emit('adjust')"
          >Adjust</button>
        </template>
        <button
          type="button"
          class="btn btn-link btn-sm p-0 text-primary"
          style="font-size: 12px"
          @click="emit('history')"
        >History</button>
      </div>
    </td>
  </tr>
</template>
