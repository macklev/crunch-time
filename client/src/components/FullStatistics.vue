<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useActivityStore } from '@/stores/activityStore';
import { computed } from 'vue';
import ActivityList from './ActivityList.vue';

const activityStore = useActivityStore();
const userStore = useUserStore();

const userActivities = computed(() => {
  if (!userStore.currentUser) return []

  return activityStore.activities.filter(
    activity => activity.userId === userStore.currentUser!.id
  )
});

const totalDuration = computed(() => {
  return userActivities.value.reduce((sum, activity) => sum + activity.duration, 0);
});

const totalCalories = computed(() => {
  return userActivities.value.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
});

const averageCalories = computed(() => {
  if (userActivities.value.length === 0) return 0;
  return totalCalories.value / userActivities.value.length;
});

const mostFrequentActivity = computed(() => {
  const activityCount: Record<string, number> = {};
  userActivities.value.forEach(activity => {
    activityCount[activity.type] = (activityCount[activity.type] || 0) + 1;
  });

  let maxCount = 0;
  let frequentActivity = '';
  for (const activityType in activityCount) {
    const count = activityCount[activityType] ?? 0;
    if (count > maxCount) {
      maxCount = count;
      frequentActivity = activityType;
    }
  }
  return frequentActivity || 'N/A';
});

</script>

<template>
  <div class="box">
    <h2 class="title is-4">My Statistics</h2>
    <p class="box">Total Duration of Workouts: {{ totalDuration }} minutes</p>
    <hr>
    <p class="box">Total Calories Burned: {{ Math.round(totalCalories) }} calories</p>
    <hr>
    <p class="box">Average Calories Burned per Activity: {{ Math.round(averageCalories) }} calories</p>
    <hr>
    <p class="box">Most Frequent Activity Type: {{ mostFrequentActivity }}</p>
    <hr>
    <ActivityList />
  </div>
</template>

