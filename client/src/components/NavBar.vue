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

<nav class="navbar" role="navigation" aria-label="main navigation">

  <div class="navbar-brand">

    <a class="navbar-item">
      <img alt= "a pink clock" src="/logo.png" width="30" height="30" />
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

    <div class="navbar-end">


      <div class="navbar-item has-dropdown is-hoverable">

        <a class="navbar-link">
          <img
            v-if="userStore.currentUser?.profilePicture"
            :src="userStore.currentUser.profilePicture"
            :alt="userStore.currentUser.username"
            class="profile-avatar"
          />
          {{ userStore.currentUser ? userStore.currentUser.username : "Select User" }}
        </a>

        <div class="navbar-dropdown is-right">

          <a
            class="navbar-item"
            v-for="user in userStore.users"
            :key="user.id"
            @click="selectUser(user)"
          >
            <img
              :src="user.profilePicture"
              :alt="user.username"
              class="profile-avatar-small"
            />
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

.profile-avatar {
  width: 40px;
  height: 50px;
  object-fit: cover;
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
}

.profile-avatar-small {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
}
</style>
