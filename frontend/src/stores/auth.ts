import { defineStore } from 'pinia'
import { ref } from 'vue'
import { users } from '@/data'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // Hard-coded for now: logged in as the owner. Use users[1] to test the cashier view.
  const currentUser = ref<User>(users[0])
  return { currentUser }
})