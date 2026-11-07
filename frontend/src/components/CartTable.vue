<script setup lang="ts">
import type { CartLine } from '@/types'
import CartRow from './CartRow.vue'

defineProps<{
  lines: CartLine[]
}>()

const emit = defineEmits<{
  'update-quantity': [productId: string, quantity: number]
  remove: [productId: string]
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover table-bordered mb-0">
      <thead class="table-light">
        <tr>
          <th class="text-uppercase text-muted small" style="width: 32%">Product</th>
          <th class="text-uppercase text-muted small">Price</th>
          <th class="text-uppercase text-muted small">Qty</th>
          <th class="text-uppercase text-muted small">Subtotal</th>
          <th aria-label="Remove"></th>
        </tr>
      </thead>

      <tbody>
        <CartRow
          v-for="line in lines"
          :key="line.productId"
          :line="line"
          @update-quantity="(quantity) => emit('update-quantity', line.productId, quantity)"
          @remove="emit('remove', line.productId)"
        />

        <tr v-if="lines.length === 0">
          <td colspan="5" class="text-center text-muted py-4">
            Your cart is empty. Choose a product to begin a sale.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
