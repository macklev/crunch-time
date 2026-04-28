import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '@/types'
import { api } from '@/services/api'

export const useMessageStore = defineStore('message', () => {
  const messages = ref<Message[]>([])

  async function fetchMyMessages() {
    messages.value = await api<Message[]>('/api/messages/me')
  }

  return {
    messages,
    fetchMyMessages,
  }
})
