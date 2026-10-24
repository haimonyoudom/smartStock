<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import LowStockTable from '@/components/LowStockTable.vue'
import StockAdjustModal from '@/components/StockAdjustModal.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import type { Product } from '@/types'

const productsStore = useProductsStore()

const adjustingProductId = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

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

function onSave(payload: { change: number; reason: string }) {
  if (!adjustingProductId.value) return
  const result = productsStore.adjustStock(adjustingProductId.value, payload.change, payload.reason)
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
  <section class="page">
    <h1>Low-stock alerts ({{ lowStockProducts.length }})</h1>
    <LowStockTable :products="lowStockProducts" @adjust="onAdjust" />
    <ErrorBanner :message="errorMessage" />
    <StockAdjustModal v-if="adjustingProduct" :product="adjustingProduct" @save="onSave" @cancel="onCancel" />
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1rem; }
</style>