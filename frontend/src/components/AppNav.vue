<script setup lang="ts">
import type { Role } from '@/types'

defineProps<{ userName: string; role: Role }>()
const emit = defineEmits<{ logout: [] }>()
</script>

<template>
  <header class="nav">
    <strong class="brand">SmartStock</strong>
    <nav>
      <RouterLink to="/products">Products</RouterLink>
      <RouterLink to="/new-sale">New Sale</RouterLink>
      <RouterLink v-if="role === 'OWNER'" to="/alerts">Alerts</RouterLink>
      <RouterLink v-if="role === 'OWNER'" to="/sales">Sales</RouterLink>
    </nav>
    <div class="user">
      {{ userName }} ({{ role === 'OWNER' ? 'Owner' : 'Cashier' }})
      <button type="button" @click="emit('logout')">Logout</button>
    </div>
  </header>
</template>

<style scoped>
.nav { display: flex; align-items: center; gap: 2rem; padding: 0.75rem 1.5rem; background: #eee; }
nav { display: flex; gap: 1rem; flex: 1; }
a.router-link-active { font-weight: bold; text-decoration: underline; }
</style>