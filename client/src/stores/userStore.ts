import { defineStore } from 'pinia'
import type { User } from '../types/index'
import { ref } from 'vue'
import usersData from '../data/users.json'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>(usersData.users)

  const currentUser = ref<User | null>(null)

  const token = ref(localStorage.getItem('token') || '')

  function setUser(selectedUser: User) {
    currentUser.value = selectedUser
  }

  function setToken(newToken: string) {
  token.value = newToken
  localStorage.setItem('token', newToken)
}

  function logout() {
  currentUser.value = null
  token.value = ''
  localStorage.removeItem('token')
}


  function updateUser(userId: number, updates: Partial<Omit<User, 'id'>>) {
    const index = users.value.findIndex((user) => user.id === userId)
    if (index === -1) return

    const existingUser = users.value[index]
    if (!existingUser) return

    const updatedUser: User = {
      ...existingUser,
      ...updates,
      id: userId,
    }

    users.value[index] = updatedUser

    if (currentUser.value?.id === userId) {
      currentUser.value = updatedUser
    }
  }

  function addUser(newUser: Omit<User, 'id'>) {
    const newId = users.value.length > 0 ? Math.max(...users.value.map((u) => u.id)) + 1 : 1
    const userToAdd: User = { id: newId, ...newUser }
    users.value.push(userToAdd)
    return userToAdd
  }

  function deleteUser(userId: number) {
    users.value = users.value.filter((user) => user.id !== userId)

    if (currentUser.value?.id === userId) {
      currentUser.value = null
    }
  }

  return {
    users,
    currentUser,
    token,
    setUser,
    setToken,
    updateUser,
    deleteUser,
    addUser,
    logout
  }
})
