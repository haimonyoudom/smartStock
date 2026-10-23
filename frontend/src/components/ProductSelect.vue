<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'

defineProps<{ products: Product[] }>()
const emit = defineEmits<{ add: [productId: string] }>()

const selectedId = ref('')

function onAdd() {
  if (!selectedId.value) return
  emit('add', selectedId.value)
  selectedId.value = ''
}
</script>

<template>
  <div class="select-bar">
    <select v-model="selectedId">
      <option value="" disabled>Choose product</option>
      <option v-for="p in products" :key="p.id" :value="p.id" :disabled="p.stockQuantity === 0">
        {{ p.name }} - ${{ p.sellingPrice.toFixed(2) }} ({{ p.stockQuantity }} left)
      </option>
    </select>
    <button type="button" :disabled="!selectedId" @click="onAdd">Add</button>
  </div>
</template>

<style scoped>
.select-bar { display: flex; gap: 0.75rem; }
select { min-width: 20rem; padding: 0.4rem; }
</style>