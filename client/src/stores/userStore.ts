import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { api } from '@/services/api'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
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
    users.value = []
    currentUser.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  async function fetchMe() {
    currentUser.value = await api<User>('/api/users/me')
  }

  async function fetchAllUsers() {
    users.value = await api<User[]>('/api/users')
  }

  async function updateUser(userId: number, updates: Partial<Omit<User, 'id'>>) {
    const updatedUser = await api<User>(
      `/api/users/${userId}`,
      updates,
      { method: 'PUT' },
    )

    const index = users.value.findIndex((user) => user.id === userId)

    if (index !== -1) {
      users.value[index] = updatedUser
    }

    if (currentUser.value?.id === userId) {
      currentUser.value = updatedUser
    }

    return updatedUser
  }

  async function deleteUser(userId: number) {
    await api(`/api/users/${userId}`, undefined, {
      method: 'DELETE',
    })

    users.value = users.value.filter((user) => user.id !== userId)

    if (currentUser.value?.id === userId) {
      currentUser.value = null
    }
  }

  async function searchUsersById(id: string) {
    return await api<User[]>(`/api/users/search?id=${id}`)
  }

  async function addFriend(friendId: number) {
    const updatedUser = await api<User>('/api/users/friends', { friendId })
    currentUser.value = updatedUser
    return updatedUser
  }

  async function removeFriend(friendId: number) {
    const updatedUser = await api<User>(
      `/api/users/friends/${friendId}`,
      undefined,
      { method: 'DELETE' },
    )

    currentUser.value = updatedUser
    return updatedUser
  }

  return {
    users,
    currentUser,
    token,
    setUser,
    setToken,
    logout,
    fetchMe,
    fetchAllUsers,
    updateUser,
    deleteUser,
    searchUsersById,
    addFriend,
    removeFriend,
  }
})
