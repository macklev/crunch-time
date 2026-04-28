<script setup lang="ts">
import { onMounted } from 'vue';
import ActivityForm from '@/components/ActivityForm.vue';
import ActivityList from '@/components/ActivityList.vue';
import { useActivityStore } from '@/stores/activityStore';
import { useUserStore } from '@/stores/userStore';

const activityStore = useActivityStore();
const userStore = useUserStore();

onMounted(() => {
  if (userStore.token) {
    activityStore.fetchMyActivities()
    activityStore.fetchActivityTypes()
  }
})
</script>

<template>
  <div class="container">
    <h1 class="title">Log Activity</h1>
    <ActivityForm />
    <ActivityList />
  </div>
</template>
