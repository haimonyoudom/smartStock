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
    />

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
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}

.main-content {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 32px clamp(20px, 3vw, 48px);
}

button,
input,
select {
  font: inherit;
}

@media (max-width: 600px) {
  .main-content {
    padding: 24px 16px;
  }
}
</style>