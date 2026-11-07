<script setup lang="ts">
withDefaults(defineProps<{ modelValue: number; min?: number; max?: number }>(), {
  min: 1,
  max: Infinity,
})
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div class="input-group input-group-sm" style="width: 120px">
    <button
      type="button"
      class="btn btn-outline-secondary"
      :disabled="modelValue <= min"
      @click="emit('update:modelValue', modelValue - 1)"
    >-</button>
    <span class="form-control text-center fw-bold" style="pointer-events: none">{{ modelValue }}</span>
    <button
      type="button"
      class="btn btn-outline-secondary"
      :disabled="modelValue >= max"
      @click="emit('update:modelValue', modelValue + 1)"
    >+</button>
  </div>
</template>
