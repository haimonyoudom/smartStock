
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
          <th>Remove</th>
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
.table-container {
  width: 100%;
  overflow-x: auto;
  border: 2px solid #666666;
}

table {
  width: 100%;
  min-width: 650px;
  border-collapse: collapse;
  background: #ffffff;
  color: #292929;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #cccccc;
}

th {
  background: #dddddd;
  color: #292929;
  font-weight: 500;
  font-size: 1rem;
}

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

.table-container {
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  border: 1px solid #dbe5f5;
  border-radius: 10px;
  background: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

th,
td {
  padding: 16px;
  text-align: left;
}

th {
  background: #eaf1ff;
  color: #243b63;
}
</style>