<script setup lang="ts">
import { onMounted } from 'vue';
import ActivityForm from '@/components/ActivityForm.vue';
import ActivityList from '@/components/ActivityList.vue';
import { useActivityStore } from '@/stores/activityStore';

const activityStore = useActivityStore();

onMounted(() => {
  activityStore.fetchActivities();
});
</script>

<template>
  <div class="container">
    <h1 class="title">Log Activity</h1>
    <ActivityForm />
    <ActivityList />
  </div>
</template>
