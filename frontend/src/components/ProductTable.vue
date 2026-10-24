<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  add: [productId: string]
}>()

const selectedId = ref('')

function onAdd() {
  if (!selectedId.value) return

  emit('add', selectedId.value)
  selectedId.value = ''
}
</script>

<template>
  <div class="select-bar">
    <select v-model="selectedId" aria-label="Choose a product">
      <option value="" disabled>
        Choose product
      </option>

      <option
        v-for="product in products"
        :key="product.id"
        :value="product.id"
        :disabled="product.stockQuantity <= 0"
      >
        {{ product.name }}
        - ${{ product.sellingPrice.toFixed(2) }}
        ({{ product.stockQuantity }} left)
      </option>
    </select>

    <button
      type="button"
      :disabled="!selectedId"
      @click="onAdd"
    >
      Add
    </button>
  </div>
</template>

<style scoped>
.select-bar {
  display: flex;
  align-items: stretch;
  gap: 20px;
  width: 100%;
}

select {
  flex: 1;
  min-width: 0;
  max-width: 560px;
  min-height: 54px;
  padding: 12px 16px;
  border: 1px solid #888888;
  border-radius: 3px;
  background: #ffffff;
  color: #292929;
  font-size: 1rem;
}

button {
  min-width: 90px;
  min-height: 54px;
  padding: 12px 20px;
  border: 2px solid #383b64;
  border-radius: 3px;
  background: #d5dafb;
  color: #292929;
  font-size: 1rem;
}

button:hover:not(:disabled) {
  background: #c3caf5;
}

button:disabled {
  border-color: #cccccc;
  background: #eeeeee;
  color: #888888;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .select-bar {
    flex-direction: column;
    gap: 12px;
  }

  select {
    max-width: none;
    width: 100%;
  }

  button {
    width: 100%;
  }
}
</style>
