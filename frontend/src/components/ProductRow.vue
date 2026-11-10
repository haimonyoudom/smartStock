<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'
import LowStockBadge from './LowStockBadge.vue'

defineProps<{ product: Product; canManage: boolean }>()
const emit = defineEmits<{ edit: []; adjust: []; history: [] }>()

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function handleAction(action: 'edit' | 'adjust' | 'history') {
  isMenuOpen.value = false
  if (action === 'edit') emit('edit')
  else if (action === 'adjust') emit('adjust')
  else if (action === 'history') emit('history')
}
</script>

<template>
  <tr :class="{ 'text-muted': !product.active }">
    <!-- Product -->
    <td style="min-width: 130px">
      <strong class="d-block text-dark" style="font-size: 13px">{{ product.name }}</strong>
      <span v-if="!product.active" class="badge bg-secondary-subtle text-secondary" style="font-size: 10px">inactive</span>
    </td>

    <!-- SKU (Hidden on mobile < 768px) -->
    <td class="d-none d-md-table-cell" style="font-size: 13px">
      {{ product.sku }}
    </td>

    <!-- Price -->
    <td style="font-size: 13px; white-space: nowrap">
      ${{ product.sellingPrice.toFixed(2) }}
    </td>

    <!-- Stock -->
    <td style="font-size: 13px">
      <span :class="{ 'fw-bold text-danger': product.stockQuantity <= product.lowStockThreshold }">
        {{ product.stockQuantity }}
      </span>
    </td>

    <!-- Status -->
    <td style="white-space: nowrap">
      <LowStockBadge :stock="product.stockQuantity" :threshold="product.lowStockThreshold" />
    </td>

    <!-- Actions -->
    <td class="text-end text-md-start">
      <!-- Desktop Text Links (>= 768px) -->
      <div class="d-none d-md-flex gap-2">
        <template v-if="canManage">
          <button
            type="button"
            class="btn btn-link btn-sm p-0 text-primary"
            style="font-size: 12px"
            @click="emit('edit')"
          >Edit</button>
          <button
            type="button"
            class="btn btn-link btn-sm p-0 text-primary"
            style="font-size: 12px"
            @click="emit('adjust')"
          >Adjust</button>
        </template>
        <button
          type="button"
          class="btn btn-link btn-sm p-0 text-primary"
          style="font-size: 12px"
          @click="emit('history')"
        >History</button>
      </div>

      <!-- Mobile Three-Dot Action Menu (< 768px) -->
      <div class="d-md-none position-relative d-inline-block">
        <button
          type="button"
          class="btn btn-light btn-sm action-dots-btn"
          aria-label="Actions menu"
          :aria-expanded="isMenuOpen"
          @click.stop="toggleMenu"
        >
          ⋮
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isMenuOpen"
          class="dropdown-menu dropdown-menu-end show shadow position-absolute border"
          style="right: 0; top: 100%; z-index: 1050; min-width: 120px;"
        >
          <button
            v-if="canManage"
            class="dropdown-item py-2 small d-flex align-items-center gap-2"
            type="button"
            @click="handleAction('edit')"
          >
            <span>✏️</span> Edit
          </button>
          <button
            v-if="canManage"
            class="dropdown-item py-2 small d-flex align-items-center gap-2"
            type="button"
            @click="handleAction('adjust')"
          >
            <span>⚖️</span> Adjust
          </button>
          <button
            class="dropdown-item py-2 small d-flex align-items-center gap-2"
            type="button"
            @click="handleAction('history')"
          >
            <span>🕒</span> History
          </button>
        </div>

        <!-- Invisible backdrop to close dropdown when tapping elsewhere -->
        <div
          v-if="isMenuOpen"
          class="menu-backdrop"
          @click="isMenuOpen = false"
        ></div>
      </div>
    </td>
  </tr>
</template>

<style scoped>
td {
  padding: 12px 10px;
}

.action-dots-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  border-radius: 6px;
  border: 1px solid #dfe5ee;
  background: #f8fafc;
  color: #475569;
  line-height: 1;
}

.action-dots-btn:hover {
  background: #e2e8f0;
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1045;
}
</style>
