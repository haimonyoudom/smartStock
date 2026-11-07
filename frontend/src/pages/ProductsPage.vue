<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import ProductTable from '@/components/ProductTable.vue'
import type { Product } from '@/types'
import ProductFormModal from '@/components/ProductFormModal.vue'
import { productsApi } from '@/api/products'
import type { ProductForm } from '@/validation'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const auth = useAuthStore()
const productsStore = useProductsStore()
const { products, status, error } = storeToRefs(productsStore)

onMounted(() => productsStore.fetchAll())

const canManage = computed(() => auth.currentUser.role === 'OWNER')
const message = ref('') // placeholder until the modals are built
const search = ref('')
const filteredProducts = computed(() =>
  products.value.filter((product) =>
    `${product.name} ${product.sku}`.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

const showForm = ref(false)
const editingProduct = ref<Product | null>(null)
const saving = ref(false)
const serverError = ref<string | null>(null)

const takenSkus = computed(() => products.value.map((p) => p.sku.toUpperCase()))

function openAdd() {
  editingProduct.value = null
  serverError.value = null
  showForm.value = true
}

function onEdit(product: Product) {
  editingProduct.value = product
  serverError.value = null
  showForm.value = true
}

async function onSave(data: ProductForm) {
  saving.value = true
  serverError.value = null
  try {
    const saved = editingProduct.value
      ? await productsApi.update(editingProduct.value.id, data)
      : await productsApi.create(data)
    productsStore.replace(saved)
    showForm.value = false
  } catch (e) {
    serverError.value = e instanceof Error ? e.message : 'Could not save the product.'
  } finally {
    saving.value = false
  }
}
function onAdjust(product: Product) {
  message.value = `Adjust ${product.name}: dialog comes next`
}
function onHistory(product: Product) {
  router.push({ name: 'product-detail', params: { id: product.id } })
}
</script>

<template>
  <section style="max-width: 1000px">
    <div v-if="route.query.denied" class="alert alert-danger py-2 mb-3" role="alert">
      Only the owner can open that page.
    </div>

    <h1 class="mb-1" style="color: #172b4d; font-size: 24px">Products</h1>
    <p class="text-muted mb-4" style="font-size: 13px">
      Manage your store with a clear, simple workflow.
    </p>

    <!-- Overview card -->
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 class="mb-1" style="font-size: 16px; color: #172b4d">Inventory overview</h2>
          <p class="mb-0 text-muted" style="font-size: 12px">
            Keep product details and stock levels up to date.
          </p>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <input
            v-model="search"
            class="form-control form-control-sm"
            placeholder="⌕  Search products"
            style="width: 160px"
          />
          <button v-if="canManage" class="btn btn-primary btn-sm" type="button" @click="openAdd">
            ＋ Add Product
          </button>
        </div>
      </div>
    </div>

    <ProductFormModal
      v-if="showForm"
      :product="editingProduct"
      :taken-skus="takenSkus"
      :pending="saving"
      :server-error="serverError"
      @save="onSave"
      @cancel="showForm = false"
    />

    <!-- Products table card -->
    <div class="card border-0 shadow-sm">
      <div class="card-body pb-0">
        <div class="d-flex justify-content-between align-items-center mb-3 px-1">
          <h2 class="mb-0" style="font-size: 16px; color: #172b4d">Products</h2>
          <span class="text-muted" style="font-size: 12px">{{ filteredProducts.length }} products</span>
        </div>
      </div>

      <p v-if="status === 'loading'" class="text-muted px-4 pb-3">Loading...</p>

      <div v-else-if="status === 'error'" class="px-4 pb-3">
        <p class="text-danger mb-2">{{ error }}</p>
        <button class="btn btn-sm btn-outline-secondary" type="button" @click="productsStore.fetchAll()">
          Try again
        </button>
      </div>

      <p v-else-if="status === 'success' && products.length === 0" class="text-muted px-4 pb-3">
        No products yet. Add your first one.
      </p>

      <ProductTable
        v-else-if="status === 'success'"
        :products="filteredProducts"
        :can-manage="canManage"
        @edit="onEdit"
        @adjust="onAdjust"
        @history="onHistory"
      />
    </div>

    <p v-if="message" class="mt-3 text-muted">{{ message }}</p>
  </section>
</template>
