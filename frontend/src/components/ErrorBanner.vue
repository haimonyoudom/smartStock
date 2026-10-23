<script setup lang="ts">
defineProps<{ message: string | null }>()
</script>

<template>
  <p v-if="message" class="error">{{ message }}</p>
</template>

<style scoped>
.error { padding: 0.6rem 0.8rem; background: #ffe3e3; border: 1px solid #c33; border-radius: 4px; }
</style>