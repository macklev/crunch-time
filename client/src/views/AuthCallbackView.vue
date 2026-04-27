<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const message = ref('Logging you in...')

onMounted(async () => {
  try {
    const token = route.query.token

    console.log('Token:', token)

    if (!token || typeof token !== 'string') {
      message.value = 'No token found.'
      return
    }

    userStore.setToken(token)

    const response = await fetch('http://localhost:3000/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('User fetch failed:', errorText)
      message.value = 'Login failed. Could not load user.'
      return
    }

    const user = await response.json()

    console.log('User:', user)

    userStore.setUser(user)

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
