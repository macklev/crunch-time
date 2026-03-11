import { defineStore } from 'pinia'
import type { User } from '../types/index'
import { ref } from 'vue'
import usersData from '../data/users.json'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>(usersData.users)

  const currentUser = ref<User | null>(null)

  function setUser(selectedUser: User) {
    currentUser.value = selectedUser
  }

  return {
    users,
    currentUser,
    setUser
  }
})
