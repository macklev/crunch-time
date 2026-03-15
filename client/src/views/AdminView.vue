<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';
import { computed, ref } from 'vue';

const userStore = useUserStore();
const searchText = ref('');
const editingUserId = ref<number | null>(null);
const editUsername = ref('');
const editGender = ref('female');
const editAge = ref(18);
const editAdmin = ref(false);

const filteredUsers = computed(() => {
  const search = searchText.value.trim().toLowerCase();
  if (!search) {
    return userStore.users;
  }

  return userStore.users.filter((user) => {
    return (
      user.username.toLowerCase().includes(search) ||
      user.id.toString().includes(search)
    );
  });
});

function startEdit(user: User) {
  editingUserId.value = user.id;
  editUsername.value = user.username;
  editGender.value = user.gender;
  editAge.value = user.age;
  editAdmin.value = user.admin;
}

function cancelEdit() {
  editingUserId.value = null;
}

function saveEdit(userId: number) {
  userStore.updateUser(userId, {
    username: editUsername.value,
    gender: editGender.value,
    age: editAge.value,
    admin: editAdmin.value,
  });
  editingUserId.value = null;
}

function deleteUser(userId: number) {
  userStore.deleteUser(userId);
  if (editingUserId.value === userId) {
    editingUserId.value = null;
  }
}

function addNewUser() {
  const nextUserNumber = userStore.users.length + 1;

  const newUser = userStore.addUser({
    username: `new_user_${nextUserNumber}`,
    gender: 'other',
    age: 25,
    admin: false,
    profilePicture: '/logo.png',
  });

  searchText.value = '';
  startEdit(newUser);
}

</script>

<template>
  <div class="container">
    <br />
    <div class="box">
      <h2 class="title is-4">Admin Dashboard</h2>

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

      <div class="stats-box table-container">
        <table class="table is-fullwidth admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>User ID</th>
              <th>Edit User</th>
              <th>Delete User</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="user in filteredUsers" :key="user.id">
              <tr>
                <td>{{ user.username }}</td>
                <td>{{ user.id }}</td>
                <td>
                  <button class="button is-small" @click="startEdit(user)">
                    Edit
                  </button>
                </td>
                <td>
                  <button class="button is-small is-danger" @click="deleteUser(user.id)">
                    Delete
                  </button>
                </td>
              </tr>

              <tr v-if="editingUserId === user.id">
                <td colspan="4">
                  <div class="columns is-multiline">
                    <div class="column is-4">
                      <label class="label">Username</label>
                      <input v-model="editUsername" class="input" type="text" />
                    </div>

                    <div class="column is-3">
                      <label class="label">Gender</label>
                      <div class="select is-fullwidth">
                        <select v-model="editGender">
                          <option value="female">female</option>
                          <option value="male">male</option>
                          <option value="other">other</option>
                        </select>
                      </div>
                    </div>

                    <div class="column is-2">
                      <label class="label">Age</label>
                      <input v-model.number="editAge" class="input" type="number" min="1" />
                    </div>

                    <div class="column is-3">
                      <label class="label">Admin</label>
                      <label class="checkbox">
                        <input v-model="editAdmin" type="checkbox" /> Is admin
                      </label>
                    </div>

                    <div class="column is-12">
                      <button class="button is-small" @click="saveEdit(user.id)">Save</button>
                      <button class="button is-small is-light ml-2" @click="cancelEdit">Cancel</button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <p v-if="filteredUsers.length === 0">No users found.</p>
    </div>
  </div>
<br>

  <button class="button" @click="addNewUser">
    Add New User
  </button>

</template>

<style scoped>

</style>
