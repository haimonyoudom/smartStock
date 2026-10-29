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
  <section class="page">
    <p v-if="route.query.denied" class="error">Only the owner can open that page.</p>
    <h1>Products</h1>
    <p class="subtitle">Manage your store with a clear, simple workflow.</p>
    <div class="overview card">
      <div>
        <h2>Inventory overview</h2>
        <p>Keep product details and stock levels up to date.</p>
      </div>
      <div class="overview-actions">
        <input v-model="search" placeholder="⌕  Search products" /><button
          v-if="canManage"
          class="btn btn-primary"
          type="button"
          @click="openAdd"
        >
          ＋ Add Product
        </button>
        <ProductFormModal
          v-if="showForm"
          :product="editingProduct"
          :taken-skus="takenSkus"
          :pending="saving"
          :server-error="serverError"
          @save="onSave"
          @cancel="showForm = false"
        />
      </div>
    </div>
    <div class="card product-card">
      <div class="section-heading">
        <h2>Products</h2>
        <span>{{ filteredProducts.length }} products</span>
      </div>
      <p v-if="status === 'loading'" class="state">Loading...</p>

      <div v-else-if="status === 'error'" class="state">
        <p class="error">{{ error }}</p>
        <button class="btn" type="button" @click="productsStore.fetchAll()">Try again</button>
      </div>

      <p v-else-if="status === 'success' && products.length === 0" class="state">
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
    <p v-if="message" class="note">{{ message }}</p>
  </section>
</template>

<style scoped>
.state {
  padding: 24px 8px;
  color: #73839f;
}
.error {
  color: #c0392b;
}
.page {
  max-width: 1000px;
}
h1 {
  margin: 0;
  color: #172b4d;
  font-size: 24px;
}
.subtitle {
  margin: 4px 0 22px;
  color: #73839f;
}
.card {
  border: 1px solid #e6ecf5;
  border-radius: 13px;
  background: #fff;
}
.overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 16px;
}
h2 {
  margin: 0;
  color: #172b4d;
  font-size: 16px;
}
.overview p {
  margin: 5px 0 0;
  color: #73839f;
  font-size: 12px;
}
.overview-actions {
  display: flex;
  gap: 14px;
}
input {
  width: 145px;
  padding: 10px 12px;
  border: 1px solid #e1e8f3;
  border-radius: 8px;
}
.product-card {
  padding: 20px 16px 0;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  padding: 0 8px 14px;
}
.section-heading span {
  color: #73839f;
  font-size: 12px;
}
.note {
  margin-top: 1rem;
  color: #555;
}
@media (max-width: 700px) {
  .overview {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
  }
  .overview-actions input {
    flex: 1;
  }
}
</style>
