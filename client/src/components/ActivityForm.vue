<script setup lang="ts">

import { ref } from 'vue'
import { useActivityStore } from '@/stores/activityStore'

const activityStore = useActivityStore()

const selectedType = ref('')
const duration = ref(0)
const date = ref('')

function submitActivity() {

  activityStore.addActivity(
    selectedType.value,
    duration.value,
    date.value
  )

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
    <div class="field">
      <label class="label">Duration (minutes)</label>
      <div class="control">
        <input
          type="number"
          class="input"
          v-model="duration"
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
    <div class="field">
      <div class="control">
        <button class="button is-primary" @click="submitActivity">
          Submit Activity
        </button>
      </div>
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
