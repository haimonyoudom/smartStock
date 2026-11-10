<script setup lang="ts">
withDefaults(defineProps<{ modelValue: number; min?: number; max?: number }>(), {
  min: 1,
  max: Infinity,
})
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div class="stepper-wrap">
    <button
      type="button"
      class="stepper-btn"
      :disabled="modelValue <= min"
      aria-label="Decrease quantity"
      @click="emit('update:modelValue', modelValue - 1)"
    >-</button>
    <span class="stepper-value">{{ modelValue }}</span>
    <button
      type="button"
      class="stepper-btn"
      :disabled="modelValue >= max"
      aria-label="Increase quantity"
      @click="emit('update:modelValue', modelValue + 1)"
    >+</button>
  </div>
</template>

<style scoped>
.stepper-wrap {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
  max-width: 82px;
}

.stepper-btn {
  width: 25px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: #f8fafc;
  color: #334155;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s ease;
}

.stepper-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.stepper-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stepper-value {
  width: 28px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  user-select: none;
}

@media (min-width: 576px) {
  .stepper-wrap {
    max-width: 96px;
  }
  .stepper-btn {
    width: 30px;
    height: 30px;
    font-size: 15px;
  }
  .stepper-value {
    width: 34px;
    font-size: 13px;
  }
}
</style>
