<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <AppNav :user-name="auth.currentUser.name" :role="auth.currentUser.role" @logout="() => {}" />
  <main><RouterView /></main>
</template>

<style>
body { margin: 0; font-family: sans-serif; }
main { padding: 1.5rem; }
</style>