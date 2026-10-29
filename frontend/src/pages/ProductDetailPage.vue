<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import { users } from '@/data'

const props = defineProps<{ id: string }>()
const store = useProductsStore()
const { status, stockMovements } = storeToRefs(store)

watch(() => props.id, () => store.load(), { immediate: true })

const product = computed(() => store.byId(props.id))

const isLow = computed(() =>
  !!product.value && product.value.stockQuantity <= product.value.lowStockThreshold,
)

const movements = computed(() =>
  stockMovements.value
    .filter((m) => m.productId === props.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
)

function userName(id: string) {
  return users.find((u) => u.id === id)?.name ?? 'Unknown'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatType(type: string) {
  return type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')
}
</script>

<template>
  <section class="page">
    <RouterLink class="back" to="/products">← Back to products</RouterLink>

    <p v-if="status === 'loading' || status === 'idle'" class="state">Loading...</p>
    <p v-else-if="status === 'error'" class="state error">Could not load the product.</p>
    <div v-else-if="!product" class="card state">
      <h2>Product not found</h2>
      <p>This product does not exist.</p>
    </div>

    <template v-else>
      <div class="header">
        <div>
          <h1>{{ product.name }}</h1>
          <p class="subtitle">SKU {{ product.sku }}</p>
        </div>
        <div class="badges">
          <span v-if="!product.active" class="badge badge-grey">Inactive</span>
          <span :class="['badge', isLow ? 'badge-red' : 'badge-green']">
            {{ isLow ? 'Low stock' : 'In stock' }}
          </span>
        </div>
      </div>

      <div class="stats">
        <div class="card stat">
          <span class="stat-label">Current stock</span>
          <strong :class="{ low: isLow }">{{ product.stockQuantity }}</strong>
        </div>
        <div class="card stat">
          <span class="stat-label">Low-stock threshold</span>
          <strong>{{ product.lowStockThreshold }}</strong>
        </div>
        <div class="card stat">
          <span class="stat-label">Selling price</span>
          <strong>${{ product.sellingPrice.toFixed(2) }}</strong>
        </div>
        <div class="card stat">
          <span class="stat-label">Movements</span>
          <strong>{{ movements.length }}</strong>
        </div>
      </div>

      <div class="card history">
        <div class="section-heading">
          <h2>Stock history</h2>
          <span>{{ movements.length }} records</span>
        </div>

        <p v-if="movements.length === 0" class="empty">No stock movements yet.</p>

        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Change</th>
                <th>Reason</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in movements" :key="m.id">
                <td class="muted">{{ formatDate(m.createdAt) }}</td>
                <td><span class="type">{{ formatType(m.movementType) }}</span></td>
                <td>
                  <span :class="['change', m.quantityChange > 0 ? 'plus' : 'minus']">
                    {{ m.quantityChange > 0 ? '+' : '' }}{{ m.quantityChange }}
                  </span>
                </td>
                <td>{{ m.reason }}</td>
                <td class="muted">{{ userName(m.userId) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page { max-width: 1000px; }
.back { display: inline-block; margin-bottom: 14px; color: #3f51b5; text-decoration: none; font-size: 13px; }
.back:hover { text-decoration: underline; }
.card { border: 1px solid #e6ecf5; border-radius: 13px; background: #fff; }
h1 { margin: 0; color: #172b4d; font-size: 24px; }
h2 { margin: 0; color: #172b4d; font-size: 16px; }
.subtitle { margin: 4px 0 0; color: #73839f; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
.badges { display: flex; gap: 8px; }
.badge { padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.badge-green { background: #e6f6ec; color: #2f8f55; }
.badge-red { background: #fdeaea; color: #c0392b; }
.badge-grey { background: #eef1f6; color: #73839f; }

.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
.stat { padding: 16px 18px; display: grid; gap: 6px; }
.stat-label { color: #73839f; font-size: 12px; }
.stat strong { color: #172b4d; font-size: 22px; }
.stat strong.low { color: #c0392b; }

.history { padding: 20px 16px 8px; }
.section-heading { display: flex; justify-content: space-between; padding: 0 8px 14px; }
.section-heading span { color: #73839f; font-size: 12px; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; padding: 12px 12px; background: #f6f8fc; color: #73839f; font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; }
td { padding: 12px; border-bottom: 1px solid #eef1f6; color: #172b4d; }
tbody tr:last-child td { border-bottom: none; }
.muted { color: #73839f; }
.type { padding: 3px 10px; border-radius: 6px; background: #eef1ff; color: #3f51b5; font-size: 12px; font-weight: 600; }
.change { font-weight: 700; }
.plus { color: #2f8f55; }
.minus { color: #c0392b; }
.empty { padding: 20px 8px; color: #73839f; }
.state { padding: 24px 8px; color: #73839f; }
.error { color: #c0392b; }

@media (max-width: 700px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .header { flex-direction: column; gap: 12px; }
}
</style>