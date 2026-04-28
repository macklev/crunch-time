<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import ActivityList from './ActivityList.vue'

const activityStore = useActivityStore()

const stats = ref({
  totalActivities: 0,
  totalMinutes: 0,
  totalCalories: 0,
  averageDuration: 0,
  mostCommonActivity: 'N/A',
})

const errorMessage = ref('')
const isLoading = ref(false)

async function fetchStats() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    stats.value = await activityStore.fetchStats()
  } catch (error) {
    console.error('Fetch stats error:', error)
    errorMessage.value = 'Could not load statistics.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStats()
})

watch(
  () => activityStore.activities.length,
  () => {
    fetchStats()
  },
)
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

<style scoped>
</style>
