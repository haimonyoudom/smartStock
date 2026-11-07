<script setup lang="ts">
import type { Role } from '@/types'

defineProps<{ userName: string; role: Role }>()
const emit = defineEmits<{ logout: [] }>()
</script>

<template>
  <aside class="sidebar">
    <!-- Brand -->
    <div class="sidebar-brand d-flex align-items-center gap-2 px-3 py-3">
      <span class="brand-mark">◇</span>
      <span>
        <strong class="d-block text-white" style="font-size: 17px">SmartStock</strong>
        <small class="d-block" style="color: #bdcbe2; font-size: 10px">Inventory &amp; Sales</small>
      </span>
    </div>

    <!-- Nav links -->
    <nav class="d-flex flex-column gap-1 px-2 mt-4 flex-grow-1">
      <RouterLink to="/products" class="sidebar-link nav-link d-flex align-items-center gap-2">
        <span>●</span> Products
      </RouterLink>
      <RouterLink to="/new-sale" class="sidebar-link nav-link d-flex align-items-center gap-2">
        <span>○</span> New Sale
      </RouterLink>
      <RouterLink
        v-if="role === 'OWNER'"
        to="/alerts"
        class="sidebar-link nav-link d-flex align-items-center gap-2"
      >
        <span>○</span> Alerts
      </RouterLink>
      <RouterLink
        v-if="role === 'OWNER'"
        to="/sales"
        class="sidebar-link nav-link d-flex align-items-center gap-2"
      >
        <span>○</span> Sales
      </RouterLink>
    </nav>

    <hr class="sidebar-divider mx-3" />

    <div class="px-2 pb-3">
      <button type="button" class="sidebar-link btn btn-link nav-link w-100 text-start">
        ⚙ &nbsp; Settings
      </button>
      <button
        type="button"
        class="sidebar-link btn btn-link nav-link w-100 text-start"
        style="color: #b7c8e5"
        @click="emit('logout')"
      >
        Log out
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  width: 220px;
  background: #102344;
  color: #dbe5f7;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 10px;
  background: #3867ed;
  font-size: 22px;
  color: #fff;
}

.sidebar-link {
  color: #dbe5f7 !important;
  text-decoration: none;
  border-radius: 9px;
  font-size: 14px;
  padding: 10px 16px;
}

.sidebar-link:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.07);
}

.sidebar-link.router-link-active {
  background: #294d9f;
  color: #fff !important;
}

.sidebar-divider {
  border-color: #30415f;
  margin-top: 12px;
  margin-bottom: 8px;
}

/* Mobile: horizontal top bar */
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    inset: 0 0 auto 0;
    width: 100%;
    height: auto;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
  }

  .sidebar-brand {
    padding: 8px 12px !important;
  }

  nav {
    flex-direction: row !important;
    gap: 2px !important;
    margin-top: 0 !important;
    padding: 0 !important;
    overflow-x: auto;
  }

  .sidebar-divider,
  .pb-3 {
    display: none !important;
  }

  .sidebar-link {
    padding: 8px 12px;
    font-size: 13px;
    white-space: nowrap;
  }
}

@media (max-width: 575px) {
  .sidebar-brand span:last-child {
    display: none;
  }
}
</style>
