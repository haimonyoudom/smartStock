<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="app-layout">
    <AppNav
      :user-name="auth.currentUser.name"
      :role="auth.currentUser.role"
      @logout="() => {}"
      @switch-role="(role) => auth.switchRole(role)"
    />

    <!-- Desktop Topbar (Hidden on mobile < 992px) -->
    <header class="topbar d-none d-lg-flex justify-content-between align-items-center px-4 shadow-sm">
      <div class="global-search">
        <input
          type="text"
          class="form-control"
          placeholder="⌕   Search products, SKU, or sales..."
          readonly
        />
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-2">
          <span class="avatar">{{ auth.currentUser.name.charAt(0) }}</span>
          <div class="lh-1">
            <strong class="d-block" style="font-size: 13px">{{ auth.currentUser.name }}</strong>
            <small class="text-muted" style="font-size: 11px">Account</small>
          </div>
        </div>
        <select
          class="form-select form-select-sm w-auto"
          :value="auth.currentUser.role"
          @change="auth.switchRole(($event.target as HTMLSelectElement).value as 'OWNER' | 'CASHIER')"
        >
          <option value="OWNER">Owner</option>
          <option value="CASHIER">Cashier</option>
        </select>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}

body {
  background: #f6f8fc;
  margin: 0;
}

.app-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* Desktop Topbar */
.topbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  z-index: 1010;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e9edf4;
}

.global-search {
  width: min(480px, 55%);
}

.avatar {
  display: grid;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: #e2ebff;
  color: #3867ed;
  font-weight: 700;
  font-size: 14px;
}

.main-content {
  width: 100%;
  margin-left: 220px;
  padding: 88px 30px 40px;
  background: #f6f8fc;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Mobile Layout (< 992px) */
@media (max-width: 991px) {
  .main-content {
    margin-left: 0;
    padding: 74px 16px 32px;
  }
}

@media (max-width: 575px) {
  .main-content {
    padding: 70px 12px 28px;
  }
}
</style>
