<script setup lang="ts">
withDefaults(defineProps<{ modelValue: number; min?: number; max?: number }>(), {
  min: 1,
  max: Infinity,
})
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div class="stepper">
    <button type="button" :disabled="modelValue <= min" @click="emit('update:modelValue', modelValue - 1)">-</button>
    <span>{{ modelValue }}</span>
    <button type="button" :disabled="modelValue >= max" @click="emit('update:modelValue', modelValue + 1)">+</button>
  </div>
</template>

<style scoped>
.stepper { display: inline-flex; align-items: center; gap: 0.5rem; }
.stepper span { min-width: 2rem; text-align: center; }
</style>