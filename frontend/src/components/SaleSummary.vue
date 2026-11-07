<script setup lang="ts">
defineProps<{ total: number; canComplete: boolean }>()
const emit = defineEmits<{ complete: [] }>()
</script>

<template>
  <div class="d-flex flex-column gap-3 mt-3">
    <div class="d-flex justify-content-between align-items-end">
      <small class="text-muted">Total</small>
      <strong class="fs-3 fw-bold text-primary">${{ total.toFixed(2) }}</strong>
    </div>
    <button
      type="button"
      class="btn btn-primary w-100 py-3"
      :disabled="!canComplete"
      @click="emit('complete')"
    >
      Complete sale
    </button>
  </div>
</template>
