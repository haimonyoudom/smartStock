<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="app-layout">
    <AppNav :user-name="auth.currentUser.name" :role="auth.currentUser.role" @logout="() => {}" />
    <header class="topbar">
      <div class="global-search">⌕ &nbsp; Search products, SKU, or sales...</div>
      <div class="account">
        <span class="avatar">{{ auth.currentUser.name.charAt(0) }}</span
        ><span
          ><strong>{{ auth.currentUser.name }}</strong
          ><small>Account</small></span
        >
      </div>

      <select
        :value="auth.currentUser.role"
        @change="auth.switchRole(($event.target as HTMLSelectElement).value as 'OWNER' | 'CASHIER')"
      >
        <option value="OWNER">Owner</option>
        <option value="CASHIER">Cashier</option>
      </select>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  width: 100%;
  min-height: 100vh;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #24324b;
  background: #f4f7fc;
}

.app-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.topbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 30px;
  background: #f6f8fc;
}
.global-search {
  width: min(500px, 60%);
  padding: 11px 20px;
  border: 1px solid #e5ebf5;
  border-radius: 10px;
  background: white;
  color: #73839f;
}
.account {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
}
.account strong,
.account small {
  display: block;
}
.account small {
  color: #73839f;
  font-size: 11px;
}
.avatar {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  background: #e2ebff;
  color: #3867ed;
  font-weight: 700;
}
.main-content {
  width: 100%;
  margin-left: 220px;
  padding: 100px 30px 40px;
  background: #f6f8fc;
}

button,
input,
select {
  font: inherit;
}

@media (max-width: 600px) {
  .topbar {
    position: static;
  }
  .global-search {
    display: none;
  }
  .main-content {
    margin-left: 0;
    padding: 24px 16px;
  }
}
</style>
