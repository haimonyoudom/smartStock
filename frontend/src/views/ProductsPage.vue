<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import ProductTable from '@/components/ProductTable.vue'
import type { Product } from '@/types'

const auth = useAuthStore()
const productsStore = useProductsStore()

const canManage = computed(() => auth.currentUser.role === 'OWNER')
const message = ref('') // placeholder until the modals are built
const search = ref('')
const filteredProducts = computed(() => productsStore.products.filter((product) =>
  `${product.name} ${product.sku}`.toLowerCase().includes(search.value.toLowerCase()),
))

function onEdit(product: Product) { message.value = `Edit ${product.name}: form comes next` }
function onAdjust(product: Product) { message.value = `Adjust ${product.name}: dialog comes next` }
function onHistory(product: Product) { message.value = `History of ${product.name}: panel comes next` }
</script>

<template>
  <section class="page">
    <h1>Products</h1>
    <p class="subtitle">Manage your store with a clear, simple workflow.</p>
    <div class="overview card">
      <div><h2>Inventory overview</h2><p>Keep product details and stock levels up to date.</p></div>
      <div class="overview-actions"><input v-model="search" placeholder="⌕  Search products" /><button v-if="canManage" class="btn btn-primary" type="button" @click="message = 'Add product: form comes next'">＋ Add Product</button></div>
    </div>
    <div class="card product-card">
      <div class="section-heading"><h2>Products</h2><span>{{ filteredProducts.length }} products</span></div>
    <ProductTable
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
.page { max-width: 1000px; }
h1 { margin: 0; color: #172b4d; font-size: 24px; }
.subtitle { margin: 4px 0 22px; color: #73839f; }
.card { border: 1px solid #e6ecf5; border-radius: 13px; background: #fff; }
.overview { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; margin-bottom: 16px; }
h2 { margin: 0; color: #172b4d; font-size: 16px; }
.overview p { margin: 5px 0 0; color: #73839f; font-size: 12px; }
.overview-actions { display: flex; gap: 14px; }
input { width: 145px; padding: 10px 12px; border: 1px solid #e1e8f3; border-radius: 8px; }
.product-card { padding: 20px 16px 0; }
.section-heading { display: flex; justify-content: space-between; padding: 0 8px 14px; }
.section-heading span { color: #73839f; font-size: 12px; }
.note { margin-top: 1rem; color: #555; }
@media (max-width: 700px) { .overview { align-items: stretch; flex-direction: column; gap: 16px; } .overview-actions input { flex: 1; } }
</style>
