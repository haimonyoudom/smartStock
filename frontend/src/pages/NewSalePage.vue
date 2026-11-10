<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import { useSalesStore } from '@/stores/sales'
import ProductSelect from '@/components/ProductSelect.vue'
import CartTable from '@/components/CartTable.vue'
import SaleSummary from '@/components/SaleSummary.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import type { CartItem, CartLine } from '@/types'

const productsStore = useProductsStore()
const salesStore = useSalesStore()
const { status: productsStatus, error: productsError } = storeToRefs(productsStore)

const cart = ref<CartItem[]>([])
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const saving = ref(false)

onMounted(() => productsStore.fetchAll())

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

async function onComplete() {
  if (saving.value) return
  saving.value = true
  const result = await salesStore.completeSale(cart.value)
  saving.value = false
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
  <section class="w-100" style="max-width: 1100px">
    <h1 class="page-title mb-1" style="color: #172b4d">New Sale</h1>
    <p class="text-muted mb-3 small">
      Manage your store with a clear, simple workflow.
    </p>

    <div v-if="successMessage" class="alert alert-success py-2 mb-3 small" role="alert">
      {{ successMessage }}
    </div>

    <div class="row g-3 align-items-start">
      <!-- Product picker -->
      <div class="col-12 col-md-5">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3 p-md-4">
            <h2 class="mb-1" style="font-size: 16px; color: #172b4d">Add products to sale</h2>
            <p class="text-muted small mb-3">Search and add available products to the cart.</p>

            <p v-if="productsStatus === 'loading'" class="text-muted small">Loading products...</p>
            <div v-else-if="productsStatus === 'error'">
              <ErrorBanner :message="productsError" />
              <button class="btn btn-sm btn-outline-secondary mt-2" type="button" @click="productsStore.fetchAll()">
                Try again
              </button>
            </div>
            <ProductSelect
              v-else-if="productsStatus === 'success'"
              :products="activeProducts"
              @add="onAdd"
            />
          </div>
        </div>
      </div>

      <!-- Current Sale / Cart -->
      <div class="col-12 col-md-7">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-2 p-sm-3 p-md-4">
            <h2 class="mb-2 mb-sm-3 px-1" style="font-size: 16px; color: #172b4d">Current sale</h2>
            <CartTable :lines="cartLines" @update-quantity="onUpdateQuantity" @remove="onRemove" />
            <SaleSummary :total="total" :can-complete="cart.length > 0 && !saving" @complete="onComplete" />
            <p class="text-muted small text-center mt-2 mb-0" style="font-size: 11px">
              {{ saving ? 'Saving stock changes...' : 'Stock updates after successful checkout.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <ErrorBanner :message="errorMessage" />
  </section>
</template>

<style scoped>
.page-title {
  font-size: 22px;
}
@media (min-width: 768px) {
  .page-title {
    font-size: 26px;
  }
}
</style>
