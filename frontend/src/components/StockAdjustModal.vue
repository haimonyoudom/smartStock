<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'

defineProps<{ product: Product }>()
const emit = defineEmits<{ save: [payload: { change: number; reason: string }]; cancel: [] }>()

const change = ref(0)
const reason = ref('')
</script>

<template>
  <div class="panel">
    <h2>Adjust stock: {{ product.name }}</h2>
    <p>Current stock: {{ product.stockQuantity }}</p>
    <label>
      Change (use a negative number to remove stock)
      <input v-model.number="change" type="number" step="1" />
    </label>
    <label>
      Reason
      <input v-model="reason" type="text" placeholder="e.g. Restock delivery" />
    </label>
    <div class="buttons">
      <button type="button" @click="emit('save', { change, reason })">Save</button>
      <button type="button" @click="emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.panel { display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem; padding: 1rem; border: 1px solid #555; border-radius: 6px; background: #fff; }
label { display: flex; flex-direction: column; gap: 0.25rem; }
input { padding: 0.4rem; }
.buttons { display: flex; gap: 0.75rem; }
</style>