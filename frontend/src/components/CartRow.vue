<script setup lang="ts">
import type { CartLine } from '@/types'
import QuantityStepper from './QuantityStepper.vue'

defineProps<{ line: CartLine }>()
const emit = defineEmits<{ 'update-quantity': [quantity: number]; remove: [] }>()
</script>

<template>
  <tr>
    <td style="font-size: 13px">{{ line.name }}</td>
    <td style="font-size: 13px">${{ line.unitPrice.toFixed(2) }}</td>
    <td>
      <QuantityStepper
        :model-value="line.quantity"
        :max="line.stockQuantity"
        @update:model-value="(value) => emit('update-quantity', value)"
      />
    </td>
    <td style="font-size: 13px">${{ (line.unitPrice * line.quantity).toFixed(2) }}</td>
    <td>
      <button
        type="button"
        class="btn btn-sm border-0 bg-transparent text-danger"
        style="font-size: 20px; line-height: 1"
        aria-label="Remove product"
        @click="emit('remove')"
      >×</button>
    </td>
  </tr>
</template>
