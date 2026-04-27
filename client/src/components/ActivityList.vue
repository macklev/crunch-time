<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore';
import { useUserStore } from '@/stores/userStore';
import type { Activity } from '@/types';
import { ref, computed } from 'vue';

const activityStore = useActivityStore();
const userStore = useUserStore();

const editingId= ref<number | null>(null)
  const editType= ref('')
  const editDuration= ref(0)
  const editDate= ref('')

const userActivities = computed(() => {
  if (!userStore.currentUser) return []

  return activityStore.activities.filter(activity => activity.userId === userStore.currentUser!.id);
});

async function deleteActivity(id: number) {
  const response= await fetch(`http://localhost:3000/api/activities/${id}`, {
    method: 'DELETE'
  })

  if (response.ok) {
    activityStore.deleteActivity(id)
  }
}

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
  const updatedActivity = {
    ...activity,
    type: editType.value,
    duration: editDuration.value,
    date: editDate.value
  }

  const response = await fetch(`http://localhost:3000/api/activities/${activity.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedActivity)
  })

  if (!response.ok) {
    console.error('Failed to update activity')
    return
  }

  const savedActivity = await response.json()
  activityStore.editActivity(savedActivity)

  cancelEdit()
}

</script>

<template>
  <div class="box">
    <h2 class="title is-4">My Activities</h2>

    <p v-if="userActivities.length === 0">
      No activities logged yet.
    </p>

    <div
      v-for="activity in userActivities"
      :key="activity.id"
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

      <div v-else class="box">
        <div class="field">
          <label class="label">Type</label>
          <input
            class="input"
            v-model="editType"
          />
        </div>

        <div class="field">
          <label class="label">Duration</label>
          <input
            class="input"
            type="number"
            v-model.number="editDuration"
          />
        </div>

        <div class="field">
          <label class="label">Date</label>
          <input
            class="input"
            type="date"
            v-model="editDate"
          />
        </div>

        <button
          class="button"
          @click="saveEdit(activity)"
        >
          Save
        </button>

        <button
          class="button is-light"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
