<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'

const route= useRoute()
const router= useRouter()
const userStore= useUserStore()

onMounted( async () => {
  const token= route.query.token

  if (!token || typeof token !== 'string') {
    router.push('/')
    return
  }

userStore.setToken(token)

const response = await fetch('http://localhost:3000/api/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

 if (!response.ok) {
    userStore.logout()
    router.push('/')
    return
  }

  const user = await response.json()

  userStore.setUser(user)

  router.push('/')
})
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="box">
        <h1 class="title">Logging you in...</h1>
        <p>Please wait while we finish setting up your account.</p>
      </div>
    </div>
  </section>
</template>
