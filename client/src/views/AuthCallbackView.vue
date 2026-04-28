<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useActivityStore } from '@/stores/activityStore'
import { api } from '@/services/api'
import type { User } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const activityStore = useActivityStore()

const message = ref('Logging you in...')

onMounted(async () => {
  try {
    const token = route.query.token

    if (!token || typeof token !== 'string') {
      message.value = 'No token found.'
      return
    }

    userStore.setToken(token)

    const user = await api<User>('/api/users/me')

    userStore.setUser(user)

    await activityStore.fetchMyActivities()
    await activityStore.fetchActivityTypes()

    router.push('/')
  } catch (error) {
    console.error('Auth callback error:', error)
    message.value = 'Login failed. Check the console.'
  }
})
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="box">
        <h1 class="title">{{ message }}</h1>
        <p>Please wait while we finish setting up your account.</p>
      </div>
    </div>
  </section>
</template>
