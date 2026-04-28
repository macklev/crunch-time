<script setup lang="ts">
import { ref } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { useUserStore } from '@/stores/userStore'

const activityStore = useActivityStore()
const userStore = useUserStore()

const selectedType = ref('')
const duration = ref(0)
const date = ref('')
const errorMessage = ref('')
const isSaving = ref(false)

async function submitActivity() {
  errorMessage.value = ''

  if (!selectedType.value || duration.value <= 0 || !date.value) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  if (!userStore.token || !userStore.currentUser) {
    errorMessage.value = 'You must be logged in to log an activity.'
    return
  }

  const activityType = activityStore.activityTypes.find(
    (type) => type.name === selectedType.value,
  )

  if (!activityType) {
    errorMessage.value = 'Selected activity type is invalid.'
    return
  }

  const caloriesBurned = Math.round(
    (activityType.calories_per_hour / 60) * duration.value,
  )

  try {
    isSaving.value = true

    await activityStore.createActivity({
      type: selectedType.value,
      duration: duration.value,
      caloriesBurned,
      date: date.value,
    })

    selectedType.value = ''
    duration.value = 0
    date.value = ''
  } catch (error) {
    console.error('Save activity error:', error)
    errorMessage.value = 'Could not save activity.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="box">
    <h2 class="title is-4">Log New Activity</h2>

    <div class="field">
      <label class="label">Activity Type</label>
      <div class="control">
        <div class="select">
          <select v-model="selectedType">
            <option value="" disabled>Select Activity</option>

            <option
              v-for="activity in activityStore.activityTypes"
              :key="activity.id"
              :value="activity.name"
            >
              {{ activity.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">Duration (minutes)</label>
      <div class="control">
        <input
          v-model.number="duration"
          class="input"
          type="number"
          min="1"
          placeholder="Enter duration"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Date</label>
      <div class="control">
        <input
          v-model="date"
          class="input"
          type="date"
        />
      </div>
    </div>

    <p v-if="errorMessage" class="has-text-danger">
      {{ errorMessage }}
    </p>

    <div class="field">
      <div class="control">
        <button
          class="button"
          :disabled="isSaving"
          @click="submitActivity"
        >
          {{ isSaving ? 'Saving...' : 'Submit Activity' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
