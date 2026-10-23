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
    <td><button type="button" @click="emit('remove')">x</button></td>
  </tr>
</template>