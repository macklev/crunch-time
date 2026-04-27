<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import ActivityList from './ActivityList.vue'

const userStore = useUserStore()

const stats = ref({
  totalActivities: 0,
  totalMinutes: 0,
  totalCalories: 0,
  averageDuration: 0,
  mostCommonActivity: 'N/A'
})

const errorMessage = ref('')
const isLoading = ref(false)

async function fetchStats() {
  errorMessage.value = ''
  isLoading.value = true

  const response = await fetch('http://localhost:3000/api/activities/stats', {
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })

  if (!response.ok) {
    errorMessage.value = 'Could not load statistics.'
    isLoading.value = false
    return
  }

  stats.value = await response.json()
  isLoading.value = false
}

onMounted(() => {
  fetchStats()

  // Listen for when a new activity is added
  window.addEventListener('activityAdded', fetchStats)
})
</script>

<template>
  <div class="box">
    <h2 class="title is-4">My Statistics</h2>

    <p v-if="isLoading">Loading statistics...</p>

    <p v-if="errorMessage" class="has-text-danger">
      {{ errorMessage }}
    </p>

    <div v-if="!isLoading && !errorMessage" class="stats-box">
      <p class="box">
        Total Activities: {{ stats.totalActivities }}
      </p>

      <p class="box">
        Total Duration of Workouts: {{ stats.totalMinutes }} minutes
      </p>

      <p class="box">
        Total Calories Burned: {{ Math.round(stats.totalCalories) }} calories
      </p>

      <p class="box">
        Average Workout Duration:
        {{ Math.round(stats.averageDuration) }} minutes
      </p>

      <p class="box">
        Most Frequent Activity Type:
        {{ stats.mostCommonActivity || 'N/A' }}
      </p>

      <ActivityList />
    </div>
  </div>
</template>
