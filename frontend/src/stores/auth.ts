import { defineStore } from 'pinia'
import { ref } from 'vue'
import { users } from '@/data'
import type { User } from '@/types'

const KEY = 'smartstock.userId'
const defaultUser = users[0]! // the owner; the "!" says this always exists

function loadUser(): User {
  try {
    const savedId = localStorage.getItem(KEY)
    return users.find((u) => u.id === savedId) ?? defaultUser
  } catch {
    return defaultUser
  }
}

export const useAuthStore = defineStore('auth', () => {
  // Starts as the saved user, or the owner if nothing is saved.
  const currentUser = ref<User>(loadUser())

  function switchRole(role: User['role']) {
    const user = users.find((u) => u.role === role)
    if (!user) return
    currentUser.value = user
    try {
      localStorage.setItem(KEY, user.id)
    } catch {
      // storage can be blocked; the switch still works until reload
    }
  }

  return { currentUser, switchRole }
})