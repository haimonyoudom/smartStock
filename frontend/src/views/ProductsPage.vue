<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import ProductTable from '@/components/ProductTable.vue'
import type { Product } from '@/types'

const auth = useAuthStore()
const productsStore = useProductsStore()

const canManage = computed(() => auth.currentUser.role === 'OWNER')
const message = ref('') // placeholder until the modals are built

function onEdit(product: Product) { message.value = `Edit ${product.name}: form comes next` }
function onAdjust(product: Product) { message.value = `Adjust ${product.name}: dialog comes next` }
function onHistory(product: Product) { message.value = `History of ${product.name}: panel comes next` }
</script>

<template>
  <section>
    <div class="top">
      <h1>Products</h1>
      <button v-if="canManage" type="button" @click="message = 'Add product: form comes next'">+ Add product</button>
    </div>
    <ProductTable
      :products="productsStore.products"
      :can-manage="canManage"
      @edit="onEdit"
      @adjust="onAdjust"
      @history="onHistory"
    />
    <p v-if="message" class="note">{{ message }}</p>
  </section>
</template>


<style scoped>
section {
  width: 100%;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

h1 {
  margin: 0;
  font-size: 1.75rem;
}

button {
  padding: 0.85rem 1.25rem;
  border: 2px solid #383b64;
  background: #d5dafb;
  color: #222;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background: #c3caf5;
}

.note {
  margin-top: 1rem;
  color: #555;
}

@media (max-width: 600px) {
  .top {
    align-items: flex-start;
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
