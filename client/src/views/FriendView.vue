<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { useUserStore } from '@/stores/userStore'
import type { Activity, User } from '@/types'


const activityStore = useActivityStore()
const userStore = useUserStore()



const friendActivities = ref<Activity[]>([])
const searchedUsers = ref<User[]>([])
const searchId = ref('')

const errorMessage = ref('')
const isLoading = ref(false)

const friends = computed(() => userStore.currentUser?.friends || [])

async function fetchFriendActivities() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    friendActivities.value = await activityStore.fetchFriendActivities()
  } catch (err) {
  console.error('Friend activity error:', err)

  if (err instanceof Error) {
    errorMessage.value = err.message
  } else {
    errorMessage.value = 'Could not load friend activity.'
  }
} finally {
    isLoading.value = false
  }
}

async function searchUsers() {
  errorMessage.value = ''

  if (!searchId.value.trim()) {
    searchedUsers.value = []
    return
  }

  try {
    searchedUsers.value = await userStore.searchUsersById(searchId.value.trim())
  } catch (err) {
    console.error('Search users error:', err)
    errorMessage.value = 'Could not search users.'
  }
}

async function addFriend(friendId: number) {
  errorMessage.value = ''

  try {
    await userStore.addFriend(friendId)
    await fetchFriendActivities()
    searchedUsers.value = []
    searchId.value = ''
  } catch (err) {
    console.error('Add friend error:', err)
    errorMessage.value = 'Could not add friend.'
  }
}

async function removeFriend(friendId: number) {
  errorMessage.value = ''

  try {
    await userStore.removeFriend(friendId)
    await fetchFriendActivities()
  } catch (err) {
    console.error('Remove friend error:', err)
    errorMessage.value = 'Could not remove friend.'
  }
}

function isAlreadyFriend(userId: number) {
  return friends.value.includes(userId)
}

onMounted(() => {
  fetchFriendActivities()
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
              @keyup.enter="searchUsers"
            />
          </div>
        </div>

        <button class="button is-small" @click="searchUsers">
          Search
        </button>

        <div
          v-for="user in searchedUsers"
          :key="user.id"
          class="box mt-3"
        >
          <p>
            <strong>{{ user.username }}</strong>
            — ID #{{ user.id }}
          </p>

          <button
            v-if="user.id !== userStore.currentUser?.id && !isAlreadyFriend(user.id)"
            class="button is-small"
            @click="addFriend(user.id)"
          >
            Add Friend
          </button>

          <p v-else-if="isAlreadyFriend(user.id)">
            Already your friend.
          </p>

          <p v-else>
            This is your account.
          </p>
        </div>
      </div>

      <div class="box">
        <h2 class="title is-5">Remove Friends</h2>

        <p v-if="friends.length === 0">
          You have not added any friends yet.
        </p>

        <div
          v-for="friendId in friends"
          :key="friendId"
          class="mb-2"
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
        v-if="!isLoading && friendActivities.length === 0 && !errorMessage"
        class="box"
      >
        No friend activities yet.
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

<style scoped>
</style>
