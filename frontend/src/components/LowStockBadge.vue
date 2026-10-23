<script setup lang="ts">
defineProps<{ stock: number; threshold: number }>()
</script>

<template>
  <span v-if="stock <= threshold" class="badge">LOW</span>
</template>

<style scoped>
.badge { margin-left: 0.5rem; padding: 0 0.4rem; background: #c33; color: #fff; border-radius: 4px; font-size: 0.75rem; }
</style>