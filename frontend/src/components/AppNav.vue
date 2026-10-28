<script setup lang="ts">
import type { Role } from '@/types'

defineProps<{ userName: string; role: Role }>()
const emit = defineEmits<{ logout: [] }>()
</script>

<template>
  <aside class="nav">
    <div class="brand">
      <span class="brand-mark">◇</span>
      <span><strong>SmartStock</strong><small>Inventory &amp; Sales</small></span>
    </div>
    <nav class="nav-links">
      <RouterLink to="/products" class="nav-link"><span>●</span> Products</RouterLink>
      <RouterLink to="/new-sale" class="nav-link"><span>○</span> New Sale</RouterLink>
      <RouterLink v-if="role === 'OWNER'" to="/alerts" class="nav-link"><span>○</span> Alerts</RouterLink>
      <RouterLink v-if="role === 'OWNER'" to="/sales" class="nav-link"><span>○</span> Sales</RouterLink>
    </nav>
    <div class="nav-divider" />
    <button type="button" class="settings">⚙ &nbsp; Settings</button>
    <button type="button" class="logout-button" @click="emit('logout')">Log out</button>
  </aside>
</template>

<style scoped>
.nav { position: fixed; inset: 0 auto 0 0; z-index: 2; display: flex; flex-direction: column; width: 220px; padding: 20px 15px; background: #102344; color: #dbe5f7; }
.brand { display: flex; align-items: center; gap: 10px; color: white; }
.brand-mark { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 10px; background: #3867ed; font-size: 25px; }
.brand strong { display: block; font-size: 18px; }
.brand small { display: block; color: #bdcbe2; font-size: 10px; }
.nav-links { display: flex; flex-direction: column; gap: 10px; margin-top: 60px; }
.nav-link, .settings, .logout-button { display: flex; align-items: center; width: 100%; padding: 10px 20px; border: 0; border-radius: 9px; background: transparent; color: #dbe5f7; text-decoration: none; text-align: left; }
.nav-link { gap: 10px; font-size: 14px; }
.nav-link.router-link-active { background: #294d9f; color: #fff; }
.nav-divider { height: 1px; margin: 22px 3px; background: #30415f; }
.settings, .logout-button { cursor: pointer; font-size: 13px; }
.logout-button { margin-top: auto; color: #b7c8e5; }
.settings:hover, .logout-button:hover, .nav-link:hover { color: #fff; }
.nav-link span { width: 10px; }
@media (max-width: 1100px) {
  .nav { position: static; width: 100%; min-height: auto; flex-direction: row; align-items: center; padding: 12px 16px; }
  .nav-links { flex-direction: row; margin: 0 0 0 20px; }
  .nav-link { width: auto; padding: 8px 12px; }
  .nav-divider, .settings, .logout-button { display: none; }
}
@media (max-width: 600px) {
  .nav { flex-wrap: wrap; }
  .nav-links { width: 100%; margin: 8px 0 0; overflow-x: auto; }
}
</style>
