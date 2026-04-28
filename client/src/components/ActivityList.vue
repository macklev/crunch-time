<script setup lang="ts">
import { computed, ref } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { useUserStore } from '@/stores/userStore'
import type { Activity } from '@/types'

const activityStore = useActivityStore()
const userStore = useUserStore()

const editingId = ref<number | null>(null)
const editType = ref('')
const editDuration = ref(0)
const editDate = ref('')
const errorMessage = ref('')

const userActivities = computed(() => {
  if (!userStore.currentUser) return []

  return activityStore.activities.filter(
    (activity) => activity.userId === userStore.currentUser!.id,
  )
})

function startEdit(activity: Activity) {
  editingId.value = activity.id
  editType.value = activity.type
  editDuration.value = activity.duration
  editDate.value = activity.date
}

function cancelEdit() {
  editingId.value = null
  editType.value = ''
  editDuration.value = 0
  editDate.value = ''
}

async function saveEdit(activity: Activity) {
  errorMessage.value = ''

  try {
    await activityStore.updateActivity(activity.id, {
      type: editType.value,
      duration: editDuration.value,
      date: editDate.value,
    })

    cancelEdit()
  } catch (err) {
    console.error('Update activity error:', err)
    errorMessage.value = 'Could not update activity.'
  }
}

async function deleteActivity(id: number) {
  errorMessage.value = ''

  try {
    await activityStore.deleteActivity(id)
  } catch (err) {
    console.error('Delete activity error:', err)

    if (err instanceof Error) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'Could not delete activity.'
    }
  }
}
</script>

<template>
  <div class="box">
    <h2 class="title is-4">My Activities</h2>

    <p v-if="errorMessage" class="has-text-danger">
      {{ errorMessage }}
    </p>

    <p v-if="userActivities.length === 0">
      No activities logged yet.
    </p>

    <div
      v-for="activity in userActivities"
      :key="activity.id"
      class="box"
    >
      <div v-if="editingId !== activity.id" class="level">
        <div class="level-left">
          <div class="level-item">
            <strong>{{ activity.type }}</strong>
          </div>

          <div class="level-item">
            {{ activity.duration }} min
          </div>

          <div class="level-item">
            {{ Math.round(activity.caloriesBurned) }} cal
          </div>

          <div class="level-item">
            {{ activity.date }}
          </div>
        </div>

        <div class="level-right">
          <button
            class="button is-small"
            @click="startEdit(activity)"
          >
            Edit
          </button>

          <button
            class="button is-small is-danger"
            @click="deleteActivity(activity.id)"
          >
            Delete
          </button>
        </div>
      </div>

      <div v-else>
        <div class="field">
          <label class="label">Type</label>
          <input
            v-model="editType"
            class="input"
            type="text"
          />
        </div>

        <div class="field">
          <label class="label">Duration</label>
          <input
            v-model.number="editDuration"
            class="input"
            type="number"
            min="1"
          />
        </div>

        <div class="field">
          <label class="label">Date</label>
          <input
            v-model="editDate"
            class="input"
            type="date"
          />
        </div>

        <button
          class="button is-small"
          @click="saveEdit(activity)"
        >
          Save
        </button>

        <button
          class="button is-small is-light ml-2"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
