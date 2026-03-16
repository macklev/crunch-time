<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore';
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const activityStore = useActivityStore();
const userStore = useUserStore();

const userActivities = computed(() => {
  if (!userStore.currentUser) return []

  return activityStore.activities.filter(activity => activity.userId === userStore.currentUser!.id);
});


</script>

<template>
  <div class="box">
    <h2 class="title is-4">My Activities</h2>
    <p v-if="userActivities.length === 0">No activities logged yet.</p>
    <div
    v-for="activity in userActivities"
    :key="activity.id"
    class="level">

      <div class="level-left">
        <div class="level-item">
          <strong>{{ activity.type }}</strong>
        </div>

        <div class="level-item">
          {{ activity.duration }} min
        </div>

        <div class="level-item">
          {{  Math.round(activity.caloriesBurned) }} cal
        </div>

        <div class="level-item">
          {{ activity.date }}
        </div>

    </div>

    <div class="level-right">
      <button class="button is-small is-danger" @click="activityStore.deleteActivity(activity.id)">
        Delete
      </button>
    </div>
  </div>
  </div>
</template>

