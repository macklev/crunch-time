<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useActivityStore } from '@/stores/activityStore';
import { computed } from 'vue';

const activityStore = useActivityStore();
const userStore = useUserStore();

const allActivities = computed(() => {
  return activityStore.activities;
});

const allUsers = computed(() => {
  return userStore.users;
});

function getUsername(userId: number) {
  const user = userStore.users.find(u => u.id === userId);
  return user ? user.username : 'Unknown User';
}

</script>

<template>
  <div class="container">
    <h1 class="title">Admin Dashboard</h1>
    <br>
    <h2 class="subtitle">All Users</h2>
    <ul>
      <li v-for="user in allUsers" :key="user.id">
        Username: {{ user.username }} Id: {{ user.id }}

      </li>
    </ul>
<br>
    <h2 class="subtitle">All Activities</h2>
    <ul>
      <li v-for="activity in allActivities" :key="activity.id">
        User: {{ getUsername(activity.userId) }} - {{ activity.type }} for {{ activity.duration }} min on {{ activity.date }}
      </li>
    </ul>

  </div>

</template>

<style scoped>

</style>
