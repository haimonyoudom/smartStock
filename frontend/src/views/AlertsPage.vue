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
    <h1>Low-stock alerts</h1>
    <p class="subtitle">Manage your store with a clear, simple workflow.</p>
    <div class="alert-banner"><span class="alert-icon">!</span><div><strong>{{ lowStockProducts.length }} products need attention</strong><p>Stock is at or below its low-stock threshold. Adjust stock to keep sales moving.</p></div></div>
    <div class="card"><div class="section-heading"><h2>Low-stock products</h2><span>Sorted by lowest stock</span></div><LowStockTable :products="lowStockProducts" @adjust="onAdjust" /></div>
    <ErrorBanner :message="errorMessage" />
    <StockAdjustModal v-if="adjustingProduct" :product="adjustingProduct" @save="onSave" @cancel="onCancel" />
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0; max-width: 1000px; }
h1 { margin: 0; color: #172b4d; font-size: 24px; }
.subtitle { margin: 4px 0 22px; color: #73839f; }
.alert-banner { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding: 22px 26px; border: 1px solid #ffdddd; border-radius: 13px; background: #fff2f2; color: #8f2537; }
.alert-icon { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: #ffe0e2; font-size: 25px; font-weight: 700; }
.alert-banner strong { font-size: 17px; }
.alert-banner p { margin: 2px 0 0; color: #9f5260; font-size: 12px; }
.card { padding: 26px 16px 0; border: 1px solid #e6ecf5; border-radius: 13px; background: #fff; }
.section-heading { display: flex; justify-content: space-between; padding: 0 8px 16px; }
.section-heading h2 { margin: 0; font-size: 16px; }
.section-heading span { color: #73839f; font-size: 12px; }
</style>