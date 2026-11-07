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
  <div class="d-flex flex-column gap-2">
    <input
      v-model="search"
      class="form-control mb-1"
      placeholder="⌕  Search or select a product..."
    />

    <div
      v-for="product in filteredProducts"
      :key="product.id"
      class="d-flex justify-content-between align-items-center border rounded p-3"
    >
      <div>
        <strong class="d-block" style="font-size: 14px">{{ product.name }}</strong>
        <small class="text-muted d-block">
          ${{ product.sellingPrice.toFixed(2) }} each · {{ product.stockQuantity }} in stock
        </small>
      </div>
      <button
        type="button"
        class="btn btn-primary btn-sm flex-shrink-0"
        :disabled="product.stockQuantity === 0"
        @click="emit('add', product.id)"
      >＋ Add</button>
    </div>

    <p v-if="filteredProducts.length === 0" class="text-muted small mb-0">
      No available products found.
    </p>
  </div>
</template>
