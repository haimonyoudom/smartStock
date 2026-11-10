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
  <section style="max-width: 1000px">
    <RouterLink class="btn btn-link p-0 mb-3 text-decoration-none" to="/products">
      ← Back to products
    </RouterLink>

    <p v-if="status === 'loading' || status === 'idle'" class="text-muted py-3">Loading...</p>
    <p v-else-if="status === 'error'" class="text-danger py-3">Could not load the product.</p>

    <div v-else-if="!product" class="card border-0 shadow-sm p-4">
      <h2 style="font-size: 18px">Product not found</h2>
      <p class="text-muted mb-0">This product does not exist.</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 mb-3 mb-md-4">
        <div>
          <h1 class="page-title mb-1" style="color: #172b4d">{{ product.name }}</h1>
          <p class="text-muted mb-0" style="font-size: 13px">SKU {{ product.sku }}</p>
        </div>
        <div class="d-flex gap-2 flex-shrink-0 mt-1 mt-sm-0">
          <span v-if="!product.active" class="badge bg-secondary">Inactive</span>
          <span :class="['badge', isLow ? 'bg-danger' : 'bg-success']">
            {{ isLow ? 'Low stock' : 'In stock' }}
          </span>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="row g-2 g-md-3 mb-3 mb-md-4">
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-3">
              <div class="text-muted mb-1" style="font-size: 11px">Current stock</div>
              <strong :class="isLow ? 'text-danger' : 'text-dark'" class="stat-number">
                {{ product.stockQuantity }}
              </strong>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-3">
              <div class="text-muted mb-1" style="font-size: 11px">Low-stock threshold</div>
              <strong class="text-dark stat-number">{{ product.lowStockThreshold }}</strong>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-3">
              <div class="text-muted mb-1" style="font-size: 11px">Selling price</div>
              <strong class="text-dark stat-number">${{ product.sellingPrice.toFixed(2) }}</strong>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-3">
              <div class="text-muted mb-1" style="font-size: 11px">Movements</div>
              <strong class="text-dark stat-number">{{ movements.length }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock history card -->
      <div class="card border-0 shadow-sm">
        <div class="card-body pb-0">
          <div class="d-flex justify-content-between align-items-center mb-3 px-1">
            <h2 class="mb-0" style="font-size: 16px; color: #172b4d">Stock history</h2>
            <span class="text-muted" style="font-size: 12px">{{ movements.length }} records</span>
          </div>
        </div>

        <p v-if="movements.length === 0" class="text-muted px-4 pb-4">No stock movements yet.</p>

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="text-uppercase text-muted small">Date</th>
                <th class="text-uppercase text-muted small">Type</th>
                <th class="text-uppercase text-muted small">Change</th>
                <th class="text-uppercase text-muted small">Reason</th>
                <th class="text-uppercase text-muted small d-none d-sm-table-cell">By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in movements" :key="m.id">
                <td class="text-muted" style="font-size: 12px; white-space: nowrap">{{ formatDate(m.createdAt) }}</td>
                <td>
                  <span class="badge" style="background: #eef1ff; color: #3f51b5; font-size: 11px">
                    {{ formatType(m.movementType) }}
                  </span>
                </td>
                <td>
                  <span
                    class="fw-bold"
                    :class="m.quantityChange > 0 ? 'text-success' : 'text-danger'"
                    style="font-size: 13px"
                  >
                    {{ m.quantityChange > 0 ? '+' : '' }}{{ m.quantityChange }}
                  </span>
                </td>
                <td style="font-size: 12px">{{ m.reason }}</td>
                <td class="text-muted d-none d-sm-table-cell" style="font-size: 12px">{{ userName(m.userId) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page-title {
  font-size: 22px;
}
.stat-number {
  font-size: 19px;
}
@media (min-width: 768px) {
  .page-title {
    font-size: 26px;
  }
  .stat-number {
    font-size: 24px;
  }
}
th, td {
  padding: 10px;
}
</style>
