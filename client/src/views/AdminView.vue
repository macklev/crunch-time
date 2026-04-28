<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/services/api'
import type { User } from '@/types'
import ActivityTypeManager from '@/components/ActivityTypeManager.vue'

const users = ref<User[]>([])
const searchText = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const editingUserId = ref<number | null>(null)
const editUsername = ref('')
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

  try {
    users.value = await api<User[]>('/api/users')
  } catch (error) {
    console.error('Fetch users error:', error)
    errorMessage.value = 'You are not authorized to view users.'
  } finally {
    isLoading.value = false
  }
}

function startEdit(user: User) {
  editingUserId.value = user.id
  editUsername.value = user.username
  editAdmin.value = user.admin
}

function cancelEdit() {
  editingUserId.value = null
  editUsername.value = ''
  editAdmin.value = false
}

async function saveEdit(userId: number) {
  errorMessage.value = ''

  if (!editUsername.value.trim()) {
    errorMessage.value = 'Username cannot be empty.'
    return
  }

  try {
    const updatedUser = await api<User>(
      `/api/users/${userId}`,
      {
        username: editUsername.value.trim(),
        admin: editAdmin.value,
      },
      { method: 'PUT' },
    )

    const index = users.value.findIndex((user) => user.id === userId)

    if (index !== -1) {
      users.value[index] = updatedUser
    }

    cancelEdit()
  } catch (error) {
    console.error('Update user error:', error)
    errorMessage.value = 'Could not update user.'
  }
}

async function deleteUser(userId: number) {
  errorMessage.value = ''

  try {
    await api(`/api/users/${userId}`, undefined, {
      method: 'DELETE',
    })

    users.value = users.value.filter((user) => user.id !== userId)

    if (editingUserId.value === userId) {
      cancelEdit()
    }
  } catch (error) {
    console.error('Delete user error:', error)
    errorMessage.value = 'Could not delete user.'
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
              <template
                v-for="user in filteredUsers"
                :key="user.id"
              >
                <tr>
                  <td>{{ user.username }}</td>
                  <td>{{ user.id }}</td>
                  <td>{{ user.admin ? 'Yes' : 'No' }}</td>
                  <td>
                    <button
                      class="button is-small"
                      @click="startEdit(user)"
                    >
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
                      <div class="column is-6">
                        <label class="label">Username</label>
                        <input
                          v-model="editUsername"
                          class="input"
                          type="text"
                        />
                      </div>

                      <div class="column is-6">
                        <label class="label">Admin</label>
                        <label class="checkbox">
                          <input
                            v-model="editAdmin"
                            type="checkbox"
                          />
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

      <ActivityTypeManager />
    </div>
  </section>
</template>

<style scoped>
.admin-table {
  background-color: white;
}
</style>
