<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/services/api'
import type { ActivityType } from '@/types'

const activityTypes = ref<ActivityType[]>([])

const newName = ref('')
const newCalories = ref(0)

const editingId = ref<number | null>(null)
const editName = ref('')
const editCalories = ref(0)

const errorMessage = ref('')
const isLoading = ref(false)

async function fetchActivityTypes() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    activityTypes.value = await api<ActivityType[]>('/api/activity-types')
  } catch (error) {
    console.error('Fetch activity types error:', error)
    errorMessage.value = 'Could not load activity types.'
  } finally {
    isLoading.value = false
  }
}

async function addActivityType() {
  errorMessage.value = ''

  if (!newName.value.trim() || newCalories.value <= 0) {
    errorMessage.value = 'Please enter a name and calories per hour.'
    return
  }

  try {
    const createdType = await api<ActivityType>('/api/activity-types', {
      name: newName.value.trim(),
      calories_per_hour: newCalories.value,
    })

    activityTypes.value.push(createdType)

    newName.value = ''
    newCalories.value = 0
  } catch (error) {
    console.error('Add activity type error:', error)
    errorMessage.value = 'Could not add activity type.'
  }
}

function startEdit(type: ActivityType) {
  editingId.value = type.id
  editName.value = type.name
  editCalories.value = type.calories_per_hour
}

function cancelEdit() {
  editingId.value = null
  editName.value = ''
  editCalories.value = 0
}

async function saveEdit(typeId: number) {
  errorMessage.value = ''

  if (!editName.value.trim() || editCalories.value <= 0) {
    errorMessage.value = 'Please enter a name and calories per hour.'
    return
  }

  try {
    const updatedType = await api<ActivityType>(
      `/api/activity-types/${typeId}`,
      {
        name: editName.value.trim(),
        calories_per_hour: editCalories.value,
      },
      { method: 'PUT' },
    )

    const index = activityTypes.value.findIndex((type) => type.id === typeId)

    if (index !== -1) {
      activityTypes.value[index] = updatedType
    }

    cancelEdit()
  } catch (error) {
    console.error('Update activity type error:', error)
    errorMessage.value = 'Could not update activity type.'
  }
}

async function deleteActivityType(typeId: number) {
  errorMessage.value = ''

  try {
    await api(`/api/activity-types/${typeId}`, undefined, {
      method: 'DELETE',
    })

    activityTypes.value = activityTypes.value.filter((type) => type.id !== typeId)
  } catch (error) {
    console.error('Delete activity type error:', error)
    errorMessage.value = 'Could not delete activity type.'
  }
}

onMounted(() => {
  fetchActivityTypes()
})
</script>

<template>
  <div class="box">
    <h2 class="title is-4">Manage Activity Types</h2>

    <p v-if="isLoading">Loading activity types...</p>

    <p v-if="errorMessage" class="has-text-danger">
      {{ errorMessage }}
    </p>

    <div class="box">
      <h3 class="title is-5">Add New Activity Type</h3>

      <div class="field">
        <label class="label">Activity Name</label>
        <div class="control">
          <input
            v-model="newName"
            class="input"
            type="text"
            placeholder="Example: Rowing"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Calories Per Hour</label>
        <div class="control">
          <input
            v-model.number="newCalories"
            class="input"
            type="number"
            min="1"
            placeholder="Example: 450"
          />
        </div>
      </div>

      <button class="button" @click="addActivityType">
        Add Activity Type
      </button>
    </div>

    <div
      v-for="type in activityTypes"
      :key="type.id"
      class="box"
    >
      <div v-if="editingId !== type.id" class="level">
        <div class="level-left">
          <div class="level-item">
            <strong>{{ type.name }}</strong>
          </div>

          <div class="level-item">
            {{ type.calories_per_hour }} cal/hr
          </div>
        </div>

        <div class="level-right">
          <button class="button is-small" @click="startEdit(type)">
            Edit
          </button>

          <button
            class="button is-small is-danger"
            @click="deleteActivityType(type.id)"
          >
            Delete
          </button>
        </div>
      </div>

      <div v-else>
        <div class="field">
          <label class="label">Activity Name</label>
          <div class="control">
            <input
              v-model="editName"
              class="input"
              type="text"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Calories Per Hour</label>
          <div class="control">
            <input
              v-model.number="editCalories"
              class="input"
              type="number"
              min="1"
            />
          </div>
        </div>

        <button class="button is-small" @click="saveEdit(type.id)">
          Save
        </button>

        <button class="button is-small is-light ml-2" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
