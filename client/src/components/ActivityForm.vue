<script setup lang="ts">

import { ref } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { useUserStore } from '@/stores/userStore'

const activityStore = useActivityStore()
const userStore = useUserStore()

const selectedType = ref('')
const duration = ref(0)
const date = ref('')
const errorMessage= ref('')

async function submitActivity() {
  errorMessage.value = ''

  if (!selectedType.value || !duration.value || !date.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (!userStore.currentUser) {
    errorMessage.value = 'You must be logged in to log an activity'
    return
  }

  const activityType= activityStore.activityTypes.find(
    type => type.name === selectedType.value)

  if (!activityType) {
    errorMessage.value = 'Selected activity type is invalid'
    return
  }

  const caloriesBurned= (activityType.caloriesBurnedPerHour / 60) * duration.value

  const response = await fetch('http://localhost:3000/api/activities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: selectedType.value,
      duration: duration.value,
      caloriesBurned,
      date: date.value
    })
  })

  if (!response.ok) {
    errorMessage.value = 'Could not save activity.'
    return
  }

  const savedActivity = await response.json()

  activityStore.activities.push(savedActivity)

  selectedType.value = ''
  duration.value = 0
  date.value = ''
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
            <option v-for="activity in activityStore.activityTypes"
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
          type="number"
          class="input"
          v-model.number="duration"
          placeholder="Enter duration"
        />
      </div>
    </div>
    <div class="field">
      <label class="label">Date</label>
      <div class="control">
        <input
          type="date"
          class="input"
          v-model="date"
        />
      </div>
    </div>
    <p v-if="errorMessage" class="has-text-danger">
      {{ errorMessage }}
    </p>
    <div class="field">
      <div class="control">
        <button class="button" @click="submitActivity">
          Submit Activity
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

</style>
