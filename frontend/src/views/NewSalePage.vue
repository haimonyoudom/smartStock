<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useSalesStore } from '@/stores/sales'
import ProductSelect from '@/components/ProductSelect.vue'
import CartTable from '@/components/CartTable.vue'
import SaleSummary from '@/components/SaleSummary.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import type { CartItem, CartLine } from '@/types'

const productsStore = useProductsStore()
const salesStore = useSalesStore()

const cart = ref<CartItem[]>([])
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const activeProducts = computed(() => productsStore.products.filter((p) => p.active))

const cartLines = computed<CartLine[]>(() =>
  cart.value.flatMap((item) => {
    const product = productsStore.products.find((p) => p.id === item.productId)
    if (!product) return []
    return [{
      productId: product.id,
      name: product.name,
      unitPrice: product.sellingPrice,
      quantity: item.quantity,
      stockQuantity: product.stockQuantity,
    }]
  }),
)

const total = computed(() =>
  Math.round(cartLines.value.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0) * 100) / 100,
)

function onAdd(productId: string) {
  errorMessage.value = null
  successMessage.value = null

  const product = productsStore.products.find(
    (p) => p.id === productId,
  )

  if (!product || !product.active) {
    errorMessage.value = 'This product is unavailable.'
    return
  }

  if (product.stockQuantity <= 0) {
    errorMessage.value = `${product.name} is out of stock.`
    return
  }

  const existing = cart.value.find(
    (item) => item.productId === productId,
  )

  if (existing) {
    if (existing.quantity < product.stockQuantity) {
      existing.quantity += 1
    } else {
      errorMessage.value =
        `Not enough stock: ${product.name} (${product.stockQuantity} left)`
    }
  } else {
    cart.value.push({
      productId,
      quantity: 1,
    })
  }
}

function onUpdateQuantity(productId: string, quantity: number) {
  const item = cart.value.find((i) => i.productId === productId)
  if (item) item.quantity = quantity
}

function onRemove(productId: string) {
  cart.value = cart.value.filter((i) => i.productId !== productId)
}

function onComplete() {
  const result = salesStore.completeSale(cart.value)
  if (result.ok) {
    cart.value = []
    errorMessage.value = null
    successMessage.value = `Sale #${result.sale.id} saved. Total $${result.sale.totalAmount.toFixed(2)}.`
  } else {
    successMessage.value = null
    errorMessage.value = result.error
  }
}
</script>

<template>
  <section class="page">
    <h1>New Sale</h1>
    <p v-if="successMessage" class="ok">{{ successMessage }}</p>
    <p class="subtitle">Manage your store with a clear, simple workflow.</p>
    <div class="sale-grid">
      <div class="card picker-card"><h2>Add products to sale</h2><p class="hint">Search and add available products to the cart.</p><ProductSelect :products="activeProducts" @add="onAdd" /></div>
      <div class="card cart-card"><h2>Current sale</h2><CartTable :lines="cartLines" @update-quantity="onUpdateQuantity" @remove="onRemove" /><SaleSummary :total="total" :can-complete="cart.length > 0" @complete="onComplete" /><p class="hint center">Stock updates after successful checkout.</p></div>
    </div>
    <ErrorBanner :message="errorMessage" />
  </section>
</template>
<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  min-width: 0;
  color: #24324b;
}

.page h1 {
  margin: 0;
  color: #172b4d;
  font-size: 24px;
}
.subtitle, .hint { color: #73839f; font-size: 12px; }
.subtitle { margin: 4px 0 22px; }
.sale-grid { display: grid; grid-template-columns: minmax(260px, .9fr) minmax(0, 1.6fr); gap: 20px; align-items: start; }
.card { min-width: 0; padding: 26px; border: 1px solid #e6ecf5; border-radius: 13px; background: #fff; }
.card h2 { margin: 0; font-size: 16px; }
.hint { margin: 5px 0 16px; }
.center { text-align: center; }
.ok {
  padding: 12px 16px;
  background: #e3f6e3;
  border: 1px solid #3a3;
  border-radius: 8px;
}
@media (max-width: 900px) {
  .sale-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .card { padding: 18px 14px; }
}

@media (min-width: 1100px) {
  .page {
    max-width: none;
  }
}
</style>