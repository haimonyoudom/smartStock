<script setup lang="ts">
defineProps<{ stock: number; threshold: number }>()
</script>

<template>
  <span v-if="stock <= threshold" class="badge">Low stock</span>
  <span v-else class="badge good">In stock</span>
</template>

<style scoped>
.badge { display: inline-block; padding: 4px 9px; border-radius: 12px; background: #fff0f1; color: #d9364f; font-size: 11px; font-weight: 700; }
.good { background: #e4f8ef; color: #0c9469; }
</style>