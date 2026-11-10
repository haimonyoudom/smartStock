<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Role } from '@/types'

const props = defineProps<{ userName: string; role: Role }>()
const emit = defineEmits<{ logout: []; 'switch-role': [role: Role] }>()

const route = useRoute()
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

// Automatically close menu when navigating to another route
watch(() => route.path, () => {
  closeMenu()
})
</script>

<template>
  <!-- Mobile Header (Visible on < 992px) -->
  <header class="mobile-navbar d-lg-none">
    <div class="d-flex align-items-center gap-2">
      <span class="brand-mark">◇</span>
      <div>
        <strong class="d-block text-white" style="font-size: 15px; line-height: 1.1">SmartStock</strong>
        <small class="d-block" style="color: #bdcbe2; font-size: 9px">Inventory &amp; Sales</small>
      </div>
    </div>

    <div class="d-flex align-items-center gap-2">
      <!-- Account Badge -->
      <div class="d-flex align-items-center gap-1">
        <span class="avatar-sm">{{ userName.charAt(0) }}</span>
        <span class="badge rounded-pill bg-primary" style="font-size: 10px">{{ role }}</span>
      </div>

      <!-- Hamburger Button -->
      <button
        type="button"
        class="hamburger-btn"
        :class="{ active: isMenuOpen }"
        aria-label="Toggle navigation"
        :aria-expanded="isMenuOpen"
        @click="toggleMenu"
      >
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>
    </div>
  </header>

  <!-- Mobile Collapsible Menu Overlay -->
  <div
    v-if="isMenuOpen"
    class="mobile-backdrop d-lg-none"
    @click="closeMenu"
  ></div>

  <transition name="slide-down">
    <div v-if="isMenuOpen" class="mobile-collapse-menu d-lg-none shadow-lg">
      <nav class="d-flex flex-column gap-1">
        <RouterLink
          to="/products"
          class="sidebar-link nav-link d-flex align-items-center gap-2"
          @click="closeMenu"
        >
          <span>●</span> Products
        </RouterLink>
        <RouterLink
          to="/new-sale"
          class="sidebar-link nav-link d-flex align-items-center gap-2"
          @click="closeMenu"
        >
          <span>○</span> New Sale
        </RouterLink>
        <RouterLink
          v-if="role === 'OWNER'"
          to="/alerts"
          class="sidebar-link nav-link d-flex align-items-center gap-2"
          @click="closeMenu"
        >
          <span>○</span> Alerts
        </RouterLink>
        <RouterLink
          v-if="role === 'OWNER'"
          to="/sales"
          class="sidebar-link nav-link d-flex align-items-center gap-2"
          @click="closeMenu"
        >
          <span>○</span> Sales
        </RouterLink>
      </nav>

      <hr class="sidebar-divider my-3" />

      <!-- User Role Switching inside mobile menu -->
      <div class="d-flex justify-content-between align-items-center px-2 py-2 mb-2 rounded" style="background: rgba(255,255,255,0.05)">
        <span class="small" style="color: #bdcbe2">Role Switch:</span>
        <select
          class="form-select form-select-sm w-auto bg-dark text-white border-secondary"
          :value="role"
          @change="emit('switch-role', ($event.target as HTMLSelectElement).value as Role)"
        >
          <option value="OWNER">Owner</option>
          <option value="CASHIER">Cashier</option>
        </select>
      </div>

      <div class="d-flex flex-column gap-1">
        <button
          type="button"
          class="sidebar-link btn btn-link nav-link w-100 text-start"
          @click="closeMenu"
        >
          ⚙ &nbsp; Settings
        </button>
        <button
          type="button"
          class="sidebar-link btn btn-link nav-link w-100 text-start text-danger"
          @click="emit('logout'); closeMenu()"
        >
          🚪 &nbsp; Log out
        </button>
      </div>
    </div>
  </transition>

  <!-- Desktop Sidebar (Visible on >= 992px) -->
  <aside class="sidebar d-none d-lg-flex">
    <!-- Brand -->
    <div class="sidebar-brand d-flex align-items-center gap-2 px-3 py-3">
      <span class="brand-mark">◇</span>
      <div>
        <strong class="d-block text-white" style="font-size: 17px">SmartStock</strong>
        <small class="d-block" style="color: #bdcbe2; font-size: 10px">Inventory &amp; Sales</small>
      </div>
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
/* Desktop Sidebar */
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 1020;
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

.avatar-sm {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: #e2ebff;
  color: #3867ed;
  font-weight: 700;
  font-size: 12px;
}

.sidebar-link {
  color: #dbe5f7 !important;
  text-decoration: none;
  border-radius: 9px;
  font-size: 14px;
  padding: 10px 16px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.sidebar-link:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.08);
}

.sidebar-link.router-link-active {
  background: #294d9f;
  color: #fff !important;
  font-weight: 600;
}

.sidebar-divider {
  border-color: #30415f;
  margin-top: 12px;
  margin-bottom: 8px;
}

/* Mobile Navbar (< 992px) */
.mobile-navbar {
  position: fixed;
  inset: 0 0 auto 0;
  height: 58px;
  z-index: 1030;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: #102344;
  border-bottom: 1px solid #1c3563;
}

.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 38px;
  height: 38px;
  padding: 0;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.hamburger-bar {
  width: 20px;
  height: 2px;
  background-color: #fff;
  border-radius: 2px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.hamburger-btn.active .hamburger-bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger-btn.active .hamburger-bar:nth-child(2) {
  opacity: 0;
}
.hamburger-btn.active .hamburger-bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.mobile-backdrop {
  position: fixed;
  inset: 58px 0 0 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1025;
}

.mobile-collapse-menu {
  position: fixed;
  top: 58px;
  left: 0;
  right: 0;
  z-index: 1026;
  background: #102344;
  padding: 16px 20px 24px;
  border-bottom: 2px solid #294d9f;
  max-height: calc(100vh - 58px);
  overflow-y: auto;
}

/* Slide down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}
</style>
