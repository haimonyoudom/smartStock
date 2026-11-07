<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import LowStockTable from '@/components/LowStockTable.vue'
import StockAdjustModal from '@/components/StockAdjustModal.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import type { Product } from '@/types'

const productsStore = useProductsStore()
const { status: productsStatus, error: productsError } = storeToRefs(productsStore)

const adjustingProductId = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

onMounted(() => productsStore.fetchAll())

// A product is in the list while stock <= threshold, and leaves it automatically.
const lowStockProducts = computed(() =>
  productsStore.products.filter((p) => p.active && p.stockQuantity <= p.lowStockThreshold),
)

const adjustingProduct = computed(
  () => productsStore.products.find((p) => p.id === adjustingProductId.value) ?? null,
)

function onAdjust(product: Product) {
  errorMessage.value = null
  adjustingProductId.value = product.id
}

async function onSave(payload: { change: number; reason: string }) {
  if (!adjustingProductId.value) return
  const result = await productsStore.adjustStock(adjustingProductId.value, payload.change, payload.reason)
  if (result.ok) {
    adjustingProductId.value = null
    errorMessage.value = null
  } else {
    errorMessage.value = result.error
  }
}

function onCancel() {
  adjustingProductId.value = null
  errorMessage.value = null
}
</script>

<template>
  <section style="max-width: 1000px">
    <h1 class="mb-1" style="color: #172b4d; font-size: 24px">Low-stock alerts</h1>
    <p class="text-muted mb-4" style="font-size: 13px">
      Manage your store with a clear, simple workflow.
    </p>

    <p v-if="productsStatus === 'loading'" class="text-muted">Loading alerts...</p>
    <ErrorBanner v-else-if="productsStatus === 'error'" :message="productsError" />

    <!-- Alert banner -->
    <div class="alert alert-danger d-flex align-items-center gap-3 mb-3" role="alert">
      <span
        class="d-grid rounded-circle flex-shrink-0 text-white fw-bold"
        style="width: 44px; height: 44px; place-items: center; background: #d9364f; font-size: 22px"
      >!</span>
      <div>
        <strong style="font-size: 16px">{{ lowStockProducts.length }} products need attention</strong>
        <p class="mb-0 mt-1" style="font-size: 12px">
          Stock is at or below its low-stock threshold. Adjust stock to keep sales moving.
        </p>
      </div>
    </div>

    <!-- Low-stock table card -->
    <div class="card border-0 shadow-sm">
      <div class="card-body pb-0">
        <div class="d-flex justify-content-between align-items-center mb-3 px-1">
          <h2 class="mb-0" style="font-size: 16px; color: #172b4d">Low-stock products</h2>
          <span class="text-muted" style="font-size: 12px">Sorted by lowest stock</span>
        </div>
      </div>
      <LowStockTable :products="lowStockProducts" @adjust="onAdjust" />
    </div>

    <ErrorBanner :message="errorMessage" />
    <StockAdjustModal v-if="adjustingProduct" :product="adjustingProduct" @save="onSave" @cancel="onCancel" />
  </section>
</template>
