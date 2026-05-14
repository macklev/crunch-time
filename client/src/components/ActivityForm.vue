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
const isSeeding = ref(false)

function formatDate(daysAgo: number) {
  const dateValue = new Date()
  dateValue.setDate(dateValue.getDate() - daysAgo)
  return dateValue.toISOString().slice(0, 10)
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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

async function addRandomActivities() {
  errorMessage.value = ''

  if (!userStore.token || !userStore.currentUser) {
    errorMessage.value = 'You must be logged in to log activities.'
    return
  }

  if (!activityStore.activityTypes.length) {
    errorMessage.value = 'Activity types must be loaded before seeding data.'
    return
  }

  try {
    isSeeding.value = true

    const seedCount = 100

    for (let index = 0; index < seedCount; index += 1) {
      const activityType = activityStore.activityTypes[
        getRandomInt(0, activityStore.activityTypes.length - 1)
      ]

      if (!activityType) {
        throw new Error('No activity type available.')
      }

      const durationValue = getRandomInt(10, 180)
      const caloriesBurned = Math.round(
        (activityType.calories_per_hour / 60) * durationValue,
      )

      await activityStore.createActivity({
        type: activityType.name,
        duration: durationValue,
        caloriesBurned,
        date: formatDate(getRandomInt(0, 30)),
      })
    }
  } catch (error) {
    console.error('Seed activities error:', error)
    errorMessage.value = 'Could not generate random activities.'
  } finally {
    isSeeding.value = false
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
        <div class="buttons">
          <button
            class="button is-primary"
            :disabled="isSaving || isSeeding"
            @click="submitActivity"
          >
            {{ isSaving ? 'Saving...' : 'Submit Activity' }}
          </button>

          <button
            class="button is-light"
            :disabled="isSaving || isSeeding"
            @click="addRandomActivities"
          >
            {{ isSeeding ? 'Generating...' : 'Add 100 Random Activities' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
