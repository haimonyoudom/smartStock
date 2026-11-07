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
    <!-- Backdrop & Modal Container -->
    <div
      class="modal d-block pf-backdrop"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @click.self="emit('cancel')"
    >
      <!-- Modal Dialog -->
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 440px; width: 92vw">
        <form
          class="modal-content bg-white shadow-lg border rounded-3 overflow-hidden"
          novalidate
          @submit.prevent="onSubmit"
        >
          <div class="modal-header bg-white border-bottom px-4 py-3">
            <h5 class="modal-title fw-bold text-dark mb-0">{{ product ? 'Edit product' : 'Add product' }}</h5>
            <button type="button" class="btn-close" @click="emit('cancel')" aria-label="Close"></button>
          </div>

          <div class="modal-body bg-white d-grid gap-3 p-4">
            <!-- Name -->
            <div>
              <label class="form-label small fw-semibold text-dark">Name</label>
              <input v-model="form.name" class="form-control" placeholder="Product name" />
              <p v-if="submitted && errors.name" class="text-danger small mb-0 mt-1">{{ errors.name }}</p>
            </div>

            <!-- SKU -->
            <div>
              <label class="form-label small fw-semibold text-dark">SKU</label>
              <input v-model="form.sku" class="form-control" placeholder="e.g. PRD-001" />
              <p v-if="submitted && errors.sku" class="text-danger small mb-0 mt-1">{{ errors.sku }}</p>
            </div>

            <!-- Selling price -->
            <div>
              <label class="form-label small fw-semibold text-dark">Selling price ($)</label>
              <input v-model.number="form.sellingPrice" class="form-control" type="number" step="0.01" />
              <p v-if="submitted && errors.sellingPrice" class="text-danger small mb-0 mt-1">
                {{ errors.sellingPrice }}
              </p>
            </div>

            <!-- Stock quantity -->
            <div>
              <label class="form-label small fw-semibold text-dark">Stock quantity</label>
              <input v-model.number="form.stockQuantity" class="form-control" type="number" />
              <p v-if="submitted && errors.stockQuantity" class="text-danger small mb-0 mt-1">
                {{ errors.stockQuantity }}
              </p>
            </div>

            <!-- Low-stock threshold -->
            <div>
              <label class="form-label small fw-semibold text-dark">Low-stock threshold</label>
              <input v-model.number="form.lowStockThreshold" class="form-control" type="number" />
              <p v-if="submitted && errors.lowStockThreshold" class="text-danger small mb-0 mt-1">
                {{ errors.lowStockThreshold }}
              </p>
            </div>

            <!-- Active checkbox -->
            <div class="form-check">
              <input v-model="form.active" class="form-check-input" type="checkbox" id="pf-active" />
              <label class="form-check-label small text-dark" for="pf-active">Active</label>
            </div>

            <!-- Server error -->
            <div v-if="serverError" class="alert alert-danger py-2 px-3 small mb-0">{{ serverError }}</div>
          </div>

          <div class="modal-footer bg-white border-top px-4 py-3">
            <button type="button" class="btn btn-outline-secondary" @click="emit('cancel')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="pending">
              {{ pending ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.pf-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1055;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background-color: #ffffff !important;
}
</style>
