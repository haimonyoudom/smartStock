
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
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="product-column">Product</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Subtotal</th>
          <th aria-label="Remove"></th>
        </tr>
      </thead>

      <tbody>
        <CartRow
          v-for="line in lines"
          :key="line.productId"
          :line="line"
          @update-quantity="
            (quantity) => emit('update-quantity', line.productId, quantity)
          "
          @remove="emit('remove', line.productId)"
        />

        <tr v-if="lines.length === 0">
          <td colspan="5" class="empty">
            Your cart is empty. Choose a product to begin a sale.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* table  cart */
.table-container { width: 100%; overflow-x: auto; border: 1px solid #dbe5f5; border-radius: 10px; background: white; }

table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  background: #ffffff;
  color: #292929;
}

th, td {
  padding: 14px 12px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #cccccc;
}

th { background: #f6f8fc; color: #73839f; font-weight: 600; font-size: 11px; text-transform: uppercase; }

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover:not(:has(.empty)) {
  background: #f7f7f7;
}

.product-column {
  width: 32%;
}

.empty {
  padding: 28px 16px;
  text-align: center;
  color: #666666;
}

td { color: #172b4d; font-size: 13px; }

@media (max-width: 560px) {
  .table-container { overflow: visible; border: 0; }
  table, thead, tbody, tr, td { display: block; min-width: 0; }
  table { width: 100%; }
  thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  tbody tr:not(:has(.empty)) { display: grid; grid-template-columns: 1fr auto; gap: 6px 12px; padding: 14px 0; border-bottom: 1px solid #edf1f7; }
  tbody tr:not(:has(.empty)) td { padding: 0; border: 0; }
  tbody tr:not(:has(.empty)) td::before { display: block; margin-bottom: 2px; color: #73839f; font-size: 10px; text-transform: uppercase; }
  tbody tr:not(:has(.empty)) td:nth-child(1) { grid-column: 1 / -1; font-weight: 700; }
  tbody tr:not(:has(.empty)) td:nth-child(1)::before { content: 'Product'; }
  tbody tr:not(:has(.empty)) td:nth-child(2)::before { content: 'Price'; }
  tbody tr:not(:has(.empty)) td:nth-child(3)::before { content: 'Quantity'; }
  tbody tr:not(:has(.empty)) td:nth-child(4)::before { content: 'Subtotal'; }
  tbody tr:not(:has(.empty)) td:nth-child(5) { position: absolute; right: 0; margin-top: -28px; }
  .empty { padding: 24px 0; }
}
</style>