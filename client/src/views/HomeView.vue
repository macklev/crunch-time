<script setup lang="ts">
import ActivityForm from '@/components/ActivityForm.vue';
import ActivityList from '@/components/ActivityList.vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
</script>

<template>
  <div class="container">
    <h1 class="title">Crunch Time</h1>
    <h2 class="subtitle">Your Fitness, Connected</h2>
    <main>
      <h1>Welcome back, {{ userStore.currentUser?.username }} </h1>
      <ActivityList />
      <ActivityForm />
    </main>
  </div>
</template>

<style scoped>

.title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

</style>
