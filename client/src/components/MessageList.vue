<script setup lang="ts">
import { onMounted } from 'vue'
import { useMessageStore } from '@/stores/messageStore'

const messageStore = useMessageStore()

onMounted(() => {
  messageStore.fetchMyMessages()
})
</script>

<template>
  <div class="box">
    <h2 class="title is-4">My Messages</h2>

    <p v-if="messageStore.messages.length === 0">
      No messages yet.
    </p>

    <div
      v-for="message in messageStore.messages"
      :key="message.id"
      class="box"
    >
      <p>{{ message.text }}</p>
      <small>{{ message.created_at }}</small>
    </div>
  </div>
</template>
