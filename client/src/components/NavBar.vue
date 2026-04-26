<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

function loginWithGoogle() {
  window.location.href = 'http://localhost:3000/api/auth/google'
}

function logout() {
  userStore.logout()
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <RouterLink to="/" class="navbar-item">
        <img alt="a pink clock" src="/logo.png" width="30" height="30" />
      </RouterLink>

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
        <div v-if="!userStore.currentUser" class="navbar-item">
          <button class="button" @click="loginWithGoogle">
            Login with Google
          </button>
        </div>

        <div v-else class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            <img
              v-if="userStore.currentUser.profilePicture"
              :src="userStore.currentUser.profilePicture"
              :alt="userStore.currentUser.username"
              class="profile-avatar"
            />
            {{ userStore.currentUser.username }}
          </a>

          <div class="navbar-dropdown is-right">
            <RouterLink to="/profile" class="navbar-item">
              Profile
            </RouterLink>

            <a class="navbar-item" @click="logout">
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.logo {
  max-height: 30px;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
}
</style>
