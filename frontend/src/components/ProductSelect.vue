<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@/types'

const emit = defineEmits<{ add: [productId: string] }>()

const { products } = defineProps<{ products: Product[] }>()
const search = ref('')
const filteredProducts = computed(() => products.filter((p) =>
  `${p.name} ${p.sku}`.toLowerCase().includes(search.value.toLowerCase()),
))

</script>

<template>
  <div class="product-picker">
    <input v-model="search" placeholder="⌕  Search or select a product..." />
    <div v-for="product in filteredProducts" :key="product.id" class="product-option">
      <div><strong>{{ product.name }}</strong><small>${{ product.sellingPrice.toFixed(2) }} each · {{ product.stockQuantity }} in stock</small></div>
      <button type="button" class="btn btn-primary" :disabled="product.stockQuantity === 0" @click="emit('add', product.id)">＋ Add</button>
    </div>
    <p v-if="filteredProducts.length === 0" class="empty">No available products found.</p>
  </div>
</template>

<style scoped>
.product-picker { display: flex; flex-direction: column; gap: 12px; }
input { width: 100%; padding: 13px 16px; border: 1px solid #e1e8f3; border-radius: 9px; background: #f6f8fc; }
.product-option { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border: 1px solid #e6ecf5; border-radius: 9px; }
.product-option strong, .product-option small { display: block; }
.product-option small { color: #73839f; font-size: 12px; }
.product-option button { padding: 9px 16px; }
.empty { color: #73839f; font-size: 13px; }
</style>