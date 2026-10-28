<script setup lang="ts">
import type { CartLine } from '@/types'
import QuantityStepper from './QuantityStepper.vue'

defineProps<{ line: CartLine }>()
const emit = defineEmits<{ 'update-quantity': [quantity: number]; remove: [] }>()
</script>

<template>
  <tr>
    <td>{{ line.name }}</td>
    <td>${{ line.unitPrice.toFixed(2) }}</td>
    <td>
      <QuantityStepper
        :model-value="line.quantity"
        :max="line.stockQuantity"
        @update:model-value="(value) => emit('update-quantity', value)"
      />
    </td>
    <td>${{ (line.unitPrice * line.quantity).toFixed(2) }}</td>
    <td><button type="button" class="remove" aria-label="Remove product" @click="emit('remove')">×</button></td>
  </tr>
</template>

<style scoped>
.remove { border: 0; background: transparent; color: #73839f; font-size: 20px; line-height: 1; cursor: pointer; }
.remove:hover { color: #d9364f; }
</style>