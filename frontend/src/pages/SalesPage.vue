<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { saleItemsApi } from '@/api/saleItems'
import { productsApi } from '@/api/products'
import { salesApi } from '@/api/sales'
import { users } from '@/data/users'
import type { Product, Sale, SaleItem } from '@/types'

const sales = ref<Sale[]>([])
const products = ref<Product[]>([])
const status = ref<'loading' | 'success' | 'error'>('loading')
const error = ref<string | null>(null)

// Draft inputs vs. the filter that is actually applied (Apply button)
const fromDraft = ref('')
const toDraft = ref('')
const applied = ref({ from: '', to: '' })
const selectedId = ref<string | null>(null)

const rangeInvalid = computed(
  () => !!fromDraft.value && !!toDraft.value && fromDraft.value > toDraft.value,
)

function dayKey(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const filteredSales = computed(() =>
  sales.value
    .filter((sale) => {
      const day = dayKey(sale.saleDate)
      return (!applied.value.from || day >= applied.value.from) && (!applied.value.to || day <= applied.value.to)
    })
    .sort((a, b) => b.saleDate.localeCompare(a.saleDate)),
)

const totalRevenue = computed(
  () => Math.round(filteredSales.value.reduce((sum, sale) => sum + sale.totalAmount, 0) * 100) / 100,
)

const selectedSale = computed(() => filteredSales.value.find((s) => s.id === selectedId.value) ?? null)

async function loadSales() {
  status.value = 'loading'
  error.value = null
  try {
    const [saleRecords, saleItems, productRecords] = await Promise.all([
      salesApi.list(),
      saleItemsApi.list(),
      productsApi.list(),
    ])
    const itemsBySale = new Map<string, SaleItem[]>()
    saleItems.forEach((item) => {
      const items = itemsBySale.get(item.saleId) ?? []
      items.push(item)
      itemsBySale.set(item.saleId, items)
    })
    sales.value = saleRecords.map((sale) => ({ ...sale, items: itemsBySale.get(sale.id) ?? [] }))
    products.value = productRecords
    status.value = 'success'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not load sales.'
    status.value = 'error'
  }
}

function applyFilters() {
  if (rangeInvalid.value) return
  applied.value = { from: fromDraft.value, to: toDraft.value }
}

function clearFilters() {
  fromDraft.value = ''
  toDraft.value = ''
  applied.value = { from: '', to: '' }
}

function money(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

function receipt(id: string) {
  return `#${id.padStart(7, '0')}`
}

function userName(userId: string) {
  return users.find((user) => user.id === userId)?.name ?? 'Unknown'
}

function productName(productId: string) {
  return products.value.find((product) => product.id === productId)?.name ?? 'Unknown product'
}

onMounted(loadSales)
</script>

<template>
  <section class="sales-page">
    <h1 class="page-title mb-1" style="color: #172b4d">Sales</h1>
    <p class="text-muted mb-3 mb-md-4 small">Manage your store with a clear, simple workflow.</p>

    <!-- Filter sales -->
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        <div>
          <h2 class="mb-1" style="font-size: 16px; color: #172b4d">Filter sales</h2>
          <p class="mb-0 text-muted" style="font-size: 12px">Choose a date range to review transactions.</p>
        </div>
        <form class="row g-2 align-items-end" @submit.prevent="applyFilters">
          <div class="col-6 col-sm-auto">
            <label for="sales-from" class="form-label text-muted mb-1" style="font-size: 11px">FROM</label>
            <input id="sales-from" v-model="fromDraft" class="form-control" type="date" />
          </div>
          <div class="col-6 col-sm-auto">
            <label for="sales-to" class="form-label text-muted mb-1" style="font-size: 11px">TO</label>
            <input id="sales-to" v-model="toDraft" class="form-control" type="date" />
          </div>
          <div class="col-12 col-sm-auto d-flex gap-2">
            <button class="btn btn-primary flex-fill px-4" type="submit" :disabled="rangeInvalid">Apply</button>
            <button class="btn btn-outline-secondary" type="button" @click="clearFilters">Clear</button>
          </div>
        </form>
      </div>
      <p v-if="rangeInvalid" class="text-danger small px-3 pb-3 mb-0">
        The “From” date must be on or before the “To” date.
      </p>
    </div>

    <div v-if="status === 'loading'" class="text-muted py-4">Loading sales...</div>
    <div v-else-if="status === 'error'" class="alert alert-danger" role="alert">
      <p class="mb-2">{{ error }}</p>
      <button class="btn btn-sm btn-outline-danger" type="button" @click="loadSales">Try again</button>
    </div>

    <template v-else>
      <!-- Summary cards -->
      <div class="row g-3 mb-3">
        <div class="col-12 col-sm-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <span class="text-muted small">Total revenue</span>
              <strong class="d-block summary-number">{{ money(totalRevenue) }}</strong>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <span class="text-muted small">Completed receipts</span>
              <strong class="d-block summary-number">{{ filteredSales.length.toLocaleString() }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales transactions -->
      <div class="card border-0 shadow-sm">
        <div class="card-body pb-0">
          <div class="d-flex justify-content-between align-items-center mb-3 px-1">
            <h2 class="mb-0" style="font-size: 16px; color: #172b4d">Sales transactions</h2>
            <span class="text-muted d-none d-sm-inline" style="font-size: 12px">Select a row to view details</span>
          </div>
        </div>

        <p v-if="filteredSales.length === 0" class="text-muted px-4 pb-4 mb-0">
          {{ sales.length === 0 ? 'No sales have been recorded yet.' : 'No sales match the selected date range.' }}
        </p>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="text-uppercase text-muted small">Date &amp; time</th>
                <th class="text-uppercase text-muted small">Receipt</th>
                <th class="text-uppercase text-muted small d-none d-sm-table-cell">Cashier</th>
                <th class="text-uppercase text-muted small">Total</th>
                <th class="text-uppercase text-muted small text-end text-md-start">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in filteredSales" :key="sale.id" role="button" @click="selectedId = sale.id">
                <td class="text-nowrap" style="font-size: 13px">{{ formatDate(sale.saleDate) }}</td>
                <td style="font-size: 13px">{{ receipt(sale.id) }}</td>
                <td class="d-none d-sm-table-cell" style="font-size: 13px">{{ userName(sale.createdBy) }}</td>
                <td class="fw-bold" style="font-size: 13px">{{ money(sale.totalAmount) }}</td>
                <td class="text-end text-md-start text-nowrap">
                  <button
                    class="btn btn-link btn-sm p-0"
                    style="font-size: 12px"
                    type="button"
                    @click.stop="selectedId = sale.id"
                  >
                    View details →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Details pop-up -->
    <Teleport to="body">
      <div
        v-if="selectedSale"
        class="modal d-block sales-backdrop"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @click.self="selectedId = null"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 480px; width: 92vw">
          <div class="modal-content bg-white shadow-lg border rounded-3 overflow-hidden">
            <div class="modal-header bg-white px-4 py-3">
              <h5 class="modal-title fw-bold mb-0">Receipt {{ receipt(selectedSale.id) }}</h5>
              <button type="button" class="btn-close" aria-label="Close" @click="selectedId = null"></button>
            </div>
            <div class="modal-body bg-white p-4">
              <div class="d-flex justify-content-between flex-wrap gap-1 small text-muted mb-3">
                <span>{{ formatDate(selectedSale.saleDate) }}</span>
                <span>Cashier: {{ userName(selectedSale.createdBy) }}</span>
              </div>
              <p v-if="selectedSale.items.length === 0" class="text-muted small mb-0">
                No item details recorded for this sale.
              </p>
              <table v-else class="table table-sm align-middle mb-0">
                <thead>
                  <tr class="text-muted small">
                    <th>Item</th>
                    <th class="text-center">Qty</th>
                    <th class="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedSale.items" :key="item.id">
                    <td style="font-size: 13px">
                      {{ productName(item.productId) }}
                      <small class="text-muted d-block">{{ money(item.unitPrice) }} each</small>
                    </td>
                    <td class="text-center" style="font-size: 13px">{{ item.quantity }}</td>
                    <td class="text-end" style="font-size: 13px">{{ money(item.subtotal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer bg-white px-4 py-3 justify-content-between">
              <strong>Total {{ money(selectedSale.totalAmount) }}</strong>
              <button type="button" class="btn btn-outline-secondary" @click="selectedId = null">Close</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.sales-page {
  max-width: 1000px;
}

.page-title {
  font-size: 22px;
}

.summary-number {
  color: #172b4d;
  font-size: 26px;
}

th,
td {
  padding: 12px 10px;
}

tbody tr[role='button'] {
  cursor: pointer;
}

.sales-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1055;
  background: rgba(0, 0, 0, 0.45);
}

@media (min-width: 768px) {
  .page-title {
    font-size: 26px;
  }
  .summary-number {
    font-size: 28px;
  }
}
</style>
