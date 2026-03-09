<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div>
  <nav class="navbar is-info" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://bulma.io">
      <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="30" height="30" />

    </a>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <RouterLink to="/" active-class="is-active" class="navbar-item">
        Home
      </RouterLink>

      <RouterLink to="/LogActivityView" active-class="is-active" class="navbar-item">
        Log Activity
      </RouterLink>

      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          More
        </a>

        <div class="navbar-dropdown">
          <RouterLink to="/AdminView" active-class="is-active" class="navbar-item">
            Admin Controls
          </RouterLink>
          <RouterLink to="/FriendView" active-class="is-active" class="navbar-item">
            Friend Activity
          </RouterLink>
          <RouterLink to="/MoreStatsView" active-class="is-active" class="navbar-item">
            Deep Stats
          </RouterLink>
          <hr class="navbar-divider">
          <RouterLink to="/report-issue" active-class="is-active" class="navbar-item">
            Report an issue
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <RouterLink to="/sign-up" active-class="is-active" class="button is-primary">
            <strong>Sign up</strong>
          </RouterLink>
          <RouterLink to="/log-in" active-class="is-active" class="button is-light">
            Log in
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</nav>
</div>
</template>

<style scoped>

</style>
