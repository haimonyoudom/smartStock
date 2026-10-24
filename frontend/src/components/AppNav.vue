<script setup lang="ts">
import type { Role } from '@/types'

defineProps<{
  userName: string
  role: Role
}>()

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <header class="nav">
    <strong class="brand">SmartStock</strong>

    <nav class="nav-links">
      <RouterLink to="/products" class="nav-link">
        Products
      </RouterLink>

      <RouterLink to="/new-sale" class="nav-link">
        New Sale
      </RouterLink>

      <RouterLink
        v-if="role === 'OWNER'"
        to="/alerts"
        class="nav-link"
      >
        Alerts (owner)
      </RouterLink>

      <RouterLink
        v-if="role === 'OWNER'"
        to="/sales"
        class="nav-link"
      >
        Sales (owner)
      </RouterLink>
    </nav>

    <div class="user">
      <span class="user-name">
        {{ userName }} ({{ role === 'OWNER' ? 'Owner' : 'Cashier' }})
      </span>

      <button
        type="button"
        class="logout-button"
        @click="emit('logout')"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
    width: 100rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 96px;
  padding: 16px 40px;
  background: #eeeeee;
  color: #292929;
}

.brand {
  flex-shrink: 0;
  font-size: 2rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  width: auto;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 12px 20px;
  border: 2px solid #666666;
  background: #ffffff;
  color: #292929;
  text-decoration: none;
  font-size: 1.1rem;
  white-space: nowrap;
}

.nav-link:hover {
  background: #f2f2f2;
}

.nav-link.router-link-active {
  background: #d5dafb;
  border-color: #383b64;
}

.user {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.user-name {
  font-size: 1rem;
  white-space: nowrap;
}

.logout-button {
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #666666;
  font-size: 1rem;
}

.logout-button:hover {
  color: #222222;
  text-decoration: underline;
}

@media (max-width: 1100px) {
  .nav {
    flex-wrap: wrap;
    gap: 16px;
    padding: 20px 24px;
  }

  .brand {
    font-size: 1.6rem;
  }

  .nav-links {
    order: 3;
    flex-basis: 100%;
    flex-wrap: wrap;
  }

  .user {
    margin-left: auto;
  }
}

@media (max-width: 600px) {
  .nav {
    padding: 16px;
  }

  .nav-links {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-link {
    justify-content: flex-start;
    width: 100%;
  }

  .user {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }

  .user-name {
    white-space: normal;
  }
}
</style>
