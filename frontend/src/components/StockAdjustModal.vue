<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'

defineProps<{ product: Product }>()
const emit = defineEmits<{ save: [payload: { change: number; reason: string }]; cancel: [] }>()

const change = ref(0)
const reason = ref('')
</script>

<template>
  <div class="card border-0 shadow-sm mt-3" style="max-width: 24rem">
    <div class="card-body d-flex flex-column gap-3">
      <h5 class="mb-0">Adjust stock: {{ product.name }}</h5>
      <p class="text-muted mb-0" style="font-size: 13px">Current stock: {{ product.stockQuantity }}</p>

      <div>
        <label class="form-label small fw-semibold">
          Change (use a negative number to remove stock)
        </label>
        <input v-model.number="change" class="form-control" type="number" step="1" />
      </div>

      <div>
        <label class="form-label small fw-semibold">Reason</label>
        <input v-model="reason" class="form-control" type="text" placeholder="e.g. Restock delivery" />
      </div>

      <div class="d-flex gap-2">
        <button type="button" class="btn btn-success" @click="emit('save', { change, reason })">Save</button>
        <button type="button" class="btn btn-danger" @click="emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>
