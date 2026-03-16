<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useActivityStore } from '@/stores/activityStore';
import { computed } from 'vue';

const activityStore = useActivityStore();
const userStore = useUserStore();

const friendActivities = computed(() => {
  if (!userStore.currentUser) return []

  return activityStore.activities.filter(
    activity => activity.userId !== userStore.currentUser!.id
  )
});

function getUsername(userId: number) {
    const user = userStore.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown User';
  }
</script>

<template>
  <div class="container">
    <h1 class="title">Friend Activity</h1>
    <div
    v-for="activity in friendActivities"
    :key="activity.id"
    class="box"
  >
    <p><strong>{{ getUsername(activity.userId) }}</strong>
    - {{ activity.type }}
      {{ activity.duration }} min
      {{ Math.round(activity.caloriesBurned) }} cal
    </p>

    <p>{{ activity.date }}</p>

  </div>
  </div>
</template>

