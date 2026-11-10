<script setup lang="ts">
import type { CartLine } from '@/types'
import QuantityStepper from './QuantityStepper.vue'

defineProps<{ line: CartLine }>()
const emit = defineEmits<{ 'update-quantity': [quantity: number]; remove: [] }>()
</script>

<template>
  <tr>
    <!-- Product Name & mobile unit price -->
    <td class="cart-product-cell">
      <strong class="d-block text-dark text-truncate" style="font-size: 13px; max-width: 140px">
        {{ line.name }}
      </strong>
      <!-- Unit price under name on mobile (< 576px) -->
      <small class="text-muted d-sm-none" style="font-size: 11px">
        ${{ line.unitPrice.toFixed(2) }} ea
      </small>
    </td>

    <!-- Standalone Price column (≥ 576px) -->
    <td class="d-none d-sm-table-cell text-muted" style="font-size: 13px; white-space: nowrap">
      ${{ line.unitPrice.toFixed(2) }}
    </td>

    <!-- Quantity Stepper -->
    <td class="cart-qty-cell">
      <QuantityStepper
        :model-value="line.quantity"
        :max="line.stockQuantity"
        @update:model-value="(value) => emit('update-quantity', value)"
      />
    </td>

    <!-- Subtotal -->
    <td class="fw-semibold text-dark text-nowrap" style="font-size: 13px">
      ${{ (line.unitPrice * line.quantity).toFixed(2) }}
    </td>

    <!-- Cancel / Remove Button -->
    <td class="text-center cart-action-cell">
      <button
        type="button"
        class="btn btn-sm btn-outline-danger cancel-btn"
        title="Remove product from cart"
        aria-label="Remove product"
        @click="emit('remove')"
      >
        ✕
      </button>
    </td>
  </tr>
</template>

<style scoped>
td {
  padding: 8px 6px;
}

.cancel-btn {
  width: 26px;
  height: 26px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border-radius: 6px;
  line-height: 1;
}

@media (min-width: 576px) {
  td {
    padding: 10px 8px;
  }
  .cancel-btn {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
}
</style>
