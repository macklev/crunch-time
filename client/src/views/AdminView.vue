<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/types'
import ActivityTypeManager from '@/components/ActivityTypeManager.vue'

const userStore = useUserStore()

const users = ref<User[]>([])
const searchText = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const editingUserId = ref<number | null>(null)
const editUsername = ref('')
const editGender = ref('')
const editAge = ref(18)
const editAdmin = ref(false)

const filteredUsers = computed(() => {
  const search = searchText.value.trim().toLowerCase()

  if (!search) {
    return users.value
  }

  return users.value.filter((user) => {
    return (
      user.username.toLowerCase().includes(search) ||
      user.id.toString().includes(search)
    )
  })
})

async function fetchUsers() {
  errorMessage.value = ''
  isLoading.value = true

  const response = await fetch('http://localhost:3000/api/users', {
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })

  if (!response.ok) {
    errorMessage.value = 'You are not authorized to view users.'
    isLoading.value = false
    return
  }

  users.value = await response.json()
  isLoading.value = false
}

function startEdit(user: User) {
  editingUserId.value = user.id
  editUsername.value = user.username
  editGender.value = user.gender || ''
  editAge.value = user.age || 18
  editAdmin.value = user.admin
}

function cancelEdit() {
  editingUserId.value = null
}

async function saveEdit(userId: number) {
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`
    },
    body: JSON.stringify({
    username: editUsername.value,
    admin: editAdmin.value
    })
  })

  if (!response.ok) {
  const errorText = await response.text()
  console.error(errorText)
  errorMessage.value = errorText
  return
}

  const updatedUser = await response.json()

  const index = users.value.findIndex((user) => user.id === userId)

  if (index !== -1) {
    users.value[index] = updatedUser
  }

  editingUserId.value = null
}

async function deleteUser(userId: number) {
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })

  if (!response.ok) {
    errorMessage.value = 'Could not delete user.'
    return
  }

  users.value = users.value.filter((user) => user.id !== userId)

  if (editingUserId.value === userId) {
    editingUserId.value = null
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="box">
        <h2 class="title is-4">Admin Dashboard</h2>

        <p v-if="isLoading">Loading users...</p>

        <p v-if="errorMessage" class="has-text-danger">
          {{ errorMessage }}
        </p>

        <div class="field">
          <div class="control has-icons-left">
            <input
              v-model="searchText"
              class="input"
              type="text"
              placeholder="Search users by name or ID"
            />
            <span class="icon is-left">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
          </div>
        </div>

        <div class="table-container">
          <table class="table is-fullwidth admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>User ID</th>
                <th>Admin</th>
                <th>Edit User</th>
                <th>Delete User</th>
              </tr>
            </thead>

            <tbody>
              <template v-for="user in filteredUsers" :key="user.id">
                <tr>
                  <td>{{ user.username }}</td>
                  <td>{{ user.id }}</td>
                  <td>{{ user.admin ? 'Yes' : 'No' }}</td>
                  <td>
                    <button class="button is-small" @click="startEdit(user)">
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      class="button is-small is-danger"
                      @click="deleteUser(user.id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                <tr v-if="editingUserId === user.id">
                  <td colspan="5">
                    <div class="columns is-multiline">
                      <div class="column is-4">
                        <label class="label">Username</label>
                        <input
                          v-model="editUsername"
                          class="input"
                          type="text"
                        />
                      </div>

                      <div class="column is-3">
                        <label class="label">Gender</label>
                        <div class="select is-fullwidth">
                          <select v-model="editGender">
                            <option value="">Not specified</option>
                            <option value="female">female</option>
                            <option value="male">male</option>
                            <option value="other">other</option>
                          </select>
                        </div>
                      </div>

                      <div class="column is-2">
                        <label class="label">Age</label>
                        <input
                          v-model.number="editAge"
                          class="input"
                          type="number"
                          min="1"
                        />
                      </div>

                      <div class="column is-3">
                        <label class="label">Admin</label>
                        <label class="checkbox">
                          <input v-model="editAdmin" type="checkbox" />
                          Is admin
                        </label>
                      </div>

                      <div class="column is-12">
                        <button
                          class="button is-small"
                          @click="saveEdit(user.id)"
                        >
                          Save
                        </button>

                        <button
                          class="button is-small is-light ml-2"
                          @click="cancelEdit"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <p v-if="!isLoading && filteredUsers.length === 0">
          No users found.
        </p>
      </div>
    </div>
    <ActivityTypeManager />
  </section>
</template>

<style scoped>
.admin-table {
  background-color: white;
}
</style>
