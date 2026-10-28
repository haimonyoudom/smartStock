<script setup lang="ts">
withDefaults(defineProps<{ modelValue: number; min?: number; max?: number }>(), {
  min: 1,
  max: Infinity,
})
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div class="stepper">
    <button type="button" class="btn btn-outline-secondary" :disabled="modelValue <= min" @click="emit('update:modelValue', modelValue - 1)">-</button>
    <span>{{ modelValue }}</span>
    <button type="button" class="btn btn-outline-secondary" :disabled="modelValue >= max" @click="emit('update:modelValue', modelValue + 1)">+</button>
  </div>
</template>

<style scoped>
.stepper { display: inline-flex; align-items: center; gap: 0.35rem; }
.stepper button { display: grid; width: 30px; height: 30px; place-items: center; padding: 0; border: 1px solid #dfe6f1; border-radius: 7px; background: #f5f7fb; color: #24324b; }
.stepper span { min-width: 1.5rem; text-align: center; font-weight: 600; }
</style>