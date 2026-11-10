<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ save: [payload: { change: number; reason: string }]; cancel: [] }>()

const change = ref<number | null>(null)
const reason = ref('')
const error = ref<string | null>(null)

function onSubmit() {
  if (change.value === null || change.value === 0 || !Number.isInteger(change.value)) {
    error.value = 'Please enter a valid whole number that is not 0.'
    return
  }
  if (!reason.value.trim()) {
    error.value = 'Please enter a reason for adjusting stock.'
    return
  }
  if (props.product.stockQuantity + change.value < 0) {
    error.value = `Stock cannot fall below 0 (${props.product.name} currently has ${props.product.stockQuantity}).`
    return
  }
  error.value = null
  emit('save', { change: change.value, reason: reason.value.trim() })
}
</script>

<template>
  <Teleport to="body">
    <!-- Pop-up Backdrop & Modal Container -->
    <div
      class="modal d-block adjust-backdrop"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @click.self="emit('cancel')"
    >
      <div class="modal-dialog modal-dialog-centered" style="max-width: 420px; width: 92vw">
        <form
          class="modal-content bg-white shadow-lg border rounded-3 overflow-hidden"
          novalidate
          @submit.prevent="onSubmit"
        >
          <!-- Modal Header -->
          <div class="modal-header bg-white border-bottom px-4 py-3">
            <h5 class="modal-title fw-bold text-dark mb-0">Adjust Stock</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="emit('cancel')"
            ></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body bg-white d-flex flex-column gap-3 p-4">
            <!-- Product Info Summary -->
            <div class="p-3 rounded-2 bg-light border">
              <strong class="d-block text-dark" style="font-size: 14px">{{ product.name }}</strong>
              <div class="d-flex justify-content-between align-items-center mt-1">
                <small class="text-muted">SKU: {{ product.sku }}</small>
                <small class="text-muted">
                  Current stock: <strong class="text-primary">{{ product.stockQuantity }}</strong>
                </small>
              </div>
            </div>

            <!-- Change Input -->
            <div>
              <label class="form-label small fw-semibold text-dark">
                Stock Change (use negative to reduce stock)
              </label>
              <input
                v-model.number="change"
                class="form-control"
                type="number"
                step="1"
                placeholder="e.g. 10 or -5"
                autofocus
              />
              <small class="text-muted d-block mt-1" style="font-size: 11px">
                New stock level:
                <strong :class="product.stockQuantity + (change || 0) < 0 ? 'text-danger' : 'text-success'">
                  {{ product.stockQuantity + (change || 0) }}
                </strong>
              </small>
            </div>

            <!-- Reason Input -->
            <div>
              <label class="form-label small fw-semibold text-dark">Reason</label>
              <input
                v-model="reason"
                class="form-control"
                type="text"
                placeholder="e.g. Restock delivery, inventory audit"
              />
            </div>

            <div v-if="error" class="alert alert-danger py-2 px-3 small mb-0">
              {{ error }}
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer bg-white border-top px-4 py-3">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="emit('cancel')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary px-3"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.adjust-backdrop {
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
