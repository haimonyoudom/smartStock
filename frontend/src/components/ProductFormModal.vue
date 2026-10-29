<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { validateProduct, type ProductForm } from '@/validation'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product | null // null means add
  takenSkus: string[]
  pending: boolean
  serverError: string | null
}>()
const emit = defineEmits<{
  save: [data: ProductForm]
  cancel: []
}>()

const form = reactive<ProductForm>({
  name: props.product?.name ?? '',
  sku: props.product?.sku ?? '',
  sellingPrice: props.product?.sellingPrice ?? 0,
  stockQuantity: props.product?.stockQuantity ?? 0,
  lowStockThreshold: props.product?.lowStockThreshold ?? 5,
  active: props.product?.active ?? true,
})

const submitted = ref(false)

// when editing, the product's own SKU is not a duplicate
const others = computed(() => props.takenSkus.filter((s) => s !== props.product?.sku.toUpperCase()))
const errors = computed(() => validateProduct(form, others.value))

function onSubmit() {
  submitted.value = true
  if (Object.keys(errors.value).length > 0) return
  emit('save', { ...form, name: form.name.trim(), sku: form.sku.trim() })
}
</script>
<template>
  <Teleport to="body">
    <div class="pf-backdrop" @click.self="emit('cancel')">
      <form class="pf-modal" novalidate @submit.prevent="onSubmit">
        <h2>{{ product ? 'Edit product' : 'Add product' }}</h2>

        <label>Name
          <input v-model="form.name" />
          <p v-if="submitted && errors.name" class="pf-error">{{ errors.name }}</p>
        </label>

        <label>SKU
          <input v-model="form.sku" />
          <p v-if="submitted && errors.sku" class="pf-error">{{ errors.sku }}</p>
        </label>

        <label>Selling price ($)
          <input v-model.number="form.sellingPrice" type="number" step="0.01" />
          <p v-if="submitted && errors.sellingPrice" class="pf-error">{{ errors.sellingPrice }}</p>
        </label>

        <label>Stock quantity
          <input v-model.number="form.stockQuantity" type="number" />
          <p v-if="submitted && errors.stockQuantity" class="pf-error">{{ errors.stockQuantity }}</p>
        </label>

        <label>Low-stock threshold
          <input v-model.number="form.lowStockThreshold" type="number" />
          <p v-if="submitted && errors.lowStockThreshold" class="pf-error">{{ errors.lowStockThreshold }}</p>
        </label>

        <label class="pf-check"><input v-model="form.active" type="checkbox" /> Active</label>

        <p v-if="serverError" class="pf-error">{{ serverError }}</p>

        <div class="pf-actions">
          <button type="button" class="btn" @click="emit('cancel')">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="pending">
            {{ pending ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<style scoped>
.pf-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-modal {
  position: static;
  width: 380px;
  max-width: 92vw;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
  margin: 0;
  background: #fff;
  border-radius: 13px;
  padding: 24px;
  display: grid;
  gap: 12px;
}
.pf-modal h2 { margin: 0; }
.pf-modal label { display: grid; gap: 4px; font-size: 13px; color: #172b4d; }
.pf-modal input:not([type='checkbox']) {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #e1e8f3;
  border-radius: 8px;
}
.pf-check { display: flex !important; align-items: center; gap: 8px; }
.pf-error { margin: 0; color: #c0392b; font-size: 12px; }
.pf-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
</style>