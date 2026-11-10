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
    <table class="table table-hover align-middle mb-0 cart-table">
      <thead class="table-light">
        <tr>
          <th class="text-uppercase text-muted small">Product</th>
          <th class="text-uppercase text-muted small d-none d-sm-table-cell" style="width: 75px">Price</th>
          <th class="text-uppercase text-muted small" style="width: 86px">Qty</th>
          <th class="text-uppercase text-muted small" style="width: 72px">Subtotal</th>
          <th aria-label="Cancel" style="width: 36px"></th>
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
          <td colspan="5" class="text-center text-muted py-4 small">
            Your cart is empty. Choose a product to begin a sale.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th {
  padding: 8px 6px;
  font-size: 11px;
  letter-spacing: 0.03em;
}

@media (min-width: 576px) {
  th {
    padding: 10px 8px;
  }
}
</style>
