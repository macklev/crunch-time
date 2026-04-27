<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { ActivityType } from '@/types'

const userStore = useUserStore()

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

  const response = await fetch('http://localhost:3000/api/activity-types', {
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })

  isLoading.value = false

  if (!response.ok) {
    errorMessage.value = 'Could not load activity types.'
    return
  }

  activityTypes.value = await response.json()
}

 async function addActivityType() {
  errorMessage.value = ''

  if (!newName.value || newCalories.value <= 0) {
    errorMessage.value = 'Please enter a name and calories per hour.'
    return
  }

  const response = await fetch('http://localhost:3000/api/activity-types', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`
    },
    body: JSON.stringify({
      name: newName.value,
      calories_per_hour: newCalories.value
    })
  })

  if (!response.ok) {
    errorMessage.value = 'Could not add activity type.'
    return
  }

  const createdType = await response.json()
  activityTypes.value.push(createdType)

  newName.value = ''
  newCalories.value = 0
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

  const response = await fetch(`http://localhost:3000/api/activity-types/${typeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`
    },
    body: JSON.stringify({
      name: editName.value,
      calories_per_hour: editCalories.value
    })
  })

  if (!response.ok) {
    errorMessage.value = 'Could not update activity type.'
    return
  }

  const updatedType = await response.json()

  const index = activityTypes.value.findIndex((type) => type.id === typeId)

  if (index !== -1) {
    activityTypes.value[index] = updatedType
  }

  cancelEdit()
}

async function deleteActivityType(typeId: number) {
  errorMessage.value = ''

  const response = await fetch(`http://localhost:3000/api/activity-types/${typeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userStore.token}`
    }
  })

  if (!response.ok) {
    errorMessage.value = 'Could not delete activity type.'
    return
  }

  activityTypes.value = activityTypes.value.filter((type) => type.id !== typeId)
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
        <input
          v-model="newName"
          class="input"
          type="text"
          placeholder="Example: Rowing"
        />
      </div>

      <div class="field">
        <label class="label">Calories Per Hour</label>
        <input
          v-model.number="newCalories"
          class="input"
          type="number"
          min="1"
          placeholder="Example: 450"
        />
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
          <input
            v-model="editName"
            class="input"
            type="text"
          />
        </div>

        <div class="field">
          <label class="label">Calories Per Hour</label>
          <input
            v-model.number="editCalories"
            class="input"
            type="number"
            min="1"
          />
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
