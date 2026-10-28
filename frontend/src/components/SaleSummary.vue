<script setup lang="ts">
defineProps<{ total: number; canComplete: boolean }>()
const emit = defineEmits<{ complete: [] }>()
</script>

<template>
  <div class="summary">
    <div class="total"><small>Total</small><strong>${{ total.toFixed(2) }}</strong></div>
    <button type="button" class="btn btn-primary" :disabled="!canComplete" @click="emit('complete')">Complete sale</button>
  </div>
</template>

<style scoped>
.summary { display: flex; flex-direction: column; gap: 16px; margin-top: 18px; font-size: 1.1rem; }
.total { display: flex; justify-content: space-between; align-items: end; }
.total small { color: #73839f; font-size: 12px; }
.total strong { color: #3867ed; font-size: 25px; }
.summary button { width: 100%; padding: 13px; }
</style>