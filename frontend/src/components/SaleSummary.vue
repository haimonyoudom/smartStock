<script setup lang="ts">
defineProps<{ total: number; canComplete: boolean }>()
const emit = defineEmits<{ complete: [] }>()
</script>

<template>
  <div class="summary">
    <strong>Total ${{ total.toFixed(2) }}</strong>
    <button type="button" class="btn btn-primary" :disabled="!canComplete" @click="emit('complete')">Complete sale</button>
  </div>
</template>

<style scoped>
.summary { display: flex; justify-content: flex-end; align-items: center; gap: 1rem; margin-top: 1rem; font-size: 1.1rem; }
</style>