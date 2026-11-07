<script setup lang="ts">
defineProps<{ stock: number; threshold: number }>()
</script>

<template>
  <span v-if="stock <= threshold" class="badge bg-danger">Low stock</span>
  <span v-else class="badge bg-success">In stock</span>
</template>
