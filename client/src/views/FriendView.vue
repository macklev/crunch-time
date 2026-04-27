<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { Activity, User } from '@/types'

const userStore = useUserStore()

const friendActivities = ref<Activity[]>([])
const errorMessage = ref('')
const isLoading = ref(false)
const users = ref<User[]>([])
const searchId= ref('')

const filteredUsers= computed(() => {
  if (!searchId.value.trim()) {
    return users.value
  }
  return users.value.filter((user) =>
    user.id.toString().includes(searchId.value.trim())
  )
})

async function searchUsers() {
  if (!searchId.value.trim()) {
    users.value = []
    return
  }

  const response = await fetch(
    `http://localhost:3000/api/users/search?id=${searchId.value}`,
    {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    }
  )

  if (response.ok) {
    users.value = await response.json()
  }
}

async function fetchFriendActivities() {
  errorMessage.value = ''
  isLoading.value = true

  if (!userStore.token) {
    errorMessage.value = 'Please log in to view friend activity.'
    isLoading.value = false
    return
  }

  const response = await fetch('http://localhost:3000/api/activities/friends', {
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })

  if (!response.ok) {
  const errorText = await response.text()
  console.error('Friend activity error:', errorText)
  errorMessage.value = errorText
  isLoading.value = false
  return
}

  friendActivities.value = await response.json()
  isLoading.value = false
}

async function addFriend(friendId: number) {
  const response = await fetch('http://localhost:3000/api/users/friends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`
    },
    body: JSON.stringify({ friendId })
  })

  if (response.ok) {
    const updatedUser = await response.json()
    userStore.setUser(updatedUser)
    fetchFriendActivities()
  }
}

async function removeFriend(friendId: number) {
  const response = await fetch(`http://localhost:3000/api/users/friends/${friendId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })

  if (response.ok) {
    const updatedUser = await response.json()
    userStore.setUser(updatedUser)
    fetchFriendActivities()
  }
}

onMounted(() => {
  fetchFriendActivities()
  searchUsers()
})
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Friend Activity</h1>

      <p v-if="isLoading">Loading friend activity...</p>

      <p v-if="errorMessage" class="has-text-danger">
        {{ errorMessage }}
      </p>

      <div
        v-if="!isLoading && friendActivities.length === 0 && !errorMessage"
        class="box"
      >
        No friend activities yet.
      </div>

      <div class="box">
      <h2 class="title is-5">Add Friends</h2>

      <div class="field">
        <label class="label">Search user by ID</label>
          <div class="control">
            <input
              v-model="searchId"
              class="input"
              type="text"
              placeholder="Enter user ID"
            />
            <button class="button is-small" @click="searchUsers">
            Search
            </button>
          </div>
        </div>

        <div
          v-for="user in filteredUsers"
          :key="user.id"
        >
        <button
          v-if="user.id !== userStore.currentUser?.id"
          class="button is-small"
          @click="addFriend(user.id)"
        >
          Add {{ user.username }} — ID #{{ user.id }}
        </button>
      </div>
    </div>

    <div class="box">
      <h2 class="title is-5">Remove Friends</h2>

      <div
        v-for="friendId in userStore.currentUser?.friends || []"
        :key="friendId"
      >
        <button
          class="button is-small is-danger"
          @click="removeFriend(friendId)"
       >
        Remove Friend ID #{{ friendId }}
        </button>
      </div>
    </div>

      <div
        v-for="activity in friendActivities"
        :key="activity.id"
        class="box"
      >
      <p>
        <strong>User {{ activity.userId }}</strong>
        - {{ activity.type }}
        {{ activity.duration }} min
        {{ Math.round(activity.caloriesBurned) }} cal
      </p>

      <p>{{ activity.date }}</p>
      </div>
    </div>
  </section>
</template>
