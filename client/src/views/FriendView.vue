<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useActivityStore } from '@/stores/activityStore'
import { useUserStore } from '@/stores/userStore'
import type { Activity, User } from '@/types'

const activityStore = useActivityStore()
const userStore = useUserStore()

const scrollEl = useTemplateRef<HTMLElement>('scrollEl')

const searchedUsers = ref<User[]>([])
const searchId = ref('')
const friendActivities = ref<Activity[]>([])

const page = ref(0)
const limit = 10
const total = ref(0)

const isLoading = ref(false)
const errorMessage = ref('')

const friends = computed(() => userStore.currentUser?.friends || [])
const hasLoadedOnce = ref(false)

function hasMore() {
  return !hasLoadedOnce.value || friendActivities.value.length < total.value
}

async function loadMoreFriendActivities() {
  if (isLoading.value || !hasMore()) return

  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await activityStore.fetchFriendActivitiesPage(page.value, limit)

    friendActivities.value.push(...result.items)
    total.value = result.total
    page.value++
  } catch (error) {
    console.error('Friend activity error:', error)
    errorMessage.value = 'Could not load friend activity.'
  } finally {
    isLoading.value = false
  }
}

async function resetFriendActivityFeed() {
  friendActivities.value = []
  page.value = 0
  total.value = 0

  reset()

  await loadMoreFriendActivities()
}

async function searchUsers() {
  errorMessage.value = ''

  if (!searchId.value.trim()) {
    searchedUsers.value = []
    return
  }

  try {
    searchedUsers.value = await userStore.searchUsersById(searchId.value.trim())
  } catch (error) {
    console.error('Search users error:', error)
    errorMessage.value = 'Could not search users.'
  }
}

async function addFriend(friendId: number) {
  errorMessage.value = ''

  try {
    await userStore.addFriend(friendId)

    searchedUsers.value = []
    searchId.value = ''

    await resetFriendActivityFeed()
  } catch (error) {
    console.error('Add friend error:', error)
    errorMessage.value = 'Could not add friend.'
  }
}

async function removeFriend(friendId: number) {
  errorMessage.value = ''

  try {
    await userStore.removeFriend(friendId)
    await resetFriendActivityFeed()
  } catch (error) {
    console.error('Remove friend error:', error)
    errorMessage.value = 'Could not remove friend.'
  }
}

function isAlreadyFriend(userId: number) {
  return friends.value.includes(userId)
}

onMounted(() => {
  loadMoreFriendActivities()
})

const { reset } = useInfiniteScroll(
  scrollEl,
  async () => {
    await loadMoreFriendActivities()
  },
  {
    distance: 80,
    canLoadMore: hasMore,
  },
)
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Friend Activity</h1>

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

      <div class="box">
        <h2 class="title is-5">Friend Activity Feed</h2>

        <p>
          Showing {{ friendActivities.length }} of {{ total }}
        </p>

        <div
          ref="scrollEl"
          style="max-height: 500px; overflow-y: auto;"
        >
          <div
            v-if="!isLoading && friendActivities.length === 0"
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
              <strong>
                {{ activity.users?.username || `User ${activity.userId}` }}
              </strong>
              - {{ activity.type }}
              {{ activity.duration }} min
              {{ Math.round(activity.caloriesBurned) }} cal
            </p>

            <p>{{ activity.date }}</p>
          </div>

          <div v-if="isLoading && hasMore()" class="box">
            Loading more activities...
          </div>

          <p v-if="hasLoadedOnce && !hasMore() && friendActivities.length > 0">
          You have reached the end.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
