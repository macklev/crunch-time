<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

interface User {
  id: number
  username: string
  gender: string
  age: number
  profilePicture: string
  admin: boolean
}

function selectUser(user: User) {
  userStore.setUser(user)
}
</script>

<template>
<div>

<nav class="navbar is-warning" role="navigation" aria-label="main navigation">

  <div class="navbar-brand">

    <a class="navbar-item">
      <img src="/logo.png" width="30" height="30" />
    </a>

    <a
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>

  </div>

  <div class="navbar-menu">
    <div class="navbar-start">

      <RouterLink to="/" class="navbar-item" active-class="is-active">
        Home
      </RouterLink>

      <RouterLink to="/LogActivityView" class="navbar-item" active-class="is-active">
        Log Activity
      </RouterLink>

      <RouterLink to="/FriendView" class="navbar-item" active-class="is-active">
        Friend Activity
      </RouterLink>

      <RouterLink to="/MoreStatsView" class="navbar-item" active-class="is-active">
        More Statistics
      </RouterLink>

      <RouterLink
        v-if="userStore.currentUser?.admin"
        to="/AdminView"
        class="navbar-item"
        active-class="is-active"
      >
        Admin Controls
      </RouterLink>

    </div>

    <!-- RIGHT SIDE -->
    <div class="navbar-end">

      <div class="navbar-item has-dropdown is-hoverable">

        <a class="navbar-link">
          {{ userStore.currentUser ? userStore.currentUser.username : "Select User" }}
        </a>

        <div class="navbar-dropdown is-right">

          <a
            class="navbar-item"
            v-for="user in userStore.users"
            :key="user.id"
            @click="selectUser(user)"
          >
            {{ user.username }}
          </a>

        </div>

      </div>

    </div>

  </div>

</nav>

</div>
</template>

<style scoped>
.logo {
  max-height: 30px;
}
</style>
